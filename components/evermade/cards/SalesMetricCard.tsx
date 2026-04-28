import React from "react";

interface SalesMetricCardProps {
  title?: string;
  value?: string;
  percent?: string;
  fillPercent?: number;
  className?: string;
}

const SalesMetricCard: React.FC<SalesMetricCardProps> = ({
  title = "Sales",
  value = "39,500",
  percent = "20%",
  fillPercent = 76,
  className = "",
}) => {
  return (
    <div
      className={className}
      style={{
        padding: "1rem",
        backgroundColor: "#fff",
        boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
        maxWidth: "320px",
        borderRadius: "20px",
      }}
    >
      {/* Title row */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <span
          style={{
            position: "relative",
            padding: "0.5rem",
            backgroundColor: "#10B981",
            width: "1.5rem",
            height: "1.5rem",
            borderRadius: "9999px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width={16} fill="white" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
            <path d="M1362 1185q0 153-99.5 263.5t-258.5 136.5v175q0 14-9 23t-23 9h-135q-13 0-22.5-9.5t-9.5-22.5v-175q-66-9-127.5-31t-101.5-44.5-74-48-46.5-37.5-17.5-18q-17-21-2-41l103-135q7-10 23-12 15-2 24 9l2 2q113 99 243 125 37 8 74 8 81 0 142.5-43t61.5-122q0-28-15-53t-33.5-42-58.5-37.5-66-32-80-32.5q-39-16-61.5-25t-61.5-26.5-62.5-31-56.5-35.5-53.5-42.5-43.5-49-35.5-58-21-66.5-8.5-78q0-138 98-242t255-134v-180q0-13 9.5-22.5t22.5-9.5h135q14 0 23 9t9 23v176q57 6 110.5 23t87 33.5 63.5 37.5 39 29 15 14q17 18 5 38l-81 146q-8 15-23 16-14 3-27-7-3-3-14.5-12t-39-26.5-58.5-32-74.5-26-85.5-11.5q-95 0-155 43t-60 111q0 26 8.5 48t29.5 41.5 39.5 33 56 31 60.5 27 70 27.5q53 20 81 31.5t76 35 75.5 42.5 62 50 53 63.5 31.5 76.5 13 94z" />
          </svg>
        </span>
        <p style={{ marginLeft: "0.5rem", color: "#374151", fontSize: "18px" }}>{title}</p>
        <p style={{ marginLeft: "0.5rem", color: "#02972f", fontWeight: 600, display: "flex", alignItems: "center" }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1792 1792" fill="currentColor" height={16} width={16}>
            <path d="M1408 1216q0 26-19 45t-45 19h-896q-26 0-45-19t-19-45 19-45l448-448q19-19 45-19t45 19l448 448q19 19 19 45z" />
          </svg>
          {percent}
        </p>
      </div>

      {/* Data */}
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
        <p style={{ marginTop: "1rem", marginBottom: "1rem", color: "#1F2937", fontSize: "2.25rem", lineHeight: "2.5rem", fontWeight: 700, textAlign: "left" }}>
          {value}
        </p>
        <div style={{ position: "relative", backgroundColor: "#E5E7EB", width: "100%", height: "0.5rem", borderRadius: "0.25rem" }}>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              backgroundColor: "#10B981",
              width: `${fillPercent}%`,
              height: "100%",
              borderRadius: "0.25rem",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SalesMetricCard;
