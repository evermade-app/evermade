"use client";

import { useState, useEffect } from "react";
import type { CreditProfile, CreditTransaction } from "@/lib/credits";
import { PLANS } from "@/lib/evermade/plans";

// ── Icons ─────────────────────────────────────────────────────────────────────

const CloseIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M2 2l11 11M13 2L2 13" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);
const CreditCardIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <rect x="1" y="3.5" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
    <path d="M1 7h13" stroke="currentColor" strokeWidth="1.4" />
    <path d="M4 10.5h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);
const ZapIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M8 1.5L3.5 8H7L6 12.5l4.5-6.5H7L8 1.5z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const RefreshIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M12 7A5 5 0 1 1 7 2c1.6 0 3 .76 3.9 1.93" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M11 1.5v3h-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ShoppingIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M1.5 1.5h2l1.5 6.5h6l1-4.5H4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="5.5" cy="11" r="1" fill="currentColor" />
    <circle cx="10" cy="11" r="1" fill="currentColor" />
  </svg>
);
const SparkleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 1v12M1 7h12M3.5 3.5l7 7M10.5 3.5l-7 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatNum(n: number): string {
  if (n >= 999_999_999) return "∞";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return String(n);
}

function nextResetDate(resetDate: string | null): string {
  if (!resetDate) return "—";
  const last = new Date(resetDate);
  const next = new Date(last.getFullYear(), last.getMonth() + 1, 1);
  return next.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function actionLabel(action: string): string {
  const map: Record<string, string> = {
    generate: "App generated",
    edit_element: "Element edited",
    edit_chat: "Chat edit",
    purchase: "Credits purchased",
    reset: "Monthly reset",
    export: "Code exported",
  };
  return map[action] ?? action;
}

function actionIcon(action: string) {
  if (action === "purchase" || action === "reset") return <SparkleIcon />;
  if (action === "edit_element" || action === "edit_chat") return <ZapIcon />;
  return <SparkleIcon />;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

// ── Stat card ─────────────────────────────────────────────────────────────────

function StatCard({
  label, value, sub, accent,
}: {
  label: string; value: string; sub?: string; accent?: string;
}) {
  return (
    <div style={{
      flex: 1, minWidth: 0,
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 14, padding: "16px 18px",
    }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.3)", letterSpacing: 0.4, textTransform: "uppercase", marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: -1.5, color: accent ?? "rgba(255,255,255,0.88)", lineHeight: 1 }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.28)", marginTop: 5, letterSpacing: -0.1 }}>
          {sub}
        </div>
      )}
    </div>
  );
}

// ── Progress bar ──────────────────────────────────────────────────────────────

function CreditBar({ used, total, isFounder }: { used: number; total: number; isFounder: boolean }) {
  const pct = isFounder ? 2 : Math.min(100, total > 0 ? (used / total) * 100 : 0);
  const isLow = pct > 80 && !isFounder;
  const color = isFounder ? "#CCFF00" : isLow ? "#f97316" : "#4ade80";

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", letterSpacing: -0.1 }}>
          {isFounder ? "Unlimited — Founder" : `${formatNum(used)} used of ${formatNum(total)}`}
        </span>
        {!isFounder && (
          <span style={{ fontSize: 12, fontWeight: 700, color, letterSpacing: -0.2 }}>
            {formatNum(total - used)} remaining
          </span>
        )}
      </div>
      <div style={{ height: 6, borderRadius: 99, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 99,
          width: `${pct}%`,
          background: isFounder
            ? "#CCFF00"
            : isLow
            ? "linear-gradient(90deg, #f97316, #ef4444)"
            : "linear-gradient(90deg, #22c55e, #4ade80)",
          transition: "width 0.6s cubic-bezier(0.34,1.56,0.64,1)",
          boxShadow: `0 0 8px ${color}55`,
        }} />
      </div>
    </div>
  );
}

// ── Transaction row ───────────────────────────────────────────────────────────

