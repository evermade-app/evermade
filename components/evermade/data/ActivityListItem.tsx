"use client";

import React, { useState } from "react";

interface ActivityListItemProps {
  title?: string;
  timestamp?: string;
  message?: string;
  className?: string;
}

const ActivityListItem: React.FC<ActivityListItemProps> = ({
  title = "Clans of Clash",
  timestamp = "12 min ago",
  message = "Xhattmahs is not attacking your base!",
  className = "",
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={className}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%",
        maxWidth: "290px",
        height: "70px",
        background: "#353535",
        borderRadius: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        backdropFilter: "blur(10px)",
        transition: "0.5s ease-in-out",
        cursor: hovered ? "pointer" : "default",
        transform: hovered ? "scale(1.05)" : "scale(1)",
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: "50px",
          height: "50px",
          marginLeft: "10px",
          borderRadius: "10px",
          background: hovered
            ? "linear-gradient(#9198e5, #712020)"
            : "linear-gradient(#d7cfcf, #9198e5)",
          transition: "0.5s ease-in-out",
          flexShrink: 0,
        }}
      />
      {/* Text */}
      <div
        style={{
          width: "calc(100% - 90px)",
          marginLeft: "10px",
          color: "white",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ fontSize: "16px", fontWeight: "bold", margin: 0 }}>{title}</p>
          <span style={{ fontSize: "10px" }}>{timestamp}</span>
        </div>
        <p style={{ fontSize: "12px", fontWeight: "lighter", margin: 0 }}>{message}</p>
      </div>
    </div>
  );
};

export default ActivityListItem;
