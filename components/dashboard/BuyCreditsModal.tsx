"use client";

import { useState } from "react";

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const RefreshIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M13.5 8A5.5 5.5 0 1 1 8 2.5c1.8 0 3.4.87 4.4 2.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M12 2v3h-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ── Data ──────────────────────────────────────────────────────────────────────

const PACKS = [
  { id: "10",   price: 10,   credits: 500,    bonus: null,  label: null,         tag: null },
  { id: "29",   price: 29,   credits: 2000,   bonus: null,  label: null,         tag: null },
  { id: "79",   price: 79,   credits: 6000,   bonus: null,  label: "Most Popular", tag: "popular" },
  { id: "149",  price: 149,  credits: 12500,  bonus: null,  label: null,         tag: null },
  { id: "299",  price: 299,  credits: 28000,  bonus: null,  label: null,         tag: null },
  { id: "500",  price: 500,  credits: 60000,  bonus: 72000, label: "Best Value", tag: "best" },
  { id: "1000", price: 1000, credits: 130000, bonus: 156000,label: "Max Value",  tag: "max" },
  { id: "custom", price: null, credits: null, bonus: null,  label: "Custom",     tag: "custom" },
];

function formatCredits(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : String(n);
}

// ── Toggle ────────────────────────────────────────────────────────────────────

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      style={{
        width: 44, height: 26, borderRadius: 13,
        background: on ? "linear-gradient(135deg, #7c5cfc, #4878ff)" : "rgba(255,255,255,0.12)",
        border: "none", cursor: "pointer", position: "relative",
        transition: "background 0.2s ease",
        flexShrink: 0,
        boxShadow: on ? "0 0 12px rgba(124,92,252,0.4)" : "none",
      }}
    >
      <div style={{
        position: "absolute", top: 3, left: on ? 21 : 3,
        width: 20, height: 20, borderRadius: "50%",
        background: "white",
        transition: "left 0.2s cubic-bezier(0.34,1.56,0.64,1)",
        boxShadow: "0 1px 4px rgba(0,0,0,0.4)",
      }} />
    </button>
  );
}

// ── Pack card ─────────────────────────────────────────────────────────────────

function PackCard({
  pack,
  selected,
  onSelect,
}: {
  pack: typeof PACKS[number];
  selected: boolean;
  onSelect: () => void;
}) {
  const [hov, setHov] = useState(false);

  const isBest = pack.tag === "best";
  const isMax  = pack.tag === "max";
  const isPop  = pack.tag === "popular";
  const isCustom = pack.tag === "custom";

  const accentColor =
    isBest || isMax ? "#22c55e"
    : isPop ? "rgba(124,92,252,1)"
    : "rgba(255,255,255,0.6)";

  const borderColor = selected
    ? isBest || isMax ? "rgba(34,197,94,0.8)"
      : isPop ? "rgba(124,92,252,0.8)"
      : "rgba(255,255,255,0.5)"
    : hov
    ? isBest || isMax ? "rgba(34,197,94,0.4)"
      : isPop ? "rgba(124,92,252,0.4)"
      : "rgba(255,255,255,0.15)"
    : isBest || isMax ? "rgba(34,197,94,0.25)"
    : "rgba(255,255,255,0.07)";

  const bg = selected
    ? isBest || isMax ? "rgba(34,197,94,0.08)"
      : isPop ? "rgba(124,92,252,0.1)"
      : "rgba(255,255,255,0.07)"
    : hov ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)";

  const glow = selected
    ? isBest || isMax ? "0 0 20px rgba(34,197,94,0.2)"
      : isPop ? "0 0 20px rgba(124,92,252,0.2)"
      : "none"
    : "none";

  return (
    <button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onSelect}
      style={{
        position: "relative",
        borderRadius: 14,
        border: `1.5px solid ${borderColor}`,
        background: bg,
        boxShadow: glow,
        padding: "14px 10px 12px",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        cursor: "pointer", gap: 3,
        transition: "all 0.18s ease",
        minHeight: 84,
        fontFamily: "inherit",
      }}
    >
      {/* Tag pill */}
      {pack.label && pack.tag !== "custom" && (
        <div style={{
          position: "absolute", top: -9, left: "50%", transform: "translateX(-50%)",
          padding: "2px 8px", borderRadius: 99,
          background: isBest || isMax ? "rgba(34,197,94,0.15)" : "rgba(124,92,252,0.2)",
          border: `1px solid ${isBest || isMax ? "rgba(34,197,94,0.4)" : "rgba(124,92,252,0.4)"}`,
          fontSize: 9, fontWeight: 800, letterSpacing: 0.5, textTransform: "uppercase",
          color: isBest || isMax ? "#4ade80" : "rgba(160,140,255,0.9)",
          whiteSpace: "nowrap",
        }}>
          {pack.label}
        </div>
      )}

      {isCustom ? (
        <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.55)" }}>Custom</span>
      ) : (
        <>
          <div style={{
            fontSize: 17, fontWeight: 800, letterSpacing: -0.8,
            color: selected ? accentColor : "rgba(255,255,255,0.88)",
            transition: "color 0.15s",
          }}>
            ${pack.price}
          </div>

          {pack.bonus ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
              <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.28)", textDecoration: "line-through", lineHeight: 1 }}>
                {formatCredits(pack.credits!)}
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#4ade80", lineHeight: 1 }}>
                {formatCredits(pack.bonus)}
              </div>
            </div>
          ) : (
            <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>
              {formatCredits(pack.credits!)}
            </div>
          )}
        </>
      )}
    </button>
  );
}

// ── Main modal ────────────────────────────────────────────────────────────────

