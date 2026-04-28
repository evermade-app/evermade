"use client";

import React, { useState } from "react";

interface NavItem {
  icon: React.ReactNode;
  label?: string;
  onClick?: () => void;
}

interface FloatingIconNavProps {
  items?: NavItem[];
  className?: string;
}

const defaultItems: NavItem[] = [
  {
    icon: (
      <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
        <path d="M946.5 505L560.1 118.8l-25.9-25.9a31.5 31.5 0 0 0-44.4 0L77.5 505a63.9 63.9 0 0 0-18.8 46c.4 35.2 29.7 63.3 64.9 63.3h42.5V940h691.8V614.3h43.4c17.1 0 33.2-6.7 45.3-18.8a63.6 63.6 0 0 0 18.7-45.3c0-17-6.7-33.1-18.8-45.2z" />
      </svg>
    ),
  },
  {
    icon: (
      <svg stroke="currentColor" fill="none" strokeWidth={2} viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    icon: (
      <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2.5a5.5 5.5 0 0 1 3.096 10.047 9.005 9.005 0 0 1 5.9 8.181.75.75 0 1 1-1.499.044 7.5 7.5 0 0 0-14.993 0 .75.75 0 0 1-1.5-.045 9.005 9.005 0 0 1 5.9-8.18A5.5 5.5 0 0 1 12 2.5ZM8 8a4 4 0 1 0 8 0 4 4 0 0 0-8 0Z" />
      </svg>
    ),
  },
  {
    icon: (
      <svg stroke="currentColor" fill="none" strokeWidth={2} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
        <circle cx={9} cy={21} r={1} />
        <circle cx={20} cy={21} r={1} />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
    ),
  },
];

const FloatingIconNav: React.FC<FloatingIconNavProps> = ({
  items = defaultItems,
  className = "",
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div
      className={className}
      style={{
        display: "flex",
        backgroundColor: "black",
        width: "250px",
        height: "40px",
        alignItems: "center",
        justifyContent: "space-around",
        borderRadius: "10px",
      }}
    >
      {items.map((item, i) => (
        <button
          key={i}
          onClick={item.onClick}
          onMouseEnter={() => setHoveredIdx(i)}
          onMouseLeave={() => setHoveredIdx(null)}
          style={{
            outline: "none",
            border: "none",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            transition: "all ease-in-out 0.3s",
            cursor: "pointer",
            transform: hoveredIdx === i ? "translateY(-3px)" : "none",
            fontSize: "20px",
          }}
        >
          {item.icon}
        </button>
      ))}
    </div>
  );
};

export default FloatingIconNav;
