"use client";
import "../auth.css";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

// ── Icons ─────────────────────────────────────────────────────────────────────

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const GitHubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const AppleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09z" />
    <path d="M15.53 3.83c.893-1.09 1.479-2.58 1.309-4.081-1.27.052-2.82.863-3.74 1.93-.831.942-1.558 2.484-1.35 3.941 1.43.111 2.889-.724 3.781-1.79z" />
  </svg>
);

// ── Typing prompt card (right panel) ──────────────────────────────────────────

const PROMPTS = [
  "Build a B2B CRM to track sales pipelines, manage contacts, and automate email follow-ups",
  "Create a fitness tracking app with workout logs, progress charts, and AI coaching",
  "Design a project management dashboard with Kanban boards and team collaboration",
  "Build an e-commerce mobile app with product catalog, cart, and Stripe payments",
];

function TypingPromptCard() {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [char, setChar] = useState(0);

  useEffect(() => {
    const target = PROMPTS[idx];
    if (char < target.length) {
      const t = setTimeout(() => {
        setText(target.slice(0, char + 1));
        setChar((c) => c + 1);
      }, 32);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setIdx((i) => (i + 1) % PROMPTS.length);
      setChar(0);
      setText("");
    }, 2600);
    return () => clearTimeout(t);
  }, [char, idx]);

  return (
    <div style={{
      borderRadius: 12,
      border: "1px solid rgba(255,255,255,0.13)",
      background: "rgba(16,16,18,0.88)",
      backdropFilter: "blur(24px)",
      WebkitBackdropFilter: "blur(24px)",
      boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
      maxWidth: 500,
      width: "100%",
      overflow: "hidden",
      animation: "evermade-fade-in 0.5s ease both",
    }}>
      <div style={{ padding: "18px 18px 14px", minHeight: 110 }}>
        <p style={{ margin: 0, fontSize: 15, color: "rgba(255,255,255,0.88)", lineHeight: 1.65 }}>
          {text}
          <span style={{
            display: "inline-block",
            width: 2,
            height: "1em",
            background: "#4f8eff",
            marginLeft: 2,
            verticalAlign: "middle",
            animation: "blink-cursor 1s step-end infinite",
          }} />
        </p>
      </div>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 16px",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.025)",
      }}>
        <button style={{
          display: "flex", alignItems: "center", gap: 6,
          background: "none", border: "none", cursor: "pointer",
          color: "rgba(255,255,255,0.38)", fontSize: 12.5,
          padding: "4px 8px", borderRadius: 6, fontFamily: "inherit",
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
          Attach
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 4,
            padding: "3px 8px", borderRadius: 5,
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.04)",
            fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "monospace",
          }}>
            Return
            <span style={{
              border: "1px solid rgba(255,255,255,0.14)", borderRadius: 3,
              padding: "0 3px", fontSize: 10, background: "rgba(255,255,255,0.05)",
            }}>↵</span>
          </div>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "#4f8eff",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 10px rgba(79,142,255,0.45)",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Button helpers ─────────────────────────────────────────────────────────────

function AuthBtn({
  onClick,
  white,
  children,
}: {
  onClick?: () => void;
  white?: boolean;
  children: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%",
        height: 48,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        borderRadius: 8,
        border: white ? "none" : "1px solid rgba(255,255,255,0.1)",
        background: white
          ? hovered ? "#f0f0f0" : "#ffffff"
          : hovered ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.04)",
        color: white ? "#111111" : "rgba(255,255,255,0.88)",
        fontSize: 14,
        fontWeight: 500,
        cursor: "pointer",
        transition: "background 0.13s ease",
        fontFamily: "inherit",
      }}
    >
      {children}
    </button>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

function LoginPageInner() {
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/dashboard";
  const [email, setEmail] = useState("");

  const handleGoogle = async () => {
    await signIn("google", { callbackUrl: nextPath });
  };

  const handleDemo = () => {
    window.location.href = `/api/auth/login?next=${encodeURIComponent(nextPath)}`;
  };

  return (
    <div style={{
      minHeight: "100vh",
      width: "100%",
      display: "flex",
      background: "#050505",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Geist', 'SF Pro Text', sans-serif",
      color: "white",
    }}>

      {/* ── Left panel ── */}
      <div id="login-left" style={{
        flex: "0 0 50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 32px",
        minHeight: "100vh",
      }}>
        <div style={{ width: "100%", maxWidth: 396, animation: "evermade-fade-in 0.4s ease both" }}>

          {/* Brand */}
          <p style={{ textAlign: "center", fontSize: 22, fontWeight: 700, letterSpacing: -0.4, color: "white", margin: "0 0 28px" }}>
            Evermade
          </p>

          {/* Heading */}
          <h1 style={{ textAlign: "center", fontSize: 28, fontWeight: 700, letterSpacing: -0.6, color: "white", margin: "0 0 8px" }}>
            Sign in to your account
          </h1>
          <p style={{ textAlign: "center", fontSize: 13.5, color: "rgba(255,255,255,0.42)", margin: "0 0 32px" }}>
            Don&apos;t have an account?{" "}
            <Link
              href={`/login?next=${encodeURIComponent(nextPath)}`}
              style={{ color: "#4f8eff", textDecoration: "none", fontWeight: 500 }}
            >
              Sign up
            </Link>
          </p>

          {/* OAuth buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 22 }}>
            <AuthBtn white onClick={handleGoogle}>
              <GoogleIcon />
              Continue with Google
            </AuthBtn>
            <AuthBtn onClick={handleDemo}>
              <GitHubIcon />
              Continue with GitHub
            </AuthBtn>
            <AuthBtn onClick={handleDemo}>
              <AppleIcon />
              Continue with Apple
            </AuthBtn>
          </div>

          {/* Divider */}
          <div style={{ position: "relative", marginBottom: 22, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.28)", letterSpacing: 0.8, textTransform: "uppercase", whiteSpace: "nowrap" }}>
              Or continue with email
            </span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
          </div>

          {/* Email input */}
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              height: 48,
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.04)",
              color: "rgba(255,255,255,0.9)",
              fontSize: 14,
              padding: "0 14px",
              outline: "none",
              boxSizing: "border-box",
              fontFamily: "inherit",
              marginBottom: 10,
              display: "block",
            }}
          />

          {/* Email submit */}
          <AuthBtn onClick={handleDemo}>
            Continue with Email
          </AuthBtn>

          {/* Terms */}
          <p style={{ textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.28)", marginTop: 22, lineHeight: 1.65 }}>
            By clicking Sign In, you agree to our{" "}
            <a href="#" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "underline" }}>Terms of Service</a>
            {" "}and{" "}
            <a href="#" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "underline" }}>Privacy Policy</a>
          </p>
        </div>
      </div>

      {/* ── Right panel — video + prompt card ── */}
      <div id="login-right" style={{
        flex: "0 0 50%",
        position: "relative",
        background: "#0a0a0a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        minHeight: "100vh",
      }}>
        {/* Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.5,
          }}
        >
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4" type="video/mp4" />
        </video>

        {/* Gradient vignette */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.08) 60%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.06)",
          pointerEvents: "none",
        }} />

        {/* Prompt card */}
        <div style={{ position: "relative", zIndex: 10, display: "flex", justifyContent: "center", width: "100%", padding: "0 40px" }}>
          <TypingPromptCard />
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #login-right { display: none !important; }
          #login-left {
            flex: 1 1 100% !important;
            padding: 40px 24px 48px !important;
            min-height: 100svh !important;
          }
          #login-left > div {
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageInner />
    </Suspense>
  );
}
