"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useEditor } from "@/lib/editor/EditorContext";
import type { SleekPreviewScreen } from "@/lib/editor/EditorContext";

// ── Dimensions ────────────────────────────────────────────────────────────────
const CARD_W = 390;
const CARD_H = 844;
const CARD_RADIUS = 32;
const GAP = 44;
const PADDING_X = 80;
const PADDING_Y = 56;
const DEFAULT_ZOOM = 0.74;

// ── Visual-edit CSS injected into iframes ─────────────────────────────────────
const VE_STYLE_ID = "em-ve-style";
const VE_CSS = `
  *{cursor:crosshair!important;user-select:none!important}
  .em-h{outline:2px solid rgba(124,92,252,.85)!important;outline-offset:2px!important;border-radius:3px!important}
  .em-s{outline:3px solid #7c5cfc!important;outline-offset:2px!important;border-radius:3px!important;background-color:rgba(124,92,252,.06)!important}
`;

// ─────────────────────────────────────────────────────────────────────────────
// SLEEK CANVAS
// ─────────────────────────────────────────────────────────────────────────────
function SleekCanvas({ onSend }: { onSend?: (text: string) => void }) {
  const { sleekApp, setSleekActiveIndex, setSleekApp, setVeSelection } = useEditor();
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [visualEdit, setVisualEdit] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragOrigin = useRef({ x: 0, scrollLeft: 0 });

  // Exit visual edit when app changes
  useEffect(() => { setVisualEdit(false); setVeSelection(null); }, [sleekApp?.id]); // eslint-disable-line react-hooks/exhaustive-deps

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

  // Arrow keys → navigate screens; Escape → exit visual edit
  useEffect(() => {
    if (!sleekApp) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setVisualEdit(false);
        setVeSelection(null);
        return;
      }
      if (visualEdit) return;
      if (e.key === "ArrowLeft") setSleekActiveIndex(Math.max(0, sleekApp.activeIndex - 1));
      if (e.key === "ArrowRight") setSleekActiveIndex(Math.min(sleekApp.screens.length - 1, sleekApp.activeIndex + 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sleekApp, setSleekActiveIndex, visualEdit, setVeSelection]);

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

  const toggleVE = () => {
    const next = !visualEdit;
    setVisualEdit(next);
    if (!next) setVeSelection(null);
  };

  return (
    <div style={{ flex: 1, position: "relative", overflow: "hidden", background: "#08080E" }}>
      {/* Grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)`,
        backgroundSize: "32px 32px", pointerEvents: "none",
      }} />
      {/* Vignette */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 55%, rgba(0,0,0,.5) 100%)",
        pointerEvents: "none", zIndex: 1,
      }} />

      {/* Canvas */}
      <div
        ref={scrollRef}
        onMouseDown={onMouseDown} onMouseMove={onMouseMove}
        onMouseUp={stopDrag} onMouseLeave={stopDrag}
        style={{
          position: "absolute", inset: 0,
          overflowX: "auto", overflowY: "hidden",
          cursor: "grab", zIndex: 2, scrollbarWidth: "none",
        } as React.CSSProperties}
      >
        <style>{`
          @keyframes phoneSlideUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
          @keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}
        `}</style>
        <div style={{
          display: "flex", alignItems: "center", gap: GAP,
          padding: `${PADDING_Y}px ${PADDING_X}px`,
          minWidth: Math.max(canvasW, scrollRef.current?.clientWidth ?? 0),
          minHeight: "100%", boxSizing: "border-box",
        }}>
          {sleekApp ? (
            sleekApp.screens.map((screen, i) => (
              <ScreenCard
                key={screen.id}
                screen={screen}
                index={i}
                isActive={i === sleekApp.activeIndex}
                zoom={zoom}
                visualEdit={visualEdit}
                onSend={onSend}
                onClick={() => setSleekActiveIndex(i)}
              />
            ))
          ) : (
            [0, 1, 2].map((i) => <SkeletonCard key={i} index={i} zoom={zoom} />)
          )}
        </div>
      </div>

      {/* ── Zoom + visual edit controls — bottom left ── */}
      <div style={{
        position: "absolute", bottom: 20, left: 20, zIndex: 10,
        display: "flex", alignItems: "center", gap: 2,
        background: "rgba(14,14,22,0.92)",
        border: "1px solid rgba(255,255,255,0.09)",
        borderRadius: 9, backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)", overflow: "hidden",
      }}>
        <ZoomBtn onClick={() => setZoom((z) => Math.max(0.3, z - 0.1))} title="Zoom out">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M2.5 6.5h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </ZoomBtn>
        <button
          onClick={() => setZoom(DEFAULT_ZOOM)} title="Reset zoom"
          style={{
            background: "none", border: "none",
            color: "rgba(255,255,255,0.42)", fontSize: 10.5,
            fontWeight: 600, fontFamily: "inherit", cursor: "pointer",
            padding: "5px 8px", minWidth: 44, textAlign: "center", letterSpacing: 0.2,
          }}
        >{Math.round(zoom * 100)}%</button>
        <ZoomBtn onClick={() => setZoom((z) => Math.min(1.4, z + 0.1))} title="Zoom in">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M6.5 2.5v8M2.5 6.5h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </ZoomBtn>
        <ZoomBtn onClick={fitAll} title="Fit all screens">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M1 4.5V2a1 1 0 0 1 1-1h2.5M9.5 1H11a1 1 0 0 1 1 1v2.5M12 8.5V11a1 1 0 0 1-1 1H8.5M3.5 12H2a1 1 0 0 1-1-1V8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        </ZoomBtn>

        {/* Divider */}
        <div style={{ width: 1, height: 22, background: "rgba(255,255,255,0.07)", flexShrink: 0 }} />

        {/* Visual Edit toggle */}
        {sleekApp && (
          <button
            onClick={toggleVE}
            title={visualEdit ? "Exit Visual Edit (Esc)" : "Visual Edit — click any element to edit with AI"}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: "5px 11px 5px 9px",
              background: visualEdit ? "rgba(124,92,252,0.18)" : "none",
              border: "none",
              color: visualEdit ? "rgba(180,160,255,0.95)" : "rgba(255,255,255,0.45)",
              fontSize: 11.5, fontWeight: 500, cursor: "pointer",
              fontFamily: "inherit", letterSpacing: -0.1,
              transition: "all 0.15s",
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
            Visual edit
            {visualEdit && (
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#7c5cfc", boxShadow: "0 0 6px rgba(124,92,252,1)", flexShrink: 0 }} />
            )}
          </button>
        )}
      </div>

    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN CARD — with visual editor overlay + "Edit with AI" floating bar
