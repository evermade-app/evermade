"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const PLACEHOLDER =
  "Marketplace app with chat, seller profiles, payments, and a live map.";

const TEMPLATES = [
  "Create a mobile app for a startup that helps users track habits and stay consistent.",
  "Create a mobile app that helps users make money online through simple daily actions.",
  "Create a mobile app that connects people around shared interests and local events.",
  "Create a mobile app for personalized fitness plans and daily workout tracking.",
  "Create a mobile app powered by AI that generates content and automates tasks.",
  "Create a mobile app where users can buy and sell services within their community.",
  "Create a mobile app that helps users discover and book unique travel experiences.",
  "Create a mobile app designed to improve focus, reduce distractions, and manage tasks.",
  "Create a mobile app that helps creators build, manage, and monetize their audience.",
  "Create a mobile app with a premium design that delivers exclusive services to users.",
];

// ── Logos ─────────────────────────────────────────────────────────────────────

const AnthropicLogo = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.827 3.818h3.227L24 20.182h-3.227l-6.946-16.364zM6.946 3.818L0 20.182h3.291l1.419-3.436h7.01l1.42 3.436h3.29L10.485 3.818H6.946zm-.527 10.91 2.527-6.109 2.527 6.11H6.419z" />
  </svg>
);

const OpenAILogo = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.843-3.372L15.115 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.403-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
  </svg>
);

const GeminiLogo = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 24A14.304 14.304 0 0 0 0 12 14.304 14.304 0 0 0 12 0a14.304 14.304 0 0 0 12 12 14.304 14.304 0 0 0-12 12z"
      fill="url(#gem-g)"
    />
    <defs>
      <linearGradient id="gem-g" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#4285F4" />
        <stop offset="50%" stopColor="#9B72FF" />
        <stop offset="100%" stopColor="#EA4335" />
      </linearGradient>
    </defs>
  </svg>
);

const AI_MODELS = [
  { id: "claude-4.5-sonnet", name: "Claude 4.5 Sonnet", company: "Anthropic", logo: <AnthropicLogo />, color: "#D4A96A", bg: "rgba(212,169,106,0.12)" },
  { id: "claude-4.6-sonnet", name: "Claude 4.6 Sonnet", company: "Anthropic", logo: <AnthropicLogo />, color: "#D4A96A", bg: "rgba(212,169,106,0.12)" },
  { id: "claude-4.6-opus",   name: "Claude 4.6 Opus",   company: "Anthropic", logo: <AnthropicLogo />, color: "#D4A96A", bg: "rgba(212,169,106,0.12)" },
  { id: "gpt-5.4",           name: "GPT 5.4",            company: "OpenAI",    logo: <OpenAILogo />,    color: "#ffffff", bg: "rgba(255,255,255,0.08)" },
  { id: "gemini-3.5-pro",    name: "Gemini 3.5 Pro",     company: "Google",    logo: <GeminiLogo />,    color: "#4285F4", bg: "rgba(66,133,244,0.12)" },
];

// ── Floating panel at fixed screen coords ─────────────────────────────────────

function FloatingPanel({
  anchorRef,
  open,
  onClose,
  children,
  width,
}: {
  anchorRef: React.RefObject<HTMLButtonElement | null>;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width: number;
}) {
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!open || !anchorRef.current) return;
    const r = anchorRef.current.getBoundingClientRect();
    setCoords({ top: r.top - 8, left: r.left });
  }, [open, anchorRef]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-[998]" onClick={onClose} />
      <div
        className="fixed z-[999]"
        style={{
          top: coords.top,
          left: coords.left,
          width,
          transform: "translateY(-100%)",
          borderRadius: 14,
          background: "rgba(14,14,20,0.97)",
          backdropFilter: "blur(32px)",
          WebkitBackdropFilter: "blur(32px)",
          border: "1px solid rgba(255,255,255,0.09)",
          boxShadow: "0 12px 48px rgba(0,0,0,0.65), 0 1px 0 rgba(255,255,255,0.04) inset",
          padding: 6,
        }}
      >
        {children}
      </div>
    </>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

interface PromptAreaProps {
  authenticated?: boolean;
}

