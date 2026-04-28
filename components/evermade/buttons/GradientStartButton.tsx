"use client";

import React, { useState } from "react";

interface GradientStartButtonProps {
  label?: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const GradientStartButton: React.FC<GradientStartButtonProps> = ({
  label = "Start",
  onClick,
  disabled = false,
  className = "",
}) => {
  const [active, setActive] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setActive(false); }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      className={className}
      style={{
        cursor: disabled ? "not-allowed" : "pointer",
        textTransform: "uppercase",
        letterSpacing: "0.5rem",
        background: `
          radial-gradient(circle, rgba(46,213,116,0.36) 0%, rgba(0,0,0,0) 95%),
          linear-gradient(rgba(46,213,116,0.073) 1px, transparent 1px),
          linear-gradient(to right, rgba(46,213,116,0.073) 1px, transparent 1px)
        `,
        backgroundSize: `
          cover,
          ${hovered ? "10px 10px" : "15px 15px"},
          ${hovered ? "10px 10px" : "15px 15px"}
        `,
        backgroundPosition: "center center, center center, center center",
        borderImage: "radial-gradient(circle, rgb(46,213,115) 0%, rgba(0,0,0,0) 100%) 1",
        borderWidth: "1px 0 1px 0",
        borderStyle: "solid",
        color: "rgb(46,213,115)",
        padding: "1rem 3rem",
        fontWeight: 700,
        fontSize: "1.5rem",
        transition: "background-size 0.2s ease-in-out",
        filter: active ? "hue-rotate(250deg)" : "hue-rotate(0deg)",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {label}
    </button>
  );
};

export default GradientStartButton;
