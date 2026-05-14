"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

export default function BuildAnythingBar() {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const expand = useCallback(() => {
    setExpanded(true);
    // Delay focus slightly so it lands after the CSS transition begins
    setTimeout(() => textareaRef.current?.focus(), 80);
  }, []);

  const collapse = useCallback(() => {
    if (!value.trim()) setExpanded(false);
  }, [value]);

  const handleSubmit = useCallback(() => {
    const q = value.trim();
    router.push(q ? `/new-project?prompt=${encodeURIComponent(q)}` : "/new-project");
  }, [value, router]);

  const handleKey = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape") {
      setValue("");
      setExpanded(false);
      textareaRef.current?.blur();
    }
  }, [handleSubmit]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        paddingBottom: 96,
        paddingTop: 16,
      }}
    >
      <style>{`
        @keyframes evBarGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(204,255,0,0); }
          50%       { box-shadow: 0 0 28px rgba(204,255,0,0.18); }
        }
        .ev-bar-collapsed { animation: none; }
        .ev-bar-expanded  { animation: evBarGlow 3s ease-in-out infinite; }
      `}</style>

      <div
        ref={containerRef}
        onMouseEnter={expand}
        onMouseLeave={collapse}
        className={expanded ? "ev-bar-expanded" : "ev-bar-collapsed"}
        style={{
          position: "relative",
          width: expanded ? 620 : 190,
          height: expanded ? 108 : 44,
          borderRadius: expanded ? 20 : 999,
          background: "rgba(8,8,14,0.88)",
          backdropFilter: "blur(32px) saturate(1.4)",
          WebkitBackdropFilter: "blur(32px) saturate(1.4)",
          border: expanded
            ? "1px solid rgba(204,255,0,0.22)"
            : "1px solid rgba(255,255,255,0.1)",
          boxShadow: expanded
            ? "0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(204,255,0,0.06)"
            : "0 4px 20px rgba(0,0,0,0.4)",
          cursor: expanded ? "default" : "pointer",
          overflow: "hidden",
          transition: [
            "width 0.42s cubic-bezier(0.22,1,0.36,1)",
            "height 0.42s cubic-bezier(0.22,1,0.36,1)",
            "border-radius 0.42s cubic-bezier(0.22,1,0.36,1)",
            "border-color 0.3s ease",
            "box-shadow 0.3s ease",
          ].join(", "),
        }}
        onClick={expanded ? undefined : expand}
      >

        {/* ── Collapsed label ── */}
        <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 7,
          opacity: expanded ? 0 : 1,
          transform: expanded ? "scale(0.92)" : "scale(1)",
          transition: "opacity 0.2s ease, transform 0.2s ease",
          pointerEvents: expanded ? "none" : "auto",
          userSelect: "none",
        }}>
          <span style={{
            fontSize: 13.5,
            fontWeight: 600,
            color: "rgba(255,255,255,0.85)",
            letterSpacing: -0.2,
            fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
          }}>
            Build anything
          </span>
          <span style={{
            fontSize: 12,
            color: "#CCFF00",
            fontWeight: 700,
          }}>→</span>
        </div>

        {/* ── Expanded input ── */}
        <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          padding: "12px 14px 10px",
          opacity: expanded ? 1 : 0,
          transform: expanded ? "translateY(0)" : "translateY(6px)",
          transition: "opacity 0.25s ease 0.1s, transform 0.25s ease 0.1s",
          pointerEvents: expanded ? "auto" : "none",
        }}>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Describe your app idea…"
            rows={2}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              resize: "none",
              fontSize: 14,
              lineHeight: 1.55,
              color: "rgba(255,255,255,0.88)",
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
              caretColor: "#CCFF00",
              padding: 0,
              width: "100%",
            }}
          />

          {/* ── Bottom action row ── */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 8,
          }}>
            {/* Left: "New project" label */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "3px 9px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.07)",
              cursor: "pointer",
            }}>
              <span style={{ fontSize: 11.5, color: "rgba(255,255,255,0.38)", fontWeight: 500 }}>
                New project
              </span>
              <svg width="8" height="5" viewBox="0 0 8 5" fill="none">
                <path d="M1 1l3 3 3-3" stroke="rgba(255,255,255,0.3)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Right: Send button */}
            <button
              type="button"
              onClick={handleSubmit}
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: value.trim() ? "#CCFF00" : "rgba(255,255,255,0.07)",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "background 0.2s ease, transform 0.15s ease",
                transform: value.trim() ? "scale(1)" : "scale(0.95)",
              }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
              >
                <path
                  d="M6 10.5V1.5M6 1.5L2 5.5M6 1.5L10 5.5"
                  stroke={value.trim() ? "#000" : "rgba(255,255,255,0.3)"}
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
