"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import PricingModal from "./PricingModal";
import BuyCreditsModal from "./BuyCreditsModal";

const SIDEBAR_WIDTH = 258;
const RAIL_WIDTH = 52;

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

const SparkleIcon = () => (
  <svg width="17" height="17" viewBox="0 0 15 15" fill="none">
    <path d="M7.5 1v13M1 7.5h13M4 4l7 7M11 4L4 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
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

const PersonIcon = () => (
  <svg width="17" height="17" viewBox="0 0 15 15" fill="none">
    <circle cx="7.5" cy="5" r="3" stroke="currentColor" strokeWidth="1.4" />
    <path d="M2 13.5c0-2.8 2.5-5 5.5-5s5.5 2.2 5.5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const CrownIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M1.5 10.5L3 5l4 3 2.5-5.5 2.5 5.5 2.5-3 1.5 5.5H1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    <path d="M1.5 12.5h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

const CoinsIcon = () => (
  <svg width="17" height="17" viewBox="0 0 15 15" fill="none">
    <circle cx="6" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.4" />
    <circle cx="9.5" cy="8" r="4" stroke="currentColor" strokeWidth="1.3" fill="rgba(11,11,14,0.97)" />
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
  return (
    <button
      title={title}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
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
  );
}

// ── Full sidebar nav item ──────────────────────────────────────────────────────

function SidebarNavItem({
  icon,
  label,
  badge,
  indent,
  muted,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  badge?: string;
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
          background: "rgba(124,92,252,0.25)", color: "rgba(124,92,252,0.95)",
          letterSpacing: 0.2, flexShrink: 0,
        }}>
          {badge}
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

// ── Main component ─────────────────────────────────────────────────────────────

export default function DashboardSidebar() {
  const [open, setOpen] = useState(true);
  const [projectsExpanded, setProjectsExpanded] = useState(true);
  const [showPricing, setShowPricing] = useState(false);
  const [showBuyCredits, setShowBuyCredits] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const displayName = session?.user?.name ?? session?.user?.email?.split("@")[0] ?? "User";
  const displayEmail = session?.user?.email ?? "";
  const avatarLetter = displayName.charAt(0).toUpperCase();

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
              background: "linear-gradient(135deg, #7c5cfc 0%, #4878ff 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 15, fontWeight: 800, color: "white",
              boxShadow: "0 2px 8px rgba(124,92,252,0.4)",
              cursor: "pointer",
            }}
              onClick={() => setOpen(true)}
              title="Open sidebar"
            >
              e
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

            <RailIcon icon={<SparkleIcon />} title="AI Builder" onClick={() => router.push("/builder")} />

            <div style={{ width: 28, height: 1, background: "rgba(255,255,255,0.06)", margin: "4px 0" }} />

            <RailIcon icon={<ClockIcon />} title="Recent" onClick={() => {}} />
            <RailIcon icon={<FolderIcon />} title="All projects" onClick={() => router.push("/dashboard")} />
            <RailIcon icon={<StarIcon />} title="Starred" onClick={() => {}} />
            <RailIcon icon={<UsersIcon />} title="Shared with me" onClick={() => {}} />

            <div style={{ width: 28, height: 1, background: "rgba(255,255,255,0.06)", margin: "4px 0" }} />

            <RailIcon icon={<TemplateIcon />} title="Templates" onClick={() => router.push("/new-project")} />
            <RailIcon icon={<ExploreIcon />} title="Explore" onClick={() => router.push("/library")} />
            <RailIcon icon={<BookIcon />} title="Docs" onClick={() => {}} />
            <RailIcon icon={<PersonIcon />} title="Account" onClick={() => {}} />
          </div>

          {/* Bottom icons */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, paddingBottom: 6, borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 8 }}>
            {/* Upgrade ring */}
            <div
              title="Upgrade to Pro"
              style={{
                width: 36, height: 36, borderRadius: 999,
                border: "2px solid rgba(124,92,252,0.6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", marginBottom: 2,
              }}
            >
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(124,92,252,0.5)" }} />
            </div>

            {/* Pro button */}
            <button
              title="Upgrade to Pro"
              onClick={() => setShowPricing(true)}
              style={{
                width: 36, height: 36, borderRadius: 10,
                background: "linear-gradient(135deg, #7c5cfc 0%, #4878ff 100%)",
                border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 12px rgba(124,92,252,0.35)",
                color: "white", marginBottom: 2,
              }}
            >
              <CrownIcon />
            </button>

            <RailIcon icon={<CoinsIcon />} title="Buy credits" onClick={() => setShowBuyCredits(true)} />
            <RailIcon icon={<GiftIcon />} title="Share Evermade" onClick={() => {}} />

            {/* Avatar */}
            <div
              title={displayName}
              style={{
                width: 32, height: 32, borderRadius: "50%",
                background: "linear-gradient(135deg, #7c5cfc 0%, #4878ff 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 700, color: "white",
                cursor: "pointer", marginTop: 2,
              }}
            >
              {avatarLetter}
            </div>

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
              background: "linear-gradient(135deg, #7c5cfc 0%, #4878ff 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 800, color: "white", flexShrink: 0,
              boxShadow: "0 2px 8px rgba(124,92,252,0.4)",
            }}>e</div>
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
          <SidebarSection label="Agents" />
          <SidebarNavItem icon={<SparkleIcon />} label="AI Builder" badge="New" onClick={() => router.push("/builder")} />

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
          <SidebarNavItem icon={<PersonIcon />} label="Account" onClick={() => {}} />

          <div style={{ height: 12 }} />
        </div>

        {/* Bottom — Credits + Upgrade */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "10px 14px", flexShrink: 0 }}>
          <div style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", fontWeight: 500 }}>Credits</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.85)" }}>5 left</span>
            </div>
            <div style={{ height: 3, borderRadius: 2, background: "rgba(255,255,255,0.08)" }}>
              <div style={{ width: "100%", height: "100%", borderRadius: 2, background: "linear-gradient(90deg, #7c5cfc 0%, #4878ff 100%)" }} />
            </div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.22)", marginTop: 4 }}>5/5 daily · resets in 5 hours</div>
          </div>

          <button
            onClick={() => setShowPricing(true)}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
              gap: 8, padding: "9px 12px", borderRadius: 10,
              background: "linear-gradient(135deg, rgba(124,92,252,0.9) 0%, rgba(72,120,255,0.85) 100%)",
              border: "none", cursor: "pointer", marginBottom: 4,
              boxShadow: "0 4px 16px rgba(124,92,252,0.3)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <CrownIcon />
              <span style={{ fontSize: 12.5, fontWeight: 700, color: "white", letterSpacing: -0.1 }}>Upgrade to Pro</span>
            </div>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>↗</span>
          </button>

          <SidebarNavItem icon={<CoinsIcon />} label="Buy credits" onClick={() => setShowBuyCredits(true)} />
          <SidebarNavItem icon={<GiftIcon />} label="Share Evermade" badge="+100" onClick={() => {}} />
        </div>

        {/* User row */}
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.05)", padding: "10px 14px",
          display: "flex", alignItems: "center", gap: 9, flexShrink: 0, cursor: "pointer",
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: "50%",
            background: "linear-gradient(135deg, #7c5cfc 0%, #4878ff 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 700, color: "white",
            boxShadow: "0 2px 8px rgba(124,92,252,0.35)", flexShrink: 0,
          }}>{avatarLetter}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.88)", letterSpacing: -0.1, lineHeight: 1.3 }}>{displayName}</div>
            <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.3)" }}>{displayEmail}</div>
          </div>
          <div style={{ position: "relative" }}>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.28)", display: "flex", padding: 4 }}>
              <MailIcon />
            </button>
            <span style={{
              position: "absolute", top: 2, right: 2,
              width: 7, height: 7, borderRadius: "50%",
              background: "#ff3b30", border: "1.5px solid rgba(10,10,13,0.97)",
            }} />
          </div>
        </div>
      </aside>
      {showPricing && <PricingModal onClose={() => setShowPricing(false)} />}
      {showBuyCredits && <BuyCreditsModal onClose={() => setShowBuyCredits(false)} />}
    </>
  );
}
