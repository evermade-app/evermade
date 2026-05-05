"use client";

import { useState, useEffect, useRef } from "react";
import { EditorProvider } from "@/lib/editor/EditorContext";
import { useEditor } from "@/lib/editor/EditorContext";
import { saveProjectMeta, getProjects } from "@/lib/projects-store";
import BuilderTopBar from "./BuilderTopBar";
import BuilderSidebar from "./BuilderSidebar";
import BuilderPreview from "./BuilderPreview";
import QRPanel from "./QRPanel";
import PricingModal from "@/components/dashboard/PricingModal";
import type { SleekPreviewApp } from "@/lib/editor/EditorContext";

export type Message = {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: string;
  isThinking?: boolean;
};

export type AppSnapshot = {
  id: string;
  app: SleekPreviewApp;
  label: string;
  timestamp: string;
};

export type SidebarMode = "normal" | "expanded" | "hidden";

function now() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const CHAT_STORAGE_KEY = "evermade-chat-v1";

function BuilderLayoutInner() {
  const { hydrated, setSleekApp, sleekApp, veSelection, setVeSelection, project } = useEditor();
  const [messages, setMessages] = useState<Message[]>([]);
  const [prompt, setPrompt] = useState("");
  const [sidebarMode, setSidebarMode] = useState<SidebarMode>("normal");
  const [appHistory, setAppHistory] = useState<AppSnapshot[]>([]);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleSendRef = useRef<((content?: string) => Promise<void>) | null>(null);
  const autoFiredRef = useRef(false);

  // On mount: new project clears state; returning project restores chat
  useEffect(() => {
    const pending = localStorage.getItem("evermade-pending-prompt");
    if (pending) {
      setSleekApp(null);
      setMessages([]);
      setAppHistory([]);
      localStorage.removeItem(CHAT_STORAGE_KEY);
    } else {
      try {
        const raw = localStorage.getItem(CHAT_STORAGE_KEY);
        if (raw) {
          const saved = JSON.parse(raw) as Message[];
          if (Array.isArray(saved) && saved.length > 0) {
            setMessages(saved.filter((m) => !m.isThinking));
          }
        }
      } catch { /* ignore */ }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist chat messages
  useEffect(() => {
    const settled = messages.filter((m) => !m.isThinking);
    if (settled.length === 0) return;
    try { localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(settled)); } catch { /* quota */ }
  }, [messages]);

  const resolveThinking = (thinkingId: string, content: string) => {
    setMessages((prev) =>
      prev.map((m) => m.id === thinkingId ? { ...m, content, isThinking: false, timestamp: now() } : m)
    );
  };

  const pushToHistory = (app: SleekPreviewApp, label: string) => {
    setAppHistory((prev) => [
      { id: Date.now().toString(), app, label, timestamp: now() },
      ...prev,
    ].slice(0, 14));
  };

  const onRestore = (snapshot: AppSnapshot) => {
    setSleekApp(snapshot.app);
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: "ai", content: `↩ Restored to: **${snapshot.label}**`, timestamp: now() },
    ]);
  };

  // ── Targeted element edit (visual editor) ─────────────────────────────────
  const handleVEEdit = async (userText: string, thinkingId: string) => {
    if (!veSelection || !sleekApp) return false;
    const screen = sleekApp.screens[veSelection.screenIndex];
    if (!screen) return false;

    try {
      const res = await fetch("/api/ai/edit-element", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          screenHtml: screen.html,
          screenName: veSelection.screenName,
          elementTag: veSelection.elementTag,
          elementText: veSelection.elementText,
          editRequest: userText,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({})) as { error?: string };
        if (res.status === 401) {
          resolveThinking(thinkingId, "You need to be signed in. Please [sign in](/login).");
        } else {
          resolveThinking(thinkingId, `Edit failed: ${err.error ?? res.statusText}`);
        }
        return true;
      }

      const data = await res.json() as { html: string };
      const updatedApp: SleekPreviewApp = {
        ...sleekApp,
        screens: sleekApp.screens.map((s, i) =>
          i === veSelection.screenIndex ? { ...s, html: data.html } : s
        ),
      };
      setSleekApp(updatedApp);
      pushToHistory(updatedApp, `Edited <${veSelection.elementTag}> in ${veSelection.screenName}`);
      setVeSelection(null);
      resolveThinking(thinkingId, `Done — edited **${veSelection.elementTag}** in *${veSelection.screenName}* ✨`);
      return true;
    } catch (err) {
      resolveThinking(thinkingId, `Connection error — ${err instanceof Error ? err.message : "Could not reach the server."}`);
      return true;
    }
  };

  // ── Main send handler ─────────────────────────────────────────────────────
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

    if (veSelection && sleekApp) {
      await handleVEEdit(text, thinkingId);
      return;
    }

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
          resolveThinking(thinkingId, "Generation blocked — see the upgrade modal.");
          setShowUpgradeModal(true);
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
        app: { id: string; appName: string; screens: Array<{ id: string; name: string; html: string }>; activeIndex: number };
      };
      setSleekApp(data.app);
      pushToHistory(data.app, `Generated — ${data.app.appName}`);

      // Sync generated app to localStorage list + Supabase
      const existing = getProjects().find((p) => p.id === project.id);
      const now = new Date().toISOString();
      saveProjectMeta({
        id: project.id,
        name: data.app.appName,
        gradient: existing?.gradient ?? "linear-gradient(135deg,#1a1a2e 0%,#16213e 45%,#0f3460 100%)",
        createdAt: existing?.createdAt ?? now,
        updatedAt: now,
        published: existing?.published ?? false,
      });
      fetch(`/api/apps/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.app.appName }),
        keepalive: true,
      }).catch(() => {});

      resolveThinking(
        thinkingId,
        `Done — **${data.app.screens.length} screens** generated ✨\n\nScroll the canvas to browse. Hit **Export** in the top bar to download the Expo project.`
      );
    } catch (err) {
      resolveThinking(thinkingId, `Connection error — ${err instanceof Error ? err.message : "Could not reach the server."}`);
    }
  };

  handleSendRef.current = handleSend;

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
    <div style={{ display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, right: 0, bottom: 0, overflow: "hidden", background: "#04040a" }}>
      <style>{`
        html, body { overflow: hidden !important; height: 100% !important; width: 100% !important; margin: 0 !important; padding: 0 !important; }
        @keyframes evermade-blob-a { 0%,100%{transform:translate(0,0) scale(1)} 40%{transform:translate(80px,-50px) scale(1.12)} 70%{transform:translate(-30px,40px) scale(0.92)} }
        @keyframes evermade-blob-b { 0%,100%{transform:translate(0,0) scale(1)} 30%{transform:translate(-60px,40px) scale(0.88)} 65%{transform:translate(50px,-60px) scale(1.1)} }
      `}</style>

      {/* Grid */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)`, backgroundSize: "36px 36px", pointerEvents: "none", zIndex: 0 }} />
      {/* Blob A */}
      <div style={{ position: "absolute", top: "-10%", left: "-5%", width: 1000, height: 1000, borderRadius: "50%", background: "radial-gradient(circle,rgba(204,255,0,0.04) 0%,transparent 65%)", pointerEvents: "none", zIndex: 0, animation: "evermade-blob-a 20s ease-in-out infinite" }} />
      {/* Blob B */}
      <div style={{ position: "absolute", bottom: "-10%", right: "0%", width: 900, height: 900, borderRadius: "50%", background: "radial-gradient(circle,rgba(204,255,0,0.03) 0%,transparent 65%)", pointerEvents: "none", zIndex: 0, animation: "evermade-blob-b 25s ease-in-out infinite" }} />

      <BuilderTopBar />
      {showUpgradeModal && <PricingModal onClose={() => setShowUpgradeModal(false)} />}

      <div style={{ position: "relative", zIndex: 1, display: "flex", flex: 1, overflow: "hidden" }}>
        <BuilderSidebar
          messages={messages}
          prompt={prompt}
          onPromptChange={setPrompt}
          onSend={handleSend}
          sidebarMode={sidebarMode}
          setSidebarMode={setSidebarMode}
          appHistory={appHistory}
          onRestore={onRestore}
        />

        {/* Floating tab to reopen sidebar when hidden */}
        {sidebarMode === "hidden" && (
          <button
            onClick={() => setSidebarMode("normal")}
            title="Show chat"
            style={{
              position: "absolute",
              left: 0,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 20,
              width: 20,
              height: 56,
              borderRadius: "0 8px 8px 0",
              border: "1px solid rgba(204,255,0,0.25)",
              borderLeft: "none",
              background: "rgba(6,6,14,0.9)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              color: "rgba(255,255,255,0.45)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "4px 0 16px rgba(0,0,0,0.4)",
              animation: "tabSlideIn 0.22s cubic-bezier(0.22,1,0.36,1) both",
            }}
          >
            <style>{`@keyframes tabSlideIn{from{opacity:0;transform:translateY(-50%) translateX(-8px)}to{opacity:1;transform:translateY(-50%) translateX(0)}}`}</style>
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 1l6 6-6 6" />
            </svg>
          </button>
        )}

        {/* Preview — fades out when sidebar is fully expanded */}
        <div style={{
          flex: 1, minWidth: 0, overflow: "hidden", display: "flex",
          opacity: sidebarMode === "expanded" ? 0 : 1,
          pointerEvents: sidebarMode === "expanded" ? "none" : "auto",
          transition: "opacity 0.22s ease",
        }}>
          <BuilderPreview onSend={handleSend} />
        </div>

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
