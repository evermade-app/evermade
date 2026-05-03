"use client";

import { useState, useEffect, useRef } from "react";
import { EditorProvider } from "@/lib/editor/EditorContext";
import { useEditor } from "@/lib/editor/EditorContext";
import { parseCommand } from "@/lib/editor/commandParser";
import { applyCommand, applyAiAction, type AiAction } from "@/lib/editor/commandEngine";
import { interpretWithAI, chatWithAI, type HistoryMessage } from "@/lib/editor/aiInterpreter";
import { getComponent } from "@/lib/editor/projectState";
import { applyGeneratedScreen } from "@/lib/editor/screenGenerator";
import type { ScreenStyle, Theme } from "@/lib/editor/project";
import BuilderTopBar from "./BuilderTopBar";
import BuilderSidebar from "./BuilderSidebar";
import BuilderPreview from "./BuilderPreview";
import QRPanel from "./QRPanel";

export type Message = {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: string;
  isThinking?: boolean;
};

const INITIAL_MESSAGES: Message[] = [];

function now() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function BuilderLayoutInner() {
  const { hydrated, selection, project, updateComponent, updateScreenStyle, updateTheme, setProject, addScreen, addComponent, updateNavigation, linkNavItem, setActiveScreen, setSleekApp } = useEditor();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [prompt, setPrompt] = useState("");

  // Keep a ref to the latest handleSend so the effect below can call it
  // without being re-triggered on every render.
  const handleSendRef = useRef<((content?: string) => Promise<void>) | null>(null);
  const autoFiredRef = useRef(false);

  // Always start with an empty canvas — clear any persisted sleekApp
  useEffect(() => {
    setSleekApp(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resolveThinking = (thinkingId: string, content: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === thinkingId
          ? { ...m, content, isThinking: false, timestamp: now() }
          : m
      )
    );
  };

  const handleSend = async (content?: string) => {
    const text = content !== undefined ? content : prompt;
    if (!text.trim()) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: "user", content: text, timestamp: now() },
    ]);
    if (content === undefined) setPrompt("");

    const thinkingId = `thinking-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      { id: thinkingId, role: "ai", content: "", timestamp: now(), isThinking: true },
    ]);

    // ── Helpers for applyAiAction ──────────────────────────────────────────────
    const helpers = {
      selection,
      activeScreenId: project.activeScreenId,
      updateComponent,
      updateScreenStyle: (screenId: string, patch: Record<string, unknown>) =>
        updateScreenStyle(screenId, patch as Partial<ScreenStyle>),
      updateTheme: (patch: Record<string, unknown>) =>
        updateTheme(patch as Partial<Theme>),
      setProjectName: (name: string) => setProject({ ...project, name }),
      renameScreen: (screenId: string, name: string) =>
        setProject({
          ...project,
          screens: project.screens.map((s) =>
            s.id === screenId ? { ...s, name } : s
          ),
        }),
      setActiveScreen,
      addScreen,
      addComponent,
      updateNavigation,
      linkNavItem,
    };

    // ── Rich project summary (includes theme + screen styles) ─────────────────
    const selectedComponentProps = selection
      ? (getComponent(project, selection.screenId, selection.componentId)?.props as Record<string, unknown> | undefined)
      : undefined;

    const projectSummary = {
      projectName: project.name,
      platform: project.platform,
      theme: project.theme,
      activeScreenId: project.activeScreenId,
      navigation: project.navigation,
      availableScreens: project.screens.map((s) => ({
        id: s.id,
        name: s.name,
        style: s.style ?? {},
        components: s.components.map((c) => ({
          id: c.id,
          type: c.type,
          props: c.props as Record<string, unknown>,
        })),
      })),
      selectedElement: selection
        ? {
            screenId: selection.screenId,
            componentId: selection.componentId,
            componentType: selection.componentType,
            componentProps: selectedComponentProps ?? {},
          }
        : null,
    };

    // ── Conversation history for chatWithAI ───────────────────────────────────
    const history: HistoryMessage[] = messages
      .filter((m) => !m.isThinking && m.content)
      .slice(-8)
      .map((m) => ({ role: m.role === "ai" ? "assistant" : "user", content: m.content }));

    // ── Sleek live preview ────────────────────────────────────────────────────
    const isBuildRequest = /make|build|create|generate/i.test(text);
    if (isBuildRequest) {
      console.log("CALLING SLEEK NOW");
      try {
        const sleekRes = await fetch("/api/ai/sleek", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: text, appName: project.name }),
        });
        console.log("SLEEK RESPONSE STATUS:", sleekRes.status);
        if (sleekRes.ok) {
          const sleekData = await sleekRes.json() as {
            app: { id: string; appName: string; activeIndex: number; screens: Array<{ id: string; name: string; html: string; screenshotUrl?: string }> };
          };
          console.log("SLEEK SUCCESS — screens:", sleekData.app?.screens?.length);
          setSleekApp(sleekData.app);
          resolveThinking(
            thinkingId,
            `Done — generated **${sleekData.app.screens.length} screens** with Sleek ✨\n\nUse the tabs at the bottom of the phone to browse all screens. Export button in the top bar downloads the full Expo project.`
          );
          return;
        }
        const errText = await sleekRes.text().catch(() => "");
        console.error("SLEEK FAILED:", sleekRes.status, errText);
        // fall through to normal AI path
      } catch (err) {
        console.error("SLEEK EXCEPTION:", err);
        // fall through to normal AI path
      }
    }

    // ── Try AI interpreter ────────────────────────────────────────────────────
    try {
      const aiResponse = await interpretWithAI({ message: text, project: projectSummary });

      // Actions present → apply them and show confirmation
      if (aiResponse.actions?.length) {
        const applied: string[] = [];
        const errors: string[] = [];

        for (const action of aiResponse.actions) {
          try {
            applyAiAction(action as AiAction, helpers);
            applied.push(describeAction(action));
          } catch (e) {
            errors.push(e instanceof Error ? e.message : String(e));
          }
        }

        // Prefer the AI's own confirmation message; fall back to auto-generated
        let msg = aiResponse.message && aiResponse.message !== "conversational"
          ? aiResponse.message
          : applied.length > 0
            ? `Done — applied ${applied.length} change${applied.length !== 1 ? "s" : ""}:\n` +
              applied.map((a) => `• ${a}`).join("\n")
            : `Couldn't apply changes:\n` + errors.map((e) => `• ${e}`).join("\n");

        if (applied.length > 0 && errors.length > 0) {
          msg += `\n\nPartially failed:\n` + errors.map((e) => `• ${e}`).join("\n");
        }

        resolveThinking(thinkingId, msg);
        return;
      }

      // AI returned empty actions with a message
      if (aiResponse.message && aiResponse.message !== "conversational") {
        resolveThinking(thinkingId, aiResponse.message);
        return;
      }

      // AI signalled "conversational" → route to chatWithAI
      if (aiResponse.message === "conversational" || aiResponse.error === "conversational") {
        const reply = await chatWithAI({ message: text, project: projectSummary, history });
        resolveThinking(thinkingId, reply);
        return;
      }

      // Unexpected empty response → try local parser
      throw new Error("empty");
    } catch {
      // ── Fallback 1: local command parser (color, rename, value…) ──────────
      const localResult = runLocalParser(text, selection, project);
      if (localResult.success) {
        if (localResult.updatedProject !== project) setProject(localResult.updatedProject);
        resolveThinking(thinkingId, localResult.message);
        return;
      }

      // ── Fallback 2: local screen generator — "create/build/make screen" ──
      // Works instantly, 100% offline. Handles any creation / generation intent.
      const generated = applyGeneratedScreen(text, project);
      if (generated) {
        const newProject = {
          ...generated.project,
          activeScreenId:
            generated.project.screens.find((s) => s.name === generated.screenName)?.id ??
            generated.project.activeScreenId,
        };
        setProject(newProject);
        resolveThinking(
          thinkingId,
          `Done — created a beautiful **${generated.screenName}** screen.\n• Hero banner + metrics grid + analytics chart\n• Premium list items and CTA button\n\nTry asking me to tweak colors, add components, or change any text!`
        );
        return;
      }

      // ── Fallback 3: conversational chat (questions / explanations) ────────
      try {
        const reply = await chatWithAI({ message: text, project: projectSummary, history });
        resolveThinking(thinkingId, reply);
      } catch {
        resolveThinking(
          thinkingId,
          "I had trouble connecting to the AI. Try:\n• **\"create a home screen\"** — generates a beautiful screen instantly\n• **\"add a hero banner\"** — adds a component\n• **\"make it blue\"** — changes the theme color"
        );
      }
    }
  };

  // Keep ref in sync with the latest closure so the effect below always
  // calls the version that has the current project state.
  handleSendRef.current = handleSend;

  // When the editor finishes hydrating from localStorage, check whether
  // the user arrived from /new-project with a pending prompt and auto-send it.
  useEffect(() => {
    if (!hydrated || autoFiredRef.current) return;
    const pending = localStorage.getItem("evermade-pending-prompt");
    if (!pending) return;
    autoFiredRef.current = true;
    localStorage.removeItem("evermade-pending-prompt");
    void handleSendRef.current!(pending);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "hidden",
        background: "#04040a",
      }}
    >
      {/* ── Global keyframes + layout lock ── */}
      <style>{`
        /* Lock the document so nothing outside this div can scroll or shift */
        html, body {
          overflow: hidden !important;
          height: 100% !important;
          width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        @keyframes evermade-glow-pulse {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 1; }
        }
        @keyframes evermade-blob-a {
          0%, 100% { transform: translate(0, 0) scale(1); }
          40% { transform: translate(80px, -50px) scale(1.12); }
          70% { transform: translate(-30px, 40px) scale(0.92); }
        }
        @keyframes evermade-blob-b {
          0%, 100% { transform: translate(0, 0) scale(1); }
          30% { transform: translate(-60px, 40px) scale(0.88); }
          65% { transform: translate(50px, -60px) scale(1.1); }
        }
        @keyframes evermade-border-spin {
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>

      {/* Fine line grid */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: `linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)`,
        backgroundSize: "36px 36px",
        pointerEvents: "none",
        zIndex: 0,
      }} />

      {/* Animated blob A — purple top-left */}
      <div style={{
        position: "absolute",
        top: "-10%",
        left: "-5%",
        width: 1000,
        height: 1000,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,92,252,0.13) 0%, transparent 65%)",
        pointerEvents: "none",
        zIndex: 0,
        animation: "evermade-blob-a 20s ease-in-out infinite",
      }} />

      {/* Animated blob B — blue bottom-right */}
      <div style={{
        position: "absolute",
        bottom: "-10%",
        right: "0%",
        width: 900,
        height: 900,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(30,100,255,0.1) 0%, transparent 65%)",
        pointerEvents: "none",
        zIndex: 0,
        animation: "evermade-blob-b 25s ease-in-out infinite",
      }} />

      <BuilderTopBar />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flex: 1,
          overflow: "hidden",
        }}
      >
        <BuilderSidebar
          messages={messages}
          prompt={prompt}
          onPromptChange={setPrompt}
          onSend={handleSend}
        />
        <BuilderPreview />
        <QRPanel />
      </div>
    </div>
  );
}

// ── Local parser runner ───────────────────────────────────────────────────────

function runLocalParser(
  text: string,
  selection: ReturnType<typeof useEditor>["selection"],
  project: ReturnType<typeof useEditor>["project"]
) {
  const cmd = parseCommand(text);
  return applyCommand(cmd, selection, project);
}

// ── Action description ────────────────────────────────────────────────────────

function describeAction(action: {
  type: string;
  componentId?: string;
  value?: string;
  screenId?: string;
  props?: Record<string, unknown>;
}): string {
  switch (action.type) {
    case "update_component_props": {
      const propNames = action.props ? Object.keys(action.props).join(", ") : "properties";
      return `Updated **${action.componentId ?? "element"}** (${propNames})`;
    }
    case "update_screen_props": {
      const propNames = action.props ? Object.keys(action.props).join(", ") : "style";
      return `Updated screen style (${propNames})`;
    }
    case "update_theme": {
      const propNames = action.props ? Object.keys(action.props).join(", ") : "theme";
      return `Updated theme (${propNames})`;
    }
    case "update_project_name":
      return `Renamed project to **${action.value ?? "—"}**`;
    case "rename_screen":
      return `Renamed screen to **${action.value ?? "—"}**`;
    case "switch_screen":
      return `Switched to screen **${action.screenId ?? "—"}**`;
    case "add_screen":
    case "generate_screen":
      return `Created screen **${(action as { screen?: { name?: string } }).screen?.name ?? "—"}**`;
    case "add_component":
      return `Added component to screen **${(action as { screenId?: string }).screenId ?? "active screen"}**`;
    case "update_navigation":
      return "Updated navigation bar";
    case "link_nav_item_to_screen":
      return `Linked nav item to screen **${(action as { screenId?: string }).screenId ?? "—"}**`;
    default:
      return action.type;
  }
}

export default function BuilderLayout() {
  return (
    <EditorProvider>
      <BuilderLayoutInner />
    </EditorProvider>
  );
}
