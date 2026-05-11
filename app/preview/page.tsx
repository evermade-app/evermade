"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const PHONE_W = 390;
const PHONE_H = 844;
const SCALE = 0.38;
const R_OUTER = 52;
const BEZEL = 8.5;
const FRAME_W = Math.round(PHONE_W * SCALE);
const FRAME_H = Math.round(PHONE_H * SCALE);

function LogoMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
      <path d="M6.5 2C4.8 2 4 3 4 4.5V7.2C4 8.2 3.4 8.8 2.2 9.5v1C3.4 11.2 4 11.8 4 12.8V15.5C4 17 4.8 18 6.5 18"
        stroke="#000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.5 2C15.2 2 16 3 16 4.5V7.2C16 8.2 16.6 8.8 17.8 9.5v1C16.6 11.2 16 11.8 16 12.8V15.5C16 17 15.2 18 13.5 18"
        stroke="#000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PhoneFrame({ id, name }: { id: string; name: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, flexShrink: 0 }}>
      <div style={{ position: "relative", width: FRAME_W, height: FRAME_H }}>
        <div style={{
          position: "absolute", inset: 0,
          borderRadius: R_OUTER * SCALE,
          boxShadow: `0 0 0 ${2 * SCALE}px rgba(204,255,0,0.6), 0 0 30px rgba(204,255,0,0.15), 0 20px 60px rgba(0,0,0,0.7)`,
        }} />
        <div style={{
          position: "absolute", inset: BEZEL * SCALE,
          borderRadius: (R_OUTER - BEZEL + 2) * SCALE,
          overflow: "hidden", background: "#08080F",
        }}>
          <div style={{ width: PHONE_W, height: PHONE_H, transform: `scale(${SCALE})`, transformOrigin: "top left" }}>
            <iframe
              src={`https://sleek.design/embed/${id}`}
              style={{ width: PHONE_W, height: PHONE_H, border: "none", display: "block" }}
              title={name}
              loading="lazy"
            />
          </div>
        </div>
        <div style={{
          position: "absolute",
          top: (BEZEL + 14) * SCALE, left: "50%", transform: "translateX(-50%)",
          width: 118 * SCALE, height: 36 * SCALE,
          borderRadius: 24 * SCALE, background: "#000", zIndex: 10,
          boxShadow: "0 2px 8px rgba(0,0,0,0.8)",
        }} />
        <div style={{
          position: "absolute", inset: BEZEL * SCALE,
          borderRadius: (R_OUTER - BEZEL + 2) * SCALE,
          background: "linear-gradient(148deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 28%, transparent 50%)",
          pointerEvents: "none", zIndex: 8,
        }} />
      </div>
      <span style={{
        fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)",
        textAlign: "center", maxWidth: FRAME_W + 16,
        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
      }}>
        {name}
      </span>
    </div>
  );
}

