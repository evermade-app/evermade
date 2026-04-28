"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { EditorProvider, useEditor } from "@/lib/editor/EditorContext";
import PhoneMockup from "@/components/builder/PhoneMockup";
import PreviewScreen from "@/components/builder/PreviewScreen";
import type { Project } from "@/lib/editor/project";

interface Props {
  project: Project;
  previewId: string;
}

// ── QR code image component ───────────────────────────────────────────────────
function QRImage({ url, size = 156 }: { url: string; size?: number }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    QRCode.toDataURL(url, {
      width: size,
      margin: 1,
      color: { dark: "#08080F", light: "#ffffff" },
      errorCorrectionLevel: "M",
    })
      .then(setDataUrl)
      .catch(() => setDataUrl(null));
  }, [url, size]);

  if (!dataUrl) {
    return (
      <div style={{ width: size, height: size, background: "#eee", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: 11, color: "#999" }}>Loading…</div>
      </div>
    );
  }
  return (
    <img src={dataUrl} width={size} height={size} alt="QR code — scan to open preview" style={{ display: "block", borderRadius: 6 }} />
  );
}

// ── Share panel ───────────────────────────────────────────────────────────────
function SharePanel({ previewUrl, primaryColor }: { previewUrl: string; primaryColor: string }) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(previewUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const socials = [
    {
      label: "X / Twitter",
      icon: "𝕏",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent("Check out this app I built with Evermade 🚀")}&url=${encodeURIComponent(previewUrl)}`,
      color: "#1d9bf0",
    },
    {
      label: "WhatsApp",
      icon: "💬",
      href: `https://wa.me/?text=${encodeURIComponent(`Check out this app! ${previewUrl}`)}`,
      color: "#25d366",
    },
    {
      label: "LinkedIn",
      icon: "in",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(previewUrl)}`,
      color: "#0a66c2",
    },
  ];

  return (
    <div style={{
      width: "100%",
      maxWidth: 380,
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 20,
      padding: 20,
    }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>
        Share this preview
      </div>

      {/* URL + copy */}
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <div style={{
          flex: 1, padding: "9px 12px", borderRadius: 10,
          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
          fontSize: 11, color: "rgba(255,255,255,0.38)",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {previewUrl}
        </div>
        <button
          onClick={copy}
          style={{
            padding: "9px 16px", borderRadius: 10, border: "none", cursor: "pointer",
            fontSize: 12, fontWeight: 700, whiteSpace: "nowrap", transition: "all 0.18s",
            background: copied ? "rgba(52,211,153,0.15)" : `linear-gradient(135deg, ${primaryColor}, #4878FF)`,
            color: copied ? "#34D399" : "#fff",
          }}
        >
          {copied ? "✓ Copied!" : "Copy link"}
        </button>
      </div>

      {/* QR toggle */}
      <button
        onClick={() => setShowQR((v) => !v)}
        style={{
          width: "100%", padding: 10, borderRadius: 10,
          border: "1px solid rgba(255,255,255,0.08)",
          background: showQR ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.03)",
          color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 600,
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
          marginBottom: 10,
        }}
      >
        <span style={{ fontSize: 15 }}>📱</span>
        {showQR ? "Hide QR code" : "Show QR code to scan"}
      </button>

      {showQR && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div style={{ padding: 14, background: "#fff", borderRadius: 16, boxShadow: `0 8px 32px ${primaryColor}35` }}>
            <QRImage url={previewUrl} size={156} />
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.26)", textAlign: "center" }}>
            Scan with any camera — no login required
          </div>
        </div>
      )}

      {/* Social share */}
      <div style={{ display: "flex", gap: 8 }}>
        {socials.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1, padding: "8px 4px", borderRadius: 10,
              background: `${s.color}14`, border: `1px solid ${s.color}30`,
              color: s.color, fontSize: 10, fontWeight: 700,
              textDecoration: "none", display: "flex",
              alignItems: "center", justifyContent: "center", gap: 4,
            }}
          >
            <span style={{ fontSize: 13 }}>{s.icon}</span>
            <span>{s.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

// ── Inner component — runs inside EditorProvider ──────────────────────────────
function PreviewInner({ previewUrl }: { previewUrl: string }) {
  const { project, setActiveScreen } = useEditor();
  const primaryColor = project.theme?.primaryColor ?? "#7C5CFC";
  const screens = project.screens;
  const activeId = project.activeScreenId;
  const activeIndex = Math.max(0, screens.findIndex((s) => s.id === activeId));

  const switchTo = (i: number) => {
    const s = screens[i];
    if (s) setActiveScreen(s.id);
  };

  return (
    <>
      {/* Phone mockup */}
      <div style={{ marginBottom: 28 }}>
        <PhoneMockup>
          <PreviewScreen />
        </PhoneMockup>
      </div>

      {/* Screen tabs */}
      {screens.length > 1 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center", marginBottom: 28, maxWidth: 380 }}>
          {screens.map((s, i) => (
            <button
              key={s.id}
              onClick={() => switchTo(i)}
              style={{
                padding: "5px 16px", borderRadius: 999, border: "none", cursor: "pointer",
                fontSize: 12, fontWeight: 600, transition: "all 0.18s",
                background: i === activeIndex
                  ? `linear-gradient(135deg, ${primaryColor}, #4878FF)`
                  : "rgba(255,255,255,0.06)",
                color: i === activeIndex ? "#fff" : "rgba(255,255,255,0.38)",
                boxShadow: i === activeIndex ? `0 4px 14px ${primaryColor}40` : "none",
              }}
            >
              {s.name}
            </button>
          ))}
        </div>
      )}

      {/* Share panel */}
      <SharePanel previewUrl={previewUrl} primaryColor={primaryColor} />

      {/* Footer */}
      <div style={{ marginTop: 32, fontSize: 12, color: "rgba(255,255,255,0.18)", textAlign: "center" }}>
        Created with{" "}
        <a href="/" style={{ color: primaryColor, textDecoration: "none", fontWeight: 600 }}>
          Evermade
        </a>
        {" "}— Build & publish beautiful apps with AI
      </div>
    </>
  );
}

