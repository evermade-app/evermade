"use client";

import React, { useState } from "react";

interface PremiumRibbonCardProps {
  ribbonText?: string;
  children?: React.ReactNode;
  className?: string;
}

const PremiumRibbonCard: React.FC<PremiumRibbonCardProps> = ({
  ribbonText = "Premium",
  children,
  className = "",
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: "200px",
          height: "250px",
          borderRadius: "20px",
          background: "linear-gradient(170deg, rgba(58,56,56,0.623) 0%, rgb(31,31,31) 100%)",
          position: "relative",
          boxShadow: "0 25px 50px rgba(0,0,0,0.55)",
          cursor: "pointer",
          transition: "all .3s",
          transform: hovered ? "scale(0.9)" : "scale(1)",
        }}
      >
        {/* Ribbon */}
        <span
          style={{
            position: "absolute",
            overflow: "hidden",
            width: "150px",
            height: "150px",
            top: "-10px",
            left: "-10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              position: "absolute",
              width: "150%",
              height: "40px",
              backgroundImage: "linear-gradient(45deg, #ff6547 0%, #ffb144 51%, #ff7053 100%)",
              transform: "rotate(-45deg) translateY(-20px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              boxShadow: "0 5px 10px rgba(0,0,0,0.23)",
              fontSize: "12px",
            }}
          >
            {ribbonText}
          </span>
        </span>
        {/* Content area */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "rgba(255,255,255,0.4)",
            fontSize: "14px",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default PremiumRibbonCard;
