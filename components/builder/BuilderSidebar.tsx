"use client";

import { useState } from "react";
import { useEditor } from "@/lib/editor/EditorContext";
import BuilderChat from "./BuilderChat";
import BuilderPromptBar from "./BuilderPromptBar";
import ContextualEditor from "./editor/ContextualEditor";
import type { Message, AppSnapshot, SidebarMode } from "./BuilderLayout";

type Props = {
  messages: Message[];
  prompt: string;
  onPromptChange: (v: string) => void;
  onSend: (content?: string) => void;
  sidebarMode: SidebarMode;
  setSidebarMode: (mode: SidebarMode) => void;
  appHistory: AppSnapshot[];
  onRestore: (snapshot: AppSnapshot) => void;
};

export default function BuilderSidebar({
  messages,
  prompt,
  onPromptChange,
  onSend,
  sidebarMode,
  setSidebarMode,
  appHistory,
  onRestore,
}: Props) {
  const { selection } = useEditor();
  const [showHistory, setShowHistory] = useState(false);

  const sidebarWidth =
    sidebarMode === "hidden" ? 0
    : sidebarMode === "expanded" ? "calc(100% - 260px)"
    : 320;

  return (
    <div style={{
      width: sidebarWidth,
      flexShrink: 0,
      height: "100%",
      overflow: "hidden",
      position: "relative",
      transition: "width 0.28s cubic-bezier(0.4,0,0.2,1)",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Geist', 'SF Pro Text', sans-serif",
    }}>
      {/* Inner content — always 100% wide so it fills whatever width the outer animates to */}
      <div style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid rgba(79,142,255,0.12)",
        background: "rgba(8,10,32,0.62)",
        backdropFilter: "blur(60px)",
        WebkitBackdropFilter: "blur(60px)",
        boxShadow: "1px 0 0 rgba(79,142,255,0.06), 8px 0 40px rgba(0,0,0,0.4)",
        position: "relative",
      }}>

        {/* ── Header ── */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "13px 16px 12px",
          borderBottom: "1px solid rgba(79,142,255,0.1)",
          background: "rgba(79,142,255,0.03)",
          flexShrink: 0,
        }}>
          {/* Brand icon */}
          <div style={{
            width: 52, height: 52, borderRadius: 14, flexShrink: 0,
            background: "#0E0E1A", border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 2px 12px rgba(0,0,0,0.4)", overflow: "hidden",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <img src="/logo-icon.png" alt="Evermade" width={52} height={52}
              style={{ display: "block", transform: "scale(1.7)", transformOrigin: "center" }} />
          </div>

          {/* Name + subtitle */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <button style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: 1 }}>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: "rgba(255,255,255,0.92)", letterSpacing: -0.2 }}>Evermade Studio</span>
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                <path d="M1 1l4 4 4-4" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.28)", letterSpacing: -0.1 }}>Previewing last saved version</div>
          </div>

          {/* ── 3 action buttons ── */}
          <div style={{ display: "flex", alignItems: "center", gap: 1, flexShrink: 0 }}>
            {/* 1 — History */}
            <HeaderIconBtn
              title="Version history"
              active={showHistory}
              onClick={() => setShowHistory((v) => !v)}
            >
              <HistoryIcon />
            </HeaderIconBtn>

            {/* 2 — Expand chat */}
            <HeaderIconBtn
              title={sidebarMode === "expanded" ? "Restore layout" : "Expand chat"}
              active={sidebarMode === "expanded"}
              onClick={() => setSidebarMode(sidebarMode === "expanded" ? "normal" : "expanded")}
            >
              <ExpandIcon />
            </HeaderIconBtn>

            {/* 3 — Hide chat / show full canvas */}
            <HeaderIconBtn
              title={sidebarMode === "hidden" ? "Show chat" : "Hide chat"}
              active={sidebarMode === "hidden"}
              onClick={() => setSidebarMode(sidebarMode === "hidden" ? "normal" : "hidden")}
            >
              <SplitIcon />
            </HeaderIconBtn>
          </div>
        </div>

        {/* ── Contextual editor ── */}
        {selection && <ContextualEditor key={selection.componentId} />}

        {/* ── Chat ── */}
        <BuilderChat messages={messages} />

        {/* ── Prompt bar ── */}
        <BuilderPromptBar value={prompt} onChange={onPromptChange} onSend={onSend} />

        {/* ── History panel — smooth overlay ── */}
        {showHistory && (
          <HistoryPanel
            history={appHistory}
            onRestore={(s) => { onRestore(s); setShowHistory(false); }}
            onClose={() => setShowHistory(false)}
          />
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HISTORY PANEL
// ─────────────────────────────────────────────────────────────────────────────
function HistoryPanel({
  history,
  onRestore,
  onClose,
}: {
  history: AppSnapshot[];
  onRestore: (s: AppSnapshot) => void;
  onClose: () => void;
}) {
  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 30,
      display: "flex", flexDirection: "column",
      background: "rgba(7,8,24,0.96)",
      backdropFilter: "blur(24px)",
      WebkitBackdropFilter: "blur(24px)",
      animation: "historyIn 0.2s cubic-bezier(0.22,1,0.36,1) both",
    }}>
      <style>{`
        @keyframes historyIn {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center",
        padding: "14px 16px 13px",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#7c5cfc", boxShadow: "0 0 8px rgba(124,92,252,0.9)" }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.88)", letterSpacing: -0.1 }}>
            Version history
          </span>
        </div>
        <button onClick={onClose} style={{
          width: 26, height: 26, borderRadius: 8,
          background: "rgba(255,255,255,0.06)", border: "none",
          color: "rgba(255,255,255,0.45)", cursor: "pointer", fontSize: 15,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>×</button>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: "auto", padding: "6px 0", scrollbarWidth: "none" }}>
        {history.length === 0 ? (
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", height: "100%", gap: 10,
            color: "rgba(255,255,255,0.22)", padding: "60px 24px",
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/><path d="M12 7v5l4 2"/>
            </svg>
            <span style={{ fontSize: 12, textAlign: "center", lineHeight: 1.5 }}>
              No history yet.<br />Generate your first app to start.
            </span>
          </div>
        ) : (
          history.map((snapshot, i) => (
            <HistoryItem
              key={snapshot.id}
              snapshot={snapshot}
              index={i}
              onRestore={() => onRestore(snapshot)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function HistoryItem({
  snapshot,
  index,
  onRestore,
}: {
  snapshot: AppSnapshot;
  index: number;
  onRestore: () => void;
}) {
  const [hov, setHov] = useState(false);
  const isLatest = index === 0;

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "11px 16px",
        background: hov ? "rgba(255,255,255,0.04)" : "transparent",
        transition: "background 0.12s",
        display: "flex", alignItems: "center", gap: 11,
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        cursor: "default",
      }}
    >
      {/* Icon */}
      <div style={{
        width: 34, height: 34, borderRadius: 9, flexShrink: 0,
        background: isLatest ? "rgba(124,92,252,0.15)" : "rgba(255,255,255,0.05)",
        border: `1px solid ${isLatest ? "rgba(124,92,252,0.3)" : "rgba(255,255,255,0.07)"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {snapshot.label.startsWith("Generated") ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isLatest ? "rgba(160,140,255,0.8)" : "rgba(255,255,255,0.3)"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isLatest ? "rgba(160,140,255,0.8)" : "rgba(255,255,255,0.3)"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
          </svg>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 11.5, fontWeight: 500,
          color: isLatest ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.55)",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          letterSpacing: -0.1,
        }}>
          {snapshot.label}
          {isLatest && (
            <span style={{ marginLeft: 6, fontSize: 9, fontWeight: 700, color: "rgba(124,92,252,0.9)", letterSpacing: 0.5, textTransform: "uppercase" }}>
              Current
            </span>
          )}
        </div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.28)", marginTop: 2 }}>
          {snapshot.app.screens.length} screens · {snapshot.timestamp}
        </div>
      </div>

      {/* Restore button — appears on hover, hidden for current */}
      {hov && !isLatest && (
        <button
          onClick={onRestore}
          style={{
            padding: "4px 10px", borderRadius: 20, flexShrink: 0,
            background: "rgba(124,92,252,0.12)",
            border: "1px solid rgba(124,92,252,0.28)",
            color: "rgba(160,140,255,0.9)",
            fontSize: 11, fontWeight: 500, cursor: "pointer",
            fontFamily: "inherit", letterSpacing: -0.1,
            transition: "all 0.12s",
          }}
        >↩ Restore</button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HEADER BUTTON
// ─────────────────────────────────────────────────────────────────────────────
function HeaderIconBtn({
  children,
  title,
  active,
  onClick,
}: {
  children: React.ReactNode;
  title?: string;
  active?: boolean;
  onClick?: () => void;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      title={title}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 30, height: 30, borderRadius: 8, border: "none",
        background: active
          ? "rgba(124,92,252,0.18)"
          : hov ? "rgba(255,255,255,0.06)" : "none",
        color: active
          ? "rgba(180,160,255,0.9)"
          : hov ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.3)",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", transition: "all 0.12s ease",
      }}
    >
      {children}
    </button>
  );
}

// ── Header SVGs ───────────────────────────────────────────────────────────────
const HistoryIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
    <path d="M3 3v5h5"/><path d="M12 7v5l4 2"/>
  </svg>
);
const ExpandIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
  </svg>
);
const SplitIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <path d="M12 3v18"/>
  </svg>
);
