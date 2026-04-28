"use client";

import React from "react";

interface GradientGenerateButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const GradientGenerateButton: React.FC<GradientGenerateButtonProps> = ({
  onClick,
  disabled = false,
  className = "",
}) => {
  const letters = ["G", "e", "n", "e", "r", "a", "t", "e"];
  const delays = [0, 0.08, 0.16, 0.24, 0.32, 0.4, 0.48, 0.56];

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        onClick={onClick}
        disabled={disabled}
        style={{
          userSelect: "none",
          display: "flex",
          justifyContent: "center",
          padding: "0.5em 0.5em 0.5em 1.1em",
          fontFamily: "'Poppins', 'Inter', 'Segoe UI', sans-serif",
          fontSize: "1em",
          fontWeight: 400,
          backgroundColor: "#101010",
          boxShadow: `
            inset 0px 1px 1px rgba(255,255,255,0.2),
            inset 0px 2px 2px rgba(255,255,255,0.15),
            inset 0px 4px 4px rgba(255,255,255,0.1),
            inset 0px 8px 8px rgba(255,255,255,0.05),
            inset 0px 16px 16px rgba(255,255,255,0.05)
          `,
          border: "solid 1px rgba(255,255,255,0.12)",
          borderRadius: "24px",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.5 : 1,
          alignItems: "center",
        }}
      >
        {/* SVG icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          style={{
            flexGrow: 1,
            height: "24px",
            marginRight: "0.5rem",
            fill: "#e8e8e8",
            animationName: "flicker",
            animationDuration: "2s",
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            animationDelay: "0.5s",
            filter: "drop-shadow(0 0 2px rgba(255,255,255,0.6))",
            stroke: "currentColor",
          }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
          />
        </svg>

        {/* Animated text */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            minWidth: "6.4em",
          }}
        >
          <div
            style={{
              position: "absolute",
              wordSpacing: "-1em",
              animationName: "appear-anim",
              animationDuration: "1s",
              animationTimingFunction: "ease-in-out",
              animationFillMode: "forwards",
            }}
          >
            {letters.map((letter, i) => (
              <span
                key={i}
                style={{
                  position: "relative",
                  display: "inline-block",
                  color: "rgba(255,255,255,0.33)",
                  animationName: "letter-anim",
                  animationDuration: "2s",
                  animationTimingFunction: "ease-in-out",
                  animationIterationCount: "infinite",
                  animationDelay: `${delays[i]}s`,
                }}
              >
                {letter}
              </span>
            ))}
          </div>
        </div>
      </button>
    </div>
  );
};

export default GradientGenerateButton;
