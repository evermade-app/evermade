"use client";

import React, { useState } from "react";

interface CyberSegmentNavProps {
  options?: Array<{ icon: React.ReactNode; id: string }>;
  defaultOption?: string;
  onChange?: (id: string) => void;
  className?: string;
}

const defaultOptions = [
  {
    id: "dashboard",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={28} height={28}>
        <rect x={3} y={3} width={7} height={9} />
        <rect x={14} y={3} width={7} height={5} />
        <rect x={14} y={12} width={7} height={9} />
        <rect x={3} y={16} width={7} height={5} />
      </svg>
    ),
  },
  {
    id: "chat",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={28} height={28}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    id: "profile",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={28} height={28}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx={12} cy={7} r={4} />
      </svg>
    ),
  },
];

const CyberSegmentNav: React.FC<CyberSegmentNavProps> = ({
  options = defaultOptions,
  defaultOption,
  onChange,
  className = "",
}) => {
  const [activeId, setActiveId] = useState(defaultOption ?? options[0]?.id ?? "");

  const handleSelect = (id: string) => {
    setActiveId(id);
    onChange?.(id);
  };

  const activeIdx = options.findIndex((o) => o.id === activeId);
  const itemWidth = (280 - 12) / options.length;

  return (
    <div
      className={className}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "280px",
          height: "80px",
          background: "#0f1016",
          borderRadius: "20px",
          boxShadow: "inset 0 2px 4px rgba(0,0,0,0.8), inset 0 -1px 2px rgba(255,255,255,0.05), 0 20px 40px -10px rgba(0,0,0,0.6)",
          display: "flex",
          alignItems: "center",
          padding: "6px",
          boxSizing: "border-box",
          overflow: "hidden",
          border: "1px solid #1f222e",
        }}
      >
        {/* Sliding highlight */}
        <div
          style={{
            position: "absolute",
            top: "6px",
            left: "6px",
            width: `${itemWidth}px`,
            height: "calc(80px - 12px)",
            background: "transparent",
            zIndex: 1,
            transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
            transform: `translateX(${activeIdx * itemWidth}px)`,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "14px",
              background: "linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%)",
              border: "1px solid rgba(255,255,255,0.15)",
              boxShadow: "0 0 20px #00f0ff, inset 0 0 15px rgba(0,240,255,0.2)",
              backdropFilter: "blur(4px)",
              animationName: "neon-pulse",
              animationDuration: "3s",
              animationIterationCount: "infinite",
              animationTimingFunction: "ease-in-out",
              position: "relative",
            }}
          >
            {/* Top highlight line */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "10%",
                width: "80%",
                height: "1px",
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)",
                opacity: 0.8,
              }}
            />
          </div>
        </div>

        {/* Options */}
        {options.map((opt, i) => (
          <React.Fragment key={opt.id}>
            <input
              type="radio"
              id={`evermade-cyber-${opt.id}`}
              name="evermade-cyber-mode"
              checked={activeId === opt.id}
              onChange={() => handleSelect(opt.id)}
              style={{ position: "absolute", width: "1px", height: "1px", padding: 0, margin: "-1px", overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 }}
            />
            <label
              htmlFor={`evermade-cyber-${opt.id}`}
              style={{
                flex: 1,
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                zIndex: 2,
                position: "relative",
                borderRadius: "14px",
                transition: "all 0.3s ease",
                color: activeId === opt.id ? "#fff" : "#5c6b7f",
                filter: activeId === opt.id ? "drop-shadow(0 0 8px #00f0ff)" : "none",
                transform: activeId === opt.id ? "scale(1.1)" : "scale(1)",
              }}
            >
              {opt.icon}
            </label>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CyberSegmentNav;
