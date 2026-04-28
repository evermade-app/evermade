import React from "react";

interface Metric {
  label: string;
  value: string;
  change: string;
}

interface BarData {
  heightPercent: number;
  fillPercent: number;
}

interface GradientAnalyticsCardProps {
  title?: string;
  metrics?: Metric[];
  bars?: BarData[];
  period?: string;
  className?: string;
}

const defaultMetrics: Metric[] = [
  { label: "Total Views", value: "24.5K", change: "+12.3%" },
  { label: "Conversions", value: "1.2K", change: "+8.1%" },
];

const defaultBars: BarData[] = [
  { heightPercent: 40, fillPercent: 60 },
  { heightPercent: 60, fillPercent: 40 },
  { heightPercent: 75, fillPercent: 80 },
  { heightPercent: 45, fillPercent: 50 },
  { heightPercent: 85, fillPercent: 90 },
  { heightPercent: 65, fillPercent: 70 },
  { heightPercent: 95, fillPercent: 85 },
];

const GradientAnalyticsCard: React.FC<GradientAnalyticsCardProps> = ({
  title = "Performance Analytics",
  metrics = defaultMetrics,
  bars = defaultBars,
  period = "Last 7 days",
  className = "",
}) => {
  return (
    <div
      className={`group relative flex flex-col rounded-xl p-4 shadow-2xl transition-all duration-300 hover:scale-[1.02] ${className}`}
      style={{
        width: "320px",
        background: "#020617",
        position: "relative",
      }}
    >
      {/* Gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "12px",
          background: "linear-gradient(90deg, #6366f1, #a855f7, #ec4899)",
          opacity: 0.2,
          filter: "blur(4px)",
          transition: "opacity 0.3s",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: "1px",
          borderRadius: "11px",
          background: "#020617",
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div style={{ position: "relative" }}>
        {/* Header */}
        <div style={{ marginBottom: "16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "linear-gradient(135deg, #6366f1, #a855f7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg height="16" width="16" viewBox="0 0 24 24" stroke="white" fill="none">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#fff" }}>{title}</h3>
          </div>
          <span style={{ display: "flex", alignItems: "center", gap: "4px", borderRadius: "9999px", background: "rgba(16,185,129,0.1)", padding: "4px 8px", fontSize: "12px", fontWeight: 500, color: "#10b981" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981" }} />
            Live
          </span>
        </div>

        {/* Metrics grid */}
        <div style={{ marginBottom: "16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          {metrics.map((m, i) => (
            <div key={i} style={{ borderRadius: "8px", background: "rgba(15,23,42,0.5)", padding: "12px" }}>
              <p style={{ fontSize: "12px", fontWeight: 500, color: "#94a3b8", margin: 0 }}>{m.label}</p>
              <p style={{ fontSize: "18px", fontWeight: 600, color: "#fff", margin: "4px 0 2px" }}>{m.value}</p>
              <span style={{ fontSize: "12px", fontWeight: 500, color: "#10b981" }}>{m.change}</span>
            </div>
          ))}
        </div>

        {/* Bar chart */}
        <div style={{ marginBottom: "16px", height: "96px", width: "100%", overflow: "hidden", borderRadius: "8px", background: "rgba(15,23,42,0.5)", padding: "12px" }}>
          <div style={{ display: "flex", height: "100%", width: "100%", alignItems: "flex-end", justifyContent: "space-between", gap: "4px" }}>
            {bars.map((b, i) => (
              <div key={i} style={{ height: `${b.heightPercent}%`, width: "12px", borderRadius: "2px", background: "rgba(99,102,241,0.3)", position: "relative" }}>
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: `${b.fillPercent}%`, borderRadius: "2px", background: "#6366f1", transition: "all 0.3s" }} />
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "12px", fontWeight: 500, color: "#94a3b8" }}>{period}</span>
            <svg height="16" width="16" viewBox="0 0 24 24" stroke="#94a3b8" fill="none">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <button style={{ display: "flex", alignItems: "center", gap: "4px", borderRadius: "8px", background: "linear-gradient(90deg, #6366f1, #a855f7)", padding: "4px 12px", fontSize: "12px", fontWeight: 500, color: "#fff", border: "none", cursor: "pointer", transition: "all 0.3s" }}>
            View Details
            <svg height="12" width="12" viewBox="0 0 24 24" stroke="white" fill="none">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GradientAnalyticsCard;
