"use client";

import React from "react";
import { resolveBridgeComponent } from "./component-bridge";

type P = Record<string, unknown>;

function str(v: unknown, fallback: string): string {
  return typeof v === "string" && v.trim() ? v.trim() : fallback;
}
function num(v: unknown, fallback: number): number {
  return typeof v === "number" && !isNaN(v) ? v : fallback;
}

export function resolveRegistryComponent(id: string, props: P): React.ReactNode | null {
  switch (id) {

    // ── kpi-glow-card ──────────────────────────────────────────────────────────
    case "kpi-glow-card": {
      const value = str(props.value, "—");
      const label = str(props.label, "Metric");
      return (
        <div style={{
          width: "100%", padding: "8px 10px", borderRadius: 13,
          background: "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.025) 100%)",
          border: "1px solid rgba(255,255,255,0.1)",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: 0, left: 0,
            width: "55%", height: 1,
            background: "linear-gradient(90deg, rgba(255,255,255,0.45), transparent)",
          }} />
          <div style={{ fontSize: 17, fontWeight: 700, color: "rgba(255,255,255,0.95)", letterSpacing: -0.6, lineHeight: 1 }}>
            {value}
          </div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", marginTop: 4, textTransform: "uppercase", letterSpacing: 0.7 }}>
            {label}
          </div>
        </div>
      );
    }

    // ── sales-metric-card ──────────────────────────────────────────────────────
    case "sales-metric-card": {
      const title = str(props.title, "Metric");
      const value = str(props.value, "—");
      const percent = str(props.percent, "+0%");
      const fill = num(props.fillPercent, 50);
      const isPos = !percent.startsWith("-");
      return (
        <div style={{
          width: "100%", padding: "8px 10px", borderRadius: 13,
          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
            <div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.5 }}>{title}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#fff", letterSpacing: -0.5 }}>{value}</div>
            </div>
            <span style={{
              fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 999,
              color: isPos ? "#34d399" : "#f87171",
              background: isPos ? "rgba(52,211,153,0.1)" : "rgba(248,113,113,0.1)",
            }}>{percent}</span>
          </div>
          <div style={{ height: 3, borderRadius: 2, background: "rgba(255,255,255,0.07)" }}>
            <div style={{ width: `${fill}%`, height: "100%", borderRadius: 2, background: "linear-gradient(90deg, #7c5cfc, #4878ff)", transition: "width 0.4s ease" }} />
          </div>
        </div>
      );
    }

    // ── gradient-analytics-card ───────────────────────────────────────────────
    case "gradient-analytics-card": {
      const title = str(props.title, "Analytics");
      const period = str(props.period, "This week");
      const rawBars = props.bars;
      const bars: number[] = Array.isArray(rawBars)
        ? (rawBars as unknown[]).map((v) => (typeof v === "number" ? v : 50))
        : [40, 65, 55, 80, 70, 90, 75];
      return (
        <div style={{
          width: "100%", padding: "8px 10px", borderRadius: 13,
          background: "linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(168,85,247,0.07) 100%)",
          border: "1px solid rgba(99,102,241,0.2)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 9 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>{title}</span>
            <span style={{ fontSize: 8, color: "#34d399", display: "flex", alignItems: "center", gap: 3 }}>
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#34d399", display: "inline-block" }} />
              {period}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", height: 34, gap: 3 }}>
            {bars.map((h, i) => (
              <div key={i} style={{
                flex: 1, borderRadius: "3px 3px 1px 1px",
                height: `${Math.max(8, h)}%`,
                background: i === bars.length - 1
                  ? "linear-gradient(180deg, #a855f7, #6366f1)"
                  : "rgba(99,102,241,0.35)",
              }} />
            ))}
          </div>
        </div>
      );
    }

    // ── neumorph-dark-card ────────────────────────────────────────────────────
    case "neumorph-dark-card": {
      const label = str(props.label, "");
      const subtitle = str(props.subtitle, "");
      return (
        <div style={{
          width: "100%", padding: "10px 11px", borderRadius: 13,
          background: "linear-gradient(145deg, rgba(255,255,255,0.045), rgba(0,0,0,0.2))",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07), 0 8px 20px rgba(0,0,0,0.3)",
        }}>
          {label && (
            <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.84)", marginBottom: subtitle ? 4 : 0 }}>
              {label}
            </div>
          )}
          {subtitle && (
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.38)", lineHeight: 1.55 }}>
              {subtitle}
            </div>
          )}
          {!label && !subtitle && (
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", fontStyle: "italic" }}>Card content</div>
          )}
        </div>
      );
    }

    // ── premium-ribbon-card ───────────────────────────────────────────────────
    case "premium-ribbon-card": {
      const ribbonText = str(props.ribbonText, "Featured");
      const label = str(props.label, "");
      const subtitle = str(props.subtitle, "");
      return (
        <div style={{
          width: "100%", minHeight: 110, borderRadius: 15,
          background: "linear-gradient(145deg, rgba(60,56,56,0.7), #1c1c1c)",
          position: "relative", overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 10px 28px rgba(0,0,0,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {/* Corner ribbon */}
          <span style={{ position: "absolute", overflow: "hidden", width: 90, height: 90, top: -8, left: -8, zIndex: 2 }}>
            <span style={{
              position: "absolute", width: "150%", height: 28,
              background: "linear-gradient(45deg, #ff6547, #ffb144)",
              transform: "rotate(-45deg) translateY(-14px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 800, letterSpacing: "0.05em",
              textTransform: "uppercase", fontSize: 8,
              boxShadow: "0 3px 8px rgba(0,0,0,0.35)",
            }}>
              {ribbonText}
            </span>
          </span>
          {/* Gradient overlay */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.4) 100%)", pointerEvents: "none" }} />
          {/* Content */}
          <div style={{ textAlign: "center", padding: "16px 14px", position: "relative", zIndex: 1 }}>
            {label && <div style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.92)", marginBottom: 3 }}>{label}</div>}
            {subtitle && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>{subtitle}</div>}
          </div>
        </div>
      );
    }

    // ── chat-composer-card ────────────────────────────────────────────────────
    case "chat-composer-card": {
      const placeholder = str(props.placeholder, "Ask AI...");
      const rawTags = props.tags;
      const tags = Array.isArray(rawTags) ? (rawTags as string[]).slice(0, 3) : [];
      return (
        <div style={{
          width: "100%", padding: "8px 10px", borderRadius: 13,
          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
        }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.27)", marginBottom: tags.length ? 8 : 0 }}>{placeholder}</div>
          {tags.length > 0 && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {tags.map((t, i) => (
                <span key={i} style={{
                  fontSize: 9, padding: "3px 8px", borderRadius: 999,
                  background: "rgba(124,92,252,0.14)", border: "1px solid rgba(124,92,252,0.22)",
                  color: "rgba(255,255,255,0.6)",
                }}>{t}</span>
              ))}
            </div>
          )}
        </div>
      );
    }

    // ── activity-list-item ────────────────────────────────────────────────────
    case "activity-list-item": {
      const title = str(props.title, "Activity");
      const timestamp = str(props.timestamp, "");
      const message = str(props.message, "");
      const icon = str(props.icon, "");
      return (
        <div style={{
          width: "100%", padding: "6px 9px", borderRadius: 11,
          background: "rgba(255,255,255,0.032)", border: "1px solid rgba(255,255,255,0.06)",
          display: "flex", gap: 9, alignItems: "center",
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9, flexShrink: 0,
            background: "linear-gradient(135deg, rgba(124,92,252,0.22), rgba(72,120,255,0.14))",
            border: "1px solid rgba(124,92,252,0.18)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: icon ? 14 : 10,
          }}>
            {icon || "⚡"}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.88)", marginBottom: 1 }}>{title}</div>
            {message && (
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {message}
              </div>
            )}
          </div>
          {timestamp && (
            <div style={{ fontSize: 8, color: "rgba(255,255,255,0.25)", flexShrink: 0 }}>{timestamp}</div>
          )}
        </div>
      );
    }

    // ── stacked-notification-card ──────────────────────────────────────────────
    case "stacked-notification-card": {
      const rawNotifs = props.notifications;
      const notifs = Array.isArray(rawNotifs)
        ? (rawNotifs as Array<{ title: string; message: string; time: string }>).slice(0, 3)
        : [
            { title: "New message", message: "You have a new notification", time: "2m" },
            { title: "Update", message: "Your data was synced", time: "1h" },
          ];
      return (
        <div style={{ width: "100%", borderRadius: 13, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
          {notifs.map((n, i) => (
            <div key={i} style={{
              padding: "6px 10px",
              background: i % 2 === 0 ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.025)",
              borderTop: i > 0 ? "1px solid rgba(255,255,255,0.05)" : "none",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.84)" }}>{n.title}</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.33)", marginTop: 1 }}>{n.message}</div>
              </div>
              <div style={{ fontSize: 8, color: "rgba(255,255,255,0.24)", flexShrink: 0, marginLeft: 8 }}>{n.time}</div>
            </div>
          ))}
        </div>
      );
    }

    // ── pro-pricing-card ──────────────────────────────────────────────────────
    case "pro-pricing-card": {
      const plan = str(props.plan, "Pro");
      const badge = str(props.badge, "Most Popular");
      const price = str(props.price, "$9.99");
      const period = str(props.period, "/month");
      const description = str(props.description, "Unlimited access");
      const ctaLabel = str(props.ctaLabel, "Get Started");
      return (
        <div style={{
          width: "100%", padding: "10px 10px", borderRadius: 15,
          background: "linear-gradient(135deg, rgba(124,92,252,0.12) 0%, rgba(72,120,255,0.08) 100%)",
          border: "1px solid rgba(124,92,252,0.25)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 9 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{plan}</span>
            <span style={{
              fontSize: 8, fontWeight: 700, padding: "2px 7px", borderRadius: 999,
              textTransform: "uppercase", letterSpacing: 0.4,
              background: "linear-gradient(90deg, #7c5cfc, #4878ff)", color: "#fff",
            }}>{badge}</span>
          </div>
          <div style={{ marginBottom: 7 }}>
            <span style={{ fontSize: 24, fontWeight: 800, color: "#fff", letterSpacing: -1 }}>{price}</span>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.38)" }}> {period}</span>
          </div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.42)", marginBottom: 11, lineHeight: 1.5 }}>{description}</div>
          <div style={{
            padding: "8px 0", borderRadius: 10,
            background: "linear-gradient(90deg, #7c5cfc, #4878ff)",
            textAlign: "center", fontSize: 12, fontWeight: 700, color: "#fff",
          }}>{ctaLabel}</div>
        </div>
      );
    }

    // ── pill-generate-button ──────────────────────────────────────────────────
    case "pill-generate-button": {
      const label = str(props.label, "Generate");
      return (
        <div style={{
          width: "100%", padding: "10px 0", borderRadius: 13,
          background: "linear-gradient(90deg, #7c5cfc, #4878ff)",
          textAlign: "center", fontSize: 12, fontWeight: 700, color: "#fff", letterSpacing: 0.2,
          boxShadow: "0 6px 20px rgba(124,92,252,0.32)",
        }}>{label}</div>
      );
    }

    // ── pill-explore-button ───────────────────────────────────────────────────
    case "pill-explore-button": {
      const label = str(props.label, "Explore");
      return (
        <div style={{
          width: "100%", padding: "10px 0", borderRadius: 13,
          background: "rgba(255,255,255,0.055)", border: "1px solid rgba(255,255,255,0.13)",
          textAlign: "center", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.72)",
        }}>{label} →</div>
      );
    }

    // ── cta-glow-arrow-button ─────────────────────────────────────────────────
    case "cta-glow-arrow-button": {
      const label = str(props.label, "Get Started");
      return (
        <div style={{
          width: "100%", padding: "10px 0", borderRadius: 13,
          background: "linear-gradient(90deg, rgba(124,92,252,0.2), rgba(72,120,255,0.14))",
          border: "1px solid rgba(124,92,252,0.32)",
          textAlign: "center", fontSize: 12, fontWeight: 700, color: "#a78bfa",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
        }}>
          {label}
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6h8M7 3l3 3-3 3" stroke="#a78bfa" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      );
    }

    // ── gradient-start-button ─────────────────────────────────────────────────
    case "gradient-start-button": {
      const label = str(props.label, "Start");
      return (
        <div style={{
          width: "100%", padding: "10px 0", borderRadius: 13,
          background: "linear-gradient(90deg, #7c5cfc 0%, #ec4899 100%)",
          textAlign: "center", fontSize: 12, fontWeight: 700, color: "#fff",
          boxShadow: "0 6px 20px rgba(124,92,252,0.28)",
        }}>{label}</div>
      );
    }

    // ── floating-chat-button ──────────────────────────────────────────────────
    case "floating-chat-button": {
      const tooltipText = str(props.tooltipText, "Chat with AI");
      return (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
            background: "linear-gradient(135deg, #7c5cfc, #4878ff)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 6px 16px rgba(124,92,252,0.38)",
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M14 2H2a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h3l3 3 3-3h3a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z" stroke="white" strokeWidth="1.3" strokeLinejoin="round" />
            </svg>
          </div>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{tooltipText}</span>
        </div>
      );
    }

    // ── soft-pill-input ───────────────────────────────────────────────────────
    case "soft-pill-input": {
      const placeholder = str(props.placeholder, "Search...");
      return (
        <div style={{
          width: "100%", padding: "9px 13px", borderRadius: 11,
          background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <circle cx="5.5" cy="5.5" r="4" stroke="rgba(255,255,255,0.28)" strokeWidth="1.4" />
            <path d="M9 9L12 12" stroke="rgba(255,255,255,0.28)" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.26)" }}>{placeholder}</span>
        </div>
      );
    }

    // ── toggle-neumorphic-switch ──────────────────────────────────────────────
    case "toggle-neumorphic-switch": {
      const label = str(props.label, "Setting");
      return (
        <div style={{
          width: "100%", padding: "8px 10px", borderRadius: 11,
          background: "rgba(255,255,255,0.032)", border: "1px solid rgba(255,255,255,0.07)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.72)" }}>{label}</span>
          <div style={{ width: 34, height: 19, borderRadius: 10, background: "linear-gradient(90deg, #7c5cfc, #4878ff)", position: "relative", flexShrink: 0 }}>
            <div style={{ position: "absolute", top: 2, right: 2, width: 15, height: 15, borderRadius: "50%", background: "#fff", boxShadow: "0 2px 5px rgba(0,0,0,0.3)" }} />
          </div>
        </div>
      );
    }

    // ── cyber-segment-nav ─────────────────────────────────────────────────────
    case "cyber-segment-nav": {
      const rawSegs = props.segments;
      const segments = Array.isArray(rawSegs)
        ? (rawSegs as string[]).slice(0, 4)
        : ["Day", "Week", "Month"];
      return (
        <div style={{
          width: "100%", display: "flex",
          background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)",
          borderRadius: 10, padding: 3, gap: 2,
        }}>
          {segments.map((s, i) => (
            <div key={i} style={{
              flex: 1, padding: "5px 0", textAlign: "center",
              borderRadius: 7, fontSize: 10, fontWeight: i === 0 ? 600 : 400,
              background: i === 0 ? "rgba(255,255,255,0.11)" : "transparent",
              color: i === 0 ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.35)",
            }}>{s}</div>
          ))}
        </div>
      );
    }

    // ── on-off-pill ───────────────────────────────────────────────────────────
    case "on-off-pill": {
      const label = str(props.label, "");
      const activeLabel = str(props.activeLabel, "ON");
      const inactiveLabel = str(props.inactiveLabel, "OFF");
      const defaultOn = props.defaultOn !== false;
      return (
        <div style={{ width: "100%" }}>
          {label && (
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.42)", marginBottom: 7, textTransform: "uppercase", letterSpacing: 0.5 }}>
              {label}
            </div>
          )}
          <div style={{
            display: "flex", width: "100%",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 999, padding: 3, gap: 3,
          }}>
            <div style={{
              flex: 1, padding: "9px 0", borderRadius: 999, textAlign: "center",
              fontSize: 12, fontWeight: 600, transition: "all 0.2s",
              background: !defaultOn ? "linear-gradient(90deg,#7c5cfc,#4878ff)" : "transparent",
              color: !defaultOn ? "#fff" : "rgba(255,255,255,0.3)",
              boxShadow: !defaultOn ? "0 4px 12px rgba(124,92,252,0.3)" : "none",
            }}>{inactiveLabel}</div>
            <div style={{
              flex: 1, padding: "9px 0", borderRadius: 999, textAlign: "center",
              fontSize: 12, fontWeight: 600, transition: "all 0.2s",
              background: defaultOn ? "linear-gradient(90deg,#7c5cfc,#4878ff)" : "transparent",
              color: defaultOn ? "#fff" : "rgba(255,255,255,0.3)",
              boxShadow: defaultOn ? "0 4px 12px rgba(124,92,252,0.3)" : "none",
            }}>{activeLabel}</div>
          </div>
        </div>
      );
    }

    // ── map-preview ───────────────────────────────────────────────────────────
    case "map-preview": {
      const location = str(props.location, "Current Location");
      const address = str(props.address, "");
      return (
        <div style={{
          width: "100%", height: 96, borderRadius: 13, overflow: "hidden",
          position: "relative",
          background: "linear-gradient(160deg, #0d1b2e 0%, #112240 50%, #0a1628 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}>
          {/* Grid lines — horizontal */}
          {[20, 40, 60, 80].map((pct) => (
            <div key={`h${pct}`} style={{ position: "absolute", left: 0, right: 0, top: `${pct}%`, height: 1, background: "rgba(255,255,255,0.045)" }} />
          ))}
          {/* Grid lines — vertical */}
          {[20, 40, 60, 80].map((pct) => (
            <div key={`v${pct}`} style={{ position: "absolute", top: 0, bottom: 0, left: `${pct}%`, width: 1, background: "rgba(255,255,255,0.045)" }} />
          ))}
          {/* Streets (horizontal accent) */}
          <div style={{ position: "absolute", left: 0, right: 0, top: "38%", height: 3, background: "rgba(255,255,255,0.07)" }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: "65%", height: 2, background: "rgba(255,255,255,0.05)" }} />
          {/* Streets (vertical accent) */}
          <div style={{ position: "absolute", top: 0, bottom: 0, left: "35%", width: 3, background: "rgba(255,255,255,0.07)" }} />
          <div style={{ position: "absolute", top: 0, bottom: 0, left: "68%", width: 2, background: "rgba(255,255,255,0.05)" }} />
          {/* Location pin */}
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-58%)", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              background: "linear-gradient(135deg,#7c5cfc,#4878ff)",
              border: "2.5px solid #fff",
              boxShadow: "0 4px 16px rgba(124,92,252,0.55), 0 0 0 6px rgba(124,92,252,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="5" r="2.2" stroke="white" strokeWidth="1.4" />
                <path d="M6 11C6 11 2 7.5 2 5a4 4 0 0 1 8 0c0 2.5-4 6-4 6z" stroke="white" strokeWidth="1.4" strokeLinejoin="round" />
              </svg>
            </div>
            <div style={{ width: 1, height: 8, background: "rgba(124,92,252,0.6)", marginTop: 1 }} />
            <div style={{ width: 5, height: 2, borderRadius: "50%", background: "rgba(0,0,0,0.3)", marginTop: 0 }} />
          </div>
          {/* Info pill at bottom */}
          <div style={{
            position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)",
            background: "rgba(8,8,14,0.85)", backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.12)", borderRadius: 999,
            padding: "5px 12px", whiteSpace: "nowrap",
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#fff" }}>{location}</div>
            {address && <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", marginTop: 1 }}>{address}</div>}
          </div>
        </div>
      );
    }

    // ── rating-stars ──────────────────────────────────────────────────────────
    case "rating-stars": {
      const title = str(props.title, "Rating");
      const rating = num(props.rating, 4.5);
      const count = str(props.count, "");
      const stars = Math.round(rating);
      return (
        <div style={{
          width: "100%", padding: "7px 10px", borderRadius: 11,
          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 }}>{title}</div>
            <div style={{ display: "flex", gap: 2 }}>
              {[1,2,3,4,5].map((s) => (
                <span key={s} style={{ fontSize: 15, color: s <= stars ? "#fbbf24" : "rgba(255,255,255,0.14)", lineHeight: 1 }}>★</span>
              ))}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: -0.5 }}>{rating}</div>
            {count && <div style={{ fontSize: 9, color: "rgba(255,255,255,0.28)", marginTop: 2 }}>{count} reviews</div>}
          </div>
        </div>
      );
    }

    // ── glass-card ────────────────────────────────────────────────────────────
    case "glass-card": {
      const title = str(props.title, "");
      const subtitle = str(props.subtitle, "");
      const value = str(props.value, "");
      const icon = str(props.icon, "");
      const accentColor = str(props.accentColor, "#8b5cf6");
      return (
        <div style={{
          width: "100%", padding: "10px 11px", borderRadius: 18,
          background: "linear-gradient(135deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.03) 100%)",
          border: "1px solid rgba(255,255,255,0.14)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.12)",
          position: "relative", overflow: "hidden",
        }}>
          {/* Glow orb */}
          <div style={{
            position: "absolute", top: -20, right: -20, width: 80, height: 80,
            borderRadius: "50%", background: accentColor, opacity: 0.12,
            filter: "blur(20px)", pointerEvents: "none",
          }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              {title && <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.92)", marginBottom: 3, letterSpacing: -0.3 }}>{title}</div>}
              {subtitle && <div style={{ fontSize: 10, color: "rgba(255,255,255,0.42)", lineHeight: 1.5 }}>{subtitle}</div>}
              {value && <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: -1, marginTop: 6 }}>{value}</div>}
            </div>
            {icon && (
              <div style={{
                width: 36, height: 36, borderRadius: 12, flexShrink: 0, marginLeft: 10,
                background: `linear-gradient(135deg, ${accentColor}30, ${accentColor}15)`,
                border: `1px solid ${accentColor}35`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
              }}>{icon}</div>
            )}
          </div>
        </div>
      );
    }

    // ── hero-banner ───────────────────────────────────────────────────────────
    case "hero-banner": {
      const title = str(props.title, "Welcome");
      const subtitle = str(props.subtitle, "");
      const badge = str(props.badge, "");
      const gradientStart = str(props.gradientStart, "#7c5cfc");
      const gradientEnd = str(props.gradientEnd, "#4878ff");
      return (
        <div style={{
          width: "100%", height: 82, borderRadius: 14, overflow: "hidden",
          background: `linear-gradient(135deg, ${gradientStart} 0%, ${gradientEnd} 100%)`,
          position: "relative",
        }}>
          {/* Noise texture overlay */}
          <div style={{ position: "absolute", inset: 0, opacity: 0.06,
            backgroundImage: "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.8) 1px, transparent 1px), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }} />
          {/* Highlight orb top-right */}
          <div style={{ position: "absolute", top: -30, right: -30, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.15)", filter: "blur(25px)" }} />
          {/* Content */}
          <div style={{ position: "absolute", inset: 0, padding: "14px 16px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            {badge && (
              <div style={{ alignSelf: "flex-start" }}>
                <span style={{
                  fontSize: 8, fontWeight: 700, padding: "3px 8px", borderRadius: 999,
                  background: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.95)",
                  textTransform: "uppercase", letterSpacing: 0.8,
                }}>{badge}</span>
              </div>
            )}
            <div>
              {subtitle && <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", marginBottom: 4 }}>{subtitle}</div>}
              <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", letterSpacing: -0.4, lineHeight: 1.15 }}>{title}</div>
            </div>
          </div>
        </div>
      );
    }

    // ── stat-badge ────────────────────────────────────────────────────────────
    case "stat-badge": {
      const value = str(props.value, "—");
      const label = str(props.label, "");
      const trend = str(props.trend, "");
      const trendUp = props.trendUp !== false;
      const description = str(props.description, "");
      const accentColor = str(props.accentColor, "#7c5cfc");
      return (
        <div style={{
          width: "100%", padding: "7px 9px", borderRadius: 16,
          background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
          border: "1px solid rgba(255,255,255,0.09)",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: 0, left: 0, width: "40%", height: 1, background: `linear-gradient(90deg, ${accentColor}80, transparent)` }} />
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              {label && <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: 0.7, marginBottom: 4 }}>{label}</div>}
              <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: -0.8, lineHeight: 1 }}>{value}</div>
              {description && <div style={{ fontSize: 9, color: "rgba(255,255,255,0.38)", marginTop: 4 }}>{description}</div>}
            </div>
            {trend && (
              <div style={{
                display: "flex", alignItems: "center", gap: 3, padding: "4px 8px", borderRadius: 999,
                background: trendUp ? "rgba(52,211,153,0.12)" : "rgba(248,113,113,0.12)",
                border: `1px solid ${trendUp ? "rgba(52,211,153,0.2)" : "rgba(248,113,113,0.2)"}`,
              }}>
                <span style={{ fontSize: 10, color: trendUp ? "#34d399" : "#f87171" }}>
                  {trendUp ? "↑" : "↓"}
                </span>
                <span style={{ fontSize: 10, fontWeight: 700, color: trendUp ? "#34d399" : "#f87171" }}>{trend}</span>
              </div>
            )}
          </div>
        </div>
      );
    }

    // ── avatar-stack ──────────────────────────────────────────────────────────
    case "avatar-stack": {
      const label = str(props.label, "");
      const count = num(props.count, 0);
      const rawAvatars = props.avatars;
      const avatarList: Array<{ initial: string; color: string }> = Array.isArray(rawAvatars)
        ? (rawAvatars as Array<{ initial: string; color: string }>).slice(0, 4)
        : [
            { initial: "A", color: "#7c5cfc" }, { initial: "B", color: "#f97316" },
            { initial: "C", color: "#06b6d4" }, { initial: "D", color: "#f472b6" },
          ];
      const overflowCount = count > avatarList.length ? count - avatarList.length : 0;
      return (
        <div style={{ width: "100%", padding: "7px 10px", borderRadius: 13,
          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <div style={{ display: "flex" }}>
            {avatarList.map((a, i) => (
              <div key={i} style={{
                width: 28, height: 28, borderRadius: "50%",
                background: a.color, border: "2px solid rgba(8,8,15,0.9)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 700, color: "#fff",
                marginLeft: i > 0 ? -8 : 0, zIndex: avatarList.length - i, position: "relative",
              }}>{a.initial}</div>
            ))}
            {overflowCount > 0 && (
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: "rgba(255,255,255,0.1)", border: "2px solid rgba(8,8,15,0.9)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.6)",
                marginLeft: -8, zIndex: 0, position: "relative",
              }}>+{overflowCount}</div>
            )}
          </div>
          {label && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", flex: 1 }}>{label}</div>}
        </div>
      );
    }

    // ── bento-grid ────────────────────────────────────────────────────────────
    case "bento-grid": {
      const rawItems = props.items;
      const items: Array<{ title: string; value: string; icon: string; color?: string }> = Array.isArray(rawItems)
        ? (rawItems as Array<{ title: string; value: string; icon: string; color?: string }>).slice(0, 4)
        : [
            { title: "Steps", value: "8,420", icon: "👟", color: "#7c5cfc" },
            { title: "Sleep", value: "7.5h", icon: "😴", color: "#06b6d4" },
            { title: "Calories", value: "1,840", icon: "🔥", color: "#f97316" },
            { title: "Water", value: "2.1L", icon: "💧", color: "#34d399" },
          ];
      const [first, second, third, fourth] = items;
      const cellStyle = (color?: string): React.CSSProperties => ({
        borderRadius: 14,
        background: color
          ? `linear-gradient(135deg, ${color}20 0%, ${color}0a 100%)`
          : "rgba(255,255,255,0.04)",
        border: `1px solid ${color ? `${color}30` : "rgba(255,255,255,0.07)"}`,
        padding: "10px 11px",
        display: "flex", flexDirection: "column", justifyContent: "space-between",
      });
      return (
        <div style={{ width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "auto auto", gap: 6 }}>
          {/* Left tall card */}
          {first && (
            <div style={{ ...cellStyle(first.color), gridRow: "1 / 3", minHeight: 110 }}>
              <div style={{ fontSize: 22 }}>{first.icon}</div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: -0.8 }}>{first.value}</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.38)", textTransform: "uppercase", letterSpacing: 0.5, marginTop: 2 }}>{first.title}</div>
              </div>
            </div>
          )}
          {/* Right top */}
          {second && (
            <div style={{ ...cellStyle(second.color) }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 14 }}>{second.icon}</div>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", letterSpacing: -0.5 }}>{second.value}</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.38)", textTransform: "uppercase", letterSpacing: 0.5 }}>{second.title}</div>
              </div>
            </div>
          )}
          {/* Right bottom */}
          {third && (
            <div style={{ ...cellStyle(third.color) }}>
              <div style={{ fontSize: 14 }}>{third.icon}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", letterSpacing: -0.5 }}>{third.value}</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.38)", textTransform: "uppercase", letterSpacing: 0.5 }}>{third.title}</div>
              </div>
            </div>
          )}
          {/* Full-width bottom card if fourth exists */}
          {fourth && (
            <div style={{ ...cellStyle(fourth.color), gridColumn: "1 / 3", flexDirection: "row", alignItems: "center", gap: 10 }}>
              <div style={{ fontSize: 18 }}>{fourth.icon}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", letterSpacing: -0.5 }}>{fourth.value}</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.38)", textTransform: "uppercase", letterSpacing: 0.5 }}>{fourth.title}</div>
              </div>
            </div>
          )}
        </div>
      );
    }

    // ── timeline-item ─────────────────────────────────────────────────────────
    case "timeline-item": {
      const title = str(props.title, "Event");
      const subtitle = str(props.subtitle, "");
      const time = str(props.time, "");
      const color = str(props.color, "#7c5cfc");
      const isLast = props.isLast === true;
      return (
        <div style={{ width: "100%", display: "flex", gap: 12, position: "relative" }}>
          {/* Timeline line + dot */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, width: 20 }}>
            <div style={{
              width: 10, height: 10, borderRadius: "50%", background: color, flexShrink: 0,
              boxShadow: `0 0 0 3px ${color}25`,
              zIndex: 1,
            }} />
            {!isLast && <div style={{ width: 1, flex: 1, minHeight: 24, background: `linear-gradient(180deg, ${color}40, rgba(255,255,255,0.06))`, marginTop: 3 }} />}
          </div>
          {/* Content */}
          <div style={{ flex: 1, paddingBottom: isLast ? 0 : 12 }}>
            <div style={{
              padding: "7px 10px", borderRadius: 12,
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.88)" }}>{title}</div>
                {time && <div style={{ fontSize: 9, color: "rgba(255,255,255,0.28)", flexShrink: 0, marginLeft: 8 }}>{time}</div>}
              </div>
              {subtitle && <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 3, lineHeight: 1.5 }}>{subtitle}</div>}
            </div>
          </div>
        </div>
      );
    }

    // ── premium-list-item ─────────────────────────────────────────────────────
    case "premium-list-item": {
      const icon = str(props.icon, "⚡");
      const iconBg = str(props.iconBg, "rgba(124,92,252,0.2)");
      const title = str(props.title, "");
      const subtitle = str(props.subtitle, "");
      const value = str(props.value, "");
      const showChevron = props.showChevron !== false;
      return (
        <div style={{
          width: "100%", padding: "7px 10px", borderRadius: 13,
          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 11, flexShrink: 0,
            background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
          }}>{icon}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.88)" }}>{title}</div>
            {subtitle && <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 1 }}>{subtitle}</div>}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
            {value && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", fontWeight: 500 }}>{value}</div>}
            {showChevron && <div style={{ fontSize: 13, color: "rgba(255,255,255,0.22)" }}>›</div>}
          </div>
        </div>
      );
    }

    // ── onboarding-slide ──────────────────────────────────────────────────────
    case "onboarding-slide": {
      const emoji = str(props.emoji, "✨");
      const title = str(props.title, "Welcome");
      const subtitle = str(props.subtitle, "");
      const step = num(props.step, 1);
      const total = num(props.total, 3);
      const accentColor = str(props.accentColor, "#7c5cfc");
      return (
        <div style={{ width: "100%", padding: "12px 11px 11px", borderRadius: 18,
          background: "linear-gradient(160deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.015) 100%)",
          border: "1px solid rgba(255,255,255,0.09)", textAlign: "center",
        }}>
          {/* Emoji illustration area */}
          <div style={{
            width: 48, height: 48, borderRadius: 16, margin: "0 auto 10px",
            background: `linear-gradient(135deg, ${accentColor}25 0%, ${accentColor}10 100%)`,
            border: `1px solid ${accentColor}30`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
          }}>{emoji}</div>
          <div style={{ fontSize: 13, fontWeight: 800, color: "rgba(255,255,255,0.95)", letterSpacing: -0.4, marginBottom: 5 }}>{title}</div>
          {subtitle && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", lineHeight: 1.6, marginBottom: 16 }}>{subtitle}</div>}
          {/* Progress dots */}
          <div style={{ display: "flex", justifyContent: "center", gap: 5 }}>
            {Array.from({ length: total }).map((_, i) => (
              <div key={i} style={{
                height: 5, borderRadius: 999,
                width: i + 1 === step ? 18 : 5,
                background: i + 1 === step ? accentColor : "rgba(255,255,255,0.15)",
                transition: "width 0.3s ease",
              }} />
            ))}
          </div>
        </div>
      );
    }

    // ── profile-header ────────────────────────────────────────────────────────
    case "profile-header": {
      const name = str(props.name, "User");
      const role = str(props.role, "");
      const avatarInitial = str(props.avatarInitial, name.charAt(0).toUpperCase());
      const avatarColor = str(props.avatarColor, "#7c5cfc");
      const gradientStart = str(props.gradientStart, "#0d0820");
      const gradientEnd = str(props.gradientEnd, "#10082a");
      const rawStats = props.stats;
      const stats: Array<{ value: string; label: string }> = Array.isArray(rawStats)
        ? (rawStats as Array<{ value: string; label: string }>).slice(0, 3)
        : [{ value: "127", label: "Sessions" }, { value: "42", label: "Days" }, { value: "Pro", label: "Plan" }];
      return (
        <div style={{
          width: "100%", borderRadius: 18, overflow: "hidden",
          background: `linear-gradient(160deg, ${gradientStart} 0%, ${gradientEnd} 100%)`,
          border: "1px solid rgba(255,255,255,0.08)",
        }}>
          {/* Top gradient accent bar */}
          <div style={{ height: 3, background: `linear-gradient(90deg, ${avatarColor}, ${avatarColor}60)` }} />
          <div style={{ padding: "11px 12px 10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                background: `linear-gradient(135deg, ${avatarColor}, ${avatarColor}80)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 15, fontWeight: 800, color: "#fff",
                boxShadow: `0 4px 16px ${avatarColor}45`,
                border: "2px solid rgba(255,255,255,0.12)",
              }}>{avatarInitial}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "rgba(255,255,255,0.95)", letterSpacing: -0.4 }}>{name}</div>
                {role && <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{role}</div>}
              </div>
            </div>
            {/* Stats row */}
            <div style={{ display: "flex", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 12, gap: 4 }}>
              {stats.map((s, i) => (
                <div key={i} style={{
                  flex: 1, textAlign: "center",
                  borderRight: i < stats.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", letterSpacing: -0.4 }}>{s.value}</div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.32)", textTransform: "uppercase", letterSpacing: 0.5, marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // ── quick-actions-row ─────────────────────────────────────────────────────
    case "quick-actions-row": {
      const rawActions = props.actions;
      const actions: Array<{ icon: string; label: string; color: string }> = Array.isArray(rawActions)
        ? (rawActions as Array<{ icon: string; label: string; color: string }>).slice(0, 4)
        : [
            { icon: "💳", label: "Pay", color: "#7c5cfc" },
            { icon: "📤", label: "Send", color: "#06b6d4" },
            { icon: "📥", label: "Request", color: "#34d399" },
            { icon: "📊", label: "Stats", color: "#f97316" },
          ];
      return (
        <div style={{ width: "100%", display: "flex", justifyContent: "space-around" }}>
          {actions.map((a, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 12,
                background: `linear-gradient(135deg, ${a.color}30 0%, ${a.color}18 100%)`,
                border: `1px solid ${a.color}35`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
                boxShadow: `0 4px 12px ${a.color}20`,
              }}>{a.icon}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.45)", fontWeight: 500, textAlign: "center" }}>{a.label}</div>
            </div>
          ))}
        </div>
      );
    }

    // ── featured-card ─────────────────────────────────────────────────────────
    case "featured-card": {
      const category = str(props.category, "");
      const title = str(props.title, "");
      const description = str(props.description, "");
      const accentColor = str(props.accentColor, "#7c5cfc");
      const meta = str(props.meta, "");
      return (
        <div style={{
          width: "100%", borderRadius: 14, overflow: "hidden",
          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
        }}>
          {/* Left accent stripe */}
          <div style={{ width: 3, background: `linear-gradient(180deg, ${accentColor}, ${accentColor}40)`, flexShrink: 0 }} />
          <div style={{ flex: 1, padding: "7px 10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                {category && (
                  <span style={{
                    fontSize: 8, fontWeight: 700, color: accentColor,
                    textTransform: "uppercase", letterSpacing: 0.8,
                    display: "inline-block", marginBottom: 4,
                  }}>{category}</span>
                )}
                {title && <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.9)", letterSpacing: -0.3, lineHeight: 1.3 }}>{title}</div>}
                {description && <div style={{ fontSize: 10, color: "rgba(255,255,255,0.38)", marginTop: 3, lineHeight: 1.5 }}>{description}</div>}
              </div>
              {meta && (
                <div style={{
                  fontSize: 9, color: "rgba(255,255,255,0.28)", flexShrink: 0, marginLeft: 10,
                  padding: "2px 7px", borderRadius: 999,
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
                }}>{meta}</div>
              )}
            </div>
          </div>
        </div>
      );
    }

    // ── progress-ring ─────────────────────────────────────────────────────────
    case "progress-ring": {
      const value = str(props.value, "0");
      const label = str(props.label, "");
      const percent = Math.min(100, Math.max(0, num(props.percent, 65)));
      const accentColor = str(props.accentColor, "#7c5cfc");
      const size = 42;
      const radius = 16;
      const circumference = 2 * Math.PI * radius;
      const strokeDash = (percent / 100) * circumference;
      return (
        <div style={{
          width: "100%", padding: "7px 9px", borderRadius: 13,
          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
          display: "flex", alignItems: "center", gap: 14,
        }}>
          {/* Ring SVG */}
          <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
            <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
              <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="4" />
              <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={accentColor} strokeWidth="4"
                strokeDasharray={`${strokeDash} ${circumference}`} strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 4px ${accentColor}80)` }}
              />
            </svg>
            <div style={{
              position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 800, color: "#fff",
            }}>{percent}%</div>
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: -0.8 }}>{value}</div>
            {label && <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: 0.6, marginTop: 2 }}>{label}</div>}
          </div>
        </div>
      );
    }

    // ── app-tab-bar ───────────────────────────────────────────────────────────
    case "app-tab-bar": {
      const rawTabs = props.tabs;
      const tabs: Array<{ icon: string; label: string; active?: boolean }> = Array.isArray(rawTabs)
        ? (rawTabs as Array<{ icon: string; label: string; active?: boolean }>).slice(0, 5)
        : [
            { icon: "🏠", label: "Home", active: true },
            { icon: "📊", label: "Stats" },
            { icon: "➕", label: "Add" },
            { icon: "👤", label: "Profile" },
          ];
      return (
        <div style={{
          width: "100%", padding: "8px 6px 4px",
          background: "rgba(10,10,18,0.92)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          display: "flex", justifyContent: "space-around", alignItems: "center",
          borderRadius: "0 0 38px 38px",
        }}>
          {tabs.map((tab, i) => (
            <div key={i} style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
              flex: 1, padding: "4px 0", position: "relative",
            }}>
              {tab.active && (
                <div style={{
                  position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
                  width: 24, height: 2, borderRadius: 999,
                  background: "linear-gradient(90deg, #7c5cfc, #4878ff)",
                }} />
              )}
              <div style={{ fontSize: 18, lineHeight: 1, filter: tab.active ? "none" : "grayscale(0.5) opacity(0.45)" }}>
                {tab.icon}
              </div>
              <div style={{
                fontSize: 8, fontWeight: tab.active ? 700 : 400, letterSpacing: 0.2,
                color: tab.active ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.3)",
              }}>{tab.label}</div>
            </div>
          ))}
        </div>
      );
    }

    // ── mini-sparkline ────────────────────────────────────────────────────────
    case "mini-sparkline": {
      const label = str(props.label, "Trend");
      const trend = str(props.trend, "+0%");
      const trendUp = props.trendUp !== false;
      const rawValues = props.values;
      const values: number[] = Array.isArray(rawValues)
        ? (rawValues as unknown[]).map((v) => (typeof v === "number" ? v : 50))
        : [30, 45, 38, 60, 52, 75, 68, 82];
      const max = Math.max(...values);
      const min = Math.min(...values);
      const range = max - min || 1;
      const w = 60;
      const h = 28;
      const points = values.map((v, i) => {
        const x = (i / (values.length - 1)) * w;
        const y = h - ((v - min) / range) * h;
        return `${x},${y}`;
      }).join(" ");
      const accentColor = trendUp ? "#34d399" : "#f87171";
      return (
        <div style={{
          width: "100%", padding: "7px 10px", borderRadius: 11,
          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 3 }}>{label}</div>
            <div style={{
              fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 999,
              color: accentColor,
              background: trendUp ? "rgba(52,211,153,0.12)" : "rgba(248,113,113,0.12)",
            }}>{trendUp ? "↑" : "↓"} {trend}</div>
          </div>
          <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
            <polyline points={points} stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.85" />
          </svg>
        </div>
      );
    }

    // ── transaction-item ──────────────────────────────────────────────────────
    case "transaction-item": {
      const title = str(props.title, "Transaction");
      const amount = str(props.amount, "$0.00");
      const date = str(props.date, "");
      const icon = str(props.icon, "💳");
      const positive = props.positive === true;
      const category = str(props.category, "");
      return (
        <div style={{
          width: "100%", padding: "7px 10px", borderRadius: 12,
          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 11, flexShrink: 0,
            background: positive ? "rgba(52,211,153,0.12)" : "rgba(255,255,255,0.06)",
            border: positive ? "1px solid rgba(52,211,153,0.2)" : "1px solid rgba(255,255,255,0.08)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
          }}>{icon}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.88)", marginBottom: 1 }}>{title}</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>
              {category && <span style={{ marginRight: 6 }}>{category}</span>}
              {date}
            </div>
          </div>
          <div style={{
            fontSize: 13, fontWeight: 700, flexShrink: 0,
            color: positive ? "#34d399" : "rgba(255,255,255,0.75)",
          }}>{positive ? "+" : ""}{amount}</div>
        </div>
      );
    }

    // ── horizontal-scroll-cards ───────────────────────────────────────────────
    case "horizontal-scroll-cards": {
      const rawCards = props.cards;
      const cards: Array<{ title: string; value: string; icon: string; color: string }> = Array.isArray(rawCards)
        ? (rawCards as Array<{ title: string; value: string; icon: string; color: string }>).slice(0, 6)
        : [
            { title: "Revenue", value: "$12.4K", icon: "💰", color: "#7c5cfc" },
            { title: "Users", value: "2,840", icon: "👥", color: "#06b6d4" },
            { title: "Orders", value: "318", icon: "📦", color: "#f97316" },
            { title: "Growth", value: "+24%", icon: "📈", color: "#34d399" },
          ];
      return (
        <div style={{ width: "100%", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          <div style={{ display: "flex", gap: 8, paddingBottom: 4 }}>
            {cards.map((c, i) => (
              <div key={i} style={{
                minWidth: 90, padding: "10px 11px", borderRadius: 13, flexShrink: 0,
                background: `linear-gradient(135deg, ${c.color}20 0%, ${c.color}0a 100%)`,
                border: `1px solid ${c.color}30`,
              }}>
                <div style={{ fontSize: 18, marginBottom: 7 }}>{c.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", letterSpacing: -0.5 }}>{c.value}</div>
                <div style={{ fontSize: 8, color: "rgba(255,255,255,0.38)", textTransform: "uppercase", letterSpacing: 0.5, marginTop: 2 }}>{c.title}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // ── user-list-item ────────────────────────────────────────────────────────
    case "user-list-item": {
      const name = str(props.name, "User");
      const role = str(props.role, "");
      const avatarInitial = str(props.avatar, name.charAt(0).toUpperCase());
      const online = props.online !== false;
      const avatarColor = str(props.avatarColor, "#7c5cfc");
      const action = str(props.action, "");
      return (
        <div style={{
          width: "100%", padding: "7px 10px", borderRadius: 12,
          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: `linear-gradient(135deg, ${avatarColor}, ${avatarColor}70)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 700, color: "#fff",
            }}>{avatarInitial}</div>
            <div style={{
              position: "absolute", bottom: 1, right: 1,
              width: 9, height: 9, borderRadius: "50%",
              background: online ? "#34d399" : "rgba(255,255,255,0.2)",
              border: "1.5px solid rgba(8,8,15,0.9)",
            }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.88)" }}>{name}</div>
            {role && <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", marginTop: 1 }}>{role}</div>}
          </div>
          {action && (
            <div style={{
              fontSize: 9, fontWeight: 600, padding: "4px 10px", borderRadius: 999,
              background: "rgba(124,92,252,0.15)", border: "1px solid rgba(124,92,252,0.25)",
              color: "#a78bfa", flexShrink: 0,
            }}>{action}</div>
          )}
        </div>
      );
    }

    // ── empty-state ───────────────────────────────────────────────────────────
    case "empty-state": {
      const emoji = str(props.emoji, "🔍");
      const title = str(props.title, "Nothing here yet");
      const subtitle = str(props.subtitle, "Get started by adding something new.");
      const ctaLabel = str(props.ctaLabel, "");
      return (
        <div style={{
          width: "100%", padding: "14px 12px", borderRadius: 16,
          background: "rgba(255,255,255,0.025)", border: "1px dashed rgba(255,255,255,0.1)",
          textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 14,
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 1,
          }}>{emoji}</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.7)", letterSpacing: -0.2 }}>{title}</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.32)", lineHeight: 1.6, maxWidth: "80%" }}>{subtitle}</div>
          {ctaLabel && (
            <div style={{
              marginTop: 6, padding: "8px 20px", borderRadius: 999,
              background: "linear-gradient(90deg, #7c5cfc, #4878ff)",
              fontSize: 11, fontWeight: 700, color: "#fff",
              boxShadow: "0 4px 14px rgba(124,92,252,0.3)",
            }}>{ctaLabel}</div>
          )}
        </div>
      );
    }

    // ── date-picker-row ───────────────────────────────────────────────────────
    case "date-picker-row": {
      const label = str(props.label, "Select date");
      const rawDates = props.dates;
      type DateEntry = { day: string; date: string; active?: boolean };
      const dates: DateEntry[] = Array.isArray(rawDates)
        ? (rawDates as Array<unknown>).slice(0, 7).map((d, i) => {
            if (d && typeof d === "object" && !Array.isArray(d)) {
              const o = d as Record<string, unknown>;
              return { day: str(o.day, "—"), date: str(o.date, String(i + 14)), active: Boolean(o.active) };
            }
            if (typeof d === "string") {
              const parts = d.split("\n");
              return { day: parts[0] ?? d, date: parts[1] ?? "", active: false };
            }
            return { day: "—", date: String(i + 14), active: false };
          })
        : [
            { day: "M", date: "14" }, { day: "T", date: "15" }, { day: "W", date: "16", active: true },
            { day: "T", date: "17" }, { day: "F", date: "18" }, { day: "S", date: "19" }, { day: "S", date: "20" },
          ];
      const selectedIndex = num(props.selectedIndex, dates.findIndex((d) => d.active) >= 0 ? dates.findIndex((d) => d.active) : 2);
      return (
        <div style={{ width: "100%" }}>
          {label && (
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 8 }}>{label}</div>
          )}
          <div style={{ display: "flex", gap: 4, justifyContent: "space-between" }}>
            {dates.map((d, i) => {
              const day = d.day;
              const date = d.date;
              const active = i === selectedIndex;
              return (
                <div key={i} style={{
                  flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
                  padding: "7px 4px", borderRadius: 10,
                  background: active ? "linear-gradient(135deg, #7c5cfc, #4878ff)" : "rgba(255,255,255,0.04)",
                  border: active ? "none" : "1px solid rgba(255,255,255,0.07)",
                  boxShadow: active ? "0 4px 12px rgba(124,92,252,0.35)" : "none",
                }}>
                  <div style={{ fontSize: 8, color: active ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.3)", marginBottom: 2 }}>{day}</div>
                  <div style={{ fontSize: 12, fontWeight: active ? 800 : 500, color: active ? "#fff" : "rgba(255,255,255,0.55)" }}>{date}</div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // ── status-banner ─────────────────────────────────────────────────────────
    case "status-banner": {
      const type = str(props.type, "info");
      const message = str(props.message, "");
      const icon = str(props.icon, "");
      const COLOR_MAP: Record<string, { bg: string; border: string; text: string; defaultIcon: string }> = {
        info:    { bg: "rgba(72,120,255,0.1)",  border: "rgba(72,120,255,0.25)",  text: "#6ea8ff",  defaultIcon: "ℹ️" },
        success: { bg: "rgba(52,211,153,0.1)",  border: "rgba(52,211,153,0.25)",  text: "#34d399",  defaultIcon: "✅" },
        warning: { bg: "rgba(251,191,36,0.1)",  border: "rgba(251,191,36,0.25)",  text: "#fbbf24",  defaultIcon: "⚠️" },
        danger:  { bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.25)", text: "#f87171",  defaultIcon: "🚨" },
      };
      const c = COLOR_MAP[type] ?? COLOR_MAP.info;
      return (
        <div style={{
          width: "100%", padding: "7px 10px", borderRadius: 11,
          background: c.bg, border: `1px solid ${c.border}`,
          display: "flex", alignItems: "center", gap: 9,
        }}>
          <div style={{ fontSize: 16, flexShrink: 0 }}>{icon || c.defaultIcon}</div>
          <div style={{ fontSize: 11, color: c.text, lineHeight: 1.55, flex: 1 }}>{message}</div>
        </div>
      );
    }

    default:
      return resolveBridgeComponent(id, props);
  }
}
