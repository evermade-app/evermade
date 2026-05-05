"use client";

import { useState, useEffect } from "react";

interface SleekPreviewApp {
  id: string;
  appName: string;
  screens: Array<{ id: string; name: string; html: string }>;
  activeIndex: number;
}

interface Props {
  sleekApp: SleekPreviewApp;
  previewId: string;
}

const PHONE_W = 390;
const PHONE_H = 844;
const PHONE_SCALE = 0.72;
const R_OUTER = 52;
const BEZEL = 8.5;

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

export default function PreviewClient({ sleekApp, previewId }: Props) {
  const [activeIndex, setActiveIndex] = useState(sleekApp.activeIndex ?? 0);
  const [previewUrl, setPreviewUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setPreviewUrl(`${window.location.origin}/preview/${previewId}`);
  }, [previewId]);

  const safeIndex = Math.min(activeIndex, sleekApp.screens.length - 1);
  const activeScreen = sleekApp.screens[safeIndex];

  const copy = async () => {
    if (!previewUrl) return;
    await navigator.clipboard.writeText(previewUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const socials = [
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`I just built "${sleekApp.appName}" with @EvermadeAI 🚀`)}&url=${encodeURIComponent(previewUrl)}`,
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.252 5.626zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
    },
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodeURIComponent(`Check out this app I built with Evermade AI! ${previewUrl}`)}`,
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.855L.057 23.5l5.784-1.517A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.894a9.89 9.89 0 0 1-5.032-1.371l-.36-.214-3.733.979 1-3.635-.235-.374A9.86 9.86 0 0 1 2.106 12c0-5.458 4.436-9.894 9.894-9.894 5.458 0 9.894 4.436 9.894 9.894 0 5.458-4.436 9.894-9.894 9.894z"/>
        </svg>
      ),
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(previewUrl)}`,
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
    },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#07070F",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Geist', sans-serif",
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        @keyframes blobA { 0%,100%{transform:translate(0,0)scale(1)} 40%{transform:translate(60px,-40px)scale(1.1)} 70%{transform:translate(-20px,30px)scale(0.92)} }
        @keyframes blobB { 0%,100%{transform:translate(0,0)scale(1)} 30%{transform:translate(-50px,30px)scale(0.9)} 65%{transform:translate(40px,-50px)scale(1.08)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes phoneIn { from{opacity:0;transform:translateY(36px)scale(0.95)} to{opacity:1;transform:translateY(0)scale(1)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        .social-link:hover { background: rgba(255,255,255,0.09) !important; color: rgba(255,255,255,0.8) !important; }
        .tab-btn:hover { opacity: 0.85 !important; }
      `}</style>

      {/* Grid */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        backgroundImage: "linear-gradient(rgba(255,255,255,0.022) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.022) 1px,transparent 1px)",
        backgroundSize: "36px 36px",
      }} />

      {/* Blobs */}
      <div style={{
        position: "fixed", top: "-20%", left: "-10%", width: 900, height: 900,
        borderRadius: "50%", pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(circle, rgba(204,255,0,0.055) 0%, transparent 65%)",
        animation: "blobA 22s ease-in-out infinite",
      }} />
      <div style={{
        position: "fixed", bottom: "-20%", right: "-10%", width: 750, height: 750,
        borderRadius: "50%", pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(circle, rgba(204,255,0,0.035) 0%, transparent 65%)",
        animation: "blobB 28s ease-in-out infinite",
      }} />

      {/* ── Sticky navbar ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50, width: "100%",
        height: 56, padding: "0 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(7,7,15,0.88)",
        backdropFilter: "blur(28px)", WebkitBackdropFilter: "blur(28px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        boxSizing: "border-box",
      }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8, background: "#CCFF00",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 10px rgba(204,255,0,0.4)", flexShrink: 0,
          }}>
            <LogoMark />
          </div>
          <span style={{ fontSize: 15, fontWeight: 700, color: "rgba(255,255,255,0.9)", letterSpacing: -0.3 }}>
            evermade
          </span>
        </a>

        <a
          href="/new-project"
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "7px 18px", borderRadius: 10,
            background: "#CCFF00", color: "#000",
            fontSize: 13, fontWeight: 700,
            textDecoration: "none", letterSpacing: -0.2,
            boxShadow: "0 4px 18px rgba(204,255,0,0.35)",
            whiteSpace: "nowrap", flexShrink: 0,
          }}
        >
          Build yours →
        </a>
      </header>

      {/* ── Main ── */}
      <main style={{
        position: "relative", zIndex: 1,
        width: "100%", maxWidth: 600,
        padding: "48px 20px 80px",
        display: "flex", flexDirection: "column", alignItems: "center",
        boxSizing: "border-box",
      }}>

        {/* App info */}
        <div style={{ textAlign: "center", marginBottom: 36, animation: "fadeUp 0.5s ease both" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            padding: "5px 13px", borderRadius: 99,
            background: "rgba(204,255,0,0.08)", border: "1px solid rgba(204,255,0,0.22)",
            fontSize: 11, fontWeight: 700, color: "#CCFF00",
            letterSpacing: 0.6, textTransform: "uppercase", marginBottom: 18,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: "50%", background: "#CCFF00",
              boxShadow: "0 0 8px #CCFF00", animation: "pulse 2s ease-in-out infinite",
            }} />
            Live Preview
          </div>

          <h1 style={{
            fontSize: "clamp(26px, 6vw, 48px)", fontWeight: 900,
            color: "rgba(255,255,255,0.95)",
            letterSpacing: "clamp(-1.5px, -0.04em, -3px)",
            lineHeight: 1.08, margin: "0 0 12px",
          }}>
            {sleekApp.appName}
          </h1>

          <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.32)", margin: 0, letterSpacing: -0.1 }}>
            {sleekApp.screens.length} screen{sleekApp.screens.length !== 1 ? "s" : ""} · Generated by Evermade AI
          </p>
        </div>

        {/* ── Phone mockup ── */}
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: 22,
          animation: "phoneIn 0.65s cubic-bezier(0.22,1,0.36,1) 0.1s both",
        }}>
          <div style={{
            position: "relative",
            width: PHONE_W * PHONE_SCALE,
            height: PHONE_H * PHONE_SCALE,
            flexShrink: 0,
          }}>
            {/* Lime glow frame */}
            <div style={{
              position: "absolute", inset: 0,
              borderRadius: R_OUTER * PHONE_SCALE,
              boxShadow: [
                `0 0 0 ${2.5 * PHONE_SCALE}px #CCFF00`,
                `0 0 50px rgba(204,255,0,0.28)`,
                `0 70px 140px rgba(0,0,0,0.85)`,
              ].join(", "),
            }} />

            {/* Screen area */}
            <div style={{
              position: "absolute",
              inset: BEZEL * PHONE_SCALE,
              borderRadius: (R_OUTER - BEZEL + 2) * PHONE_SCALE,
              overflow: "hidden",
              background: "#08080F",
            }}>
              {activeScreen && (
                <div style={{
                  width: PHONE_W, height: PHONE_H,
                  transform: `scale(${PHONE_SCALE})`,
                  transformOrigin: "top left",
                  willChange: "transform",
                }}>
                  <iframe
                    key={activeScreen.id}
                    srcDoc={activeScreen.html}
                    sandbox="allow-scripts allow-same-origin"
                    style={{ width: PHONE_W, height: PHONE_H, border: "none", display: "block" }}
                    title={activeScreen.name}
                  />
                </div>
              )}
            </div>

            {/* Dynamic Island */}
            <div style={{
              position: "absolute",
              top: (BEZEL + 14) * PHONE_SCALE,
              left: "50%", transform: "translateX(-50%)",
              width: 118 * PHONE_SCALE, height: 36 * PHONE_SCALE,
              borderRadius: 24 * PHONE_SCALE,
              background: "#000",
              zIndex: 10,
              boxShadow: "0 2px 10px rgba(0,0,0,0.8)",
            }}>
              {/* Camera */}
              <div style={{
                position: "absolute", right: "20%", top: "50%", transform: "translateY(-50%)",
                width: 9 * PHONE_SCALE, height: 9 * PHONE_SCALE,
                borderRadius: "50%", background: "#111820",
                boxShadow: "inset 0 0 3px rgba(0,0,0,0.9)",
              }} />
            </div>

            {/* Glass reflection */}
            <div style={{
              position: "absolute",
              inset: BEZEL * PHONE_SCALE,
              borderRadius: (R_OUTER - BEZEL + 2) * PHONE_SCALE,
              background: "linear-gradient(148deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 28%, transparent 50%)",
              pointerEvents: "none",
              zIndex: 8,
            }} />
          </div>

          {/* Screen tabs */}
          {sleekApp.screens.length > 1 && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center", maxWidth: PHONE_W * PHONE_SCALE + 40 }}>
              {sleekApp.screens.map((s, i) => (
                <button
                  key={s.id}
                  className="tab-btn"
                  onClick={() => setActiveIndex(i)}
                  style={{
                    padding: "6px 16px", borderRadius: 99, border: "none", cursor: "pointer",
                    fontSize: 12, fontWeight: 600, transition: "all 0.18s",
                    background: i === safeIndex ? "#CCFF00" : "rgba(255,255,255,0.07)",
                    color: i === safeIndex ? "#000" : "rgba(255,255,255,0.42)",
                    boxShadow: i === safeIndex ? "0 4px 16px rgba(204,255,0,0.3)" : "none",
                    fontFamily: "inherit", letterSpacing: -0.1,
                  }}
                >
                  {s.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Share card ── */}
        <div style={{
          width: "100%", marginTop: 40,
          background: "rgba(255,255,255,0.025)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 20, padding: "20px",
          animation: "fadeUp 0.6s ease 0.25s both",
          boxSizing: "border-box",
        }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, color: "rgba(255,255,255,0.28)", letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 14 }}>
            Share this app
          </div>

          {/* Copy link row */}
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <div style={{
              flex: 1, padding: "10px 13px", borderRadius: 10,
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
              fontSize: 11, color: "rgba(255,255,255,0.3)", lineHeight: 1,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              display: "flex", alignItems: "center",
            }}>
              {previewUrl || "Loading…"}
            </div>
            <button
              onClick={copy}
              style={{
                padding: "10px 20px", borderRadius: 10, border: "none", cursor: "pointer",
                fontSize: 12.5, fontWeight: 700, whiteSpace: "nowrap", transition: "all 0.18s",
                background: copied ? "rgba(52,211,153,0.15)" : "#CCFF00",
                color: copied ? "#34D399" : "#000",
                fontFamily: "inherit", letterSpacing: -0.1,
                boxShadow: copied ? "none" : "0 4px 16px rgba(204,255,0,0.3)",
              }}
            >
              {copied ? "✓ Copied!" : "Copy link"}
            </button>
          </div>

          {/* Social row */}
          <div style={{ display: "flex", gap: 8 }}>
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                style={{
                  flex: 1, padding: "10px 4px", borderRadius: 10,
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.45)", fontSize: 11, fontWeight: 600,
                  textDecoration: "none", display: "flex",
                  alignItems: "center", justifyContent: "center", gap: 6,
                  transition: "all 0.14s",
                }}
              >
                {s.icon}
                <span>{s.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <div style={{
          marginTop: 52, textAlign: "center",
          animation: "fadeUp 0.6s ease 0.35s both",
        }}>
          <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.22)", marginBottom: 16, letterSpacing: -0.1 }}>
            Want to build your own app with AI?
          </div>
          <a
            href="/new-project"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "14px 30px", borderRadius: 14,
              background: "#CCFF00", color: "#000",
              fontSize: 15, fontWeight: 800,
              textDecoration: "none", letterSpacing: -0.3,
              boxShadow: "0 8px 36px rgba(204,255,0,0.35)",
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
            }}
          >
            Build your app with Evermade
            <span style={{ fontSize: 18, lineHeight: 1 }}>→</span>
          </a>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.18)", marginTop: 10 }}>
            Free to start · No credit card required
          </div>
        </div>
      </main>
    </div>
  );
}
