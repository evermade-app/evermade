"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import PricingModal from "./PricingModal";
import BuyCreditsModal from "./BuyCreditsModal";
import ShareEvermadeModal from "./ShareEvermadeModal";
import CreditsModal from "./CreditsModal";

interface CreditInfo {
  creditsRemaining: number;
  monthlyCredits: number;
  creditsUsed: number;
  planName: string;
  isFounder: boolean;
  resetDate: string | null;
}

function timeUntilReset(): string {
  const now = new Date();
  const nextReset = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const diffH = Math.round((nextReset.getTime() - now.getTime()) / 36e5);
  if (diffH < 24) return `${diffH} hour${diffH !== 1 ? "s" : ""}`;
  const diffD = Math.ceil(diffH / 24);
  return `${diffD} day${diffD !== 1 ? "s" : ""}`;
}

const SIDEBAR_WIDTH = 258;
const RAIL_WIDTH = 52;

// ── Logo mark ─────────────────────────────────────────────────────────────────

function LogoMark({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path
        d="M6.5 2C4.8 2 4 3 4 4.5V7.2C4 8.2 3.4 8.8 2.2 9.5v1C3.4 11.2 4 11.8 4 12.8V15.5C4 17 4.8 18 6.5 18"
        stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />
      <path
        d="M13.5 2C15.2 2 16 3 16 4.5V7.2C16 8.2 16.6 8.8 17.8 9.5v1C16.6 11.2 16 11.8 16 12.8V15.5C16 17 15.2 18 13.5 18"
        stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

// ── Icons ──────────────────────────────────────────────────────────────────────

const HomeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
    <path d="M2 6.5L8 2l6 4.5V14a1 1 0 01-1 1H3a1 1 0 01-1-1V6.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M6 15v-5h4v5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SearchIcon = () => (
  <svg width="17" height="17" viewBox="0 0 15 15" fill="none">
    <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.4" />
    <path d="M10.5 10.5L13.5 13.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const ClockIcon = () => (
  <svg width="17" height="17" viewBox="0 0 15 15" fill="none">
    <circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" strokeWidth="1.4" />
    <path d="M7.5 4.5V7.5L9.5 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const FolderIcon = () => (
  <svg width="17" height="17" viewBox="0 0 15 15" fill="none">
    <path d="M1 4.5A1 1 0 012 3.5h4l1.5 2H13a1 1 0 011 1v6a1 1 0 01-1 1H2a1 1 0 01-1-1v-8z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
);

const StarIcon = () => (
  <svg width="17" height="17" viewBox="0 0 15 15" fill="none">
    <path d="M7.5 1.5l1.8 3.7 4 .6-2.9 2.8.7 4L7.5 10.3l-3.6 1.8.7-4L1.7 5.8l4-.6z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
);

const UsersIcon = () => (
  <svg width="17" height="17" viewBox="0 0 15 15" fill="none">
    <circle cx="5.5" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.4" />
    <path d="M1 13c0-2.5 2-4 4.5-4s4.5 1.5 4.5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M11 7.5c1.5 0 3 1 3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <circle cx="11.5" cy="5" r="2" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);


const TemplateIcon = () => (
  <svg width="17" height="17" viewBox="0 0 15 15" fill="none">
    <rect x="1" y="1" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.4" />
    <path d="M1 5.5h13" stroke="currentColor" strokeWidth="1.4" />
    <path d="M6 5.5V14" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

const ExploreIcon = () => (
  <svg width="17" height="17" viewBox="0 0 15 15" fill="none">
    <circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1.4" />
    <path d="M9.5 5.5L8 8 5 9.5l1.5-3 3-1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
  </svg>
);

const BookIcon = () => (
  <svg width="17" height="17" viewBox="0 0 15 15" fill="none">
    <path d="M2 2.5A1.5 1.5 0 013.5 1h8.5v11H3.5A1.5 1.5 0 012 10.5V2.5z" stroke="currentColor" strokeWidth="1.4" />
    <path d="M12 12v1.5A1.5 1.5 0 0110.5 15H3a1 1 0 01-1-1" stroke="currentColor" strokeWidth="1.4" />
    <path d="M5 4.5h5M5 7h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);


const CrownIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M1.5 10.5L3 5l4 3 2.5-5.5 2.5 5.5 2.5-3 1.5 5.5H1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    <path d="M1.5 12.5h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

const DatabaseIcon = () => (
  <svg width="17" height="17" viewBox="0 0 15 15" fill="none">
    <ellipse cx="7.5" cy="3.5" rx="5" ry="1.8" stroke="currentColor" strokeWidth="1.35" />
    <path d="M2.5 3.5V7c0 1 2.24 1.8 5 1.8S12.5 8 12.5 7V3.5" stroke="currentColor" strokeWidth="1.35" />
    <path d="M2.5 7v3.5c0 1 2.24 1.8 5 1.8s5-.8 5-1.8V7" stroke="currentColor" strokeWidth="1.35" />
  </svg>
);

const GiftIcon = () => (
  <svg width="17" height="17" viewBox="0 0 15 15" fill="none">
    <rect x="1" y="6" width="13" height="8" rx="1" stroke="currentColor" strokeWidth="1.4" />
    <path d="M7.5 6V14" stroke="currentColor" strokeWidth="1.4" />
    <rect x="1" y="4" width="13" height="2.5" rx="1" stroke="currentColor" strokeWidth="1.3" />
    <path d="M7.5 4c0-2-3-3-3-1s3 1 3 1zM7.5 4c0-2 3-3 3-1s-3 1-3 1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
  </svg>
);

const MailIcon = () => (
  <svg width="17" height="17" viewBox="0 0 15 15" fill="none">
    <rect x="1" y="3" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
    <path d="M1 4l6.5 4.5L14 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

const CollapseIcon = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="1" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1.3" />
    <rect x="1" y="1" width="5" height="14" rx="3" stroke="currentColor" strokeWidth="1.3" fill="rgba(255,255,255,0.07)" />
    <path d="M5 8h6M8.5 5.5L11 8l-2.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ExpandIcon = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="1" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1.3" />
    <rect x="1" y="1" width="5" height="14" rx="3" stroke="currentColor" strokeWidth="1.3" fill="rgba(255,255,255,0.07)" />
    <path d="M9 8H6M7.5 5.5L5 8l2.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronUpDownIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M4 5.5L7 3l3 2.5M4 8.5L7 11l3-2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const MonitorIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <rect x="1" y="2" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
    <path d="M5 13h5M7.5 11v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

const SunIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <circle cx="7.5" cy="7.5" r="2.5" stroke="currentColor" strokeWidth="1.3" />
    <path d="M7.5 1v1.5M7.5 12.5V14M14 7.5h-1.5M2.5 7.5H1M12 3L11 4M4 11l-1 1M12 12l-1-1M4 4L3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

const MoonIcon = () => (
  <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
    <path d="M12.5 9.5A6 6 0 015.5 2.5a6 6 0 100 10 6 6 0 007-3z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
  </svg>
);

const GearIcon = () => (
  <svg width="17" height="17" viewBox="0 0 15 15" fill="none">
    <circle cx="7.5" cy="7.5" r="2" stroke="currentColor" strokeWidth="1.35" />
    <path d="M7.5 1v1.5m0 9V13m-4.95-9.45L3.6 4.6M11.4 10.4l1.05 1.05M1 7.5h1.5m9 0H13M2.55 11.45L3.6 10.4M11.4 4.6l1.05-1.05" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
  </svg>
);

const ChatIcon = () => (
  <svg width="17" height="17" viewBox="0 0 15 15" fill="none">
    <path d="M1 2.5A1.5 1.5 0 012.5 1h10A1.5 1.5 0 0114 2.5v7A1.5 1.5 0 0112.5 11H8l-3 3v-3H2.5A1.5 1.5 0 011 9.5v-7z" stroke="currentColor" strokeWidth="1.35" strokeLinejoin="round" />
  </svg>
);

const DiscordIcon = () => (
  <svg width="17" height="17" viewBox="0 0 15 15" fill="none">
    <path d="M11 2.5s-1.5-.5-3.5-.5S4 2.5 4 2.5A9.5 9.5 0 002 8.5s1 1.5 3 2l.5-1a5 5 0 002 .5 5 5 0 002-.5l.5 1c2-.5 3-2 3-2A9.5 9.5 0 0011 2.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    <circle cx="5.5" cy="8" r="1" fill="currentColor" />
    <circle cx="9.5" cy="8" r="1" fill="currentColor" />
  </svg>
);

const HandshakeIcon = () => (
  <svg width="17" height="17" viewBox="0 0 15 15" fill="none">
    <path d="M1 5.5l3-2h3l2 2 1-1h2l2 2-4 4-2-2-1 1-2-1L1 5.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    <path d="M5.5 8.5l1 1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

const ExternalArrowIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <path d="M2.5 10.5L10 3M10 3H5M10 3v5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SignOutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 15 15" fill="none">
    <path d="M5.5 2H3a1 1 0 00-1 1v9a1 1 0 001 1h2.5" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
    <path d="M9.5 10l3-2.5L9.5 5M12.5 7.5h-7" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ── Rail icon button ───────────────────────────────────────────────────────────

function RailIcon({
  icon,
  active,
  onClick,
  title,
  pill,
}: {
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  title?: string;
  pill?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const [tipPos, setTipPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleMouseEnter = () => {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setTipPos({ top: r.top + r.height / 2, left: r.right + 10 });
    }
    setHovered(true);
  };

  return (
    <>
      <button
        ref={btnRef}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: 36,
          height: 36,
          borderRadius: pill ? 999 : 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: active
            ? "rgba(255,255,255,0.12)"
            : hovered
            ? "rgba(255,255,255,0.07)"
            : "transparent",
          border: "none",
          cursor: "pointer",
          color: active ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.45)",
          transition: "background 0.12s ease, color 0.12s ease",
          flexShrink: 0,
        }}
      >
        {icon}
      </button>

      {/* Tooltip rendered in portal to escape overflow:hidden containers */}
      {title && hovered && typeof document !== "undefined" && createPortal(
        <div style={{
          position: "fixed",
          top: tipPos.top,
          left: tipPos.left,
          transform: "translateY(-50%)",
          pointerEvents: "none",
          zIndex: 9999,
          animation: "railTip 0.14s cubic-bezier(0.22,1,0.36,1) both",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
        }}>
          <style>{`@keyframes railTip{from{opacity:0;transform:translateY(-50%) translateX(-4px)}to{opacity:1;transform:translateY(-50%) translateX(0)}}`}</style>
          <div style={{
            background: "rgba(14,14,22,0.97)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 9,
            padding: "6px 12px",
            fontSize: 12.5,
            fontWeight: 500,
            color: "rgba(255,255,255,0.82)",
            whiteSpace: "nowrap",
            letterSpacing: -0.1,
            boxShadow: "0 4px 20px rgba(0,0,0,0.6)",
          }}>
            {title}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

// ── Full sidebar nav item ──────────────────────────────────────────────────────

function SidebarNavItem({
  icon,
  label,
  badge,
  badgeGreen,
  indent,
  muted,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  badge?: string;
  badgeGreen?: string;
  indent?: boolean;
  muted?: boolean;
  onClick?: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: indent ? "5px 14px 5px 28px" : "5px 14px",
        borderRadius: 7,
        background: hovered ? "rgba(255,255,255,0.055)" : "transparent",
        border: "none",
        cursor: "pointer",
        transition: "background 0.12s ease",
        textAlign: "left",
      }}
    >
      <span style={{ color: muted ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.55)", flexShrink: 0, display: "flex", alignItems: "center" }}>
        {icon}
      </span>
      <span style={{ fontSize: 13, color: muted ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.78)", fontWeight: 450, flex: 1, letterSpacing: -0.1 }}>
        {label}
      </span>
      {badge && (
        <span style={{
          fontSize: 10, fontWeight: 700, padding: "1.5px 6px", borderRadius: 99,
          background: "rgba(204,255,0,0.12)", color: "#CCFF00",
          letterSpacing: 0.2, flexShrink: 0,
        }}>
          {badge}
        </span>
      )}
      {badgeGreen && (
        <span style={{ fontSize: 12.5, fontWeight: 700, color: "#3ecf6a", flexShrink: 0, letterSpacing: -0.1 }}>
          {badgeGreen}
        </span>
      )}
    </button>
  );
}

function SidebarSection({ label }: { label: string }) {
  return (
    <div style={{
      fontSize: 10.5, fontWeight: 600, color: "rgba(255,255,255,0.25)",
      letterSpacing: 0.5, textTransform: "uppercase", padding: "8px 14px 3px",
    }}>
      {label}
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: "rgba(255,255,255,0.05)", margin: "6px 14px" }} />;
}

function MenuRow({ icon, label, external, red, onClick }: {
  icon: React.ReactNode;
  label: string;
  external?: boolean;
  red?: boolean;
  onClick?: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%", display: "flex", alignItems: "center", gap: 10,
        padding: "8px 10px", borderRadius: 9, background: hovered ? "rgba(255,255,255,0.055)" : "transparent",
        border: "none", cursor: "pointer", textAlign: "left", transition: "background 0.1s ease",
      }}
    >
      <span style={{ color: red ? "rgba(255,80,65,0.75)" : "rgba(255,255,255,0.42)", display: "flex", alignItems: "center", flexShrink: 0 }}>
        {icon}
      </span>
      <span style={{ fontSize: 13, fontWeight: 450, color: red ? "#ff5041" : "rgba(255,255,255,0.82)", flex: 1, letterSpacing: -0.1 }}>
        {label}
      </span>
      {external && (
        <span style={{ color: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", flexShrink: 0 }}>
          <ExternalArrowIcon />
        </span>
      )}
    </button>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function DashboardSidebar() {
  const [open, setOpen] = useState(true);
  const [projectsExpanded, setProjectsExpanded] = useState(true);
  const [showPricing, setShowPricing] = useState(false);
  const [showBuyCredits, setShowBuyCredits] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  const [credits, setCredits] = useState<CreditInfo | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userRowHovered, setUserRowHovered] = useState(false);
  const [theme, setTheme] = useState<"system" | "light" | "dark">("dark");
  const [menuPos, setMenuPos] = useState({ bottom: 0, left: 0, width: 0 });
  const userRowRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const router = useRouter();

  const fullName = session?.user?.name ?? "";
  const firstName = fullName.split(" ")[0] || session?.user?.email?.split("@")[0] || "User";
  const avatarLetter = firstName.charAt(0).toUpperCase();
  const avatarImage = session?.user?.image ?? null;
  const userEmail = session?.user?.email ?? "";

  useEffect(() => {
    fetch("/api/credits")
      .then((r) => r.json())
      .then((data) => {
        if (data?.credits) setCredits(data.credits as CreditInfo);
      })
      .catch(() => {});
  }, []);

  // Close menu on outside click
  useEffect(() => {
    if (!showUserMenu) return;
    function onDown(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [showUserMenu]);

  function openUserMenu() {
    if (userRowRef.current) {
      const r = userRowRef.current.getBoundingClientRect();
      setMenuPos({ bottom: window.innerHeight - r.top + 8, left: r.left, width: r.width });
    }
    setShowUserMenu((v) => !v);
  }

  async function handleSignOut() {
    setShowUserMenu(false);
    await signOut({ callbackUrl: "/login" });
  }

  return (
    <>
      {/* ── Collapsed icon rail ── */}
      {!open && (
        <aside
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            height: "100vh",
            width: RAIL_WIDTH,
            background: "rgba(10, 10, 13, 0.97)",
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
            borderRight: "1px solid rgba(255,255,255,0.07)",
            zIndex: 40,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
          }}
        >
          {/* Workspace logo */}
          <div style={{ paddingTop: 10, paddingBottom: 8, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 9,
              background: "#CCFF00",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 2px 8px rgba(204,255,0,0.35)",
              cursor: "pointer",
            }}
              onClick={() => setOpen(true)}
              title="Open sidebar"
            >
              <LogoMark size={20} />
            </div>
          </div>

          {/* Expand toggle */}
          <div style={{ marginBottom: 8 }}>
            <RailIcon icon={<ExpandIcon />} onClick={() => setOpen(true)} title="Expand sidebar" />
          </div>

          <div style={{ width: 28, height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 6 }} />

          {/* Nav icons */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, flex: 1, overflowY: "auto", scrollbarWidth: "none", paddingBottom: 8 }}>
            <RailIcon icon={<HomeIcon />} active title="Home" onClick={() => router.push("/dashboard")} />
            <RailIcon icon={<SearchIcon />} title="Search" onClick={() => {}} />

            <div style={{ width: 28, height: 1, background: "rgba(255,255,255,0.06)", margin: "4px 0" }} />

            <RailIcon icon={<ClockIcon />} title="Recent" onClick={() => {}} />
            <RailIcon icon={<FolderIcon />} title="All projects" onClick={() => router.push("/dashboard")} />
            <RailIcon icon={<StarIcon />} title="Starred" onClick={() => {}} />
            <RailIcon icon={<UsersIcon />} title="Shared with me" onClick={() => {}} />

            <div style={{ width: 28, height: 1, background: "rgba(255,255,255,0.06)", margin: "4px 0" }} />

            <RailIcon icon={<TemplateIcon />} title="Templates" onClick={() => router.push("/new-project")} />
            <RailIcon icon={<ExploreIcon />} title="Explore" onClick={() => router.push("/library")} />
            <RailIcon icon={<BookIcon />} title="Docs" onClick={() => {}} />
            <RailIcon icon={<DiscordIcon />} title="Community" onClick={() => {}} />
          </div>

          {/* Bottom icons */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, paddingBottom: 6, borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 8 }}>
            {/* Upgrade ring */}
            <div
              title="Upgrade to Pro"
              style={{
                width: 36, height: 36, borderRadius: 999,
                border: "2px solid rgba(204,255,0,0.6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", marginBottom: 2,
              }}
            >
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(204,255,0,0.5)" }} />
            </div>

            {/* Pro button */}
            <button
              title="Upgrade to Pro"
              onClick={() => setShowPricing(true)}
              style={{
                width: 36, height: 36, borderRadius: 10,
                background: "#CCFF00",
                border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 12px rgba(204,255,0,0.3)",
                color: "#000", marginBottom: 2,
              }}
            >
              <CrownIcon />
            </button>

            <RailIcon icon={<DatabaseIcon />} title="Buy credits" onClick={() => setShowBuyCredits(true)} />
            <RailIcon icon={<GiftIcon />} title="Share Evermade" onClick={() => setShowShare(true)} />

            {/* Avatar */}
            {avatarImage ? (
              <img
                src={avatarImage}
                alt={firstName}
                referrerPolicy="no-referrer"
                title={firstName}
                style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", cursor: "pointer", marginTop: 2 }}
              />
            ) : (
              <div
                title={firstName}
                style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: "#CCFF00",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 700, color: "#000",
                  cursor: "pointer", marginTop: 2,
                }}
              >
                {avatarLetter}
              </div>
            )}

            {/* Notification dot */}
            <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2 }}>
              <RailIcon icon={<MailIcon />} title="Messages" onClick={() => {}} />
              <span style={{
                position: "absolute", top: 4, right: 4,
                width: 7, height: 7, borderRadius: "50%",
                background: "#ff3b30", border: "1.5px solid rgba(10,10,13,0.97)",
              }} />
            </div>
          </div>
        </aside>
      )}

      {/* ── Full expanded sidebar ── */}
      <aside
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: SIDEBAR_WIDTH,
          background: "rgba(10, 10, 13, 0.97)",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          borderRight: "1px solid rgba(255,255,255,0.07)",
          zIndex: 41,
          display: "flex",
          flexDirection: "column",
          transform: open ? "translateX(0)" : `translateX(-${SIDEBAR_WIDTH}px)`,
          transition: "transform 0.22s cubic-bezier(0.4, 0, 0.2, 1)",
          overflowY: "auto",
          overflowX: "hidden",
          scrollbarWidth: "none",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
          pointerEvents: open ? "auto" : "none",
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 12px 12px 14px",
          borderBottom: "1px solid rgba(255,255,255,0.05)", flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 26, height: 26, borderRadius: 7,
              background: "#CCFF00",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 2px 8px rgba(204,255,0,0.35)",
            }}>
              <LogoMark size={16} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 650, color: "rgba(255,255,255,0.9)", letterSpacing: -0.2 }}>evermade</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 0.5 }}>Workspace</div>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            title="Collapse sidebar"
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "rgba(255,255,255,0.35)", padding: 4, borderRadius: 6,
              display: "flex", alignItems: "center", transition: "color 0.12s",
            }}
          >
            <CollapseIcon />
          </button>
        </div>

        {/* Scrollable nav */}
        <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", scrollbarWidth: "none", padding: "8px 4px" }}>
          <SidebarNavItem icon={<HomeIcon />} label="Home" onClick={() => router.push("/dashboard")} />
          <SidebarNavItem icon={<SearchIcon />} label="Search" badge="⌘K" onClick={() => {}} />

          <Divider />
          <SidebarSection label="Projects" />

          <button
            onClick={() => setProjectsExpanded((v) => !v)}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: 8,
              padding: "5px 14px", borderRadius: 7, background: "transparent",
              border: "none", cursor: "pointer", textAlign: "left",
            }}
          >
            <span style={{ color: "rgba(255,255,255,0.55)", display: "flex", alignItems: "center" }}><ClockIcon /></span>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.78)", fontWeight: 450, flex: 1, letterSpacing: -0.1 }}>Recent</span>
            <span style={{
              color: "rgba(255,255,255,0.3)",
              transform: projectsExpanded ? "rotate(0)" : "rotate(-90deg)",
              transition: "transform 0.18s ease", display: "flex", alignItems: "center",
            }}>
              <ChevronDownIcon />
            </span>
          </button>

          {projectsExpanded && (
            <SidebarNavItem icon={<span />} label="View all" indent muted onClick={() => router.push("/dashboard")} />
          )}

          <SidebarNavItem icon={<FolderIcon />} label="All projects" onClick={() => router.push("/dashboard")} />
          <SidebarNavItem icon={<StarIcon />} label="Starred" onClick={() => {}} />
          <SidebarNavItem icon={<UsersIcon />} label="Shared with me" onClick={() => {}} />

          <Divider />
          <SidebarSection label="Resources" />
          <SidebarNavItem icon={<TemplateIcon />} label="Templates" onClick={() => router.push("/new-project")} />
          <SidebarNavItem icon={<ExploreIcon />} label="Explore" onClick={() => router.push("/library")} />
          <SidebarNavItem icon={<BookIcon />} label="Docs" onClick={() => {}} />
          <SidebarNavItem icon={<DiscordIcon />} label="Community" onClick={() => {}} />

          <div style={{ height: 12 }} />
        </div>

        {/* Bottom — Credits + Upgrade */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "12px 14px 6px", flexShrink: 0 }}>
          {/* Credits row */}
          <button
            onClick={() => setShowCredits(true)}
            style={{ width: "100%", marginBottom: 12, background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left" }}
          >
            {/* Label + remaining */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.75)", fontFamily: "inherit", letterSpacing: -0.1 }}>
                Credits
              </span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.92)", fontFamily: "inherit", letterSpacing: -0.2 }}>
                {credits
                  ? credits.isFounder ? "∞" : `${credits.creditsRemaining} left`
                  : "—"}
              </span>
            </div>
            {/* Progress bar */}
            <div style={{ height: 5, borderRadius: 3, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
              <div style={{
                height: "100%",
                borderRadius: 3,
                background: "#CCFF00",
                width: credits
                  ? credits.isFounder
                    ? "100%"
                    : `${Math.max(4, Math.round((credits.creditsUsed / credits.monthlyCredits) * 100))}%`
                  : "0%",
                transition: "width 0.4s ease",
              }} />
            </div>
            {/* Subtitle */}
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 5, fontFamily: "inherit", letterSpacing: -0.1 }}>
              {credits
                ? credits.isFounder
                  ? "Unlimited · founder account"
                  : `${credits.creditsUsed}/${credits.monthlyCredits} monthly · resets in ${timeUntilReset()}`
                : "Loading..."}
            </div>
          </button>

          {/* Upgrade to Pro / Plan label */}
          {(() => {
            const planName = credits?.planName ?? "";
            const isFree = !credits || (!credits.isFounder && (planName.toLowerCase() === "free" || planName === ""));
            const label = credits?.isFounder
              ? "EverMax Plan"
              : planName.toLowerCase().includes("max")
              ? "EverMax Plan"
              : planName.toLowerCase().includes("pro")
              ? "EverPro Plan"
              : "Upgrade to Pro";
            return (
              <button
                onClick={() => setShowPricing(true)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                  gap: 8, padding: "11px 14px", borderRadius: 12,
                  background: isFree ? "#CCFF00" : "rgba(204,255,0,0.12)",
                  border: isFree ? "none" : "1px solid rgba(204,255,0,0.3)",
                  cursor: "pointer", marginBottom: 2,
                  boxShadow: isFree ? "0 4px 20px rgba(204,255,0,0.3)" : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <span style={{ color: isFree ? "#000" : "#CCFF00", display: "flex", alignItems: "center" }}><CrownIcon /></span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: isFree ? "#000" : "#CCFF00", letterSpacing: -0.2 }}>{label}</span>
                </div>
                <div style={{
                  width: 22, height: 22, borderRadius: "50%",
                  background: isFree ? "rgba(0,0,0,0.15)" : "rgba(204,255,0,0.12)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, color: isFree ? "#000" : "#CCFF00", fontWeight: 600, flexShrink: 0,
                }}>↗</div>
              </button>
            );
          })()}

          <SidebarNavItem icon={<DatabaseIcon />} label="Buy credits" onClick={() => setShowBuyCredits(true)} />
          <SidebarNavItem icon={<GiftIcon />} label="Share Evermade" badgeGreen="+100" onClick={() => setShowShare(true)} />
        </div>

        {/* User row — click opens profile menu */}
        <div
          ref={userRowRef}
          onClick={openUserMenu}
          onMouseEnter={() => setUserRowHovered(true)}
          onMouseLeave={() => setUserRowHovered(false)}
          style={{
            borderTop: "1px solid rgba(255,255,255,0.05)", padding: "10px 14px",
            display: "flex", alignItems: "center", gap: 9, flexShrink: 0,
            cursor: "pointer",
            background: userRowHovered ? "rgba(255,255,255,0.045)" : "transparent",
            transition: "background 0.12s ease",
          }}
        >
          {avatarImage ? (
            <img src={avatarImage} alt={firstName} referrerPolicy="no-referrer"
              style={{ width: 30, height: 30, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
          ) : (
            <div style={{
              width: 30, height: 30, borderRadius: "50%",
              background: "#CCFF00",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 700, color: "#000", flexShrink: 0,
            }}>{avatarLetter}</div>
          )}
          <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.88)", letterSpacing: -0.1, flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {firstName}
          </span>
          <span style={{ color: "rgba(255,255,255,0.3)", display: "flex", flexShrink: 0 }}><ChevronUpDownIcon /></span>
          <div style={{ position: "relative", flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.35)", display: "flex", padding: 4, borderRadius: 6 }}>
              <MailIcon />
            </button>
            <span style={{ position: "absolute", top: 3, right: 3, width: 7, height: 7, borderRadius: "50%", background: "#ff3b30", border: "1.5px solid rgba(10,10,13,0.97)", pointerEvents: "none" }} />
          </div>
        </div>
      </aside>
      {/* ── User profile popup ── */}
      {showUserMenu && typeof document !== "undefined" && createPortal(
        <div
          ref={userMenuRef}
          style={{
            position: "fixed",
            bottom: menuPos.bottom,
            left: menuPos.left,
            width: menuPos.width,
            background: "rgba(13,13,18,0.98)",
            backdropFilter: "blur(32px)",
            WebkitBackdropFilter: "blur(32px)",
            border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: 16,
            boxShadow: "0 -4px 48px rgba(0,0,0,0.7), 0 1px 0 rgba(255,255,255,0.04) inset",
            zIndex: 9999,
            overflow: "hidden",
            animation: "userMenuSlide 0.18s cubic-bezier(0.22,1,0.36,1) both",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
          }}
        >
          <style>{`@keyframes userMenuSlide{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>

          {/* Header */}
          <div style={{ padding: "16px 16px 14px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            {avatarImage ? (
              <img src={avatarImage} alt={fullName} referrerPolicy="no-referrer"
                style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
            ) : (
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#CCFF00", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: "#000", flexShrink: 0 }}>
                {avatarLetter}
              </div>
            )}
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 650, color: "rgba(255,255,255,0.95)", letterSpacing: -0.2, lineHeight: 1.25 }}>{fullName || firstName}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.38)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{userEmail}</div>
            </div>
          </div>

          {/* Theme switcher */}
          <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", fontWeight: 500 }}>Theme</span>
            <div style={{ display: "flex", gap: 2, background: "rgba(255,255,255,0.06)", borderRadius: 10, padding: 3 }}>
              {([
                { id: "system", icon: <MonitorIcon /> },
                { id: "light",  icon: <SunIcon />     },
                { id: "dark",   icon: <MoonIcon />    },
              ] as const).map(({ id, icon }) => (
                <button
                  key={id}
                  onClick={() => setTheme(id)}
                  style={{
                    width: 34, height: 30, borderRadius: 8, border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: theme === id ? "rgba(255,255,255,0.13)" : "transparent",
                    color: theme === id ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.35)",
                    transition: "all 0.12s ease",
                    boxShadow: theme === id ? "0 1px 3px rgba(0,0,0,0.4)" : "none",
                  }}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Menu items */}
          <div style={{ padding: "6px 8px" }}>
            {[
              { icon: <GearIcon />,       label: "Settings",             external: false, onClick: () => setShowUserMenu(false) },
              { icon: <ChatIcon />,       label: "Help & Support",        external: false, onClick: () => setShowUserMenu(false) },
              { icon: <DiscordIcon />,    label: "Community",             external: true,  onClick: () => setShowUserMenu(false) },
              { icon: <BookIcon />,       label: "Docs",                  external: true,  onClick: () => setShowUserMenu(false) },
              { icon: <HandshakeIcon />, label: "Become an affiliate",   external: true,  onClick: () => setShowUserMenu(false) },
            ].map(({ icon, label, external, onClick }) => (
              <MenuRow key={label} icon={icon} label={label} external={external} onClick={onClick} />
            ))}
          </div>

          {/* Sign out */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "6px 8px 8px" }}>
            <MenuRow icon={<SignOutIcon />} label="Sign out" red onClick={handleSignOut} />
          </div>
        </div>,
        document.body,
      )}

      {showPricing && <PricingModal onClose={() => setShowPricing(false)} />}
      {showBuyCredits && <BuyCreditsModal onClose={() => setShowBuyCredits(false)} />}
      {showShare && <ShareEvermadeModal onClose={() => setShowShare(false)} />}
      {showCredits && (
        <CreditsModal
          onClose={() => setShowCredits(false)}
          onBuyCredits={() => setShowBuyCredits(true)}
        />
      )}
    </>
  );
}