export default function PromptArea({ authenticated = false }: PromptAreaProps) {
  const [text, setText] = useState("");
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0]);
  const [modelOpen, setModelOpen] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modelBtnRef = useRef<HTMLButtonElement>(null);
  const templatesBtnRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  function handleGenerate() {
    const trimmedPrompt = text.trim();
    if (!trimmedPrompt) return;
    if (authenticated) {
      router.push(`/new-project?prompt=${encodeURIComponent(trimmedPrompt)}`);
    } else {
      router.push(`/login?next=${encodeURIComponent(`/new-project?prompt=${encodeURIComponent(trimmedPrompt)}`)}`);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, minWidth: 0 }}>
      <span style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.3)",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
      }}>
        Describe your app
      </span>

      <div
        style={{
          position: "relative",
          borderRadius: 14,
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={PLACEHOLDER}
          className="w-full resize-none border-none bg-transparent p-4 text-sm leading-[1.7] text-white/85 outline-none placeholder:text-white/25 md:p-5 md:text-[15px]"
          style={{ caretColor: "#CCFF00", minHeight: 80 }}
        />

        {attachedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 px-4 pb-4">
            {attachedFiles.map((file, i) => (
              <div
                key={`${file.name}-${i}`}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-white/70"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <span>📄</span>
                <span className="max-w-[120px] truncate">{file.name}</span>
                <button onClick={() => setAttachedFiles((p) => p.filter((_, idx) => idx !== i))} className="ml-0.5 text-white/30 hover:text-white/70">×</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input type="file" ref={fileInputRef} className="hidden" multiple
            onChange={(e) => { if (e.target.files) setAttachedFiles((p) => [...p, ...Array.from(e.target.files!)]); e.target.value = ""; }}
          />

          {/* Attach */}
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              borderRadius: 999, padding: "5px 12px",
              fontSize: 11.5, fontWeight: 500, cursor: "pointer",
              color: "rgba(255,255,255,0.38)",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
              transition: "all 0.15s ease",
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "rgba(255,255,255,0.38)"; }}
          >
            Attach
          </button>

          {/* Model picker */}
          <button
            ref={modelBtnRef}
            onClick={() => { setModelOpen((v) => !v); setTemplatesOpen(false); }}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              borderRadius: 999, padding: "5px 12px",
              fontSize: 11.5, fontWeight: 500, cursor: "pointer",
              color: "rgba(255,255,255,0.5)",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
              transition: "all 0.15s ease",
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
          >
            <span style={{ color: selectedModel.color, display: "flex", alignItems: "center" }}>{selectedModel.logo}</span>
            <span style={{ maxWidth: 110, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{selectedModel.name}</span>
            <span style={{ fontSize: 7, opacity: 0.45 }}>{modelOpen ? "▲" : "▼"}</span>
          </button>

          <FloatingPanel anchorRef={modelBtnRef} open={modelOpen} onClose={() => setModelOpen(false)} width={230}>
            {["Anthropic", "OpenAI", "Google"].map((company, ci) => {
              const models = AI_MODELS.filter((m) => m.company === company);
              return (
                <div key={company}>
                  {ci > 0 && <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "4px 2px" }} />}
                  <div className="flex items-center gap-2 px-2 py-1.5">
                    <span style={{ color: models[0].color, display: "flex", alignItems: "center", opacity: 0.65 }}>{models[0].logo}</span>
                    <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.3)", letterSpacing: "0.05em", textTransform: "uppercase" }}>{company}</span>
                  </div>
                  {models.map((model) => {
                    const sel = selectedModel.id === model.id;
                    return (
                      <button
                        key={model.id}
                        onClick={() => { setSelectedModel(model); setModelOpen(false); }}
                        className="flex w-full items-center gap-2 px-2 py-2 rounded-lg text-left"
                        style={{ background: sel ? model.bg : "transparent", transition: "background 0.1s" }}
                        onMouseEnter={(e) => { if (!sel) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                        onMouseLeave={(e) => { if (!sel) e.currentTarget.style.background = "transparent"; }}
                      >
                        <span style={{ flex: 1, fontSize: 13, fontWeight: sel ? 600 : 450, color: sel ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.72)", letterSpacing: -0.1 }}>
                          {model.name}
                        </span>
                        {sel && <span style={{ width: 5, height: 5, borderRadius: "50%", background: model.color, flexShrink: 0 }} />}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </FloatingPanel>

          {/* Templates */}
          <button
            ref={templatesBtnRef}
            onClick={() => { setTemplatesOpen((v) => !v); setModelOpen(false); }}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              borderRadius: 999, padding: "5px 12px",
              fontSize: 11.5, fontWeight: 500, cursor: "pointer",
              color: "rgba(255,255,255,0.38)",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
              transition: "all 0.15s ease",
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "rgba(255,255,255,0.38)"; }}
          >
            Templates
          </button>

          <FloatingPanel anchorRef={templatesBtnRef} open={templatesOpen} onClose={() => setTemplatesOpen(false)} width={420}>
            <div style={{ padding: "2px 2px 4px" }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.28)", letterSpacing: "0.05em", textTransform: "uppercase", padding: "6px 8px 8px" }}>
                App ideas
              </div>
              {TEMPLATES.map((t, i) => (
                <button
                  key={i}
                  onClick={() => { setText(t); setTemplatesOpen(false); }}
                  className="flex w-full items-start gap-3 px-3 py-2.5 rounded-lg text-left"
                  style={{ background: "transparent", transition: "background 0.1s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.055)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(124,92,255,0.7)", marginTop: 1, flexShrink: 0, fontVariantNumeric: "tabular-nums" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.78)", lineHeight: 1.55, letterSpacing: -0.1 }}>
                    {t}
                  </span>
                </button>
              ))}
            </div>
          </FloatingPanel>
        </div>

        <button
          onClick={handleGenerate}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            borderRadius: 999, padding: "9px 22px",
            fontSize: 13, fontWeight: 700, cursor: "pointer",
            color: "#000",
            background: text.trim() ? "#CCFF00" : "rgba(204,255,0,0.55)",
            border: "none",
            boxShadow: text.trim()
              ? "0 4px 20px rgba(204,255,0,0.35), 0 0 0 1px rgba(204,255,0,0.2)"
              : "none",
            transition: "all 0.2s ease",
            fontFamily: "inherit",
            letterSpacing: -0.1,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.03)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
          onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.98)"; }}
          onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1.03)"; }}
        >
          Generate
          <span style={{ fontSize: 14 }}>→</span>
        </button>
      </div>
    </div>
  );
}
