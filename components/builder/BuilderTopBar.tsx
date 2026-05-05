"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEditor } from "@/lib/editor/EditorContext";
import QRCode from "qrcode";
import ProjectDashboard from "./ProjectDashboard";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

// ── Share modal ───────────────────────────────────────────────────────────────
function ShareModal({ previewUrl, onClose }: { previewUrl: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  useEffect(() => {
    QRCode.toDataURL(previewUrl, {
      width: 160,
      margin: 1,
      color: { dark: "#08080F", light: "#ffffff" },
      errorCorrectionLevel: "M",
    })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(null));
  }, [previewUrl]);

  const copy = async () => {
    await navigator.clipboard.writeText(previewUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1000, padding: 20,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#111118", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 24, padding: 28, width: "100%", maxWidth: 360,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 20,
        }}
      >
        <div style={{ fontSize: 17, fontWeight: 800, color: "#fff", letterSpacing: -0.3 }}>
          Share your app preview
        </div>

        {qrDataUrl ? (
          <div style={{ padding: 14, background: "#fff", borderRadius: 16, boxShadow: "0 8px 32px rgba(204,255,0,0.2)" }}>
            <img src={qrDataUrl} width={160} height={160} alt="QR code" style={{ display: "block", borderRadius: 6 }} />
          </div>
        ) : (
          <div style={{ width: 160, height: 160, background: "rgba(255,255,255,0.04)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Generating…</div>
          </div>
        )}

        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.38)", textAlign: "center", lineHeight: 1.55 }}>
          Anyone who scans this or opens the link<br />sees your app — no login required
        </div>

        <div style={{ display: "flex", gap: 8, width: "100%" }}>
          <div style={{
            flex: 1, padding: "10px 12px", borderRadius: 10,
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
            fontSize: 11, color: "rgba(255,255,255,0.38)",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {previewUrl}
          </div>
          <button
            onClick={copy}
            style={{
              padding: "10px 16px", borderRadius: 10, border: "none", cursor: "pointer",
              fontSize: 12, fontWeight: 700, transition: "all 0.18s",
              background: copied ? "rgba(52,211,153,0.15)" : "#CCFF00",
              color: copied ? "#34D399" : "#000",
            }}
          >
            {copied ? "✓" : "Copy"}
          </button>
        </div>

        <button
          onClick={onClose}
          style={{
            width: "100%", padding: "10px", borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.08)", background: "transparent",
            color: "rgba(255,255,255,0.38)", fontSize: 13, cursor: "pointer",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

const CENTER_ITEMS = [
  { id: "dashboard", icon: GridIcon,     title: "Dashboard", label: "Dashboard" },
  { id: "preview",   icon: EyeIcon,      title: "Preview",   label: "Preview", active: true },
  { id: "code",      icon: CodeIcon,     title: "Code" },
  { id: "database",  icon: DatabaseIcon, title: "Database" },
  { id: "cloud",     icon: CloudIcon,    title: "Deploy" },
];

export default function BuilderTopBar() {
  const [activeTab, setActiveTab] = useState("preview");
  const [showDashboard, setShowDashboard] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [sharing, setSharing] = useState(false);
  const [exporting, setExporting] = useState<"idle" | "generating" | "packaging">("idle");
  const [exportError, setExportError] = useState<{ message: string; upgradeUrl?: string } | null>(null);
  const router = useRouter();
  const { project } = useEditor();
  const { data: session } = useSession();

  const userPlan = (session?.user as { plan?: string } | undefined)?.plan ?? "free";
  const upgradeBtnLabel =
    userPlan === "owner" || userPlan === "evermax" ? "EverMax Plan" :
    userPlan === "everpro" ? "EverPro Plan" :
    "Upgrade";

  const handleExport = async () => {
    if (exporting !== "idle") return;
    setExporting("generating");
    setExportError(null);
    try {
      const genRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: `Build a ${project.name} mobile app`, appName: project.name }),
      });

      if (genRes.status === 403 || genRes.status === 401) {
        const data = await genRes.json() as { message?: string; upgradeUrl?: string; redirectUrl?: string };
        if (data.redirectUrl) { router.push(data.redirectUrl); return; }
        setExportError({ message: data.message ?? "Upgrade required", upgradeUrl: data.upgradeUrl });
        return;
      }
      if (!genRes.ok) throw new Error(await genRes.text());

      const { app } = await genRes.json() as { app: { id: string } };

      setExporting("packaging");
      const zipRes = await fetch(`/api/apps/${app.id}/export`);

      if (zipRes.status === 403) {
        const data = await zipRes.json() as { message?: string; upgradeUrl?: string };
        setExportError({ message: data.message ?? "Upgrade to export", upgradeUrl: data.upgradeUrl });
        return;
      }
      if (!zipRes.ok) throw new Error(await zipRes.text());

      const blob = await zipRes.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${project.name.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase()}-expo.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed:", err);
      setExportError({ message: "Export failed. Please try again." });
    } finally {
      setExporting("idle");
    }
  };

  const handleShare = useCallback(async () => {
    if (sharing) return;
    setSharing(true);
    try {
      const res = await fetch(`/api/preview/${project.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
      });
      if (res.ok) {
        setShareUrl(`${APP_URL}/preview/${project.id}`);
      }
    } catch {
      // silently fail — share button grays out
    } finally {
      setSharing(false);
    }
  }, [project, sharing]);

  return (
    <>
    <div style={{
      height: 52,
      display: "flex",
      alignItems: "center",
      padding: "0 14px",
      borderBottom: "1px solid rgba(255,255,255,0.07)",
      background: "rgba(6,6,22,0.97)",
      backdropFilter: "blur(60px)",
      WebkitBackdropFilter: "blur(60px)",
      boxShadow: "0 1px 0 rgba(255,255,255,0.04), 0 8px 32px rgba(0,0,0,0.5)",
      gap: 0,
      flexShrink: 0,
      zIndex: 30,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Geist', 'SF Pro Text', sans-serif",
    }}>

      {/* ── LEFT — brand + project name ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, flex: "0 0 auto", minWidth: 0 }}>
        <button
          onClick={() => router.push("/dashboard")}
          style={{
            border: "none", cursor: "pointer", padding: 0,
            fontSize: 17, fontWeight: 800, letterSpacing: -0.5,
            fontFamily: "inherit",
            background: "linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.75) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          } as React.CSSProperties}
        >
          Evermade
        </button>

        <div style={{ width: 1, height: 18, background: "rgba(255,255,255,0.12)" }} />

        {/* Project name pill */}
        <button style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "4px 10px",
          borderRadius: 8,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.09)",
          cursor: "pointer",
          fontFamily: "inherit",
        }}>
          <GlobeIcon />
          <span style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.82)", letterSpacing: -0.2, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {project.name}
          </span>
          <svg width="9" height="6" viewBox="0 0 9 6" fill="none">
            <path d="M1 1l3.5 3.5L8 1" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* ── CENTER — tabs ── */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 2 }}>
        {CENTER_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const handleClick = item.id === "dashboard"
            ? () => setShowDashboard(true)
            : () => setActiveTab(item.id);

          if (item.label) {
            return (
              <button
                key={item.id}
                onClick={handleClick}
                title={item.title}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "5px 14px",
                  borderRadius: 8,
                  background: isActive ? "rgba(0,0,0,0.5)" : "transparent",
                  color: isActive ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.38)",
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 400,
                  cursor: "pointer",
                  transition: "all 0.14s ease",
                  fontFamily: "inherit",
                  letterSpacing: -0.1,
                  border: isActive ? "1px solid rgba(204,255,0,0.5)" : "1px solid transparent",
                  boxShadow: isActive ? "0 0 12px rgba(204,255,0,0.12)" : "none",
                }}
              >
                <Icon active={isActive} />
                {item.label}
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={handleClick}
              title={item.title}
              style={{
                width: 32, height: 32,
                display: "flex", alignItems: "center", justifyContent: "center",
                borderRadius: 7,
                border: "none",
                background: isActive ? "rgba(0,0,0,0.5)" : "transparent",
                color: isActive ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.35)",
                cursor: "pointer",
                transition: "all 0.14s ease",
              }}
            >
              <Icon active={isActive} />
            </button>
          );
        })}
      </div>

      {/* ── RIGHT ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, flex: "0 0 auto" }}>

        <div style={{ display: "flex", alignItems: "center", marginRight: 2 }}>
          <Avatar label="Y" color="#CCFF00" textColor="#000" style={{ zIndex: 3 }} />
        </div>

        <TopIconBtn title="Fast mode" accent="#fbbf24">
          <svg width="12" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13 2 4.09 12.96A1 1 0 0 0 5 14.5h6.5L11 22l8.91-10.96A1 1 0 0 0 19 9.5H12.5L13 2z"/>
          </svg>
        </TopIconBtn>

        <div style={{ width: 1, height: 18, background: "rgba(255,255,255,0.1)", margin: "0 2px" }} />

        {/* Export */}
        <button
          onClick={handleExport}
          disabled={exporting !== "idle"}
          title="Export as Expo ZIP"
          style={{
            display: "flex", alignItems: "center", gap: 5,
            padding: "6px 13px",
            borderRadius: 9,
            border: "1px solid rgba(52,211,153,0.28)",
            background: exporting !== "idle" ? "rgba(52,211,153,0.05)" : "rgba(52,211,153,0.10)",
            color: exporting !== "idle" ? "rgba(52,211,153,0.4)" : "#34d399",
            fontSize: 12.5,
            fontWeight: 600,
            cursor: exporting !== "idle" ? "default" : "pointer",
            fontFamily: "inherit",
            letterSpacing: -0.1,
            transition: "all 0.14s ease",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          {exporting === "generating" ? "Generating…" : exporting === "packaging" ? "Packaging…" : "Export"}
        </button>

        {/* Share */}
        <button
          onClick={handleShare}
          disabled={sharing}
          style={{
            display: "flex", alignItems: "center", gap: 5,
            padding: "6px 13px",
            borderRadius: 9,
            border: "1px solid rgba(255,255,255,0.12)",
            background: sharing ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.06)",
            color: sharing ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.7)",
            fontSize: 12.5,
            fontWeight: 600,
            cursor: sharing ? "default" : "pointer",
            fontFamily: "inherit",
            letterSpacing: -0.1,
            transition: "all 0.14s ease",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
          {sharing ? "Sharing…" : "Share"}
        </button>

        {/* Upgrade */}
        <button style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "6px 14px",
          borderRadius: 9,
          border: "1px solid rgba(204,255,0,0.55)",
          background: "rgba(0,0,0,0.6)",
          color: "#CCFF00",
          fontSize: 12.5,
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: "inherit",
          letterSpacing: -0.1,
          boxShadow: "0 2px 12px rgba(204,255,0,0.12)",
          transition: "all 0.14s ease",
        }}>
          <svg width="13" height="11" viewBox="0 0 15 13" fill="currentColor">
            <path d="M1.5 10.5L3 5l4 3 2.5-5.5 2.5 5.5 2.5-3 1.5 5.5H1.5z"/>
          </svg>
          {upgradeBtnLabel}
        </button>

        {/* Publish */}
        <button style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "6px 14px",
          borderRadius: 9,
          border: "1px solid rgba(204,255,0,0.7)",
          background: "#CCFF00",
          color: "#000",
          fontSize: 12.5,
          fontWeight: 700,
          cursor: "pointer",
          fontFamily: "inherit",
          letterSpacing: -0.1,
          boxShadow: "0 2px 12px rgba(204,255,0,0.25)",
          transition: "all 0.14s ease",
        }}>
          <GlobeIconSm />
          Publish
        </button>

        <Avatar label="Y" color="#CCFF00" textColor="#000" size={30} />
      </div>
    </div>

    {shareUrl && (
      <ShareModal previewUrl={shareUrl!} onClose={() => setShareUrl(null)} />
    )}

    {showDashboard && (
      <ProjectDashboard onClose={() => setShowDashboard(false)} />
    )}

    {exportError && (
      <div style={{
        position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
        zIndex: 1000, display: "flex", alignItems: "center", gap: 12,
        padding: "12px 18px", borderRadius: 14,
        background: "rgba(20,10,10,0.97)", border: "1px solid rgba(239,68,68,0.3)",
        boxShadow: "0 8px 40px rgba(0,0,0,0.7)",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
        maxWidth: 420,
      }}>
        <span style={{ fontSize: 15 }}>🔒</span>
        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", flex: 1 }}>
          {exportError.message}
        </span>
        {exportError.upgradeUrl && (
          <a
            href={exportError.upgradeUrl}
            style={{
              padding: "6px 14px", borderRadius: 8, border: "1px solid rgba(204,255,0,0.5)",
              background: "rgba(0,0,0,0.6)",
              color: "#CCFF00", fontSize: 12, fontWeight: 700, textDecoration: "none",
              whiteSpace: "nowrap", flexShrink: 0,
            }}
          >
            Upgrade
          </a>
        )}
        <button
          onClick={() => setExportError(null)}
          style={{
            width: 22, height: 22, borderRadius: "50%", border: "none",
            background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)",
            fontSize: 13, cursor: "pointer", display: "flex",
            alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}
        >
          ×
        </button>
      </div>
    )}
  </>
  );
}

// ── Small helpers ─────────────────────────────────────────────────────────────

function Avatar({
  label,
  color,
  textColor = "white",
  size = 26,
  style: extraStyle,
}: {
  label: string;
  color: string;
  textColor?: string;
  size?: number;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: color,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.42, fontWeight: 700, color: textColor,
      border: "2px solid rgba(255,255,255,0.1)",
      flexShrink: 0,
      ...extraStyle,
    }}>
      {label}
    </div>
  );
}

function TopIconBtn({
  children,
  title,
  accent,
}: {
  children: React.ReactNode;
  title?: string;
  accent?: string;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      title={title}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 30, height: 30, borderRadius: "50%",
        border: "none",
        background: hov ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.04)",
        color: accent ?? (hov ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.35)"),
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", transition: "all 0.14s ease", flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
}

// ── Center icons ──────────────────────────────────────────────────────────────

function GridIcon({ active }: { active?: boolean }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.7} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
    </svg>
  );
}
function EyeIcon({ active }: { active?: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}
function CodeIcon({ active }: { active?: boolean }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>
    </svg>
  );
}
function DatabaseIcon({ active }: { active?: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.7} strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3"/>
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
    </svg>
  );
}
function CloudIcon({ active }: { active?: boolean }) {
  return (
    <svg width="16" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
    </svg>
  );
}
function GlobeIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  );
}
function GlobeIconSm() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  );
}
