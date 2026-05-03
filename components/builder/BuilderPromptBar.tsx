"use client";

import { useState, useEffect } from "react";
import { useEditor } from "@/lib/editor/EditorContext";
import { getComponent, getComponentLabel } from "@/lib/editor/projectState";
import PlusMenu from "./PlusMenu";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSend: (content?: string) => void;
};

export default function BuilderPromptBar({ value, onChange, onSend }: Props) {
  const [focused, setFocused] = useState(false);
  const [plusOpen, setPlusOpen] = useState(false);
  const [chipVisible, setChipVisible] = useState(false);

  const { selection, setSelection, project, veSelection, setVeSelection } = useEditor();

  // Legacy component chip (existing feature)
  const selectedComponent = selection
    ? getComponent(project, selection.screenId, selection.componentId)
    : null;
  const chipLabel = selectedComponent ? getComponentLabel(selectedComponent) : null;

  // VE chips take priority over legacy chip
  const hasVEContext = !!veSelection;
  const hasContext = hasVEContext || !!chipLabel;

  const canSend = value.trim().length > 0 || hasContext;

  useEffect(() => {
    if (hasContext) {
      setChipVisible(false);
      const raf = requestAnimationFrame(() => setChipVisible(true));
      return () => cancelAnimationFrame(raf);
    } else {
      setChipVisible(false);
    }
  }, [hasContext, veSelection, selection]);

  const handleSend = () => {
    let prefix = "";
    if (hasVEContext && veSelection) {
      prefix = `[${veSelection.screenName}] [${veSelection.elementTag}] `;
    } else if (chipLabel) {
      prefix = `[${chipLabel}] `;
    }
    const fullContent = prefix + value;
    if (!fullContent.trim()) return;
    onSend(fullContent);
    onChange("");
    setSelection(null);
    // keep veSelection — BuilderLayout clears it after successful edit
  };

  const clearVEContext = () => {
    setVeSelection(null);
  };

  const placeholder = hasVEContext && veSelection
    ? `What changes do you want to make to the ${veSelection.elementTag}?`
    : chipLabel
      ? `Ask Evermade about ${chipLabel}…`
      : "Ask Evermade…";

  return (
    <div style={{
      padding: "10px 16px 16px",
      flexShrink: 0,
      position: "relative",
    }}>
      {plusOpen && <PlusMenu onClose={() => setPlusOpen(false)} />}

      {/* Composer */}
      <div style={{
        borderRadius: 16,
        border: `1px solid ${focused ? "rgba(79,142,255,0.35)" : hasVEContext ? "rgba(124,92,252,0.25)" : "rgba(79,142,255,0.14)"}`,
        background: focused ? "rgba(20,50,140,0.14)" : "rgba(10,16,50,0.55)",
        backdropFilter: "blur(30px)",
        WebkitBackdropFilter: "blur(30px)",
        boxShadow: focused
          ? "0 0 0 3px rgba(79,142,255,0.08), 0 4px 28px rgba(0,20,80,0.4)"
          : hasVEContext
            ? "0 0 0 3px rgba(124,92,252,0.06), 0 4px 20px rgba(0,0,0,0.3)"
            : "0 4px 20px rgba(0,0,0,0.3)",
        transition: "border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease",
        overflow: "hidden",
      }}>

        {/* Context chips */}
        {hasContext && (
          <div style={{
            padding: "9px 12px 0",
            opacity: chipVisible ? 1 : 0,
            transform: chipVisible ? "translateY(0)" : "translateY(-3px)",
            transition: "opacity 0.18s ease, transform 0.18s ease",
            display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap",
          }}>
            {hasVEContext && veSelection ? (
              <>
                {/* Screen chip */}
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  padding: "3px 7px 3px 6px", borderRadius: 20,
                  background: "rgba(124,92,252,0.1)",
                  border: "1px solid rgba(124,92,252,0.22)",
                }}>
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="rgba(160,140,255,0.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                  <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(160,140,255,0.9)", letterSpacing: 0.15 }}>
                    {veSelection.screenName}
                  </span>
                </div>

                {/* Element chip */}
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  padding: "3px 7px 3px 6px", borderRadius: 20,
                  background: "rgba(124,92,252,0.1)",
                  border: "1px solid rgba(124,92,252,0.22)",
                }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(160,140,255,0.7)", letterSpacing: 0.1, fontFamily: "ui-monospace, monospace" }}>
                    T
                  </span>
                  <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(160,140,255,0.9)", letterSpacing: 0.15 }}>
                    {veSelection.elementTag}
                    {veSelection.elementText ? ` "${veSelection.elementText.slice(0, 22)}${veSelection.elementText.length > 22 ? "…" : ""}"` : ""}
                  </span>
                  <button type="button" onClick={clearVEContext} style={{
                    width: 13, height: 13, borderRadius: "50%",
                    background: "rgba(255,255,255,0.08)", border: "none",
                    color: "rgba(255,255,255,0.45)", display: "flex",
                    alignItems: "center", justifyContent: "center",
                    cursor: "pointer", fontSize: 10, lineHeight: 1, padding: 0, flexShrink: 0,
                  }}>×</button>
                </div>
              </>
            ) : chipLabel ? (
              /* Legacy single chip */
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                padding: "3px 7px 3px 6px", borderRadius: 20,
                background: "rgba(124,92,252,0.1)",
                border: "1px solid rgba(124,92,252,0.22)",
              }}>
                <div style={{
                  width: 4, height: 4, borderRadius: "50%",
                  background: "#7c5cfc", boxShadow: "0 0 5px rgba(124,92,252,0.9)", flexShrink: 0,
                }} />
                <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(160,140,255,0.9)", letterSpacing: 0.15 }}>
                  {chipLabel}
                </span>
                <button type="button" onClick={() => setSelection(null)} style={{
                  width: 13, height: 13, borderRadius: "50%",
                  background: "rgba(255,255,255,0.08)", border: "none",
                  color: "rgba(255,255,255,0.45)", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  cursor: "pointer", fontSize: 10, lineHeight: 1, padding: 0, flexShrink: 0,
                }}>×</button>
              </div>
            ) : null}
          </div>
        )}

        {/* Textarea */}
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
          }}
          placeholder={placeholder}
          rows={2}
          style={{
            width: "100%",
            background: "transparent",
            border: "none",
            outline: "none",
            padding: hasContext ? "8px 14px 10px" : "14px 14px 10px",
            color: "rgba(255,255,255,0.86)",
            fontSize: 14,
            lineHeight: 1.6,
            resize: "none",
            caretColor: "rgba(255,255,255,0.7)",
            display: "block",
            fontFamily: "inherit",
            letterSpacing: -0.1,
          }}
        />

        {/* ── Bottom toolbar ── */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "8px 10px 10px",
        }}>
          {/* + button */}
          <button
            type="button"
            onClick={() => setPlusOpen((o) => !o)}
            title="Attach & Integrations"
            style={{
              width: 30, height: 30,
              borderRadius: 9,
              border: `1px solid ${plusOpen ? "rgba(79,142,255,0.35)" : "rgba(79,142,255,0.15)"}`,
              background: plusOpen ? "rgba(79,142,255,0.16)" : "rgba(79,142,255,0.06)",
              color: plusOpen ? "rgba(179,210,255,0.9)" : "rgba(255,255,255,0.5)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
              fontSize: plusOpen ? 16 : 20,
              fontWeight: 300,
              lineHeight: 1,
              flexShrink: 0,
              transition: "all 0.14s ease",
            }}
          >
            {plusOpen ? "×" : "+"}
          </button>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Build dropdown */}
          <button
            type="button"
            style={{
              display: "flex", alignItems: "center", gap: 4,
              padding: "5px 10px",
              background: "none", border: "none",
              color: "rgba(255,255,255,0.45)",
              fontSize: 12, fontWeight: 500,
              cursor: "pointer", flexShrink: 0,
              fontFamily: "inherit", letterSpacing: -0.1,
            }}
          >
            Build
            <svg width="9" height="6" viewBox="0 0 9 6" fill="none">
              <path d="M1 1l3.5 3.5L8 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Mic */}
          <button type="button" title="Voice input" style={{
            width: 30, height: 30, borderRadius: "50%",
            border: "none",
            background: "rgba(255,255,255,0.05)",
            color: "rgba(255,255,255,0.38)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", flexShrink: 0,
          }}>
            <svg width="12" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3Z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3M8 22h8"/>
            </svg>
          </button>

          {/* Send */}
          <button
            type="button"
            onClick={handleSend}
            title="Send (Enter)"
            style={{
              width: 30, height: 30, borderRadius: "50%",
              border: "none",
              background: canSend
                ? "linear-gradient(135deg, #7c5cfc 0%, #4878ff 100%)"
                : "rgba(255,255,255,0.07)",
              color: canSend ? "white" : "rgba(255,255,255,0.22)",
              cursor: canSend ? "pointer" : "default",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: canSend ? "0 3px 14px rgba(124,92,252,0.45)" : "none",
              transition: "all 0.18s ease",
              flexShrink: 0,
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19V5M5 12l7-7 7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
