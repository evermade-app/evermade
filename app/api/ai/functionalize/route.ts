import { type NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextauth";
import {
  generateExpoStarterScreen,
  buildExpoStarterTabsLayout,
  buildExpoStarterRootLayout,
  type ScreenForTabs,
} from "@/lib/evermade/sleek/expo-starter";

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

// Derive a stable PascalCase component name from the screen's display name.
function toComponentName(screenName: string): string {
  const safe = screenName.replace(/[^a-zA-Z0-9 ]/g, "").trim();
  return (
    safe
      .split(/\s+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join("") + "Screen"
  );
}

function isOnboarding(screenName: string): boolean {
  return screenName.toLowerCase().includes("onboard");
}

const SCREEN_DELAY_MS = 3_000;
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

// ── POST /api/ai/functionalize ──────────────────────────────────────────────
// Streams SSE events:
//   1. For each screen: calls GPT-4o-mini to generate a real NativeWind screen
//      using the expo-starter template (Container + NativeWind className styling).
//   2. Generates the Expo Router tabs layout from screen names.
//
// Body: { appName: string, screens: InputScreen[], prompt?: string }
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: "Authentication required" }, { status: 401 });
  }

  const body = await req.json() as {
    appName?: string;
    prompt?: string;
    screens?: InputScreen[];
  };

  const appName = body?.appName?.trim() ?? "My App";
  const screens: InputScreen[] = Array.isArray(body?.screens) ? body.screens : [];

  if (screens.length === 0) {
    return Response.json({ error: "screens array is required and must not be empty" }, { status: 400 });
  }

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: SSEEvent) => controller.enqueue(sseChunk(event));

      try {
        // ── Phase 1: Generate screens via GPT-4o-mini (expo-starter NativeWind) ──
        const screensForNav: ScreenForTabs[] = [];

        for (let i = 0; i < screens.length; i++) {
          if (i > 0) await sleep(SCREEN_DELAY_MS);

          const screen = screens[i]!;
          const componentName = toComponentName(screen.name);
          const onboarding = isOnboarding(screen.name);

          send({
            type: "progress",
            step: "screen",
            index: i,
            total: screens.length,
            name: screen.name,
          });

          let rnCode: string;
          try {
            rnCode = await generateExpoStarterScreen(screen.name, componentName, screen.html);
          } catch (err) {
            console.warn(`[functionalize] screen "${screen.name}" failed, using placeholder:`, err);
            rnCode = buildPlaceholderScreen(componentName, screen.name);
          }

          screensForNav.push({ screenName: screen.name, componentName, isOnboarding: onboarding });
          send({ type: "screen_done", index: i, id: screen.id, componentName, rnCode });
        }

        // ── Phase 2: Generate Expo Router tabs layout ─────────────────────────
        send({ type: "progress", step: "navigation", message: "Building navigation…" });

        const navigatorTsx = buildExpoStarterTabsLayout(screensForNav);
        const appTsx = buildExpoStarterRootLayout(appName);

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

// Fallback placeholder if GPT call fails for a screen
function buildPlaceholderScreen(componentName: string, screenName: string): string {
  const label = screenName.replace(/Screen$/i, "").trim() || screenName;
  return `import { Container } from "@/components/container";
import { Text } from "@/components/ui/text";
import { View } from "react-native";

export default function ${componentName}() {
  return (
    <Container className="p-6">
      <View className="flex-1 items-center justify-center gap-3">
        <Text variant="h3" className="text-foreground">${label}</Text>
        <Text className="text-muted-foreground text-sm">Screen placeholder</Text>
      </View>
    </Container>
  );
}
`;
}
