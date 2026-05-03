"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { useEditor } from "@/lib/editor/EditorContext";

// ── Real QR code via qrcode package ───────────────────────────────────────────
function RealQRCode({ url }: { url: string }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!url) return;
    QRCode.toDataURL(url, {
      width: 140,
      margin: 1,
      color: { dark: "#0a0818", light: "#ffffff" },
      errorCorrectionLevel: "M",
    }).then(setDataUrl).catch(() => setDataUrl(null));
  }, [url]);

  if (!dataUrl) return <FakeQRCode />;
  return (
    <img
      src={dataUrl}
      width={140}
      height={140}
      alt="Scan to preview on your device"
      style={{ display: "block", borderRadius: 5 }}
    />
  );
}

// ── Fallback skeleton QR while real one loads ─────────────────────────────────
function FakeQRCode() {
  const n = 21;
  const cell = 8;

  const finderDark = (r: number, c: number): boolean => {
    if (r === 0 || r === 6 || c === 0 || c === 6) return true;
    if (r >= 2 && r <= 4 && c >= 2 && c <= 4) return true;
    return false;
  };

  const isFinderPattern = (r: number, c: number): boolean | null => {
    if (r <= 6 && c <= 6) return finderDark(r, c);
    if (r <= 6 && c >= 14) return finderDark(r, c - 14);
    if (r >= 14 && c <= 6) return finderDark(r - 14, c);
    if (r === 7 && c <= 7) return false;
    if (c === 7 && r <= 7) return false;
    if (r === 7 && c >= 13) return false;
    if (c === 13 && r <= 7) return false;
    if (r === 13 && c <= 7) return false;
    if (c === 7 && r >= 13) return false;
    return null;
  };

  const isDark = (r: number, c: number): boolean => {
    const fp = isFinderPattern(r, c);
    if (fp !== null) return fp;
    if (r === 6) return c % 2 === 0;
    if (c === 6) return r % 2 === 0;
    return ((r * 17 + c * 13 + r * c + r + c) % 4) !== 0;
  };

  const size = n * cell;
  const darkCells: [number, number][] = [];
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (isDark(r, c)) darkCells.push([r, c]);
    }
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ borderRadius: 5, display: "block", opacity: 0.35 }}
    >
      <rect width={size} height={size} fill="white" />
      {darkCells.map(([r, c]) => (
        <rect
          key={`${r}-${c}`}
          x={c * cell + 0.3}
          y={r * cell + 0.3}
          width={cell - 0.6}
          height={cell - 0.6}
          fill="#0a0818"
        />
      ))}
    </svg>
  );
}

