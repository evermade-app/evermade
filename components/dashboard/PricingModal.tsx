"use client";

import { useState } from "react";

// ── Icons ─────────────────────────────────────────────────────────────────────

const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <circle cx="6.5" cy="6.5" r="6" fill="rgba(124,92,252,0.18)" />
    <path d="M4 6.5l2 2 3-3.5" stroke="rgba(160,140,255,0.9)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DimCheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <circle cx="6.5" cy="6.5" r="6" fill="rgba(255,255,255,0.04)" />
    <path d="M4.5 6.5l1.5 1.5 2.5-3" stroke="rgba(255,255,255,0.2)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CrossIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <circle cx="6.5" cy="6.5" r="6" fill="rgba(255,255,255,0.04)" />
    <path d="M4.5 4.5l4 4M8.5 4.5l-4 4" stroke="rgba(255,255,255,0.15)" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

const GoldCheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <circle cx="6.5" cy="6.5" r="6" fill="rgba(251,191,36,0.15)" />
    <path d="M4 6.5l2 2 3-3.5" stroke="rgba(251,191,36,0.85)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

// ── Feature row ───────────────────────────────────────────────────────────────

function Feature({ text, dim, cross, gold }: { text: string; dim?: boolean; cross?: boolean; gold?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "3.5px 0" }}>
      <span style={{ flexShrink: 0, marginTop: 1 }}>
        {cross ? <CrossIcon /> : dim ? <DimCheckIcon /> : gold ? <GoldCheckIcon /> : <CheckIcon />}
      </span>
      <span style={{
        fontSize: 13,
        lineHeight: 1.45,
        color: cross || dim ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.72)",
        letterSpacing: -0.1,
      }}>
        {text}
      </span>
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "10px 0" }} />;
}

// ── Plan card ─────────────────────────────────────────────────────────────────

