import { type NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextauth";
import { getSleekAIPrompt, convertSleekPromptToExpoApp } from "@/lib/evermade/sleek/sleek-to-rn";

interface InputScreen {
  id: string;
  name: string;
  html: string;
  screenshotUrl?: string;
}

interface ProgressEvent {
  type: "progress";
  step: "screen" | "navigation";
  index?: number;
  total?: number;
  name?: string;
  message?: string;
}

interface ScreenDoneEvent {
  type: "screen_done";
  index: number;
  id: string;
  componentName: string;
  rnCode: string;
}

interface NavigationDoneEvent {
  type: "navigation_done";
  appTsx: string;
  navigatorTsx: string;
}

interface DoneEvent { type: "done" }
interface ErrorEvent { type: "error"; message: string }

type SSEEvent = ProgressEvent | ScreenDoneEvent | NavigationDoneEvent | DoneEvent | ErrorEvent;

function sseChunk(event: SSEEvent): Uint8Array {
  return new TextEncoder().encode(`data: ${JSON.stringify(event)}\n\n`);
}

function toComponentName(screenName: string): string {
  const safe = screenName.replace(/[^a-zA-Z0-9 ]/g, "").trim();
  return (
    safe
      .split(/\s+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join("") + "Screen"
  );
}

// ── POST /api/ai/functionalize ──────────────────────────────────────────────
// Streams SSE events using the Claude-based pipeline:
//   1. Sends all screen HTML to Claude via convertSleekPromptToExpoApp()
//   2. Emits screen_done for each file Claude generates
//   3. Emits navigation_done with the layout files
//
// Body: { appName: string, screens: InputScreen[], sleekProjectId?: string }
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: "Authentication required" }, { status: 401 });
  }

  const body = await req.json() as {
    appName?: string;
    screens?: InputScreen[];
    sleekProjectId?: string;
  };

  const appName = body?.appName?.trim() ?? "My App";
  const screens: InputScreen[] = Array.isArray(body?.screens) ? body.screens : [];
  const sleekProjectId = body?.sleekProjectId ?? null;

  if (screens.length === 0) {
    return Response.json({ error: "screens array is required and must not be empty" }, { status: 400 });
  }

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: SSEEvent) => controller.enqueue(sseChunk(event));

      try {
        // ── Phase 1: Show initial progress while Claude thinks ──────────────
        send({
          type: "progress",
          step: "screen",
          index: 0,
          total: screens.length,
          name: "Building app with AI…",
        });

        // ── Phase 2: Get Sleek AI prompt and call Claude ─────────────────────
        const sleekPrompt = await getSleekAIPrompt(sleekProjectId, screens);
        const { files } = await convertSleekPromptToExpoApp(sleekPrompt, appName);

        // ── Phase 3: Map Claude files to screen_done events ──────────────────
        const LAYOUT_PATHS = new Set(["app/_layout.tsx", "app/(tabs)/_layout.tsx"]);
        const screenFiles = Object.entries(files).filter(([path]) => !LAYOUT_PATHS.has(path));

        for (let i = 0; i < screens.length; i++) {
          const screen = screens[i]!;
          const componentName = toComponentName(screen.name);
          const rnCode = screenFiles[i]?.[1] ?? "";

          send({
            type: "progress",
            step: "screen",
            index: i,
            total: screens.length,
            name: screen.name,
          });

          send({ type: "screen_done", index: i, id: screen.id, componentName, rnCode });
        }

        // ── Phase 4: Emit navigation files ───────────────────────────────────
        send({ type: "progress", step: "navigation", message: "Wiring navigation…" });

        const appTsx = files["app/_layout.tsx"] ?? buildFallbackRootLayout();
        const navigatorTsx = files["app/(tabs)/_layout.tsx"] ?? buildFallbackTabsLayout(screens.map((s) => toComponentName(s.name)));

        send({ type: "navigation_done", appTsx, navigatorTsx });
        send({ type: "done" });
      } catch (err) {
        console.error("[/api/ai/functionalize]", err);
        send({ type: "error", message: err instanceof Error ? err.message : "Functionalization failed" });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
      Connection: "keep-alive",
    },
  });
}

function buildFallbackRootLayout(): string {
  return `import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Layout() {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}
`;
}

function buildFallbackTabsLayout(componentNames: string[]): string {
  const tabs = componentNames.slice(0, 5);
  const screenLines = tabs
    .map((name) => {
      const route = name.replace(/Screen$/, "").toLowerCase();
      return `      <Tabs.Screen name="${route}" options={{ title: "${name.replace(/Screen$/, "")}" }} />`;
    })
    .join("\n");

  return `import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
${screenLines}
    </Tabs>
  );
}
`;
}
