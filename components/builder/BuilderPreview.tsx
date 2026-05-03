"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useEditor } from "@/lib/editor/EditorContext";
import type { SleekPreviewScreen } from "@/lib/editor/EditorContext";

// ── Dimensions ────────────────────────────────────────────────────────────────
const CARD_W = 390;   // natural mobile viewport width
const CARD_H = 844;   // natural mobile viewport height
const CARD_RADIUS = 32;
const GAP = 44;
const PADDING_X = 80;
const PADDING_Y = 56;
const DEFAULT_ZOOM = 0.74;

// ─────────────────────────────────────────────────────────────────────────────
// SLEEK CANVAS — multi-screen horizontal canvas (no phone mockup)
// ─────────────────────────────────────────────────────────────────────────────
function SleekCanvas() {
  const { sleekApp, setSleekActiveIndex, setSleekApp } = useEditor();
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragOrigin = useRef({ x: 0, scrollLeft: 0 });

  // Cmd/Ctrl + scroll → zoom
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        setZoom((z) => Math.min(1.4, Math.max(0.3, z - e.deltaY * 0.001)));
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // Arrow keys → navigate screens
  useEffect(() => {
    if (!sleekApp) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")
        setSleekActiveIndex(Math.max(0, sleekApp.activeIndex - 1));
      if (e.key === "ArrowRight")
        setSleekActiveIndex(Math.min(sleekApp.screens.length - 1, sleekApp.activeIndex + 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sleekApp, setSleekActiveIndex]);

  // Drag-to-pan on canvas background only
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el || (e.target as HTMLElement).closest("[data-phone]")) return;
    isDragging.current = true;
    dragOrigin.current = { x: e.pageX, scrollLeft: el.scrollLeft };
    el.style.cursor = "grabbing";
    e.preventDefault();
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    scrollRef.current.scrollLeft = dragOrigin.current.scrollLeft - (e.pageX - dragOrigin.current.x);
  }, []);

  const stopDrag = useCallback(() => {
    isDragging.current = false;
    if (scrollRef.current) scrollRef.current.style.cursor = "";
  }, []);

  const count = sleekApp?.screens.length ?? 3;
  const canvasW = PADDING_X * 2 + CARD_W * zoom * count + GAP * (count - 1);

  const fitAll = () => {
    if (!scrollRef.current) return;
    const cW = scrollRef.current.clientWidth;
    const cH = scrollRef.current.clientHeight;
    const zW = (cW - PADDING_X * 2) / (CARD_W * count + GAP * (count - 1));
    const zH = (cH - PADDING_Y * 2) / CARD_H;
    setZoom(Math.min(1.2, zW, zH));
  };

  return (
    <div style={{ flex: 1, position: "relative", overflow: "hidden", background: "#08080E" }}>

      {/* Grid background */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
        backgroundSize: "32px 32px",
        pointerEvents: "none",
      }} />

      {/* Vignette */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 55%, rgba(0,0,0,0.5) 100%)",
        pointerEvents: "none", zIndex: 1,
      }} />

      {/* Scrollable canvas */}
      <div
        ref={scrollRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
        style={{
          position: "absolute", inset: 0,
          overflowX: "auto", overflowY: "hidden",
          cursor: "grab", zIndex: 2,
          scrollbarWidth: "none",
        } as React.CSSProperties}
      >
        <style>{`
          @keyframes phoneSlideUp {
            from { opacity: 0; transform: translateY(28px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes shimmer {
            0%   { background-position: -400px 0; }
            100% { background-position:  400px 0; }
          }
        `}</style>

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: GAP,
          padding: `${PADDING_Y}px ${PADDING_X}px`,
          minWidth: Math.max(canvasW, scrollRef.current?.clientWidth ?? 0),
          minHeight: "100%",
          boxSizing: "border-box",
        }}>
          {sleekApp ? (
            sleekApp.screens.map((screen, i) => (
              <ScreenCard
                key={screen.id}
                screen={screen}
                index={i}
                isActive={i === sleekApp.activeIndex}
                zoom={zoom}
                onClick={() => setSleekActiveIndex(i)}
              />
            ))
          ) : (
            [0, 1, 2].map((i) => <SkeletonCard key={i} index={i} zoom={zoom} />)
          )}
        </div>
      </div>

      {/* Zoom controls — bottom left */}
      <div style={{
        position: "absolute", bottom: 20, left: 20, zIndex: 10,
        display: "flex", alignItems: "center", gap: 2,
        background: "rgba(14,14,22,0.92)",
        border: "1px solid rgba(255,255,255,0.09)",
        borderRadius: 9,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        overflow: "hidden",
      }}>
        <ZoomBtn onClick={() => setZoom((z) => Math.max(0.3, z - 0.1))} title="Zoom out">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M2.5 6.5h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </ZoomBtn>
        <button
          onClick={() => setZoom(DEFAULT_ZOOM)}
          title="Reset zoom"
          style={{
            background: "none", border: "none",
            color: "rgba(255,255,255,0.42)", fontSize: 10.5,
            fontWeight: 600, fontFamily: "inherit", cursor: "pointer",
            padding: "5px 8px", minWidth: 44, textAlign: "center", letterSpacing: 0.2,
          }}
        >
          {Math.round(zoom * 100)}%
        </button>
        <ZoomBtn onClick={() => setZoom((z) => Math.min(1.4, z + 0.1))} title="Zoom in">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M6.5 2.5v8M2.5 6.5h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </ZoomBtn>
        <div style={{ width: 1, height: 22, background: "rgba(255,255,255,0.07)", flexShrink: 0 }} />
        <ZoomBtn onClick={fitAll} title="Fit all screens">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M1 4.5V2a1 1 0 0 1 1-1h2.5M9.5 1H11a1 1 0 0 1 1 1v2.5M12 8.5V11a1 1 0 0 1-1 1H8.5M3.5 12H2a1 1 0 0 1-1-1V8.5"
              stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        </ZoomBtn>
      </div>

      {/* App badge — top center */}
      {sleekApp && (
        <div style={{
          position: "absolute", top: 16, left: "50%", transform: "translateX(-50%)",
          zIndex: 10, display: "flex", alignItems: "center", gap: 8,
          background: "rgba(14,14,22,0.88)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 8,
          backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
          padding: "5px 12px",
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#7c5cfc", boxShadow: "0 0 8px #7c5cfc" }} />
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", fontWeight: 500 }}>
            {sleekApp.appName}
          </span>
          <div style={{ width: 1, height: 12, background: "rgba(255,255,255,0.1)" }} />
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
            {sleekApp.screens.length} screens
          </span>
          <button
            onClick={() => setSleekApp(null)}
            style={{
              background: "none", border: "none",
              color: "rgba(255,255,255,0.2)", cursor: "pointer",
              fontSize: 13, padding: "0 0 0 4px",
              display: "flex", alignItems: "center", lineHeight: 1,
            }}
            title="Clear app"
          >×</button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN CARD — full-bleed iframe, no phone mockup
// ─────────────────────────────────────────────────────────────────────────────
function ScreenCard({
  screen,
  index,
  isActive,
  zoom,
  onClick,
}: {
  screen: SleekPreviewScreen;
  index: number;
  isActive: boolean;
  zoom: number;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      data-phone="true"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
        flexShrink: 0,
        animation: `phoneSlideUp 0.45s cubic-bezier(0.22,1,0.36,1) ${index * 70}ms both`,
      }}
    >
      {/* Card */}
      <div
        onClick={onClick}
        style={{
          width: CARD_W * zoom,
          height: CARD_H * zoom,
          borderRadius: CARD_RADIUS * zoom,
          overflow: "hidden",
          position: "relative",
          flexShrink: 0,
          cursor: "pointer",
          transition: "transform 0.2s ease, box-shadow 0.15s ease",
          transform: hovered ? "translateY(-6px)" : "translateY(0)",
          boxShadow: isActive
            ? `0 0 0 ${2 * zoom}px rgba(124,92,252,0.9), 0 0 0 ${6 * zoom}px rgba(124,92,252,0.15), 0 ${24 * zoom}px ${60 * zoom}px rgba(0,0,0,0.7)`
            : hovered
              ? `0 0 0 ${1.5 * zoom}px rgba(255,255,255,0.15), 0 ${20 * zoom}px ${50 * zoom}px rgba(0,0,0,0.55)`
              : `0 ${16 * zoom}px ${40 * zoom}px rgba(0,0,0,0.45)`,
        }}
      >
        {/* Natural-size iframe, CSS-scaled to fit */}
        <div style={{
          width: CARD_W,
          height: CARD_H,
          transform: `scale(${zoom})`,
          transformOrigin: "top left",
          willChange: "transform",
          pointerEvents: "auto",
        }}>
          <iframe
            srcDoc={screen.html}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
            style={{
              width: CARD_W,
              height: CARD_H,
              border: "none",
              display: "block",
            }}
            title={screen.name}
          />
        </div>
      </div>

      {/* Label */}
      <div style={{ textAlign: "center", userSelect: "none" }}>
        <div style={{
          fontSize: 9, fontWeight: 700,
          color: "rgba(255,255,255,0.18)",
          letterSpacing: 1.2, marginBottom: 4,
          fontFamily: "ui-monospace, 'SF Mono', monospace",
        }}>
          {String(index + 1).padStart(2, "0")}
        </div>
        <div style={{
          fontSize: 11.5,
          fontWeight: isActive ? 600 : 400,
          color: isActive ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.38)",
          letterSpacing: -0.1,
          transition: "color 0.15s",
          maxWidth: CARD_W * zoom,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {screen.name}
        </div>
        {isActive && (
          <div style={{
            width: 20, height: 2, borderRadius: 1,
            background: "#7c5cfc",
            margin: "5px auto 0",
            boxShadow: "0 0 6px rgba(124,92,252,0.6)",
          }} />
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON CARD — shimmer while loading
// ─────────────────────────────────────────────────────────────────────────────
function SkeletonCard({ index, zoom }: { index: number; zoom: number }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      gap: 14, flexShrink: 0, opacity: 1 - index * 0.22,
    }}>
      <div style={{
        width: CARD_W * zoom,
        height: CARD_H * zoom,
        borderRadius: CARD_RADIUS * zoom,
        background: "linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 100%)",
        backgroundSize: "800px 100%",
        animation: `shimmer 1.8s ease-in-out ${index * 200}ms infinite`,
        border: "1px solid rgba(255,255,255,0.06)",
      }} />
      <div style={{ width: 80, height: 8, borderRadius: 4, background: "rgba(255,255,255,0.06)" }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ZOOM BUTTON
// ─────────────────────────────────────────────────────────────────────────────
function ZoomBtn({ onClick, title, children }: { onClick: () => void; title: string; children: React.ReactNode }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick} title={title}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? "rgba(255,255,255,0.06)" : "none",
        border: "none", cursor: "pointer",
        color: "rgba(255,255,255,0.45)",
        padding: "6px 8px",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "background 0.12s", borderRadius: 5,
      }}
    >
      {children}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT EXPORT
// ─────────────────────────────────────────────────────────────────────────────
export default function BuilderPreview() {
  return <SleekCanvas />;
}
