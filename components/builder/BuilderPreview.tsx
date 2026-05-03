"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useEditor } from "@/lib/editor/EditorContext";
import type { SleekPreviewScreen, SleekPreviewApp } from "@/lib/editor/EditorContext";

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
function SleekCanvas() {
  const { sleekApp, setSleekActiveIndex, setSleekApp } = useEditor();
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [visualEdit, setVisualEdit] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragOrigin = useRef({ x: 0, scrollLeft: 0 });

  // Exit visual edit when app changes
  useEffect(() => { setVisualEdit(false); }, [sleekApp?.id]);

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
      if (e.key === "Escape") { setVisualEdit(false); return; }
      if (visualEdit) return;
      if (e.key === "ArrowLeft") setSleekActiveIndex(Math.max(0, sleekApp.activeIndex - 1));
      if (e.key === "ArrowRight") setSleekActiveIndex(Math.min(sleekApp.screens.length - 1, sleekApp.activeIndex + 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sleekApp, setSleekActiveIndex, visualEdit]);

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
                sleekApp={sleekApp}
                setSleekApp={setSleekApp}
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
            onClick={() => setVisualEdit((v) => !v)}
            title={visualEdit ? "Exit Visual Edit (Esc)" : "Visual Edit — click any element to edit"}
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

      {/* App badge */}
      {sleekApp && (
        <div style={{
          position: "absolute", top: 16, left: "50%", transform: "translateX(-50%)",
          zIndex: 10, display: "flex", alignItems: "center", gap: 8,
          background: "rgba(14,14,22,0.88)", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 8, backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
          padding: "5px 12px",
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#7c5cfc", boxShadow: "0 0 8px #7c5cfc" }} />
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", fontWeight: 500 }}>{sleekApp.appName}</span>
          <div style={{ width: 1, height: 12, background: "rgba(255,255,255,0.1)" }} />
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{sleekApp.screens.length} screens</span>
          <button
            onClick={() => setSleekApp(null)}
            style={{ background: "none", border: "none", color: "rgba(255,255,255,0.2)", cursor: "pointer", fontSize: 13, padding: "0 0 0 4px", display: "flex", alignItems: "center", lineHeight: 1 }}
            title="Clear app"
          >×</button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN CARD — with visual editor overlay
// ─────────────────────────────────────────────────────────────────────────────
interface EditTarget {
  el: Element;
  tag: string;
  text: string;
  color: string;
  bgColor: string;
  fontSize: string;
  clientX: number;
  clientY: number;
}

function ScreenCard({
  screen,
  index,
  isActive,
  zoom,
  visualEdit,
  sleekApp,
  setSleekApp,
  onClick,
}: {
  screen: SleekPreviewScreen;
  index: number;
  isActive: boolean;
  zoom: number;
  visualEdit: boolean;
  sleekApp: SleekPreviewApp;
  setSleekApp: (app: SleekPreviewApp | null) => void;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [editTarget, setEditTarget] = useState<EditTarget | null>(null);
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
      // Try immediately, also on iframe load
      injectVeStyle();
      iframeRef.current?.addEventListener("load", injectVeStyle);
      return () => {
        iframeRef.current?.removeEventListener("load", injectVeStyle);
        removeVeStyle();
        setEditTarget(null);
      };
    } else {
      removeVeStyle();
      setEditTarget(null);
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

    setEditTarget({
      el,
      tag: el.tagName.toLowerCase(),
      text: (el as HTMLElement).innerText ?? el.textContent ?? "",
      color: computed?.color ?? "#ffffff",
      bgColor: computed?.backgroundColor ?? "transparent",
      fontSize: computed?.fontSize ?? "16px",
      clientX: e.clientX,
      clientY: e.clientY,
    });
  }, [getElAt]);

  const applyEdit = useCallback((patch: Partial<EditTarget>) => {
    if (!editTarget) return;
    const el = editTarget.el as HTMLElement;

    if (patch.text !== undefined && patch.text !== editTarget.text) {
      // Only update leaf text nodes to avoid breaking child elements
      if (!el.children.length) el.textContent = patch.text;
      else el.childNodes.forEach((n) => { if (n.nodeType === Node.TEXT_NODE) n.textContent = patch.text!; });
    }
    if (patch.color !== undefined) el.style.color = patch.color;
    if (patch.bgColor !== undefined) el.style.backgroundColor = patch.bgColor;
    if (patch.fontSize !== undefined) el.style.fontSize = patch.fontSize;

    setEditTarget((prev) => prev ? { ...prev, ...patch } : null);
  }, [editTarget]);

  const saveAndClose = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe?.contentDocument) { setEditTarget(null); return; }

    // Strip VE classes + style before serializing
    const doc = iframe.contentDocument;
    doc.querySelectorAll(".em-h,.em-s").forEach((el) => el.classList.remove("em-h", "em-s"));
    doc.getElementById(VE_STYLE_ID)?.remove();

    const newHtml = `<!DOCTYPE html>${doc.documentElement.outerHTML}`;

    setSleekApp({
      ...sleekApp,
      screens: sleekApp.screens.map((s, i) =>
        i === index ? { ...s, html: newHtml } : s
      ),
    });

    setEditTarget(null);
    // Re-inject style for continued editing
    setTimeout(injectVeStyle, 50);
  }, [editTarget, iframeRef, sleekApp, setSleekApp, index, injectVeStyle]); // eslint-disable-line react-hooks/exhaustive-deps

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

      {/* Edit panel — fixed position near click */}
      {editTarget && (
        <EditPanel
          target={editTarget}
          onApply={applyEdit}
          onSave={saveAndClose}
          onClose={() => {
            const doc = iframeRef.current?.contentDocument;
            doc?.querySelectorAll(".em-s").forEach((el) => el.classList.remove("em-s"));
            setEditTarget(null);
          }}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EDIT PANEL — floating card to edit the selected element
// ─────────────────────────────────────────────────────────────────────────────
function EditPanel({
  target,
  onApply,
  onSave,
  onClose,
}: {
  target: EditTarget;
  onApply: (patch: Partial<EditTarget>) => void;
  onSave: () => void;
  onClose: () => void;
}) {
  const [text, setText] = useState(target.text);
  const [color, setColor] = useState(target.color);
  const [bgColor, setBgColor] = useState(target.bgColor);
  const [fontSize, setFontSize] = useState(parseInt(target.fontSize, 10) || 16);

  // Panel position: clamp near click, always fully on-screen
  const panelW = 240;
  const panelH = 260;
  const x = Math.min(target.clientX + 14, window.innerWidth - panelW - 10);
  const y = Math.max(10, Math.min(target.clientY - 40, window.innerHeight - panelH - 10));

  const isTextNode = !target.el.children.length || !!target.text.trim();

  return (
    <div
      style={{
        position: "fixed", top: y, left: x, zIndex: 9999,
        width: panelW,
        background: "rgba(12,12,20,0.97)",
        border: "1px solid rgba(124,92,252,0.35)",
        borderRadius: 14,
        padding: "12px 14px 14px",
        boxShadow: "0 16px 48px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        fontFamily: "-apple-system,BlinkMacSystemFont,'Geist','SF Pro Text',sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#7c5cfc", boxShadow: "0 0 6px rgba(124,92,252,1)" }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(180,160,255,0.9)", letterSpacing: 0.1 }}>
            &lt;{target.tag}&gt;
          </span>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: 15, lineHeight: 1, padding: 2 }}>×</button>
      </div>

      {/* Text */}
      {isTextNode && (
        <Field label="Text">
          <textarea
            value={text}
            rows={2}
            onChange={(e) => {
              setText(e.target.value);
              onApply({ text: e.target.value });
            }}
            style={{
              width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8, color: "rgba(255,255,255,0.85)", fontSize: 12, padding: "6px 8px",
              resize: "none", outline: "none", fontFamily: "inherit",
            }}
          />
        </Field>
      )}

      {/* Colors */}
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <Field label="Text color" flex>
          <ColorRow value={color} onChange={(v) => { setColor(v); onApply({ color: v }); }} />
        </Field>
        <Field label="Background" flex>
          <ColorRow value={bgColor} onChange={(v) => { setBgColor(v); onApply({ bgColor: v }); }} />
        </Field>
      </div>

      {/* Font size */}
      {isTextNode && (
        <Field label="Font size" style={{ marginTop: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button onClick={() => { const v = Math.max(8, fontSize - 1); setFontSize(v); onApply({ fontSize: `${v}px` }); }}
              style={stepBtn}>−</button>
            <span style={{ flex: 1, textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>{fontSize}px</span>
            <button onClick={() => { const v = fontSize + 1; setFontSize(v); onApply({ fontSize: `${v}px` }); }}
              style={stepBtn}>+</button>
          </div>
        </Field>
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
        <button onClick={onClose} style={{
          flex: 1, padding: "7px 0", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)",
          background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", fontSize: 12, cursor: "pointer", fontFamily: "inherit",
        }}>Discard</button>
        <button onClick={onSave} style={{
          flex: 1, padding: "7px 0", borderRadius: 8, border: "none",
          background: "linear-gradient(135deg,#7c5cfc,#4878ff)",
          color: "white", fontSize: 12, fontWeight: 600, cursor: "pointer",
          fontFamily: "inherit", boxShadow: "0 4px 14px rgba(124,92,252,0.4)",
        }}>Save ✓</button>
      </div>
    </div>
  );
}

// Tiny helpers
const stepBtn: React.CSSProperties = {
  width: 26, height: 26, borderRadius: 6, border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)",
  cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center",
};

function Field({ label, children, flex, style }: { label: string; children: React.ReactNode; flex?: boolean; style?: React.CSSProperties }) {
  return (
    <div style={{ flex: flex ? 1 : undefined, ...style }}>
      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginBottom: 4, letterSpacing: 0.2 }}>{label}</div>
      {children}
    </div>
  );
}

function ColorRow({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const safeHex = cssColorToHex(value);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <input type="color" value={safeHex} onChange={(e) => onChange(e.target.value)}
        style={{ width: 28, height: 28, border: "none", borderRadius: 6, cursor: "pointer", padding: 0, background: "none" }}
      />
      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontFamily: "monospace", letterSpacing: 0 }}>{safeHex}</span>
    </div>
  );
}

function cssColorToHex(color: string): string {
  if (!color || color === "transparent" || color === "rgba(0, 0, 0, 0)") return "#000000";
  if (color.startsWith("#")) return color.slice(0, 7);
  const m = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!m) return "#ffffff";
  return "#" + [m[1], m[2], m[3]].map((n) => parseInt(n).toString(16).padStart(2, "0")).join("");
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
export default function BuilderPreview() {
  return <SleekCanvas />;
}