function PreviewGallery() {
  const searchParams = useSearchParams();
  const [copied, setCopied] = useState(false);
  const [pageUrl, setPageUrl] = useState("");

  useEffect(() => { setPageUrl(window.location.href); }, []);

  const rawIds = searchParams.get("screens") ?? "";
  const rawNames = searchParams.get("names") ?? "";
  const title = searchParams.get("title") ? decodeURIComponent(searchParams.get("title")!) : "App Preview";

  const ids = rawIds.split(",").filter(Boolean);
  const nameList = rawNames.split(",").map((n) => decodeURIComponent(n));
  const screens = ids.map((id, i) => ({ id, name: nameList[i] ?? `Screen ${i + 1}` }));

  const copy = async () => {
    await navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (screens.length === 0) {
    return (
      <div style={{ minHeight: "100vh", background: "#07070F", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui" }}>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 16 }}>No screens found.</p>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh", background: "#07070F",
      display: "flex", flexDirection: "column", alignItems: "center",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
      position: "relative", overflow: "hidden",
    }}>
      <style>{`
        @keyframes blobA { 0%,100%{transform:translate(0,0)scale(1)} 40%{transform:translate(60px,-40px)scale(1.1)} 70%{transform:translate(-20px,30px)scale(0.92)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        .screens-scroll { scrollbar-width:none; }
        .screens-scroll::-webkit-scrollbar { display:none; }
      `}</style>

      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(255,255,255,0.022) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.022) 1px,transparent 1px)", backgroundSize: "36px 36px" }} />
      <div style={{ position: "fixed", top: "-20%", left: "-10%", width: 900, height: 900, borderRadius: "50%", pointerEvents: "none", zIndex: 0, background: "radial-gradient(circle, rgba(204,255,0,0.055) 0%, transparent 65%)", animation: "blobA 22s ease-in-out infinite" }} />

      {/* Navbar */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, width: "100%", height: 56, padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(7,7,15,0.88)", backdropFilter: "blur(28px)", WebkitBackdropFilter: "blur(28px)", borderBottom: "1px solid rgba(255,255,255,0.06)", boxSizing: "border-box" }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "#CCFF00", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 10px rgba(204,255,0,0.4)", flexShrink: 0 }}>
            <LogoMark />
          </div>
          <span style={{ fontSize: 15, fontWeight: 700, color: "rgba(255,255,255,0.9)", letterSpacing: -0.3 }}>evermade</span>
        </a>
        <a href="/new-project" style={{ padding: "7px 18px", borderRadius: 10, background: "#CCFF00", color: "#000", fontSize: 13, fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 18px rgba(204,255,0,0.35)", whiteSpace: "nowrap" }}>
          Build yours →
        </a>
      </header>

      <main style={{ position: "relative", zIndex: 1, width: "100%", padding: "40px 0 80px", display: "flex", flexDirection: "column", alignItems: "center" }}>

        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: 36, padding: "0 20px", animation: "fadeUp 0.5s ease both" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 13px", borderRadius: 99, background: "rgba(204,255,0,0.08)", border: "1px solid rgba(204,255,0,0.22)", fontSize: 11, fontWeight: 700, color: "#CCFF00", letterSpacing: 0.6, textTransform: "uppercase" as const, marginBottom: 18 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#CCFF00", boxShadow: "0 0 8px #CCFF00", animation: "pulse 2s ease-in-out infinite" }} />
            Live Preview
          </div>
          <h1 style={{ fontSize: "clamp(24px, 6vw, 42px)", fontWeight: 900, color: "rgba(255,255,255,0.95)", letterSpacing: -2, lineHeight: 1.08, margin: "0 0 10px" }}>{title}</h1>
          <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.32)", margin: 0 }}>
            {screens.length} screen{screens.length !== 1 ? "s" : ""} · Generated by Evermade AI
          </p>
        </div>

        {/* Gallery */}
        <div className="screens-scroll" style={{ width: "100%", overflowX: "auto", overflowY: "visible", display: "flex", gap: 16, padding: `20px 24px ${FRAME_H * 0.1 + 20}px`, scrollSnapType: "x mandatory", boxSizing: "border-box", animation: "fadeUp 0.65s cubic-bezier(0.22,1,0.36,1) 0.1s both" } as React.CSSProperties}>
          {screens.map((s) => (
            <div key={s.id} style={{ scrollSnapAlign: "start", flexShrink: 0 }}>
              <PhoneFrame id={s.id} name={s.name} />
            </div>
          ))}
          <div style={{ flexShrink: 0, width: 8 }} />
        </div>

        {/* Share */}
        <div style={{ width: "100%", maxWidth: 520, marginTop: 24, padding: "0 20px", boxSizing: "border-box", animation: "fadeUp 0.6s ease 0.25s both" }}>
          <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: 20 }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: "rgba(255,255,255,0.28)", letterSpacing: 0.8, textTransform: "uppercase" as const, marginBottom: 12 }}>Share this app</div>
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ flex: 1, padding: "10px 13px", borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", fontSize: 11, color: "rgba(255,255,255,0.3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const, display: "flex", alignItems: "center" }}>
                {pageUrl || "Loading…"}
              </div>
              <button onClick={copy} style={{ padding: "10px 20px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 12.5, fontWeight: 700, whiteSpace: "nowrap" as const, background: copied ? "rgba(52,211,153,0.15)" : "#CCFF00", color: copied ? "#34D399" : "#000", fontFamily: "inherit", boxShadow: copied ? "none" : "0 4px 16px rgba(204,255,0,0.3)" }}>
                {copied ? "✓ Copied!" : "Copy link"}
              </button>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I just built "${title}" with @EvermadeAI 🚀`)}&url=${encodeURIComponent(pageUrl)}`} target="_blank" rel="noopener noreferrer" style={{ flex: 1, padding: "9px 4px", borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.45)", fontSize: 11, fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>X</a>
              <a href={`https://wa.me/?text=${encodeURIComponent(`Check out this app! ${pageUrl}`)}`} target="_blank" rel="noopener noreferrer" style={{ flex: 1, padding: "9px 4px", borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.45)", fontSize: 11, fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>WhatsApp</a>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ marginTop: 48, textAlign: "center", padding: "0 20px", animation: "fadeUp 0.6s ease 0.35s both" }}>
          <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.22)", marginBottom: 16 }}>Want to build your own app with AI?</div>
          <a href="/new-project" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 30px", borderRadius: 14, background: "#CCFF00", color: "#000", fontSize: 15, fontWeight: 800, textDecoration: "none", boxShadow: "0 8px 36px rgba(204,255,0,0.35)" }}>
            Build your app with Evermade <span style={{ fontSize: 18 }}>→</span>
          </a>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.18)", marginTop: 10 }}>Free to start · No credit card required</div>
        </div>
      </main>
    </div>
  );
}

export default function PreviewPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", background: "#07070F", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 14, fontFamily: "system-ui" }}>Loading preview…</div>
      </div>
    }>
      <PreviewGallery />
    </Suspense>
  );
}