// ─────────────────────────────────────────────────────────────────────────────
function ScreenCard({
  screen,
  index,
  isActive,
  zoom,
  visualEdit,
  onSend,
  onClick,
}: {
  screen: SleekPreviewScreen;
  index: number;
  isActive: boolean;
  zoom: number;
  visualEdit: boolean;
  onSend?: (text: string) => void;
  onClick: () => void;
}) {
  const { setVeSelection } = useEditor();
  const [hovered, setHovered] = useState(false);
  // Position is frozen at click time via ref — text state is separate so typing never moves the bar
  const vePosRef = useRef<{ x: number; y: number } | null>(null);
  const [veBarOpen, setVeBarOpen] = useState(false);
  const [veBarText, setVeBarText] = useState("");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const lastHoverRef = useRef<Element | null>(null);

  // Inject/remove VE CSS when mode changes or iframe loads
  const injectVeStyle = useCallback(() => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc?.head) return;
    if (doc.getElementById(VE_STYLE_ID)) return;
    const s = doc.createElement("style");
    s.id = VE_STYLE_ID;
    s.textContent = VE_CSS;
    doc.head.appendChild(s);
  }, []);

  const removeVeStyle = useCallback(() => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;
    doc.getElementById(VE_STYLE_ID)?.remove();
    doc.querySelectorAll(".em-h,.em-s").forEach((el) => el.classList.remove("em-h", "em-s"));
    lastHoverRef.current = null;
  }, []);

  useEffect(() => {
    if (visualEdit) {
      injectVeStyle();
      iframeRef.current?.addEventListener("load", injectVeStyle);
      return () => {
        iframeRef.current?.removeEventListener("load", injectVeStyle);
        removeVeStyle();
        setVeBarOpen(false);
        vePosRef.current = null;
      };
    } else {
      removeVeStyle();
      setVeBarOpen(false);
      vePosRef.current = null;
    }
  }, [visualEdit, injectVeStyle, removeVeStyle]);

  // Map overlay coordinates → iframe element
  const getElAt = useCallback((clientX: number, clientY: number, overlayRect: DOMRect) => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return null;
    const x = (clientX - overlayRect.left) / zoom;
    const y = (clientY - overlayRect.top) / zoom;
    return doc.elementFromPoint(x, y);
  }, [zoom]);

  const handleOverlayMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = getElAt(e.clientX, e.clientY, e.currentTarget.getBoundingClientRect());
    if (!el || el === lastHoverRef.current) return;
    lastHoverRef.current?.classList.remove("em-h");
    lastHoverRef.current = el;
    el.classList.add("em-h");
  }, [getElAt]);

  const handleOverlayLeave = useCallback(() => {
    lastHoverRef.current?.classList.remove("em-h");
    lastHoverRef.current = null;
  }, []);

  const handleOverlayClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;

    const el = getElAt(e.clientX, e.clientY, e.currentTarget.getBoundingClientRect());
    if (!el) return;

    // Clear previous selection
    doc.querySelectorAll(".em-s").forEach((x) => x.classList.remove("em-s"));
    el.classList.remove("em-h");
    el.classList.add("em-s");
    lastHoverRef.current = null;

    const iframeWin = iframeRef.current?.contentWindow;
    const computed = iframeWin ? iframeWin.getComputedStyle(el as HTMLElement) : null;

    const elementText = ((el as HTMLElement).innerText ?? el.textContent ?? "").slice(0, 120).trim();
    const elementTag = el.tagName.toLowerCase();

    // Set VE context in global state (picked up by left sidebar chips)
    setVeSelection({
      screenIndex: index,
      screenName: screen.name,
      elementTag,
      elementText,
    });

    // Freeze position once — never recalculated on re-renders
    vePosRef.current = { x: e.clientX, y: e.clientY };
    setVeBarText("");
    setVeBarOpen(true);

    void computed;
  }, [getElAt, index, screen.name, setVeSelection]);

  const submitVeBar = useCallback((text: string) => {
    if (!text.trim()) return;
    onSend?.(text);
    setVeBarOpen(false);
    vePosRef.current = null;
  }, [onSend]);

  const closeVeBar = useCallback(() => {
    setVeBarOpen(false);
    vePosRef.current = null;
    const doc = iframeRef.current?.contentDocument;
    doc?.querySelectorAll(".em-s").forEach((el) => el.classList.remove("em-s"));
    setVeSelection(null);
  }, [setVeSelection]);

  return (
    <div
      data-phone="true"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        gap: 14, flexShrink: 0,
        animation: `phoneSlideUp 0.45s cubic-bezier(0.22,1,0.36,1) ${index * 70}ms both`,
      }}
    >
      <div
        onClick={visualEdit ? undefined : onClick}
        style={{
          width: CARD_W * zoom, height: CARD_H * zoom,
          borderRadius: CARD_RADIUS * zoom,
          overflow: "hidden", position: "relative", flexShrink: 0,
          cursor: visualEdit ? "crosshair" : "pointer",
          transition: "transform 0.2s ease, box-shadow 0.15s ease",
          transform: (hovered && !visualEdit) ? "translateY(-6px)" : "translateY(0)",
          boxShadow: isActive
            ? `0 0 0 ${2 * zoom}px rgba(124,92,252,.9), 0 0 0 ${6 * zoom}px rgba(124,92,252,.15), 0 ${24 * zoom}px ${60 * zoom}px rgba(0,0,0,.7)`
            : hovered
              ? `0 0 0 ${1.5 * zoom}px rgba(255,255,255,.15), 0 ${20 * zoom}px ${50 * zoom}px rgba(0,0,0,.55)`
              : `0 ${16 * zoom}px ${40 * zoom}px rgba(0,0,0,.45)`,
        }}
      >
        {/* Natural-size iframe, CSS-scaled */}
        <div style={{
          width: CARD_W, height: CARD_H,
          transform: `scale(${zoom})`, transformOrigin: "top left",
          willChange: "transform",
        }}>
          <iframe
            ref={iframeRef}
            srcDoc={screen.html}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
            style={{ width: CARD_W, height: CARD_H, border: "none", display: "block" }}
            title={screen.name}
          />
        </div>

        {/* Visual edit overlay — intercepts mouse, maps → iframe coords */}
        {visualEdit && (
          <div
            style={{ position: "absolute", inset: 0, cursor: "crosshair", zIndex: 10 }}
            onMouseMove={handleOverlayMove}
            onMouseLeave={handleOverlayLeave}
            onClick={handleOverlayClick}
          />
        )}
      </div>

      {/* Label */}
      <div style={{ textAlign: "center", userSelect: "none" }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,.18)", letterSpacing: 1.2, marginBottom: 4, fontFamily: "ui-monospace,'SF Mono',monospace" }}>
          {String(index + 1).padStart(2, "0")}
        </div>
        <div style={{
          fontSize: 11.5, fontWeight: isActive ? 600 : 400,
          color: isActive ? "rgba(255,255,255,.88)" : "rgba(255,255,255,.38)",
          letterSpacing: -0.1, transition: "color 0.15s",
          maxWidth: CARD_W * zoom, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>{screen.name}</div>
        {isActive && (
          <div style={{ width: 20, height: 2, borderRadius: 1, background: "#7c5cfc", margin: "5px auto 0", boxShadow: "0 0 6px rgba(124,92,252,.6)" }} />
        )}
      </div>

      {/* "Edit with AI" bar — portal to body so CSS transform ancestors don't affect fixed positioning */}
      {veBarOpen && vePosRef.current && typeof document !== "undefined" && createPortal(
        <EditWithAIBar
          x={vePosRef.current.x}
          y={vePosRef.current.y}
          text={veBarText}
          onSubmit={submitVeBar}
          onChange={setVeBarText}
          onClose={closeVeBar}
        />,
        document.body
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// "EDIT WITH AI" FLOATING BAR
// ─────────────────────────────────────────────────────────────────────────────
function EditWithAIBar({
  x: rawX,
  y: rawY,
  text,
  onSubmit,
  onChange,
  onClose,
}: {
  x: number;
  y: number;
  text: string;
  onSubmit: (text: string) => void;
  onChange: (text: string) => void;
  onClose: () => void;
}) {
  // Freeze position on first mount — never recalculate, prevents jitter on input
  const posRef = useRef({ x: rawX, y: rawY });
  const BAR_W = 310;
  const BAR_H = 40;
  const MARGIN = 10;
  const left = Math.min(
    Math.max(MARGIN, posRef.current.x - BAR_W / 2),
    window.innerWidth - BAR_W - MARGIN
  );
  const top = Math.max(
    MARGIN,
    posRef.current.y - BAR_H - 12 < MARGIN
      ? posRef.current.y + 16   // flip below if too close to top
      : posRef.current.y - BAR_H - 12
  );

  return (
    <div
      style={{
        position: "fixed",
        top,
        left,
        zIndex: 99999,
        width: BAR_W,
        height: BAR_H,
        display: "flex",
        alignItems: "center",
        background: "rgba(9,9,16,0.97)",
        border: "1px solid rgba(124,92,252,0.28)",
        borderRadius: BAR_H / 2,
        boxShadow: "0 8px 32px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.04)",
        backdropFilter: "blur(40px)",
        WebkitBackdropFilter: "blur(40px)",
        overflow: "hidden",
        animation: "veBarIn 0.16s cubic-bezier(0.34,1.56,0.64,1) both",
        pointerEvents: "auto",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <style>{`@keyframes veBarIn{from{opacity:0;transform:scale(0.88)}to{opacity:1;transform:scale(1)}}`}</style>

      {/* Sparkle */}
      <div style={{ padding: "0 8px 0 12px", flexShrink: 0, color: "rgba(150,120,255,0.75)", display: "flex", alignItems: "center" }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l2.09 6.26L20 10l-5.91 1.74L12 18l-2.09-6.26L4 10l5.91-1.74z"/>
        </svg>
      </div>

      {/* Input */}
      <input
        autoFocus
        value={text}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") { e.preventDefault(); onSubmit(text); }
          if (e.key === "Escape") { e.preventDefault(); onClose(); }
        }}
        placeholder="Edit with AI…"
        style={{
          flex: 1, minWidth: 0,
          background: "transparent", border: "none", outline: "none",
          color: "rgba(255,255,255,0.88)", fontSize: 12.5,
          fontFamily: "-apple-system,BlinkMacSystemFont,'Geist','SF Pro Text',sans-serif",
          letterSpacing: -0.1, padding: 0, caretColor: "#7c5cfc",
        }}
      />

      {/* Divider */}
      <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.07)", flexShrink: 0 }} />

      {/* Quick icons */}
      <VEIconBtn title="Edit style" onClick={() => onChange("Change the style and colors")}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
        </svg>
      </VEIconBtn>
      <VEIconBtn title="Edit text" onClick={() => onChange("Edit the text content")}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/>
        </svg>
      </VEIconBtn>
      <VEIconBtn title="Delete element" onClick={() => onSubmit("Remove this element completely")}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/>
        </svg>
      </VEIconBtn>

      {/* Send */}
      <button
        onClick={() => onSubmit(text)}
        disabled={!text.trim()}
        title="Send (Enter)"
        style={{
          width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
          border: "none", margin: "0 6px",
          background: text.trim() ? "linear-gradient(135deg,#7c5cfc,#4878ff)" : "rgba(255,255,255,0.06)",
          color: text.trim() ? "white" : "rgba(255,255,255,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: text.trim() ? "pointer" : "default",
          transition: "all 0.14s",
          boxShadow: text.trim() ? "0 2px 10px rgba(124,92,252,0.5)" : "none",
        }}
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 19V5M5 12l7-7 7 7"/>
        </svg>
      </button>
    </div>
  );
}

function VEIconBtn({ title, onClick, children }: { title: string; onClick: () => void; children: React.ReactNode }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      title={title}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 30, height: 30, border: "none", borderRadius: 0,
        background: hov ? "rgba(255,255,255,0.06)" : "none",
        color: hov ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.3)",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", flexShrink: 0, transition: "all 0.1s",
      }}
    >{children}</button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON CARD
// ─────────────────────────────────────────────────────────────────────────────
function SkeletonCard({ index, zoom }: { index: number; zoom: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, flexShrink: 0, opacity: 1 - index * 0.22 }}>
      <div style={{
        width: CARD_W * zoom, height: CARD_H * zoom, borderRadius: CARD_RADIUS * zoom,
        background: "linear-gradient(90deg,rgba(255,255,255,.04) 0%,rgba(255,255,255,.08) 50%,rgba(255,255,255,.04) 100%)",
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
    <button onClick={onClick} title={title}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? "rgba(255,255,255,0.06)" : "none", border: "none",
        cursor: "pointer", color: "rgba(255,255,255,0.45)",
        padding: "6px 8px", display: "flex", alignItems: "center", justifyContent: "center",
        transition: "background 0.12s", borderRadius: 5,
      }}
    >{children}</button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT EXPORT
// ─────────────────────────────────────────────────────────────────────────────
export default function BuilderPreview({ onSend }: { onSend?: (text: string) => void }) {
  return <SleekCanvas onSend={onSend} />;
}
