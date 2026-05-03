"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://evermade.ai";

// ── Icons ─────────────────────────────────────────────────────────────────────

const CloseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const LightningIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M9 2L4.5 9h5L6 14l5.5-7H7L9 2z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const UserPlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="6.5" cy="5.5" r="2.8" stroke="currentColor" strokeWidth="1.4" />
    <path d="M1.5 13.5c0-2.8 2.2-4.5 5-4.5s5 1.7 5 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M12.5 4v4M14.5 6h-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const ChatIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M13 2H3a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h2l2 3 2-3h4a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
);

const CopyIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <rect x="4" y="4" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
    <path d="M2 11V2h9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const HeartIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
    <path d="M6 10.5S1 7.5 1 4a2.5 2.5 0 0 1 5-0c0 0 0 0 0 0a2.5 2.5 0 0 1 5 0c0 3.5-5 6.5-5 6.5z" />
  </svg>
);

// ── Social share buttons ───────────────────────────────────────────────────────

const SOCIALS = [
  {
    label: "X",
    bg: "#000",
    border: "rgba(255,255,255,0.15)",
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="white">
        <path d="M11.9 1.5h2.1L9.3 6.9l5.5 7.6h-4l-3.4-4.5-3.9 4.5H1.3l5.1-5.8L1 1.5h4.1l3.1 4.1L11.9 1.5zm-.7 12.3h1.2L3.9 2.7H2.6l8.6 11.1z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    bg: "#0a66c2",
    border: "rgba(10,102,194,0.5)",
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="white">
        <path d="M2.5 1.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm-1 3.5h2V13h-2V5zm3 0h1.9v1.1c.5-.8 1.4-1.3 2.4-1.3 2 0 2.7 1.2 2.7 3.2V13h-2V8.3c0-1.1-.3-1.8-1.3-1.8-.9 0-1.4.6-1.7 1.2V13h-2V5z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    bg: "#1877f2",
    border: "rgba(24,119,242,0.5)",
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="white">
        <path d="M8.5 2c-1.7 0-3 1.3-3 3v1.5H4V8.5h1.5V14h2.5V8.5H9.5L10 6.5H8V5c0-.6.2-1 1-1H10V2.1A12 12 0 0 0 8.5 2z" />
      </svg>
    ),
  },
  {
    label: "Reddit",
    bg: "#ff4500",
    border: "rgba(255,69,0,0.5)",
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="white">
        <circle cx="7.5" cy="7.5" r="6.5" fill="#ff4500" />
        <path d="M12 7.5a1 1 0 0 0-1.7-.7c-.8-.5-1.8-.8-2.9-.9l.5-2.3 1.6.3a.8.8 0 1 0 .8-.8c-.3 0-.6.2-.8.4l-1.8-.4c-.1 0-.2 0-.2.1l-.6 2.6c-1.1.1-2.1.4-2.9.9a1 1 0 1 0-1.1 1.5v.3c0 1.6 1.9 2.9 4.1 2.9s4.1-1.3 4.1-2.9v-.3c.2-.2.4-.5.4-.7zm-6.4 1.2a.8.8 0 1 1 1.6 0 .8.8 0 0 1-1.6 0zm4.3 2c-.5.5-1.3.7-2.4.7s-1.9-.2-2.4-.7a.2.2 0 0 1 .3-.3c.4.4 1.1.6 2.1.6s1.7-.2 2.1-.6a.2.2 0 1 1 .3.3zm-.1-1.2a.8.8 0 1 1 0-1.6.8.8 0 0 1 0 1.6z" fill="white" />
      </svg>
    ),
  },
  {
    label: "Discord",
    bg: "#5865f2",
    border: "rgba(88,101,242,0.5)",
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="white">
        <path d="M12.4 2.6A11.5 11.5 0 0 0 9.6 1.8a8 8 0 0 0-.4.8 10.7 10.7 0 0 0-3.4 0 8 8 0 0 0-.4-.8 11.5 11.5 0 0 0-2.8.8C.7 5.5.3 8.4.8 11.2a11.6 11.6 0 0 0 3.6 1.8 8.6 8.6 0 0 0 .7-1.2l-1.1-.5.3-.2 1 .5a10.7 10.7 0 0 0 4.4 0l1-.5.3.2-1.1.5a8.6 8.6 0 0 0 .7 1.2 11.6 11.6 0 0 0 3.6-1.8c.6-3.2-.1-6-1.8-8.6zm-8 6.9c-.7 0-1.3-.7-1.3-1.5S4.7 6.5 5.4 6.5s1.3.7 1.3 1.5-.6 1.5-1.3 1.5zm4.7 0c-.7 0-1.3-.7-1.3-1.5s.6-1.5 1.3-1.5 1.3.7 1.3 1.5-.6 1.5-1.3 1.5z" />
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    bg: "#25d366",
    border: "rgba(37,211,102,0.5)",
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="white">
        <path d="M7.5 1a6.5 6.5 0 0 0-5.6 9.8L1 14l3.3-.9A6.5 6.5 0 1 0 7.5 1zm3.5 9c-.2.5-1 1-1.4 1-.4.1-.8.1-2.5-.5-2-1-3.3-3-3.4-3.2-.1-.2-1-1.3-1-2.4 0-1.2.6-1.7.8-2 .2-.2.4-.2.5-.2h.4c.1 0 .3 0 .4.3L5.6 5c.1.3 0 .5-.1.6l-.4.4c-.1.2-.2.3-.1.5.2.3.8 1.2 1.6 1.9.7.7 1.5 1 1.8 1 .2.1.4 0 .5-.1l.5-.6c.1-.2.3-.2.5-.1L11 9c.3.2.3.4.3.6z" />
      </svg>
    ),
  },
  {
    label: "Email",
    bg: "rgba(255,255,255,0.08)",
    border: "rgba(255,255,255,0.12)",
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <rect x="1" y="3" width="13" height="9" rx="1.5" stroke="white" strokeWidth="1.3" />
        <path d="M1 4.5l6.5 4.5L14 4.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
];