function TxRow({ tx }: { tx: CreditTransaction }) {
  const isCredit = tx.amount > 0;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "10px 0",
      borderBottom: "1px solid rgba(255,255,255,0.05)",
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 9, flexShrink: 0,
        background: isCredit ? "rgba(34,197,94,0.1)" : "rgba(204,255,0,0.08)",
        border: `1px solid ${isCredit ? "rgba(34,197,94,0.2)" : "rgba(204,255,0,0.18)"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: isCredit ? "#4ade80" : "rgba(204,255,0,0.85)",
      }}>
        {isCredit ? <ShoppingIcon /> : actionIcon(tx.action)}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.78)", letterSpacing: -0.1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {tx.description || actionLabel(tx.action)}
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.28)", marginTop: 2 }}>
          {timeAgo(tx.created_at)} · balance after: {formatNum(tx.balance_after)}
        </div>
      </div>
      <div style={{
        fontSize: 13, fontWeight: 700, letterSpacing: -0.3, flexShrink: 0,
        color: isCredit ? "#4ade80" : "rgba(255,255,255,0.55)",
      }}>
        {isCredit ? "+" : ""}{tx.amount}
      </div>
    </div>
  );
}

// ── Plan badge ────────────────────────────────────────────────────────────────

function PlanBadge({ profile }: { profile: CreditProfile }) {
  const { plan, isFounder } = profile;
  const isMax  = plan === "evermax" || plan === "owner";
  const isPro  = plan === "everpro";

  const bg = isFounder
    ? "#CCFF00"
    : isMax
    ? "linear-gradient(135deg, #d97706, #fbbf24)"
    : isPro
    ? "rgba(204,255,0,0.12)"
    : "rgba(255,255,255,0.08)";

  const border = isFounder
    ? "none"
    : isMax
    ? "none"
    : isPro
    ? "1px solid rgba(204,255,0,0.3)"
    : "1px solid rgba(255,255,255,0.1)";

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "14px 18px",
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 14, marginBottom: 20,
    }}>
      {/* Icon */}
      <div style={{
        width: 44, height: 44, borderRadius: 12, flexShrink: 0,
        background: bg, border,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: isFounder || isMax ? "0 4px 16px rgba(251,191,36,0.3)" : "none",
      }}>
        <ZapIcon />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: "rgba(255,255,255,0.9)", letterSpacing: -0.3 }}>
            {isFounder ? "EverMax" : PLANS[plan].name}
          </span>
          {isFounder && (
            <span style={{
              fontSize: 9, fontWeight: 800, letterSpacing: 0.8, textTransform: "uppercase",
              background: "#CCFF00",
              color: "#000", padding: "2px 7px", borderRadius: 99,
            }}>Founder · Admin</span>
          )}
          {isMax && !isFounder && (
            <span style={{
              fontSize: 9, fontWeight: 800, letterSpacing: 0.8, textTransform: "uppercase",
              background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.4)",
              color: "#fbbf24", padding: "2px 7px", borderRadius: 99,
            }}>EverMax</span>
          )}
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 2, letterSpacing: -0.1 }}>
          {isFounder
            ? "Unlimited access · Full premium features"
            : plan === "free"
            ? "5 credits total · Upgrade to unlock more"
            : `${formatNum(PLANS[plan].monthlyCredits)} credits/month · Resets monthly`}
        </div>
      </div>
      {plan === "free" && (
        <button style={{
          padding: "7px 14px", borderRadius: 9, border: "none",
          background: "#CCFF00",
          color: "#000", fontSize: 12, fontWeight: 700, cursor: "pointer",
          fontFamily: "inherit", letterSpacing: -0.1, flexShrink: 0,
          boxShadow: "0 4px 14px rgba(204,255,0,0.3)",
        }}>Upgrade</button>
      )}
    </div>
  );
}

// ── Main modal ────────────────────────────────────────────────────────────────

interface CreditsData {
  credits: CreditProfile;
  history: CreditTransaction[];
}

export default function CreditsModal({
  onClose,
  onBuyCredits,
}: {
  onClose: () => void;
  onBuyCredits?: () => void;
}) {
  const [data, setData] = useState<CreditsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/credits")
      .then((r) => r.json())
      .then((d: CreditsData) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const profile = data?.credits;
  const history = data?.history ?? [];

  const totalBucket = profile
    ? (profile.isFounder ? 999_999_999 : profile.monthlyCredits + profile.creditsAddons)
    : 0;

  const isLow = profile
    ? !profile.isFounder && profile.creditsRemaining < totalBucket * 0.2
    : false;

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
        @keyframes creditsModalIn {
          from { opacity: 0; transform: scale(0.96) translateY(18px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 660,
          background: "rgba(8,8,18,0.99)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 22,
          boxShadow: "0 40px 120px rgba(0,0,0,0.85)",
          overflow: "hidden",
          animation: "creditsModalIn 0.28s cubic-bezier(0.22,1,0.36,1) both",
          display: "flex", flexDirection: "column",
          maxHeight: "90vh",
        }}
      >
        {/* ── Header ── */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "22px 24px 18px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 9,
              background: "rgba(204,255,0,0.12)",
              border: "1px solid rgba(204,255,0,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#CCFF00",
            }}>
              <CreditCardIcon />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "rgba(255,255,255,0.9)", letterSpacing: -0.3 }}>
                Credits & Usage
              </div>
              <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.3)", letterSpacing: -0.1 }}>
                Track your credit balance and usage
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 30, height: 30, borderRadius: 8,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.4)", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <CloseIcon />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div style={{ flex: 1, overflowY: "auto", padding: "22px 24px", scrollbarWidth: "none" }}>

          {loading ? (
            /* Skeleton */
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[80, 60, 40].map((w) => (
                <div key={w} style={{
                  height: 20, borderRadius: 8, width: `${w}%`,
                  background: "linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 100%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 1.5s ease-in-out infinite",
                }} />
              ))}
            </div>
          ) : profile ? (
            <>
              {/* Plan card */}
              <PlanBadge profile={profile} />

              {/* Remaining credits — big display */}
              <div style={{
                textAlign: "center", padding: "24px 0 20px",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                marginBottom: 20,
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 10 }}>
                  Credits remaining
                </div>
                <div style={{
                  fontSize: 72, fontWeight: 900, letterSpacing: -5, lineHeight: 1,
                  color: profile.isFounder ? "#CCFF00"
                    : isLow ? "#f97316"
                    : "#4ade80",
                  textShadow: profile.isFounder
                    ? "0 0 40px rgba(204,255,0,0.4)"
                    : isLow
                    ? "0 0 40px rgba(249,115,22,0.4)"
                    : "0 0 40px rgba(74,222,128,0.4)",
                }}>
                  {formatNum(profile.creditsRemaining)}
                </div>
                {isLow && !profile.isFounder && (
                  <div style={{
                    marginTop: 10, display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "5px 12px", borderRadius: 99,
                    background: "rgba(249,115,22,0.1)",
                    border: "1px solid rgba(249,115,22,0.3)",
                    fontSize: 12, color: "#fb923c", fontWeight: 600,
                  }}>
                    ⚠ Credits running low — consider upgrading
                  </div>
                )}
              </div>

              {/* Progress bar */}
              <div style={{ marginBottom: 20 }}>
                <CreditBar
                  used={profile.creditsUsed}
                  total={totalBucket}
                  isFounder={profile.isFounder}
                />
              </div>

              {/* Stat cards */}
              <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                <StatCard
                  label="Monthly"
                  value={formatNum(profile.monthlyCredits)}
                  sub={profile.isFounder ? "Unlimited" : PLANS[profile.plan]?.resetsMonthly ? "Resets monthly" : "One-time"}
                />
                <StatCard
                  label="Used"
                  value={formatNum(profile.creditsUsed)}
                  sub="This period"
                />
                <StatCard
                  label="Add-ons"
                  value={formatNum(profile.creditsAddons)}
                  accent={profile.creditsAddons > 0 ? "#4ade80" : undefined}
                  sub="Never expire"
                />
              </div>

              {/* Reset date + auto-reload row */}
              {profile.resetDate && PLANS[profile.plan]?.resetsMonthly && (
                <div style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "12px 16px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 12, marginBottom: 20,
                  color: "rgba(255,255,255,0.45)",
                }}>
                  <RefreshIcon />
                  <span style={{ fontSize: 12.5, letterSpacing: -0.1 }}>
                    Monthly credits reset on{" "}
                    <strong style={{ color: "rgba(255,255,255,0.7)" }}>
                      {nextResetDate(profile.resetDate)}
                    </strong>
                    {" "}· Top-up credits never expire
                  </span>
                </div>
              )}

              {/* Buy credits CTA */}
              <button
                onClick={() => { onClose(); onBuyCredits?.(); }}
                style={{
                  width: "100%", padding: "13px 0", borderRadius: 13, border: "none",
                  background: "#CCFF00",
                  color: "#000", fontSize: 14, fontWeight: 700, cursor: "pointer",
                  fontFamily: "inherit", letterSpacing: -0.3,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  boxShadow: "0 4px 24px rgba(204,255,0,0.35)",
                  marginBottom: 24, transition: "opacity 0.14s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.88"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
              >
                <ShoppingIcon />
                Buy More Credits
              </button>

              {/* Recent activity */}
              <div style={{ marginBottom: 6 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 12 }}>
                  Recent activity
                </div>

                {history.length === 0 ? (
                  <div style={{
                    textAlign: "center", padding: "32px 0",
                    color: "rgba(255,255,255,0.2)", fontSize: 13,
                  }}>
                    No activity yet. Generate your first app to start!
                  </div>
                ) : (
                  history.map((tx) => <TxRow key={tx.id} tx={tx} />)
                )}
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "48px 0", color: "rgba(255,255,255,0.3)", fontSize: 13 }}>
              Could not load credit data. Please try again.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
