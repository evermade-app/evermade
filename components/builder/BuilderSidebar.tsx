"use client";

import { useState } from "react";
import { useEditor } from "@/lib/editor/EditorContext";
import BuilderChat from "./BuilderChat";
import BuilderPromptBar from "./BuilderPromptBar";
import ContextualEditor from "./editor/ContextualEditor";
import type { Message } from "./BuilderLayout";

type Props = {
  messages: Message[];
  prompt: string;
  onPromptChange: (v: string) => void;
  onSend: (content?: string) => void;
};

export default function BuilderSidebar({ messages, prompt, onPromptChange, onSend }: Props) {
  const { selection } = useEditor();

  return (
    <div style={{
      width: 280,
      flexShrink: 0,
      height: "100%",
      display: "flex",
      flexDirection: "column",
      borderRight: "1px solid rgba(79,142,255,0.12)",
      background: "rgba(8,10,32,0.62)",
      backdropFilter: "blur(60px)",
      WebkitBackdropFilter: "blur(60px)",
      boxShadow: "1px 0 0 rgba(79,142,255,0.06), 8px 0 40px rgba(0,0,0,0.4)",
      position: "relative",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Geist', 'SF Pro Text', sans-serif",
    }}>

      {/* ── Lovable-style header ── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "13px 16px 12px",
        borderBottom: "1px solid rgba(79,142,255,0.1)",
        background: "rgba(79,142,255,0.03)",
        flexShrink: 0,
      }}>
        {/* Brand icon */}
        <div style={{
          width: 52, height: 52, borderRadius: 14, flexShrink: 0,
          background: "#0E0E1A",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.4)",
          overflow: "hidden",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <img
            src="/logo-icon.png"
            alt="Evermade"
            width={52}
            height={52}
            style={{ display: "block", transform: "scale(1.7)", transformOrigin: "center" }}
          />
        </div>

        {/* Name + subtitle */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <button style={{
            display: "flex", alignItems: "center", gap: 4,
            background: "none", border: "none", cursor: "pointer",
            padding: 0, marginBottom: 1,
          }}>
            <span style={{ fontSize: 13.5, fontWeight: 700, color: "rgba(255,255,255,0.92)", letterSpacing: -0.2 }}>
              Evermade Studio
            </span>
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
              <path d="M1 1l4 4 4-4" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.28)", letterSpacing: -0.1 }}>
            Previewing last saved version
          </div>
        </div>

        {/* Right icons */}
        <div style={{ display: "flex", alignItems: "center", gap: 1, flexShrink: 0 }}>
          <HeaderIconBtn title="Version history"><HistoryIcon /></HeaderIconBtn>
          <HeaderIconBtn title="Expand"><ExpandIcon /></HeaderIconBtn>
          <HeaderIconBtn title="Split view"><SplitIcon /></HeaderIconBtn>
        </div>
      </div>

      {/* ── Contextual editor ── */}
      {selection && <ContextualEditor key={selection.componentId} />}

      {/* ── Chat ── */}
      <BuilderChat messages={messages} />

      {/* ── Prompt bar ── */}
      <BuilderPromptBar value={prompt} onChange={onPromptChange} onSend={onSend} />
    </div>
  );
}

function HeaderIconBtn({ children, title }: { children: React.ReactNode; title?: string }) {
  const [hov, setHov] = useState(false);
  return (
    <button title={title}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 30, height: 30, borderRadius: 8,
        border: "none",
        background: hov ? "rgba(255,255,255,0.06)" : "none",
        color: hov ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.3)",
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