// ── Root export ───────────────────────────────────────────────────────────────
export default function PreviewClient({ project, previewId }: Props) {
  const primaryColor = project.theme?.primaryColor ?? "#7C5CFC";

  // Use the actual origin so the URL works on any device (phone, tablet, etc.)
  const [previewUrl, setPreviewUrl] = useState(`/preview/${previewId}`);
  useEffect(() => {
    setPreviewUrl(`${window.location.origin}/preview/${previewId}`);
  }, [previewId]);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#08080F",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "32px 16px 48px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
    }}>

      {/* ── Header ── */}
      <div style={{ width: "100%", maxWidth: 380, display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32 }}>
        <div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.28)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>
            Built with Evermade
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#fff", letterSpacing: -0.6, lineHeight: 1.1 }}>
            {project.name}
          </div>
          <div style={{
            display: "inline-flex", alignItems: "center", marginTop: 8,
            padding: "3px 10px", borderRadius: 999,
            background: `${primaryColor}1a`, border: `1px solid ${primaryColor}40`,
            fontSize: 11, fontWeight: 600, color: primaryColor,
          }}>
            {project.screens.length} screen{project.screens.length !== 1 ? "s" : ""}
          </div>
        </div>
        <a
          href="/"
          style={{
            padding: "8px 16px", borderRadius: 10,
            background: `linear-gradient(135deg, ${primaryColor}, #4878FF)`,
            color: "#fff", fontSize: 12, fontWeight: 700, textDecoration: "none",
            boxShadow: `0 4px 16px ${primaryColor}40`, whiteSpace: "nowrap",
            flexShrink: 0, marginLeft: 12,
          }}
        >
          Build yours →
        </a>
      </div>

      {/* ── Phone + tabs + share — project injected directly, no localStorage needed ── */}
      <EditorProvider initialProject={project}>
        <PreviewInner previewUrl={previewUrl} />
      </EditorProvider>
    </div>
  );
}
