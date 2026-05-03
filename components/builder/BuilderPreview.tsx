"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useEditor } from "@/lib/editor/EditorContext";
import PhoneMockup from "./PhoneMockup";
import PreviewScreen from "./PreviewScreen";
import type { SleekPreviewApp, SleekPreviewScreen } from "@/lib/editor/EditorContext";

// ── Dimensions ────────────────────────────────────────────────────────────────
const PHONE_W = 292;
const PHONE_H = 628;
const GAP = 44;
const PADDING_X = 90;
const PADDING_Y = 72;
const DEFAULT_ZOOM = 0.74;

// ─────────────────────────────────────────────────────────────────────────────
// SLEEK CANVAS — multi-phone horizontal canvas (Figma / Sleek Design style)
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
        setZoom((z) => Math.min(1.3, Math.max(0.28, z - e.deltaY * 0.0012)));
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

  // Drag-to-pan
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
    const dx = e.pageX - dragOrigin.current.x;
    scrollRef.current.scrollLeft = dragOrigin.current.scrollLeft - dx;
  }, []);

  const stopDrag = useCallback(() => {
    isDragging.current = false;
    if (scrollRef.current) scrollRef.current.style.cursor = "";
  }, []);

  const scaledW = PHONE_W * zoom;
  const scaledH = PHONE_H * zoom;
  const count = sleekApp?.screens.length ?? 3;
  const canvasW = PADDING_X * 2 + scaledW * count + GAP * (count - 1);

  const fitAll = () => {
    if (!scrollRef.current || !sleekApp) return;
    const containerW = scrollRef.current.clientWidth;
    const containerH = scrollRef.current.clientHeight;
    const zoomW = (containerW - PADDING_X * 2) / (PHONE_W * count + GAP * (count - 1));
    const zoomH = (containerH - PADDING_Y * 2) / PHONE_H;
    setZoom(Math.min(1, zoomW, zoomH));
  };

  return (
    <div style={{ flex: 1, position: "relative", overflow: "hidden", background: "#08080E" }}>

      {/* ── Canvas grid background ── */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px)`,
        backgroundSize: "32px 32px",
        pointerEvents: "none",
      }} />

      {/* ── Subtle vignette ── */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 60%, rgba(0,0,0,0.45) 100%)",
        pointerEvents: "none",
        zIndex: 1,
      }} />

      {/* ── Scrollable canvas ── */}
      <div
        ref={scrollRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
        style={{
          position: "absolute",
          inset: 0,
          overflowX: "auto",
          overflowY: "hidden",
          cursor: "grab",
          zIndex: 2,
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
        } as React.CSSProperties}
      >
        <style>{`
          @keyframes phoneSlideUp {
            from { opacity: 0; transform: translateY(24px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes shimmer {
            0%   { background-position: -400px 0; }
            100% { background-position: 400px 0; }
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
              <PhoneCard
                key={screen.id}
                screen={screen}
                index={i}
                isActive={i === sleekApp.activeIndex}
                zoom={zoom}
                onClick={() => setSleekActiveIndex(i)}
              />
            ))
          ) : (
            // Skeleton state — 3 ghost phones
            [0, 1, 2].map((i) => <SkeletonPhone key={i} index={i} zoom={zoom} />)
          )}
        </div>
      </div>

      {/* ── Zoom controls — bottom left ── */}
      <div style={{
        position: "absolute",
        bottom: 20,
        left: 20,
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        gap: 2,
        background: "rgba(14,14,22,0.9)",
        border: "1px solid rgba(255,255,255,0.09)",
        borderRadius: 9,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        overflow: "hidden",
      }}>
        <ZoomBtn onClick={() => setZoom((z) => Math.max(0.28, z - 0.1))} title="Zoom out">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M2.5 6.5h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </ZoomBtn>

        <button
          onClick={() => setZoom(DEFAULT_ZOOM)}
          title="Reset zoom"
          style={{
            background: "none",
            border: "none",
            color: "rgba(255,255,255,0.42)",
            fontSize: 10.5,
            fontWeight: 600,
            fontFamily: "inherit",
            cursor: "pointer",
            padding: "5px 8px",
            minWidth: 44,
            textAlign: "center",
            letterSpacing: 0.2,
          }}
        >
          {Math.round(zoom * 100)}%
        </button>

        <ZoomBtn onClick={() => setZoom((z) => Math.min(1.3, z + 0.1))} title="Zoom in">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M6.5 2.5v8M2.5 6.5h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </ZoomBtn>

        <div style={{ width: 1, height: 22, background: "rgba(255,255,255,0.07)", flexShrink: 0 }} />

        <ZoomBtn onClick={fitAll} title="Fit all screens">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M1 4.5V2a1 1 0 0 1 1-1h2.5M9.5 1H11a1 1 0 0 1 1 1v2.5M12 8.5V11a1 1 0 0 1-1 1H8.5M3.5 12H2a1 1 0 0 1-1-1V8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        </ZoomBtn>
      </div>

      {/* ── Screen count badge — top center ── */}
      {sleekApp && (
        <div style={{
          position: "absolute",
          top: 16,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "rgba(14,14,22,0.85)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 8,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
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
              background: "none",
              border: "none",
              color: "rgba(255,255,255,0.2)",
              cursor: "pointer",
              fontSize: 13,
              padding: "0 0 0 4px",
              display: "flex",
              alignItems: "center",
              lineHeight: 1,
            }}
            title="Clear app"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PHONE CARD — one phone mockup with label + selection ring
// ─────────────────────────────────────────────────────────────────────────────
function PhoneCard({
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
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
        cursor: "pointer",
        flexShrink: 0,
        animation: `phoneSlideUp 0.45s cubic-bezier(0.22,1,0.36,1) ${index * 80}ms both`,
        transition: "transform 0.2s ease",
        transform: hovered ? "translateY(-5px)" : "translateY(0)",
      }}
    >
      {/* Scaled phone wrapper */}
      <div style={{
        width: PHONE_W * zoom,
        height: PHONE_H * zoom,
        position: "relative",
        flexShrink: 0,
      }}>
        {/* Natural-size phone, CSS-scaled */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: PHONE_W,
          height: PHONE_H,
          transform: `scale(${zoom})`,
          transformOrigin: "top left",
          willChange: "transform",
        }}>
          <PhoneMockup>
            <iframe
              srcDoc={screen.html}
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                display: "block",
                pointerEvents: "none",
              }}
              title={screen.name}
              scrolling="no"
            />
          </PhoneMockup>
        </div>

        {/* Selection ring */}
        <div style={{
          position: "absolute",
          inset: -3,
          borderRadius: PHONE_W * zoom * 0.19,
          border: isActive
            ? "2px solid rgba(124,92,252,0.85)"
            : hovered
              ? "1.5px solid rgba(255,255,255,0.12)"
              : "1.5px solid transparent",
          boxShadow: isActive
            ? "0 0 0 4px rgba(124,92,252,0.12), 0 0 30px rgba(124,92,252,0.22)"
            : "none",
          transition: "border-color 0.15s, box-shadow 0.15s",
          pointerEvents: "none",
        }} />

        {/* Bottom shadow */}
        <div style={{
          position: "absolute",
          bottom: -20,
          left: "10%",
          right: "10%",
          height: 30,
          background: "radial-gradient(ellipse, rgba(0,0,0,0.55) 0%, transparent 75%)",
          filter: "blur(8px)",
          pointerEvents: "none",
        }} />
      </div>

      {/* Label */}
      <div style={{ textAlign: "center", userSelect: "none" }}>
        <div style={{
          fontSize: 9,
          fontWeight: 700,
          color: "rgba(255,255,255,0.18)",
          letterSpacing: 1.2,
          marginBottom: 4,
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
          maxWidth: PHONE_W * zoom,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}>
          {screen.name}
        </div>
        {isActive && (
          <div style={{
            width: 20,
            height: 2,
            borderRadius: 1,
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
// SKELETON PHONE — shimmer placeholder when no app generated
// ─────────────────────────────────────────────────────────────────────────────
function SkeletonPhone({ index, zoom }: { index: number; zoom: number }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 14,
      flexShrink: 0,
      opacity: 1 - index * 0.22,
    }}>
      <div style={{
        width: PHONE_W * zoom,
        height: PHONE_H * zoom,
        borderRadius: PHONE_W * zoom * 0.18,
        background: "linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 100%)",
        backgroundSize: "800px 100%",
        animation: `shimmer 1.8s ease-in-out ${index * 200}ms infinite`,
        border: "1px solid rgba(255,255,255,0.06)",
      }} />
      <div style={{
        width: 80,
        height: 8,
        borderRadius: 4,
        background: "rgba(255,255,255,0.06)",
      }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ZOOM BUTTON helper
// ─────────────────────────────────────────────────────────────────────────────
function ZoomBtn({ onClick, title, children }: { onClick: () => void; title: string; children: React.ReactNode }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? "rgba(255,255,255,0.06)" : "none",
        border: "none",
        cursor: "pointer",
        color: "rgba(255,255,255,0.45)",
        padding: "6px 8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background 0.12s",
        borderRadius: 5,
      }}
    >
      {children}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SINGLE PHONE VIEW — original FitTrack / edit-mode preview (unchanged)
// ─────────────────────────────────────────────────────────────────────────────
function SinglePhoneView() {
  const { editMode, setSelection } = useEditor();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => {
      const el = containerRef.current;
      if (!el) return;
      const availH = el.clientHeight - 48;
      const availW = el.clientWidth - 80;
      setScale(Math.max(0.4, Math.min(1, availH / PHONE_H, availW / PHONE_W)));
    };
    update();
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const floorOffset = Math.round((PHONE_H / 2) * scale) + 18;

  return (
    <div
      ref={containerRef}
      style={{
        flex: 1,
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
      onClick={editMode ? () => setSelection(null) : undefined}
    >
      {/* Grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(rgba(79,142,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(79,142,255,0.06) 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
        pointerEvents: "none",
        maskImage: "radial-gradient(ellipse 70% 80% at 50% 50%, black 20%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 70% 80% at 50% 50%, black 20%, transparent 100%)",
      }} />

      <div style={{
        position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", height: "55%",
        background: "radial-gradient(ellipse 80% 80% at 50% 100%, rgba(0,60,200,0.3) 0%, rgba(0,40,140,0.12) 45%, transparent 75%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
        width: "80%", height: "35%",
        background: "radial-gradient(ellipse 60% 60% at 50% 0%, rgba(124,92,252,0.1) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(30,100,255,0.12) 0%, rgba(60,80,220,0.05) 40%, transparent 70%)",
        pointerEvents: "none",
        animation: "evermade-glow-pulse 5s ease-in-out infinite",
      }} />

      {/* Phone wrapper */}
      <div style={{ position: "relative", zIndex: 2, transform: `scale(${scale})`, transformOrigin: "center center" }}>
        {editMode && (
          <div style={{
            position: "absolute", top: -36, left: "50%", transform: "translateX(-50%)",
            display: "flex", alignItems: "center", gap: 5,
            padding: "3px 10px 3px 7px", borderRadius: 20,
            background: "rgba(79,142,255,0.06)", border: "1px solid rgba(79,142,255,0.2)",
            backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
            whiteSpace: "nowrap", pointerEvents: "none",
          }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#4f8eff", boxShadow: "0 0 8px rgba(79,142,255,1)" }} />
            <span style={{ fontSize: 10, color: "rgba(179,210,255,0.7)", fontWeight: 500, letterSpacing: 0.2 }}>Visual Edit Active</span>
          </div>
        )}

        <div style={{
          position: "absolute", inset: -60, borderRadius: 120,
          background: "radial-gradient(ellipse at 50% 60%, rgba(0,80,255,0.25) 0%, rgba(30,60,220,0.1) 50%, transparent 75%)",
          pointerEvents: "none", zIndex: -2,
          animation: "evermade-glow-pulse 4s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", inset: -3, borderRadius: 58,
          border: "1.5px solid rgba(79,142,255,0.75)",
          boxShadow: "0 0 20px rgba(79,142,255,0.7), 0 0 50px rgba(79,142,255,0.4), 0 0 100px rgba(30,80,255,0.22), inset 0 0 30px rgba(79,142,255,0.1)",
          animation: "evermade-glow-pulse 4s ease-in-out infinite",
          zIndex: 0, pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", inset: -36, borderRadius: 90,
          background: "radial-gradient(ellipse at center, rgba(79,142,255,0.12) 0%, rgba(124,92,252,0.06) 50%, transparent 75%)",
          pointerEvents: "none", zIndex: -1,
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <PhoneMockup>
            <PreviewScreen />
          </PhoneMockup>
        </div>
      </div>

      {/* Floor glows */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: `translateX(-50%) translateY(${floorOffset}px)`,
        width: Math.round(480 * scale), height: 55, borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(0,90,255,0.7) 0%, rgba(0,60,200,0.38) 50%, transparent 75%)",
        filter: "blur(30px)", pointerEvents: "none", zIndex: 1,
        animation: "evermade-glow-pulse 4s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: `translateX(-50%) translateY(${floorOffset + 10}px)`,
        width: Math.round(720 * scale), height: 65, borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(0,60,180,0.25) 0%, transparent 70%)",
        filter: "blur(45px)", pointerEvents: "none", zIndex: 1,
      }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT EXPORT — switches between canvas and single-phone view
// ─────────────────────────────────────────────────────────────────────────────
export default function BuilderPreview() {
  const { sleekApp } = useEditor();
  return sleekApp ? <SleekCanvas /> : <SinglePhoneView />;
}