function SocialBtn({ social, refUrl }: { social: typeof SOCIALS[number]; refUrl: string }) {
  const [hov, setHov] = useState(false);

  const getShareUrl = () => {
    const encoded = encodeURIComponent(refUrl);
    const text = encodeURIComponent("Check out Evermade — the AI app builder that turns ideas into real mobile apps ✨");
    switch (social.label) {
      case "X": return `https://twitter.com/intent/tweet?text=${text}&url=${encoded}`;
      case "LinkedIn": return `https://linkedin.com/sharing/share-offsite/?url=${encoded}`;
      case "Facebook": return `https://facebook.com/sharer/sharer.php?u=${encoded}`;
      case "Reddit": return `https://reddit.com/submit?url=${encoded}&title=${text}`;
      case "Discord": return refUrl;
      case "WhatsApp": return `https://wa.me/?text=${text}%20${encoded}`;
      case "Email": return `mailto:?subject=Try Evermade&body=${text}%20${encoded}`;
      default: return refUrl;
    }
  };

  return (
    <a
      href={getShareUrl()}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      title={social.label}
      style={{
        width: 46, height: 46, borderRadius: "50%",
        background: social.bg,
        border: `1.5px solid ${social.border}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", textDecoration: "none",
        transform: hov ? "scale(1.08) translateY(-2px)" : "scale(1)",
        transition: "transform 0.18s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.18s ease",
        boxShadow: hov ? `0 6px 20px ${social.border}` : "none",
        flexShrink: 0,
      }}
    >
      {social.icon}
    </a>
  );
}

// ── Step row ──────────────────────────────────────────────────────────────────

function Step({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{
        width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
        background: "rgba(79,142,255,0.1)",
        border: "1px solid rgba(79,142,255,0.22)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "rgba(120,175,255,0.85)",
      }}>
        {icon}
      </div>
      <div style={{ fontSize: 13.5, color: "rgba(255,255,255,0.75)", letterSpacing: -0.2, lineHeight: 1.4 }}>
        {children}
      </div>
    </div>
  );
}

// ── Main modal ────────────────────────────────────────────────────────────────

export default function ShareEvermadeModal({ onClose }: { onClose: () => void }) {
  const { data: session } = useSession();
  const [copied, setCopied] = useState(false);

  const userId = (session?.user as { id?: string })?.id ?? "demo";
  const refUrl = `${APP_URL}?ref=${userId.slice(0, 8)}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(refUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(0,0,0,0.78)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px 20px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Geist', sans-serif",
      }}
    >
      <style>{`
        @keyframes shareIn {
          from { opacity: 0; transform: scale(0.95) translateY(16px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 460,
          background: "#09090f",
          border: "1px solid rgba(255,255,255,0.09)",
          borderRadius: 22,
          overflow: "hidden",
          boxShadow: "0 40px 120px rgba(0,0,0,0.85)",
          animation: "shareIn 0.26s cubic-bezier(0.22,1,0.36,1) both",
          position: "relative",
        }}
      >
        {/* ── Banner image ── */}
        <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
          <img
            src="/share-banner.PNG"
            alt="Share Evermade"
            style={{
              width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "center 30%",
              display: "block",
            }}
          />
          {/* Gradient fade bottom */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(9,9,15,0.85) 100%)",
          }} />

          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: "absolute", top: 14, right: 14,
              width: 30, height: 30, borderRadius: 8,
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.7)", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <CloseIcon />
          </button>

          {/* Badge pill */}
          <div style={{
            position: "absolute", top: 16, left: 16,
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "5px 12px", borderRadius: 99,
            background: "rgba(20,10,30,0.75)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255,150,180,0.25)",
          }}>
            <span style={{ color: "#fb7185" }}><HeartIcon /></span>
            <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.88)", letterSpacing: -0.1 }}>
              Earn 100+ credits
            </span>
          </div>

          {/* Title over banner */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 22px 18px" }}>
            <h2 style={{
              margin: 0, fontSize: 26, fontWeight: 800,
              color: "rgba(255,255,255,0.95)", letterSpacing: -1,
              lineHeight: 1.15, textShadow: "0 2px 12px rgba(0,0,0,0.6)",
            }}>
              Spread the love
            </h2>
            <p style={{ margin: "3px 0 0", fontSize: 13.5, color: "rgba(255,255,255,0.5)", letterSpacing: -0.1 }}>
              and earn free credits
            </p>
          </div>
        </div>

        {/* ── Content ── */}
        <div style={{ padding: "22px 22px 20px" }}>

          {/* How it works */}
          <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: 0.4, textTransform: "uppercase", marginBottom: 14 }}>
            How it works
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 13, marginBottom: 22 }}>
            <Step icon={<LightningIcon />}>
              Share your invite link
            </Step>
            <Step icon={<UserPlusIcon />}>
              They sign up and get{" "}
              <strong style={{ color: "rgba(255,255,255,0.9)", fontWeight: 700 }}>extra 10 credits</strong>
            </Step>
            <Step icon={<ChatIcon />}>
              You get{" "}
              <strong style={{ color: "rgba(255,255,255,0.9)", fontWeight: 700 }}>100 credits</strong>
              {" "}once they subscribe to a paid plan
            </Step>
          </div>

          {/* Invite link row */}
          <div style={{
            display: "flex", alignItems: "center",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 14, overflow: "hidden",
            marginBottom: 18,
          }}>
            <div style={{
              flex: 1, padding: "12px 14px",
              fontSize: 12.5, color: "rgba(255,255,255,0.35)",
              fontFamily: "'SF Mono', 'Fira Code', monospace",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              letterSpacing: 0.2,
            }}>
              {refUrl}
            </div>
            <button
              onClick={handleCopy}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "10px 16px",
                margin: 4,
                borderRadius: 10,
                background: copied ? "rgba(52,211,153,0.12)" : "rgba(255,255,255,0.92)",
                border: "none", cursor: "pointer",
                fontSize: 13, fontWeight: 700,
                color: copied ? "#34d399" : "#09090f",
                fontFamily: "inherit", letterSpacing: -0.2,
                transition: "all 0.18s ease",
                whiteSpace: "nowrap", flexShrink: 0,
              }}
            >
              {copied ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7l3.5 3.5L12 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <CopyIcon />
                  Copy link
                </>
              )}
            </button>
          </div>

          {/* Or share via */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", letterSpacing: -0.1 }}>or share via</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
          </div>

          {/* Social icons */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 20 }}>
            {SOCIALS.map((s) => (
              <SocialBtn key={s.label} social={s} refUrl={refUrl} />
            ))}
          </div>

          {/* Footer */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.22)" }}>
              Used by <strong style={{ color: "rgba(255,255,255,0.45)" }}>0</strong> users
            </span>
            <button style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: 12, color: "rgba(255,255,255,0.28)",
              fontFamily: "inherit", padding: 0,
              textDecoration: "underline", textDecorationColor: "rgba(255,255,255,0.12)",
            }}>
              Terms
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