function PlanCard({
  badge,
  name,
  price,
  tagline,
  features,
  cta,
  variant,
}: {
  badge?: string;
  name: string;
  price: string;
  tagline: string;
  features: React.ReactNode;
  cta: string;
  variant: "free" | "pro" | "max";
}) {
  const [hovered, setHovered] = useState(false);

  const border =
    variant === "pro"
      ? `1px solid rgba(124,92,252,${hovered ? 0.7 : 0.45})`
      : variant === "max"
      ? `1px solid rgba(251,191,36,${hovered ? 0.6 : 0.35})`
      : `1px solid rgba(255,255,255,${hovered ? 0.12 : 0.07})`;

  const glow =
    variant === "pro"
      ? `0 0 ${hovered ? 48 : 28}px rgba(124,92,252,${hovered ? 0.28 : 0.15}), 0 8px 32px rgba(0,0,0,0.5)`
      : variant === "max"
      ? `0 0 ${hovered ? 48 : 28}px rgba(251,191,36,${hovered ? 0.22 : 0.1}), 0 8px 32px rgba(0,0,0,0.5)`
      : `0 8px 32px rgba(0,0,0,0.4)`;

  const ctaBg =
    variant === "pro"
      ? "linear-gradient(135deg, #7c5cfc 0%, #4878ff 100%)"
      : variant === "max"
      ? "linear-gradient(135deg, #d97706 0%, #f59e0b 50%, #fbbf24 100%)"
      : "rgba(255,255,255,0.08)";

  const ctaColor = variant === "free" ? "rgba(255,255,255,0.6)" : "white";

  const ctaShadow =
    variant === "pro"
      ? "0 4px 20px rgba(124,92,252,0.4)"
      : variant === "max"
      ? "0 4px 20px rgba(251,191,36,0.3)"
      : "none";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1,
        minWidth: 0,
        position: "relative",
        borderRadius: 20,
        border,
        background:
          variant === "pro"
            ? "rgba(18,12,40,0.97)"
            : variant === "max"
            ? "rgba(18,14,8,0.97)"
            : "rgba(12,12,18,0.97)",
        boxShadow: glow,
        padding: "28px 24px 24px",
        display: "flex",
        flexDirection: "column",
        transition: "box-shadow 0.25s ease, border-color 0.25s ease, transform 0.22s cubic-bezier(0.34,1.56,0.64,1)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        cursor: "default",
      }}
    >
      {/* Badge */}
      {badge && (
        <div style={{
          position: "absolute",
          top: -12,
          left: "50%",
          transform: "translateX(-50%)",
          padding: "4px 12px",
          borderRadius: 99,
          background: variant === "pro"
            ? "linear-gradient(135deg, #7c5cfc, #4878ff)"
            : "linear-gradient(135deg, #d97706, #fbbf24)",
          fontSize: 10,
          fontWeight: 800,
          color: "white",
          letterSpacing: 0.8,
          textTransform: "uppercase",
          whiteSpace: "nowrap",
          boxShadow: variant === "pro"
            ? "0 4px 14px rgba(124,92,252,0.5)"
            : "0 4px 14px rgba(251,191,36,0.4)",
        }}>
          {badge}
        </div>
      )}

      {/* Plan name */}
      <div style={{
        fontSize: variant === "free" ? 13 : 11,
        fontWeight: 700,
        letterSpacing: variant === "free" ? -0.1 : 1.2,
        textTransform: variant === "free" ? "none" : "uppercase",
        color: variant === "pro"
          ? "rgba(160,140,255,0.9)"
          : variant === "max"
          ? "rgba(251,191,36,0.85)"
          : "rgba(255,255,255,0.35)",
        marginBottom: 10,
      }}>
        {name}
      </div>

      {/* Price */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 4, marginBottom: 6 }}>
        {variant === "free" ? (
          <span style={{ fontSize: 38, fontWeight: 800, color: "rgba(255,255,255,0.88)", letterSpacing: -2, lineHeight: 1 }}>
            Free
          </span>
        ) : (
          <>
            <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>$</span>
            <span style={{ fontSize: 44, fontWeight: 800, letterSpacing: -3, lineHeight: 1, color: "rgba(255,255,255,0.92)" }}>
              {price}
            </span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginBottom: 8, letterSpacing: -0.2 }}>/month</span>
          </>
        )}
      </div>

      {/* Tagline */}
      <div style={{
        fontSize: 12.5,
        color: "rgba(255,255,255,0.38)",
        marginBottom: 20,
        letterSpacing: -0.1,
        lineHeight: 1.4,
      }}>
        {tagline}
      </div>

      {/* CTA */}
      <button
        style={{
          width: "100%",
          padding: "11px 0",
          borderRadius: 12,
          border: variant === "free" ? "1px solid rgba(255,255,255,0.1)" : "none",
          background: ctaBg,
          color: ctaColor,
          fontSize: 13.5,
          fontWeight: 700,
          cursor: "pointer",
          fontFamily: "inherit",
          letterSpacing: -0.2,
          boxShadow: ctaShadow,
          transition: "opacity 0.14s ease, box-shadow 0.14s ease",
          marginBottom: 22,
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.88"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
      >
        {cta}
      </button>

      {/* Features */}
      <div style={{ flex: 1 }}>
        {features}
      </div>
    </div>
  );
}

// ── Main modal ────────────────────────────────────────────────────────────────

