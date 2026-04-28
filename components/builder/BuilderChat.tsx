"use client";

import { useEffect, useRef } from "react";
import type { Message } from "./BuilderLayout";

type Props = {
  messages: Message[];
};

export default function BuilderChat({ messages }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages]);

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        padding: "16px 0 16px",
        display: "flex",
        flexDirection: "column",
        scrollbarWidth: "none",
        gap: 4,
      }}
    >
      {messages.map((msg, i) => {
        const prevMsg = messages[i - 1];
        const showSeparator = i > 0 && prevMsg && prevMsg.timestamp !== msg.timestamp && i === 2;
        return (
          <div key={msg.id}>
            {showSeparator && <DateSeparator label={`Today at ${msg.timestamp}`} />}
            <MessageRow msg={msg} />
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}

function DateSeparator({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 20px" }}>
      <div style={{ flex: 1, height: 1, background: "rgba(79,142,255,0.08)" }} />
      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", fontWeight: 500, whiteSpace: "nowrap" }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: "rgba(79,142,255,0.08)" }} />
    </div>
  );
}

function ThinkingDots() {
  return (
    <div style={{ display: "flex", gap: 5, alignItems: "center", padding: "4px 0" }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{
          width: 5, height: 5, borderRadius: "50%",
          background: "rgba(79,142,255,0.6)",
          animationName: "thinking-pulse",
          animationDuration: "1.2s",
          animationIterationCount: "infinite",
          animationTimingFunction: "ease-in-out",
          animationDelay: `${i * 0.2}s`,
        }} />
      ))}
    </div>
  );
}

function MessageRow({ msg }: { msg: Message }) {
  if (msg.role === "ai") return <AIMessage msg={msg} />;
  return <UserMessage msg={msg} />;
}

// ── AI message — clean text with blue left bar ────────────────────────────────
function AIMessage({ msg }: { msg: Message }) {
  return (
    <div style={{ padding: "6px 20px 4px" }}>
      {/* AI avatar row */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <div style={{
          width: 22, height: 22, borderRadius: 7,
          background: "linear-gradient(135deg, rgba(79,142,255,0.9) 0%, rgba(124,92,252,0.9) 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
          boxShadow: "0 0 12px rgba(79,142,255,0.4)",
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
        </div>
        <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(179,210,255,0.7)", letterSpacing: -0.1 }}>
          Evermade AI
        </span>
      </div>

      {/* Message content */}
      <div style={{
        paddingLeft: 30,
        fontSize: 13.5,
        lineHeight: 1.75,
        color: msg.isThinking ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.82)",
        whiteSpace: "pre-wrap",
        letterSpacing: -0.1,
      }}>
        {msg.isThinking ? <ThinkingDots /> : <ParsedContent text={msg.content} />}
      </div>

      {!msg.isThinking && <AIActionRow />}
    </div>
  );
}

function AIActionRow() {
  const btns = [
    { icon: ThumbUpIcon, title: "Good response" },
    { icon: ThumbDownIcon, title: "Bad response" },
    { icon: CopyIcon, title: "Copy" },
    { icon: MoreIcon, title: "More" },
  ];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 1, marginTop: 6, marginBottom: 2, paddingLeft: 30 }}>
      {btns.map(({ icon: Icon, title }) => (
        <ActionIconBtn key={title} title={title}><Icon /></ActionIconBtn>
      ))}
    </div>
  );
}

function ActionIconBtn({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <button title={title} style={{
      width: 26, height: 26,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "none", border: "none", cursor: "pointer",
      borderRadius: 6,
      color: "rgba(255,255,255,0.2)",
      transition: "color 0.12s, background 0.12s",
    }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.color = "rgba(179,210,255,0.7)";
        (e.currentTarget as HTMLButtonElement).style.background = "rgba(79,142,255,0.08)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.2)";
        (e.currentTarget as HTMLButtonElement).style.background = "none";
      }}
    >
      {children}
    </button>
  );
}

// ── User message — glass card ─────────────────────────────────────────────────
function UserMessage({ msg }: { msg: Message }) {
  return (
    <div style={{ padding: "6px 20px 4px", display: "flex", justifyContent: "flex-end" }}>
      <div style={{
        maxWidth: "90%",
        borderRadius: 18,
        background: "rgba(30,70,180,0.12)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(79,142,255,0.22)",
        boxShadow: "0 4px 28px rgba(0,20,80,0.35), inset 0 1px 0 rgba(255,255,255,0.07)",
        overflow: "hidden",
      }}>
        {/* Card header */}
        <div style={{
          display: "flex", alignItems: "center", gap: 7,
          padding: "9px 14px 8px",
          borderBottom: "1px solid rgba(79,142,255,0.1)",
          background: "rgba(79,142,255,0.05)",
        }}>
          <div style={{
            width: 20, height: 20, borderRadius: 6,
            background: "linear-gradient(135deg, #ff6b6b 0%, #ff9f43 50%, #4878ff 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 9, fontWeight: 800, color: "white", flexShrink: 0,
            boxShadow: "0 2px 8px rgba(255,107,107,0.3)",
          }}>
            Y
          </div>
          <span style={{ fontSize: 11.5, fontWeight: 600, color: "rgba(179,210,255,0.6)", letterSpacing: -0.1 }}>
            You
          </span>
          <span style={{ marginLeft: "auto", fontSize: 10, color: "rgba(255,255,255,0.2)" }}>
            {msg.timestamp}
          </span>
        </div>

        {/* Message body */}
        <div style={{ padding: "10px 14px 12px" }}>
          <div style={{
            fontSize: 13.5, lineHeight: 1.65,
            color: "rgba(255,255,255,0.88)",
            letterSpacing: -0.1,
          }}>
            {msg.content}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Text parsing ──────────────────────────────────────────────────────────────
function ParsedContent({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, li) => {
        if (line.trim() === "") return <span key={li} style={{ display: "block", height: 6 }} />;
        if (line.startsWith("•")) {
          return (
            <span key={li} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 3 }}>
              <span style={{
                marginTop: 8, width: 4, height: 4, borderRadius: "50%",
                background: "rgba(79,142,255,0.6)", flexShrink: 0, display: "inline-block",
              }} />
              <span><BoldText text={line.slice(1).trim()} /></span>
            </span>
          );
        }
        return <span key={li} style={{ display: "block" }}><BoldText text={line} /></span>;
      })}
    </>
  );
}

function BoldText({ text }: { text: string }) {
  const parts = text.split("**");
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1
          ? <strong key={i} style={{ color: "rgba(179,210,255,0.95)", fontWeight: 600 }}>{part}</strong>
          : <span key={i}>{part}</span>
      )}
    </>
  );
}

// ── SVG icons ─────────────────────────────────────────────────────────────────
const ThumbUpIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/>
  </svg>
);
const ThumbDownIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 14V2"/><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z"/>
  </svg>
);
const CopyIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
  </svg>
);
const MoreIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>
  </svg>
);