export default function BuyCreditsModal({ onClose }: { onClose: () => void }) {
  const [selected, setSelected] = useState("79");
  const [autoReload, setAutoReload] = useState(true);

  const activePack = PACKS.find((p) => p.id === selected);
  const displayCredits = activePack?.bonus ?? activePack?.credits;
  const displayPrice = activePack?.price;
  const isCustom = selected === "custom";

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(0,0,0,0.82)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px 20px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Geist', sans-serif",
      }}
    >
      <style>{`
        @keyframes creditsIn {
          from { opacity: 0; transform: scale(0.96) translateY(16px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 560,
          background: "rgba(8,8,18,0.99)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 24,
          boxShadow: "0 40px 120px rgba(0,0,0,0.8), 0 0 0 1px rgba(79,142,255,0.08)",
          padding: "32px 28px 28px",
          display: "flex", flexDirection: "column",
          animation: "creditsIn 0.26s cubic-bezier(0.22,1,0.36,1) both",
          position: "relative",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 20, right: 20,
            width: 32, height: 32, borderRadius: 9,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.4)", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <CloseIcon />
        </button>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{
            margin: "0 0 6px", fontSize: 22, fontWeight: 800,
            color: "rgba(255,255,255,0.92)", letterSpacing: -0.8,
          }}>
            Buy More Credits
          </h2>
          <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.38)", letterSpacing: -0.1 }}>
            One-time purchase. Get{" "}
            <span style={{ color: "#4ade80", fontWeight: 700 }}>20% bonus credits</span>
            {" "}on orders of $500 or more.
          </p>
        </div>

        {/* Big price display */}
        <div style={{
          textAlign: "center", marginBottom: 28,
          padding: "20px 0 16px",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}>
          {isCustom ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "center" }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: "rgba(255,255,255,0.88)", letterSpacing: -2 }}>
                Custom
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>
                Contact us for volume pricing
              </div>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", gap: 2 }}>
                <span style={{ fontSize: 24, fontWeight: 700, color: "rgba(255,255,255,0.38)", marginTop: 10, letterSpacing: -0.5 }}>$</span>
                <span style={{ fontSize: 72, fontWeight: 900, letterSpacing: -5, lineHeight: 1, color: "rgba(255,255,255,0.92)" }}>
                  {displayPrice}
                </span>
              </div>
              <div style={{
                marginTop: 4, fontSize: 15, letterSpacing: -0.2,
                color: activePack?.bonus ? "#4ade80" : "rgba(255,255,255,0.38)",
                fontWeight: activePack?.bonus ? 700 : 400,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}>
                {activePack?.bonus && (
                  <span style={{ color: "rgba(255,255,255,0.25)", fontWeight: 400, fontSize: 13, textDecoration: "line-through" }}>
                    {formatCredits(activePack.credits!)} credits
                  </span>
                )}
                <span>{displayCredits ? formatCredits(displayCredits) : "—"} credits</span>
                {activePack?.bonus && (
                  <span style={{
                    fontSize: 10, fontWeight: 800, letterSpacing: 0.5, textTransform: "uppercase",
                    background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.35)",
                    color: "#4ade80", padding: "2px 7px", borderRadius: 99,
                  }}>+20% bonus</span>
                )}
              </div>
            </>
          )}
        </div>

        {/* Pack grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 8,
          marginBottom: 20,
        }}>
          {PACKS.map((pack) => (
            <PackCard
              key={pack.id}
              pack={pack}
              selected={selected === pack.id}
              onSelect={() => setSelected(pack.id)}
            />
          ))}
        </div>

        {/* Auto-reload row */}
        <div style={{
          display: "flex", alignItems: "center", gap: 14,
          padding: "14px 16px",
          borderRadius: 14,
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
          marginBottom: 20,
        }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10, flexShrink: 0,
            background: "rgba(79,142,255,0.1)",
            border: "1px solid rgba(79,142,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "rgba(120,175,255,0.8)",
          }}>
            <RefreshIcon />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: "rgba(255,255,255,0.82)", letterSpacing: -0.2 }}>
              Auto-reload
            </div>
            <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.3)", marginTop: 1, letterSpacing: -0.1 }}>
              Keep services running · charge $25 when below 100 credits
            </div>
          </div>
          <Toggle on={autoReload} onChange={setAutoReload} />
        </div>

        {/* CTA */}
        {isCustom ? (
          <button
            style={{
              width: "100%", padding: "15px 0", borderRadius: 14,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.75)",
              fontSize: 15, fontWeight: 700, cursor: "pointer",
              fontFamily: "inherit", letterSpacing: -0.3,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              transition: "opacity 0.14s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.8"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
          >
            Contact Sales
            <ArrowIcon />
          </button>
        ) : (
          <button
            style={{
              width: "100%", padding: "15px 0", borderRadius: 14,
              background: "linear-gradient(135deg, #7c5cfc 0%, #4878ff 100%)",
              border: "none",
              color: "white",
              fontSize: 15, fontWeight: 700, cursor: "pointer",
              fontFamily: "inherit", letterSpacing: -0.3,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              boxShadow: "0 4px 24px rgba(124,92,252,0.4), 0 0 0 1px rgba(124,92,252,0.3)",
              transition: "opacity 0.14s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.88"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
          >
            Continue to Payment
            <ArrowIcon />
          </button>
        )}

        {/* Footer note */}
        <div style={{ textAlign: "center", marginTop: 14, fontSize: 12, color: "rgba(255,255,255,0.2)", letterSpacing: -0.1 }}>
          Top-up credits never expire · Secure checkout
        </div>
      </div>
    </div>
  );
}
