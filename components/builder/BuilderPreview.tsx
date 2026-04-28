"use client";

import { useRef, useState, useEffect } from "react";
import { useEditor } from "@/lib/editor/EditorContext";
import PhoneMockup from "./PhoneMockup";
import PreviewScreen from "./PreviewScreen";

const PHONE_H = 628;
const PHONE_W = 292;

export default function BuilderPreview() {
  const { editMode, setSelection } = useEditor();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => {
      const el = containerRef.current;
      if (!el) return;
      const availH = el.clientHeight - 48;
      const availW = el.clientWidth - 80;
      const s = Math.min(1, availH / PHONE_H, availW / PHONE_W);
      setScale(Math.max(0.4, s));
    };
    update();
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Floor glow sits just below the (scaled) phone bottom
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
        position: "absolute",
        inset: 0,
        backgroundImage: `linear-gradient(rgba(79,142,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(79,142,255,0.06) 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
        pointerEvents: "none",
        maskImage: "radial-gradient(ellipse 70% 80% at 50% 50%, black 20%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 70% 80% at 50% 50%, black 20%, transparent 100%)",
      }} />

      {/* Deep blue atmospheric bottom layer */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        height: "55%",
        background: "radial-gradient(ellipse 80% 80% at 50% 100%, rgba(0,60,200,0.3) 0%, rgba(0,40,140,0.12) 45%, transparent 75%)",
        pointerEvents: "none",
      }} />

      {/* Top glow */}
      <div style={{
        position: "absolute",
        top: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "80%",
        height: "35%",
        background: "radial-gradient(ellipse 60% 60% at 50% 0%, rgba(124,92,252,0.1) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Center ambient glow */}
      <div style={{
        position: "absolute",
        width: 600,
        height: 600,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(30,100,255,0.12) 0%, rgba(60,80,220,0.05) 40%, transparent 70%)",
        pointerEvents: "none",
        animation: "evermade-glow-pulse 5s ease-in-out infinite",
      }} />

      {/* Phone wrapper — scaled to fit */}
      <div style={{ position: "relative", zIndex: 2, transform: `scale(${scale})`, transformOrigin: "center center" }}>
        {/* Edit mode badge */}
        {editMode && (
          <div style={{
            position: "absolute",
            top: -36,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "3px 10px 3px 7px",
            borderRadius: 20,
            background: "rgba(79,142,255,0.06)",
            border: "1px solid rgba(79,142,255,0.2)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}>
            <div style={{
              width: 5, height: 5, borderRadius: "50%",
              background: "#4f8eff",
              boxShadow: "0 0 8px rgba(79,142,255,1)",
            }} />
            <span style={{ fontSize: 10, color: "rgba(179,210,255,0.7)", fontWeight: 500, letterSpacing: 0.2 }}>
              Visual Edit Active
            </span>
          </div>
        )}

        {/* Outer glow spread */}
        <div style={{
          position: "absolute",
          inset: -60,
          borderRadius: 120,
          background: "radial-gradient(ellipse at 50% 60%, rgba(0,80,255,0.25) 0%, rgba(30,60,220,0.1) 50%, transparent 75%)",
          pointerEvents: "none",
          zIndex: -2,
          animation: "evermade-glow-pulse 4s ease-in-out infinite",
        }} />

        {/* Electric border ring */}
        <div style={{
          position: "absolute",
          inset: -3,
          borderRadius: 58,
          border: "1.5px solid rgba(79,142,255,0.75)",
          boxShadow: [
            "0 0 20px rgba(79,142,255,0.7)",
            "0 0 50px rgba(79,142,255,0.4)",
            "0 0 100px rgba(30,80,255,0.22)",
            "inset 0 0 30px rgba(79,142,255,0.1)",
          ].join(", "),
          animation: "evermade-glow-pulse 4s ease-in-out infinite",
          zIndex: 0,
          pointerEvents: "none",
        }} />

        {/* Halo */}
        <div style={{
          position: "absolute",
          inset: -36,
          borderRadius: 90,
          background: "radial-gradient(ellipse at center, rgba(79,142,255,0.12) 0%, rgba(124,92,252,0.06) 50%, transparent 75%)",
          pointerEvents: "none",
          zIndex: -1,
        }} />

        {/* Phone */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <PhoneMockup>
            <PreviewScreen />
          </PhoneMockup>
        </div>
      </div>

      {/* Floor glow — positioned just below the scaled phone */}
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: `translateX(-50%) translateY(${floorOffset}px)`,
        width: Math.round(480 * scale),
        height: 55,
        borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(0,90,255,0.7) 0%, rgba(0,60,200,0.38) 50%, transparent 75%)",
        filter: "blur(30px)",
        pointerEvents: "none",
        zIndex: 1,
        animation: "evermade-glow-pulse 4s ease-in-out infinite",
      }} />

      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: `translateX(-50%) translateY(${floorOffset + 10}px)`,
        width: Math.round(720 * scale),
        height: 65,
        borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(0,60,180,0.25) 0%, transparent 70%)",
        filter: "blur(45px)",
        pointerEvents: "none",
        zIndex: 1,
      }} />
    </div>
  );
}
