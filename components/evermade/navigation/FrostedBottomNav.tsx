"use client";

import React, { useState } from "react";

interface NavLink {
  icon: React.ReactNode;
  label: string;
  href?: string;
}

interface FrostedBottomNavProps {
  links?: NavLink[];
  activeIndex?: number;
  onLinkClick?: (index: number) => void;
  className?: string;
}

const defaultLinks: NavLink[] = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6" width={22} height={22}>
        <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
        <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
      </svg>
    ),
    label: "Home",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6" width={22} height={22}>
        <path d="M19.5 21a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h15ZM1.5 10.146V6a3 3 0 0 1 3-3h5.379a2.25 2.25 0 0 1 1.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 0 1 3 3v1.146A4.483 4.483 0 0 0 19.5 9h-15a4.483 4.483 0 0 0-3 1.146Z" />
      </svg>
    ),
    label: "Files",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6" width={22} height={22}>
        <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z" clipRule="evenodd" />
      </svg>
    ),
    label: "Plans",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6" width={22} height={22}>
        <path d="M17.004 10.407c.138.435-.216.842-.672.842h-3.465a.75.75 0 0 1-.65-.375l-1.732-3c-.229-.396-.053-.907.393-1.004a5.252 5.252 0 0 1 6.126 3.537Z" />
        <path d="M8.12 8.464c.307-.338.838-.235 1.066.16l1.732 3a.75.75 0 0 1 0 .75l-1.732 3c-.229.397-.76.5-1.067.161A5.23 5.23 0 0 1 6.75 12a5.23 5.23 0 0 1 1.37-3.536Z" />
        <path d="M10.878 17.13c-.447-.098-.623-.608-.394-1.004l1.733-3.002a.75.75 0 0 1 .65-.375h3.465c.457 0 .81.407.672.842a5.252 5.252 0 0 1-6.126 3.539Z" />
      </svg>
    ),
    label: "Settings",
  },
];

const FrostedBottomNav: React.FC<FrostedBottomNavProps> = ({
  links = defaultLinks,
  activeIndex: controlledActive,
  onLinkClick,
  className = "",
}) => {
  const [internalActive, setInternalActive] = useState(0);
  const activeIndex = controlledActive ?? internalActive;

  const handleClick = (i: number) => {
    setInternalActive(i);
    onLinkClick?.(i);
  };

  return (
    <nav
      className={className}
      style={{
        width: "fit-content",
        maxWidth: "520px",
        backdropFilter: "blur(12px) saturate(180%) contrast(200%)",
        WebkitBackdropFilter: "blur(12px) saturate(180%) contrast(200%)",
        background: "rgba(0, 122, 255, 0.4)",
        border: "1px solid rgba(255,255,255,0.2)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
        padding: "8px",
        borderRadius: "99rem",
        display: "flex",
        justifyContent: "center",
        gap: "8px",
        zIndex: 50,
        position: "relative",
      }}
    >
      {links.map((link, i) => (
        <a
          key={i}
          href={link.href ?? "#"}
          onClick={(e) => { e.preventDefault(); handleClick(i); }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            flex: "1 1 0",
            minWidth: 0,
            color: i === activeIndex ? "rgba(0,122,255,0.9)" : "rgba(255,255,255,0.9)",
            textDecoration: "none",
            padding: "10px 16px",
            borderRadius: "999rem",
            transition: "all 0.18s ease",
            background: i === activeIndex ? "rgba(237,237,237,0.6)" : "transparent",
          }}
        >
          {link.icon}
          <span style={{ fontSize: "0.8rem", fontWeight: 600, lineHeight: 1, marginTop: "4px" }}>
            {link.label}
          </span>
        </a>
      ))}
    </nav>
  );
};

export default FrostedBottomNav;
