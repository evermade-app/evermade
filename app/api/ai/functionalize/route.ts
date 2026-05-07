import { type NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextauth";
import { convertScreensToRN } from "@/lib/evermade/sleek/rn-converter";
import { generateNavigation, buildFallbackNavigation } from "@/lib/evermade/sleek/nav-generator";
import type { NavigationBundle } from "@/lib/editor/EditorContext";

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

// ── POST /api/ai/functionalize ─────────────────────────────────────────────────
// Streams SSE: converts each screen HTML → React Native, then generates navigation.
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
  const appPrompt = body?.prompt?.trim() ?? appName;
  const screens: InputScreen[] = Array.isArray(body?.screens) ? body.screens : [];

  if (screens.length === 0) {
    return Response.json({ error: "screens array is required and must not be empty" }, { status: 400 });
  }

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: SSEEvent) => controller.enqueue(sseChunk(event));

      try {
        // ── Phase 1: Convert each screen HTML → React Native ──────────────────
        const convertedScreens: Array<{ id: string; componentName: string; rnCode: string }> = [];

        for (let i = 0; i < screens.length; i++) {
          const screen = screens[i];
          send({
            type: "progress",
            step: "screen",
            index: i,
            total: screens.length,
            name: screen.name,
          });

          const [converted] = await convertScreensToRN([
            { id: screen.id, name: screen.name, html: screen.html, screenshotUrl: screen.screenshotUrl },
          ]);

          convertedScreens.push({
            id: screen.id,
            componentName: converted.componentName,
            rnCode: converted.code,
          });

          send({
            type: "screen_done",
            index: i,
            id: screen.id,
            componentName: converted.componentName,
            rnCode: converted.code,
          });
        }

        // ── Phase 2: Generate navigation ──────────────────────────────────────
        send({ type: "progress", step: "navigation", message: "Generating navigation..." });

        const screensForNav = screens.map((s, i) => ({
          screenName: s.name,
          componentName: convertedScreens[i].componentName,
        }));

        let navigation: NavigationBundle;
        try {
          navigation = await generateNavigation(appName, appPrompt, screensForNav);
        } catch (navErr) {
          console.warn("[functionalize] GPT-4o nav failed, using fallback:", navErr);
          navigation = buildFallbackNavigation(appName, screensForNav);
        }

        send({
          type: "navigation_done",
          appTsx: navigation.appTsx,
          navigatorTsx: navigation.navigatorTsx,
        });

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