export default function QRPanel() {
  const { project } = useEditor();
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const uploadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Build preview URL using NEXT_PUBLIC_APP_URL or fall back to current origin
  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin;
    setPreviewUrl(`${base}/preview/${project.id}`);
  }, [project.id]);

  // Upload project to server (debounced 500 ms) whenever project changes
  useEffect(() => {
    if (uploadTimerRef.current) clearTimeout(uploadTimerRef.current);
    uploadTimerRef.current = setTimeout(() => {
      fetch(`/api/preview/${project.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
      }).catch(() => {});
    }, 500);
    return () => {
      if (uploadTimerRef.current) clearTimeout(uploadTimerRef.current);
    };
  }, [project]);

  return (
    <div
      style={{
        width: 220,
        flexShrink: 0,
        height: "100%",
        borderLeft: "1px solid rgba(79,142,255,0.14)",
        background: "rgba(4,4,16,0.88)",
        backdropFilter: "blur(48px)",
        WebkitBackdropFilter: "blur(48px)",
        boxShadow: "-1px 0 0 rgba(79,142,255,0.06), -8px 0 40px rgba(0,0,0,0.5)",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        padding: "20px 16px 20px",
        gap: 14,
        scrollbarWidth: "none",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Geist', 'SF Pro Text', sans-serif",
      }}
    >
      {/* ── TIER 1: QR card with rainbow shimmer border ── */}
      <div className="evermade-shimmer-shell" style={{ borderRadius: 20, flexShrink: 0 }}>
        <div className="evermade-shimmer-content" style={{ padding: "16px 14px 14px" }}>

          {/* Title */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: "rgba(255,255,255,0.88)", letterSpacing: -0.2, marginBottom: 2 }}>
              Test on your device
            </div>
            <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.28)" }}>
              {previewUrl ? "Scan to open live preview" : "Detecting local network…"}
            </div>
          </div>

          {/* QR code */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
            <div style={{
              padding: 10,
              background: "white",
              borderRadius: 12,
              boxShadow: "0 8px 32px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4)",
            }}>
              {previewUrl ? <RealQRCode url={previewUrl} /> : <FakeQRCode />}
            </div>
          </div>

          {/* URL pill */}
          {previewUrl && (
            <div style={{
              marginBottom: 10,
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: 5,
              padding: "4px 10px",
              borderRadius: 20,
              background: "rgba(79,142,255,0.07)",
              border: "1px solid rgba(79,142,255,0.15)",
            }}>
              <div style={{
                width: 4, height: 4, borderRadius: "50%",
                background: "#4f8eff", boxShadow: "0 0 6px rgba(79,142,255,0.9)", flexShrink: 0,
              }} />
              <span style={{ fontSize: 9.5, color: "rgba(179,210,255,0.6)", fontFamily: "monospace", letterSpacing: 0 }}>
                {previewUrl}
              </span>
            </div>
          )}

          {/* Steps */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{
                width: 26, height: 26, borderRadius: 8,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <rect x="2" y="1" width="10" height="12" rx="2.5" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2" />
                  <circle cx="7" cy="11" r="0.8" fill="rgba(255,255,255,0.4)" />
                  <rect x="4.5" y="3" width="5" height="0.8" rx="0.4" fill="rgba(255,255,255,0.3)" />
                </svg>
              </div>
              <span style={{ fontSize: 9.5, color: "rgba(255,255,255,0.35)", textAlign: "center" }}>Open Camera</span>
            </div>

            <svg width="14" height="10" viewBox="0 0 14 10" fill="none" style={{ flexShrink: 0, marginBottom: 12 }}>
              <path d="M1 5h11M8 1l4 4-4 4" stroke="rgba(255,255,255,0.15)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{
                width: 26, height: 26, borderRadius: 8,
                background: "rgba(124,92,252,0.1)",
                border: "1px solid rgba(124,92,252,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <rect x="1" y="1" width="5" height="5" rx="1" stroke="rgba(124,92,252,0.85)" strokeWidth="1.2" />
                  <rect x="8" y="1" width="5" height="5" rx="1" stroke="rgba(124,92,252,0.85)" strokeWidth="1.2" />
                  <rect x="1" y="8" width="5" height="5" rx="1" stroke="rgba(124,92,252,0.85)" strokeWidth="1.2" />
                  <rect x="10" y="10" width="3" height="3" rx="0.5" fill="rgba(124,92,252,0.85)" />
                </svg>
              </div>
              <span style={{ fontSize: 9.5, color: "rgba(255,255,255,0.35)", textAlign: "center" }}>Scan QR code</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── TIER 2: Guidance ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "0 4px", flexShrink: 0 }}>
        {[
          "Browser preview is approximate — native device shows true performance.",
          "Hot-reload active: changes appear instantly on scan.",
        ].map((text, i) => (
          <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <div style={{
              width: 4, height: 4, borderRadius: "50%",
              background: "rgba(79,142,255,0.3)", flexShrink: 0, marginTop: 5,
            }} />
            <span style={{ fontSize: 10.5, color: "rgba(255,255,255,0.26)", lineHeight: 1.6 }}>
              {text}
            </span>
          </div>
        ))}
      </div>

      {/* ── TIER 3: Deploy card ── */}
      <div style={{
        borderRadius: 16,
        overflow: "hidden",
        border: "1px solid rgba(79,142,255,0.22)",
        background: "rgba(79,142,255,0.05)",
        boxShadow: "0 0 30px rgba(79,142,255,0.08), inset 0 1px 0 rgba(255,255,255,0.04)",
        flexShrink: 0,
      }}>
        {/* Gradient top line */}
        <div style={{
          height: 1.5,
          background: "linear-gradient(90deg, rgba(79,142,255,0.95) 0%, rgba(124,92,252,0.7) 60%, transparent 100%)",
          boxShadow: "0 0 10px rgba(79,142,255,0.5)",
        }} />

        <div style={{ padding: "13px 14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: "linear-gradient(135deg, #7c5cfc 0%, #4878ff 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 15, flexShrink: 0,
              boxShadow: "0 4px 12px rgba(124,92,252,0.4)",
            }}>🚀</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.88)", letterSpacing: -0.1, marginBottom: 1 }}>
                Ready to ship?
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>App Store · Google Play</div>
            </div>
          </div>

          <p style={{ margin: "0 0 10px", fontSize: 10.5, color: "rgba(255,255,255,0.34)", lineHeight: 1.6 }}>
            Submit directly to both stores — no Xcode or Android Studio required.
          </p>

          <button type="button" style={{
            width: "100%",
            padding: "9px 0",
            borderRadius: 10,
            border: "1px solid rgba(79,142,255,0.35)",
            background: "linear-gradient(135deg, rgba(79,142,255,0.22) 0%, rgba(124,92,252,0.12) 100%)",
            color: "rgba(255,255,255,0.9)",
            fontSize: 12,
            fontWeight: 650,
            cursor: "pointer",
            letterSpacing: 0.1,
            boxShadow: "0 0 18px rgba(79,142,255,0.18)",
            fontFamily: "inherit",
          }}>
            Publish now →
          </button>

          {/* Store badges */}
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            {/* App Store */}
            <div style={{
              flex: 1,
              display: "flex", alignItems: "center", gap: 7,
              padding: "7px 10px",
              borderRadius: 9,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(255,255,255,0.85)">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <div>
                <div style={{ fontSize: 8, color: "rgba(255,255,255,0.4)", lineHeight: 1, marginBottom: 1 }}>Download on</div>
                <div style={{ fontSize: 10.5, fontWeight: 600, color: "rgba(255,255,255,0.82)", lineHeight: 1, letterSpacing: -0.1 }}>App Store</div>
              </div>
            </div>

            {/* Google Play */}
            <div style={{
              flex: 1,
              display: "flex", alignItems: "center", gap: 7,
              padding: "7px 10px",
              borderRadius: 9,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M3.18 23.76a2 2 0 0 0 2.14-.22l12.1-6.92L14 13l-10.82 10.76z" fill="rgba(255,255,255,0.5)"/>
                <path d="M22.23 9.62a2 2 0 0 0 0 4.76l-.01-.01-2.84-1.63-2.84-1.63 2.85-1.63 2.84-1.62v.13z" fill="rgba(255,255,255,0.7)"/>
                <path d="M3.18.24A2 2 0 0 0 2 2.03v19.94a2 2 0 0 0 1.18 1.79L14 13 3.18.24z" fill="rgba(255,255,255,0.85)"/>
                <path d="M17.42 16.14L5.32 23.06a2 2 0 0 0 2.1-.1L19.38 15.5l-1.96.64z" fill="rgba(255,255,255,0.6)"/>
                <path d="M17.42 7.86l1.96.64L7.42 1.04a2 2 0 0 0-2.1-.1l12.1 6.92z" fill="rgba(255,255,255,0.6)"/>
              </svg>
              <div>
                <div style={{ fontSize: 8, color: "rgba(255,255,255,0.4)", lineHeight: 1, marginBottom: 1 }}>Get it on</div>
                <div style={{ fontSize: 10.5, fontWeight: 600, color: "rgba(255,255,255,0.82)", lineHeight: 1, letterSpacing: -0.1 }}>Google Play</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Build status ── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "7px 10px",
        borderRadius: 10,
        background: "rgba(255,255,255,0.018)",
        border: "1px solid rgba(255,255,255,0.05)",
        flexShrink: 0,
      }}>
        <div style={{
          width: 5, height: 5, borderRadius: "50%",
          background: "#4ade80",
          boxShadow: "0 0 7px rgba(74,222,128,0.8)",
          flexShrink: 0,
        }} />
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>
          Build ready · {project.name} {project.version}
        </span>
      </div>
    </div>
  );
}