export default function PricingModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px 20px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Geist', sans-serif",
        overflowY: "auto",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 980,
          display: "flex",
          flexDirection: "column",
          gap: 0,
          animation: "pricingIn 0.28s cubic-bezier(0.22,1,0.36,1) both",
        }}
      >
        <style>{`
          @keyframes pricingIn {
            from { opacity: 0; transform: translateY(20px) scale(0.97); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}</style>

        {/* ── Header ── */}
        <div style={{ textAlign: "center", marginBottom: 48, position: "relative" }}>
          <button
            onClick={onClose}
            style={{
              position: "absolute", right: 0, top: 0,
              width: 34, height: 34, borderRadius: 10,
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.4)", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <CloseIcon />
          </button>

          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "5px 14px", borderRadius: 99,
            background: "rgba(124,92,252,0.12)",
            border: "1px solid rgba(124,92,252,0.25)",
            marginBottom: 18,
          }}>
            <span style={{ fontSize: 12, color: "rgba(160,140,255,0.85)", fontWeight: 600, letterSpacing: 0.2 }}>
              Simple pricing · Cancel anytime
            </span>
          </div>

          <h2 style={{
            fontSize: 40,
            fontWeight: 800,
            letterSpacing: -2,
            margin: 0,
            background: "linear-gradient(135deg, #ffffff 0%, rgba(180,200,255,0.85) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            lineHeight: 1.1,
            marginBottom: 12,
          } as React.CSSProperties}>
            Build faster. Ship smarter.
          </h2>

          <p style={{
            fontSize: 15, color: "rgba(255,255,255,0.38)", margin: 0,
            letterSpacing: -0.2, lineHeight: 1.5,
          }}>
            From your first prototype to the App Store — Evermade scales with you.
          </p>
        </div>

        {/* ── Plans ── */}
        <div style={{ display: "flex", gap: 16, alignItems: "stretch" }}>

          {/* FREE */}
          <PlanCard
            name="Free"
            price=""
            tagline="Try the magic."
            variant="free"
            cta="Start Free"
            features={
              <>
                <Feature text="5 credits total" />
                <Feature text="Preview up to 3 screens" />
                <Feature text="Watermark (Evermade logo)" />
                <Divider />
                <Feature text="No export" cross />
                <Feature text="No editing" cross />
                <Feature text="No backend" cross />
                <Feature text="No publish" cross />
              </>
            }
          />

          {/* EVERPRO */}
          <PlanCard
            badge="⚡ Most Popular"
            name="EverPro"
            price="25"
            tagline="Build real apps. Fast."
            variant="pro"
            cta="Upgrade to Pro"
            features={
              <>
                <Feature text="1,500 credits / month" />
                <Feature text="≈ 50 screens · ≈ 5 full apps" />
                <Divider />
                <Feature text="Full app generation" />
                <Feature text="Chat editing" />
                <Feature text="Visual editor" />
                <Feature text="Export code (React Native / Expo)" />
                <Feature text="Priority support" />
                <Feature text="Remove Evermade badge" />
                <Divider />
                <Feature text="No auto-publish" dim />
              </>
            }
          />

          {/* EVERMAX */}
          <PlanCard
            badge="🚀 Power Move"
            name="EverMax"
            price="59"
            tagline="Go from idea to App Store."
            variant="max"
            cta="Go EverMax"
            features={
              <>
                <Feature text="6,000 credits / month" gold />
                <Feature text="≈ 200 screens · ≈ 20 full apps" gold />
                <Divider />
                <Feature text="Everything in Pro, plus:" gold />
                <Feature text="App Store & Google Play publishing" gold />
                <Feature text="Backend generation (Supabase)" gold />
                <Feature text="Priority generation speed" gold />
                <Feature text="Premium templates" gold />
              </>
            }
          />
        </div>

        {/* ── Team banner ── */}
        <TeamBanner />
      </div>
    </div>
  );
}

// ── Team banner ───────────────────────────────────────────────────────────────

function TeamBanner() {
  const [hov, setHov] = useState(false);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        marginTop: 16,
        borderRadius: 18,
        border: `1px solid rgba(79,142,255,${hov ? 0.35 : 0.18})`,
        background: "rgba(10,14,36,0.96)",
        padding: "20px 28px",
        display: "flex",
        alignItems: "center",
        gap: 24,
        transition: "border-color 0.22s ease, box-shadow 0.22s ease",
        boxShadow: hov ? "0 0 40px rgba(79,142,255,0.12)" : "none",
      }}
    >
      {/* Left */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase",
            color: "rgba(79,142,255,0.7)",
          }}>Team</div>
        </div>
        <div style={{ fontSize: 15, fontWeight: 700, color: "rgba(255,255,255,0.88)", letterSpacing: -0.3, marginBottom: 4 }}>
          Scale your team&apos;s productivity
        </div>
        <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.35)", letterSpacing: -0.1 }}>
          Shared credits, collaboration tools, and VIP support — built for teams that ship.
        </div>
      </div>

      {/* Features */}
      <div style={{
        display: "flex", gap: 24, flexShrink: 0,
        flexWrap: "wrap", justifyContent: "flex-end",
      }}>
        {["Per-seat pricing", "Shared credit pool", "Roles & permissions", "Unlimited viewers", "VIP support"].map((f) => (
          <div key={f} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(79,142,255,0.6)", flexShrink: 0 }} />
            <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.45)", letterSpacing: -0.1, whiteSpace: "nowrap" }}>{f}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        style={{
          flexShrink: 0,
          padding: "10px 22px",
          borderRadius: 12,
          border: "1px solid rgba(79,142,255,0.3)",
          background: "rgba(79,142,255,0.1)",
          color: "rgba(120,175,255,0.9)",
          fontSize: 13,
          fontWeight: 700,
          cursor: "pointer",
          fontFamily: "inherit",
          letterSpacing: -0.2,
          transition: "all 0.14s ease",
          whiteSpace: "nowrap",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "rgba(79,142,255,0.18)";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(79,142,255,0.5)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "rgba(79,142,255,0.1)";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(79,142,255,0.3)";
        }}
      >
        Get Team
      </button>
    </div>
  );
}
