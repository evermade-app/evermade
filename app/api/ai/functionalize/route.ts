import { type NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextauth";
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

// Derive a stable PascalCase component name from the screen's display name.
// Mirrors the algorithm in rn-converter so names are consistent.
function toComponentName(screenName: string): string {
  const safe = screenName.replace(/[^a-zA-Z0-9 ]/g, "").trim();
  return (
    safe
      .split(/\s+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join("") + "Screen"
  );
}

// Minimal placeholder screen — dark background, centred screen title.
// No OpenAI call required; acts as a structural scaffold.
function buildPlaceholderScreen(componentName: string, screenName: string): string {
  const label = screenName.replace(/Screen$/i, "").trim() || screenName;
  return `import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";

export default function ${componentName}() {
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.center}>
        <Text style={styles.title}>${label}</Text>
        <Text style={styles.sub}>Screen placeholder</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#080818" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8 },
  title: { fontSize: 28, fontWeight: "700", color: "#CCFF00", letterSpacing: -0.5 },
  sub: { fontSize: 13, color: "rgba(255,255,255,0.35)" },
});
`;
}

// ── POST /api/ai/functionalize ──────────────────────────────────────────────
// Streams SSE events:
//   1. Emits screen_done for each screen instantly (placeholder code, no AI call).
//   2. Calls GPT-4o-mini once to generate navigation files.
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
        // ── Phase 1: Placeholder screens (no API calls) ───────────────────────
        const screensForNav: Array<{ screenName: string; componentName: string }> = [];

        for (let i = 0; i < screens.length; i++) {
          const screen = screens[i]!;
          send({ type: "progress", step: "screen", index: i, total: screens.length, name: screen.name });

          const componentName = toComponentName(screen.name);
          const rnCode = buildPlaceholderScreen(componentName, screen.name);

          screensForNav.push({ screenName: screen.name, componentName });

          send({ type: "screen_done", index: i, id: screen.id, componentName, rnCode });
        }

        // ── Phase 2: Navigation (one GPT-4o-mini call) ────────────────────────
        send({ type: "progress", step: "navigation", message: "Generating navigation…" });

        let navigation: NavigationBundle;
        try {
          navigation = await generateNavigation(appName, appPrompt, screensForNav);
        } catch (navErr) {
          console.warn("[functionalize] nav generation failed, using fallback:", navErr);
          navigation = buildFallbackNavigation(appName, screensForNav);
        }

        send({ type: "navigation_done", appTsx: navigation.appTsx, navigatorTsx: navigation.navigatorTsx });
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
