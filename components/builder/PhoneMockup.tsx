import type { ReactNode } from "react";

// iPhone 17 Pro Max proportions
const W = 292;
const H = 628;
const R_OUTER = 52;   // outer frame corner radius
const R_SCREEN = 46;  // screen corner radius
const BORDER = 2.5;   // shimmer border thickness
const BEZEL = 6;      // titanium bezel around screen

type Props = { children: ReactNode };

export default function PhoneMockup({ children }: Props) {
  return (
    <div style={{ position: "relative", width: W, height: H, flexShrink: 0 }}>

      {/* ── Layer 0 — rotating shimmer gradient (clipped) ── */}
      <div style={{
        position: "absolute",
        inset: 0,
        borderRadius: R_OUTER,
        overflow: "hidden",
        zIndex: 0,
      }}>
        {/* Solid #CCFF00 border fill */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "#CCFF00",
        }} />
        {/* Soft glow */}
        <div style={{
          position: "absolute",
          inset: -4,
          background: "#CCFF00",
          filter: "blur(10px)",
          opacity: 0.35,
        }} />
      </div>

      {/* ── Layer 1 — titanium frame (covers center, leaves BORDER gap = shimmer ring) ── */}
      <div style={{
        position: "absolute",
        inset: BORDER,
        borderRadius: R_OUTER - BORDER,
        zIndex: 1,
        background: `linear-gradient(
          168deg,
          #e2e2e6 0%,
          #d0d0d4 18%,
          #bebec2 40%,
          #c8c8cc 62%,
          #d4d4d8 80%,
          #e0e0e4 100%
        )`,
        boxShadow: `
          0 70px 160px rgba(0,0,0,0.90),
          0 28px 70px  rgba(0,0,0,0.60),
          inset 0  1.5px 0 rgba(255,255,255,0.65),
          inset 0 -1px  0 rgba(0,0,0,0.18),
          inset 1px 0   0 rgba(255,255,255,0.28),
          inset -1px 0  0 rgba(255,255,255,0.18)
        `,
      }}>
        {/* Specular highlight strip along top edge */}
        <div style={{
          position: "absolute",
          top: 0, left: "14%", right: "14%", height: 1,
          borderRadius: 1,
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.72), rgba(255,255,255,0.65), transparent)",
          zIndex: 4,
        }} />
        {/* Subtle frame gradient overlay */}
        <div style={{
          position: "absolute",
          inset: 0,
          borderRadius: R_OUTER - BORDER,
          background: "linear-gradient(155deg, rgba(255,255,255,0.12) 0%, transparent 32%, transparent 70%, rgba(0,0,0,0.05) 100%)",
          pointerEvents: "none",
          zIndex: 2,
        }} />
      </div>

      {/* ── Layer 2 — screen glass (inside the titanium bezel) ── */}
      <div style={{
        position: "absolute",
        inset: BORDER + BEZEL,
        borderRadius: R_SCREEN,
        overflow: "hidden",
        zIndex: 2,
        background: "#08080F",
        boxShadow: "inset 0 0 0 0.5px rgba(0,0,0,0.08)",
      }}>
        {children}
      </div>

      {/* ── Layer 3 — Dynamic Island ── */}
      <div style={{
        position: "absolute",
        top: BORDER + BEZEL + 14,
        left: "50%",
        transform: "translateX(-50%)",
        width: 118,
        height: 36,
        borderRadius: 24,
        background: "#000000",
        zIndex: 10,
        boxShadow: "0 2px 10px rgba(0,0,0,0.7), 0 0 0 0.5px rgba(255,255,255,0.04)",
      }}>
        {/* Camera dot */}
        <div style={{
          position: "absolute",
          right: 18, top: "50%", transform: "translateY(-50%)",
          width: 10, height: 10, borderRadius: "50%",
          background: "radial-gradient(circle at 35% 35%, #1a2840, #0a0a10)",
          boxShadow: "inset 0 0 4px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.06)",
        }}>
          <div style={{
            position: "absolute", top: "20%", left: "20%",
            width: 3, height: 3, borderRadius: "50%",
            background: "rgba(255,255,255,0.45)",
          }} />
        </div>
      </div>

      {/* ── Layer 4 — screen glass reflection ── */}
      <div style={{
        position: "absolute",
        inset: BORDER + BEZEL,
        borderRadius: R_SCREEN,
        background: "linear-gradient(148deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.025) 28%, transparent 50%)",
        pointerEvents: "none",
        zIndex: 8,
      }} />

      {/* ── Side buttons — titanium silver ── */}

      {/* Action button (top-left) */}
      <SideBtn side="left" top={88} h={28} r={BORDER} />
      {/* Volume up */}
      <SideBtn side="left" top={130} h={50} r={BORDER} />
      {/* Volume down */}
      <SideBtn side="left" top={192} h={50} r={BORDER} />
      {/* Power / side button */}
      <SideBtn side="right" top={144} h={74} r={BORDER} />
    </div>
  );
}

function SideBtn({ side, top, h, r }: { side: "left" | "right"; top: number; h: number; r: number }) {
  const isLeft = side === "left";
  return (
    <div style={{
      position: "absolute",
      [isLeft ? "left" : "right"]: r - 1,
      top,
      width: 3.5,
      height: h,
      borderRadius: isLeft ? "2px 0 0 2px" : "0 2px 2px 0",
      background: "linear-gradient(180deg, #d4d4d8 0%, #b8b8bc 50%, #c8c8cc 100%)",
      boxShadow: isLeft
        ? "-1px 0 4px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.5)"
        : " 1px 0 4px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.5)",
      zIndex: 5,
    }} />
  );
}
