"use client";

import { useState, useEffect, useRef } from "react";
import { EditorProvider } from "@/lib/editor/EditorContext";
import { useEditor } from "@/lib/editor/EditorContext";
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

function now() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function BuilderLayoutInner() {
  const { hydrated, setSleekApp } = useEditor();
  const [messages, setMessages] = useState<Message[]>([]);
  const [prompt, setPrompt] = useState("");

  const handleSendRef = useRef<((content?: string) => Promise<void>) | null>(null);
  const autoFiredRef = useRef(false);

  // Always start with an empty canvas
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

    try {
      const res = await fetch("/api/ai/sleek", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text, appName: text.slice(0, 60) }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({})) as { error?: string; message?: string };
        if (res.status === 401) {
          resolveThinking(thinkingId, "You need to be signed in to generate apps. Please [sign in](/login).");
          return;
        }
        if (res.status === 403) {
          resolveThinking(thinkingId, err.message ?? "Screen limit reached. Upgrade to continue.");
          return;
        }
        if (res.status === 503) {
          resolveThinking(thinkingId, "Generation service not configured — contact support.");
          return;
        }
        resolveThinking(thinkingId, `Generation failed: ${err.error ?? res.statusText}`);
        return;
      }

      const data = await res.json() as {
        app: {
          id: string;
          appName: string;
          screens: Array<{ id: string; name: string; html: string }>;
          activeIndex: number;
        };
      };
      setSleekApp(data.app);
      resolveThinking(
        thinkingId,
        `Done — **${data.app.screens.length} screens** generated ✨\n\nScroll the canvas to browse all screens. Hit **Export** in the top bar to download the full Expo project.`
      );
    } catch (err) {
      resolveThinking(
        thinkingId,
        `Connection error — ${err instanceof Error ? err.message : "Could not reach the server. Check your connection and try again."}`
      );
    }
  };

  handleSendRef.current = handleSend;

  // Auto-fire pending prompt from /new-project
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

export default function BuilderLayout() {
  return (
    <EditorProvider>
      <BuilderLayoutInner />
    </EditorProvider>
  );
}
