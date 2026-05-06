"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useEditor } from "@/lib/editor/EditorContext";
import { getComponent, getComponentLabel } from "@/lib/editor/projectState";
import PlusMenu from "./PlusMenu";
import type { Attachment } from "./BuilderLayout";

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB
const TEXT_MIME = new Set(["text/plain", "text/markdown", "text/csv", "application/json"]);
const TEXT_EXT = /\.(txt|md|csv|json)$/i;

function formatBytes(b: number): string {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${Math.round(b / 1024)} KB`;
  return `${(b / (1024 * 1024)).toFixed(1)} MB`;
}

async function processFile(file: File): Promise<Attachment | "too_large"> {
  if (file.size > MAX_FILE_BYTES) return "too_large";

  const kind: Attachment["kind"] =
    file.type.startsWith("image/") ? "image" :
    TEXT_MIME.has(file.type) || TEXT_EXT.test(file.name) ? "text" :
    "binary";

  let dataUrl = "";
  let textContent: string | undefined;

  if (kind === "image") {
    dataUrl = await new Promise<string>((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(r.result as string);
      r.onerror = rej;
      r.readAsDataURL(file);
    });
  } else if (kind === "text") {
    textContent = await new Promise<string>((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(r.result as string);
      r.onerror = rej;
      r.readAsText(file);
    });
  }

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    name: file.name,
    size: file.size,
    mimeType: file.type || "application/octet-stream",
    dataUrl,
    kind,
    textContent,
  };
}

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSend: (content?: string) => void;
  attachments: Attachment[];
  onAttachmentsChange: (a: Attachment[]) => void;
};

export default function BuilderPromptBar({ value, onChange, onSend, attachments, onAttachmentsChange }: Props) {
  const [focused, setFocused] = useState(false);
  const [plusOpen, setPlusOpen] = useState(false);
  const [chipVisible, setChipVisible] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { selection, setSelection, project, veSelection, setVeSelection } = useEditor();

  const selectedComponent = selection
    ? getComponent(project, selection.screenId, selection.componentId)
    : null;
  const chipLabel = selectedComponent ? getComponentLabel(selectedComponent) : null;

  const hasVEContext = !!veSelection;
  const hasContext = hasVEContext || !!chipLabel;
  const hasAttachments = attachments.length > 0;

  const canSend = value.trim().length > 0 || hasContext || hasAttachments;

  useEffect(() => {
    if (hasContext) {
      setChipVisible(false);
      const raf = requestAnimationFrame(() => setChipVisible(true));
      return () => cancelAnimationFrame(raf);
    } else {
      setChipVisible(false);
    }
  }, [hasContext, veSelection, selection]);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const showToast = useCallback((msg: string) => setToast(msg), []);

  const processFiles = useCallback(async (files: FileList) => {
    const results: Attachment[] = [];
    for (const file of Array.from(files)) {
      const result = await processFile(file);
      if (result === "too_large") {
        showToast(`"${file.name}" is too large. Max 10 MB.`);
        continue;
      }
      results.push(result);
    }
    if (results.length > 0) {
      onAttachmentsChange([...attachments, ...results]);
    }
  }, [attachments, onAttachmentsChange, showToast]);

  const handleImageInput = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) await processFiles(e.target.files);
    e.target.value = "";
    setPlusOpen(false);
  }, [processFiles]);

  const handleFileInput = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) await processFiles(e.target.files);
    e.target.value = "";
    setPlusOpen(false);
  }, [processFiles]);

  const removeAttachment = useCallback((id: string) => {
    onAttachmentsChange(attachments.filter((a) => a.id !== id));
  }, [attachments, onAttachmentsChange]);

  const handleSend = () => {
    let prefix = "";
    if (hasVEContext && veSelection) {
      prefix = `[${veSelection.screenName}] [${veSelection.elementTag}] `;
    } else if (chipLabel) {
      prefix = `[${chipLabel}] `;
    }
    const fullContent = prefix + value;
    if (!fullContent.trim() && !hasAttachments) return;
    onSend(fullContent || undefined);
    onChange("");
    setSelection(null);
  };

  const clearVEContext = () => setVeSelection(null);

  const placeholder = hasAttachments
    ? "Describe what to build, or let the AI use your uploaded assets…"
    : hasVEContext && veSelection
      ? `What changes do you want to make to the ${veSelection.elementTag}?`
      : chipLabel
        ? `Ask Evermade about ${chipLabel}…`
        : "Ask Evermade…";

  return (
    <div style={{ padding: "10px 16px 16px", flexShrink: 0, position: "relative" }}>
      {/* Hidden file inputs */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: "none" }}
        onChange={handleImageInput}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt,.md,.csv,.json,.png,.jpg,.jpeg,.svg,.gif,.mp4,.zip,image/*"
        multiple
        style={{ display: "none" }}
        onChange={handleFileInput}
      />

      {plusOpen && (
        <PlusMenu
          onClose={() => setPlusOpen(false)}
          onUploadImage={() => imageInputRef.current?.click()}
          onAttachFile={() => fileInputRef.current?.click()}
        />
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: "absolute", bottom: "calc(100% + 8px)", left: 16, right: 16,
          background: "rgba(255,60,60,0.92)", backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderRadius: 10, padding: "9px 14px",
          fontSize: 12, color: "#fff", fontWeight: 500,
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          zIndex: 200, animation: "toastIn 0.18s ease both",
        }}>
          <style>{`@keyframes toastIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}`}</style>
          {toast}
        </div>
      )}

      {/* Composer */}
      <div style={{
        borderRadius: 16,
        border: `1px solid ${focused ? "rgba(204,255,0,0.55)" : hasVEContext ? "rgba(204,255,0,0.3)" : hasAttachments ? "rgba(204,255,0,0.35)" : "rgba(204,255,0,0.18)"}`,
        background: focused ? "rgba(0,0,0,0.55)" : "rgba(6,6,14,0.75)",
        backdropFilter: "blur(30px)",
        WebkitBackdropFilter: "blur(30px)",
        boxShadow: focused
          ? "0 0 0 3px rgba(204,255,0,0.06), 0 4px 28px rgba(0,0,0,0.5)"
          : "0 4px 20px rgba(0,0,0,0.4)",
        transition: "border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease",
        overflow: "hidden",
      }}>

        {/* Context chips (VE selection / legacy) */}
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
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  padding: "3px 7px 3px 6px", borderRadius: 20,
                  background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
                }}>
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                  <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.75)", letterSpacing: 0.15 }}>
                    {veSelection.screenName}
                  </span>
                </div>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  padding: "3px 7px 3px 6px", borderRadius: 20,
                  background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
                }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: 0.1, fontFamily: "ui-monospace, monospace" }}>T</span>
                  <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.75)", letterSpacing: 0.15 }}>
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
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                padding: "3px 7px 3px 6px", borderRadius: 20,
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
              }}>
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#CCFF00", flexShrink: 0 }} />
                <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.75)", letterSpacing: 0.15 }}>{chipLabel}</span>
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

        {/* Attachment preview strip */}
        {hasAttachments && (
          <div style={{
            padding: "9px 12px 0",
            display: "flex", gap: 6, flexWrap: "wrap",
          }}>
            {attachments.map((att) => (
              <AttachmentChip key={att.id} att={att} onRemove={() => removeAttachment(att.id)} />
            ))}
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
            padding: (hasContext || hasAttachments) ? "8px 14px 10px" : "14px 14px 10px",
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

        {/* Bottom toolbar */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 10px 10px" }}>
          {/* + button */}
          <button
            type="button"
            onClick={() => setPlusOpen((o) => !o)}
            title="Attach & Integrations"
            style={{
              width: 30, height: 30,
              borderRadius: 9,
              border: `1px solid ${plusOpen ? "rgba(204,255,0,0.5)" : "rgba(255,255,255,0.12)"}`,
              background: plusOpen ? "rgba(204,255,0,0.08)" : "rgba(255,255,255,0.04)",
              color: plusOpen ? "#CCFF00" : "rgba(255,255,255,0.5)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
              fontSize: plusOpen ? 16 : 20, fontWeight: 300, lineHeight: 1,
              flexShrink: 0,
              transition: "all 0.14s ease",
            }}
          >
            {plusOpen ? "×" : "+"}
          </button>

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
              background: canSend ? "#CCFF00" : "rgba(255,255,255,0.07)",
              color: canSend ? "#000" : "rgba(255,255,255,0.22)",
              cursor: canSend ? "pointer" : "default",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: canSend ? "0 3px 14px rgba(204,255,0,0.35)" : "none",
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

function AttachmentChip({ att, onRemove }: { att: Attachment; onRemove: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: att.kind === "image" ? "2px 8px 2px 2px" : "4px 8px 4px 6px",
        borderRadius: 9,
        background: "rgba(255,255,255,0.07)",
        border: "1px solid rgba(255,255,255,0.12)",
        maxWidth: 200,
        transition: "background 0.12s",
      }}
    >
      {att.kind === "image" ? (
        /* Thumbnail */
        <div style={{
          width: 36, height: 36, borderRadius: 7, overflow: "hidden", flexShrink: 0,
          background: "rgba(255,255,255,0.06)",
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={att.dataUrl} alt={att.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      ) : (
        /* File icon */
        <div style={{
          width: 28, height: 28, borderRadius: 7,
          background: "rgba(204,255,0,0.08)", border: "1px solid rgba(204,255,0,0.18)",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
            <path d="M2 1h5l4 4v8a1 1 0 01-1 1H2a1 1 0 01-1-1V2a1 1 0 011-1z" stroke="#CCFF00" strokeWidth="1.2"/>
            <path d="M7 1v4h4" stroke="#CCFF00" strokeWidth="1.2"/>
          </svg>
        </div>
      )}
      <div style={{ minWidth: 0 }}>
        <div style={{
          fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.8)",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          maxWidth: 110,
        }}>{att.name}</div>
        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", marginTop: 1 }}>
          {formatBytes(att.size)}
        </div>
      </div>
      <button
        type="button"
        onClick={onRemove}
        style={{
          width: 14, height: 14, borderRadius: "50%",
          background: hov ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.07)",
          border: "none", color: "rgba(255,255,255,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", fontSize: 10, lineHeight: 1, padding: 0, flexShrink: 0,
          transition: "background 0.12s",
        }}
      >×</button>
    </div>
  );
}
