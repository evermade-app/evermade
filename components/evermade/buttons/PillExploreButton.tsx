"use client";

import React, { useState } from "react";

interface PillExploreButtonProps {
  label?: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const PillExploreButton: React.FC<PillExploreButtonProps> = ({
  label = "Explore",
  onClick,
  disabled = false,
  className = "",
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={className}
      style={{
        padding: "15px 30px",
        border: `2px solid ${hovered ? "#666666" : "#2c2c2c"}`,
        backgroundColor: hovered ? "#292929" : "#1a1a1a",
        color: "#ffffff",
        fontSize: "1.2rem",
        cursor: disabled ? "not-allowed" : "pointer",
        borderRadius: "30px",
        transition: "all 0.4s ease",
        outline: "none",
        position: "relative",
        overflow: "hidden",
        fontWeight: "bold",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {label}
    </button>
  );
};

export default PillExploreButton;
