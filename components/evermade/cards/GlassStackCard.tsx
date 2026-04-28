"use client";

import React from "react";

interface GlassStackItem {
  icon: React.ReactNode;
  label: string;
  rotation?: number;
}

interface GlassStackCardProps {
  items?: GlassStackItem[];
  className?: string;
}

const defaultItems: GlassStackItem[] = [
  {
    icon: (
      <svg viewBox="0 0 496 512" height="1em" xmlns="http://www.w3.org/2000/svg" fill="#fff">
        <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8z" />
      </svg>
    ),
    label: "Github",
    rotation: -15,
  },
  {
    icon: (
      <svg viewBox="0 0 640 512" height="1em" xmlns="http://www.w3.org/2000/svg" fill="#fff">
        <path d="M392.8 1.2c-17-4.9-34.7 5-39.6 22l-128 448c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l128-448c4.9-17-5-34.7-22-39.6zm80.6 120.1c-12.5 12.5-12.5 32.8 0 45.3L562.7 256l-89.4 89.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-112-112c-12.5-12.5-32.8-12.5-45.3 0zm-306.7 0c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l112 112c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256l89.4-89.4c12.5-12.5 12.5-32.8 0-45.3z" />
      </svg>
    ),
    label: "Code",
    rotation: 5,
  },
  {
    icon: (
      <svg viewBox="0 0 576 512" height="1em" xmlns="http://www.w3.org/2000/svg" fill="#fff">
        <path d="M64 64C28.7 64 0 92.7 0 128V384c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64H64zm64 320H64V320c35.3 0 64 28.7 64 64zM64 192V128h64c0 35.3-28.7 64-64 64zM448 384c0-35.3 28.7-64 64-64v64H448zm64-192c-35.3 0-64-28.7-64-64h64v64zM288 160a96 96 0 1 1 0 192 96 96 0 1 1 0-192z" />
      </svg>
    ),
    label: "Earn",
    rotation: 25,
  },
];

const GlassStackCard: React.FC<GlassStackCardProps> = ({
  items = defaultItems,
  className = "",
}) => {
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      className={className}
      style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            position: "relative",
            width: "180px",
            height: "200px",
            background: "linear-gradient(rgba(255,255,255,0.12), transparent)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 25px 25px rgba(0,0,0,0.25)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            transition: "0.5s",
            borderRadius: "10px",
            margin: hovered ? "0 10px" : "0 -45px",
            backdropFilter: "blur(10px)",
            transform: hovered ? "rotate(0deg)" : `rotate(${item.rotation ?? 0}deg)`,
          }}
        >
          {/* Icon */}
          <div style={{ fontSize: "2.5em", fill: "#fff" }}>{item.icon}</div>
          {/* Label */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              height: "40px",
              background: "rgba(255,255,255,0.05)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#fff",
            }}
          >
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GlassStackCard;
