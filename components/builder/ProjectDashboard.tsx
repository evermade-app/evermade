"use client";

import { useState, useRef } from "react";
import { useEditor } from "@/lib/editor/EditorContext";

// ─────────────────────────────────────────────────────────────────────────────
// NAV STRUCTURE
// ─────────────────────────────────────────────────────────────────────────────
const NAV = [
  {
    section: "PROJECT",
    items: [
      { id: "overview",       label: "Overview",        icon: GridNavIcon },
      { id: "hosting",        label: "Hosting",         icon: GlobeNavIcon },
      { id: "versions",       label: "Versions",        icon: ClockNavIcon },
    ],
  },
  {
    section: "ACCESS",
    items: [
      { id: "users",          label: "Users",           icon: UsersNavIcon },
      { id: "authentication", label: "Authentication",  icon: ShieldNavIcon },
    ],
  },
  {
    section: "CONFIGURATION",
    items: [
      { id: "apikeys",        label: "API Keys",        icon: KeyNavIcon },
      { id: "secrets",        label: "Secrets",         icon: LockNavIcon },
      { id: "security",       label: "Security",        icon: ShieldNavIcon },
      { id: "connectors",     label: "Connectors",      icon: PlugNavIcon, badge: "Beta" },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────────────────────────────────────
export default function ProjectDashboard({ onClose }: { onClose: () => void }) {
  const [active, setActive] = useState("overview");
  const { sleekApp, project } = useEditor();
  const appName = sleekApp?.appName ?? project?.name ?? "My App";

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(0,0,0,0.72)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        padding: "52px 24px 24px",
        fontFamily: "-apple-system,BlinkMacSystemFont,'Geist','SF Pro Text',sans-serif",
        animation: "dashBgIn 0.2s ease both",
      }}
    >
      <style>{`
        @keyframes dashBgIn  { from{opacity:0} to{opacity:1} }
        @keyframes dashIn    { from{opacity:0;transform:translateY(-10px) scale(0.985)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes fadeSlide { from{opacity:0;transform:translateX(8px)} to{opacity:1;transform:translateX(0)} }
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:2px}
      `}</style>

      {/* Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 1100,
          height: "calc(100vh - 100px)",
          maxHeight: 760,
          background: "#0d0d14",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 16,
          display: "flex",
          overflow: "hidden",
          boxShadow: "0 40px 120px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04)",
          animation: "dashIn 0.22s cubic-bezier(0.22,1,0.36,1) both",
        }}
      >
        {/* ── Left sidebar ── */}
        <div style={{
          width: 240, flexShrink: 0,
          background: "#0a0a10",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          display: "flex", flexDirection: "column",
          overflowY: "auto",
          padding: "20px 0 20px",
        }}>
          {/* App name */}
          <div style={{ padding: "0 16px 18px", borderBottom: "1px solid rgba(255,255,255,0.05)", marginBottom: 8 }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.28)", letterSpacing: 0.3, marginBottom: 8, fontWeight: 500 }}>
              Dashboard
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 7, flexShrink: 0,
                background: "linear-gradient(135deg,#7c5cfc,#4878ff)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                  <rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
                </svg>
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.88)", letterSpacing: -0.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {appName}
              </span>
            </div>
          </div>

          {/* Nav */}
          {NAV.map((group) => (
            <div key={group.section} style={{ marginBottom: 4, padding: "0 8px" }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: "rgba(255,255,255,0.28)", letterSpacing: 0.9, padding: "10px 8px 6px", textTransform: "uppercase" }}>
                {group.section}
              </div>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = active === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActive(item.id)}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", gap: 9,
                      padding: "8px 10px", borderRadius: 8, border: "none",
                      background: isActive ? "rgba(59,130,246,0.14)" : "none",
                      color: isActive ? "rgba(147,197,253,0.95)" : "rgba(255,255,255,0.5)",
                      fontSize: 13.5, fontWeight: isActive ? 500 : 400,
                      cursor: "pointer", textAlign: "left",
                      letterSpacing: -0.1, transition: "all 0.12s",
                      fontFamily: "inherit",
                    }}
                    onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)"; }}
                    onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "none"; }}
                  >
                    <Icon active={isActive} />
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {"badge" in item && item.badge && (
                      <span style={{ fontSize: 10, fontWeight: 600, color: "#60a5fa", background: "rgba(59,130,246,0.15)", padding: "1px 6px", borderRadius: 10, letterSpacing: 0.2 }}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* ── Main content ── */}
        <div style={{ flex: 1, overflowY: "auto", background: "#0d0d14", position: "relative" }}>
          {/* Close */}
          <button onClick={onClose} style={{
            position: "absolute", top: 16, right: 16, zIndex: 10,
            width: 30, height: 30, borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, fontFamily: "inherit",
          }}>×</button>

          <div style={{ padding: "32px 40px 48px", animation: "fadeSlide 0.18s ease both" }} key={active}>
            {active === "overview"       && <SectionOverview appName={appName} />}
            {active === "hosting"        && <SectionHosting />}
            {active === "versions"       && <SectionVersions />}
            {active === "users"          && <SectionUsers />}
            {active === "authentication" && <SectionAuthentication />}
            {active === "apikeys"        && <SectionApiKeys />}
            {active === "secrets"        && <SectionSecrets />}
            {active === "security"       && <SectionSecurity />}
            {active === "connectors"     && <SectionConnectors />}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SHARED UI PRIMITIVES
// ─────────────────────────────────────────────────────────────────────────────
function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "rgba(255,255,255,0.92)", letterSpacing: -0.4 }}>{title}</h1>
      <p style={{ margin: "5px 0 0", fontSize: 13.5, color: "rgba(255,255,255,0.38)", letterSpacing: -0.1 }}>{subtitle}</p>
    </div>
  );
}

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: "#111118", border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 12, padding: "22px 24px", marginBottom: 16,
    }}>
      <div style={{ marginBottom: subtitle ? 16 : 18 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,0.88)", letterSpacing: -0.2 }}>{title}</div>
        {subtitle && <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.35)", marginTop: 3, letterSpacing: -0.1 }}>{subtitle}</div>}
      </div>
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.5)", marginBottom: 7, letterSpacing: -0.1 }}>{children}</div>;
}

function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: "100%", boxSizing: "border-box",
        background: "#0a0a10", border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 8, padding: "10px 12px",
        color: "rgba(255,255,255,0.82)", fontSize: 13.5,
        outline: "none", fontFamily: "inherit", letterSpacing: -0.1,
      }}
      onFocus={(e) => e.currentTarget.style.borderColor = "rgba(59,130,246,0.5)"}
      onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
    />
  );
}

function Textarea({ value, onChange, rows = 4 }: { value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      style={{
        width: "100%", boxSizing: "border-box",
        background: "#0a0a10", border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 8, padding: "10px 12px",
        color: "rgba(255,255,255,0.82)", fontSize: 13.5,
        outline: "none", fontFamily: "inherit", letterSpacing: -0.1,
        resize: "vertical", lineHeight: 1.6,
      }}
      onFocus={(e) => e.currentTarget.style.borderColor = "rgba(59,130,246,0.5)"}
      onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
    />
  );
}

function PrimaryBtn({ children, onClick, small }: { children: React.ReactNode; onClick?: () => void; small?: boolean }) {
  return (
    <button onClick={onClick} style={{
      padding: small ? "6px 14px" : "9px 18px",
      borderRadius: 8, border: "none",
      background: "linear-gradient(135deg,#3b82f6,#2563eb)",
      color: "white", fontSize: small ? 12 : 13,
      fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
      letterSpacing: -0.1, boxShadow: "0 2px 12px rgba(59,130,246,0.35)",
      transition: "all 0.14s",
    }}>{children}</button>
  );
}

function GhostBtn({ children, onClick, small }: { children: React.ReactNode; onClick?: () => void; small?: boolean }) {
  return (
    <button onClick={onClick} style={{
      padding: small ? "6px 14px" : "9px 18px",
      borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)",
      background: "rgba(255,255,255,0.05)",
      color: "rgba(255,255,255,0.65)", fontSize: small ? 12 : 13,
      fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
      letterSpacing: -0.1, transition: "all 0.14s",
    }}>{children}</button>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <div
      onClick={() => onChange(!on)}
      style={{
        width: 40, height: 22, borderRadius: 11,
        background: on ? "#3b82f6" : "rgba(255,255,255,0.1)",
        position: "relative", cursor: "pointer", flexShrink: 0,
        transition: "background 0.2s",
        boxShadow: on ? "0 0 10px rgba(59,130,246,0.4)" : "none",
      }}
    >
      <div style={{
        position: "absolute", top: 3,
        left: on ? 21 : 3,
        width: 16, height: 16, borderRadius: "50%",
        background: "white", transition: "left 0.18s",
        boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
      }} />
    </div>
  );
}

function StatusDot({ status }: { status: "live" | "building" | "error" }) {
  const color = status === "live" ? "#34d399" : status === "building" ? "#fbbf24" : "#f87171";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ width: 7, height: 7, borderRadius: "50%", background: color, boxShadow: `0 0 8px ${color}` }} />
      <span style={{ fontSize: 12, color, fontWeight: 600, textTransform: "capitalize" }}>{status}</span>
    </div>
  );
}

function EmptyState({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div style={{ textAlign: "center", padding: "48px 24px", color: "rgba(255,255,255,0.25)" }}>
      <div style={{ marginBottom: 12, opacity: 0.4 }}>{icon}</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.45)", marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 12.5, lineHeight: 1.5 }}>{subtitle}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION: OVERVIEW
// ─────────────────────────────────────────────────────────────────────────────
function SectionOverview({ appName }: { appName: string }) {
  const [name, setName] = useState(appName);
  const [desc, setDesc] = useState(`${appName} is a beautifully designed mobile app built with Evermade. It provides an intuitive experience with stunning screens generated by AI.`);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <>
      <PageHeader title="Overview" subtitle="Basic settings for your project." />

      {/* Basics */}
      <Card title="Basics" subtitle="Name and description shown in your workspace and share links.">
        <div style={{ marginBottom: 14 }}>
          <Label>Project name</Label>
          <Input value={name} onChange={setName} />
        </div>
        <div style={{ marginBottom: 18 }}>
          <Label>Description</Label>
          <Textarea value={desc} onChange={setDesc} rows={3} />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <PrimaryBtn onClick={save}>{saved ? "✓ Saved" : "Save changes"}</PrimaryBtn>
        </div>
      </Card>

      {/* App Icon */}
      <Card title="App Icon" subtitle="Set the icon for your mobile app. Upload your own or generate with AI.">
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            onClick={() => fileRef.current?.click()}
            style={{
              width: 64, height: 64, borderRadius: 14,
              background: "linear-gradient(135deg,#7c5cfc,#4878ff)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", border: "2px dashed rgba(255,255,255,0.15)",
              flexShrink: 0, transition: "opacity 0.12s",
            }}
            title="Click to upload"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="4"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} />
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: "rgba(255,255,255,0.75)", marginBottom: 10 }}>Mobile App Icon</div>
            <div style={{ display: "flex", gap: 8 }}>
              <GhostBtn small onClick={() => fileRef.current?.click()}>↑ Upload</GhostBtn>
              <GhostBtn small>Generate with AI</GhostBtn>
            </div>
          </div>
        </div>
      </Card>

      {/* Site URL */}
      <Card title="Site URL" subtitle="Where visitors can access your app preview.">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            flex: 1, background: "#0a0a10", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 8, padding: "10px 12px",
            fontSize: 12.5, color: "rgba(255,255,255,0.38)",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            fontFamily: "ui-monospace,'SF Mono',monospace",
          }}>
            {`https://evermade.app/preview/${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
          </div>
          <GhostBtn small>↗ Open</GhostBtn>
        </div>
      </Card>

      {/* Delete zone */}
      <Card title="Danger Zone" subtitle="Irreversible actions for this project.">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.7)" }}>Delete this project</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 3 }}>Permanently delete all screens and data.</div>
          </div>
          <button style={{
            padding: "7px 16px", borderRadius: 8, border: "1px solid rgba(239,68,68,0.3)",
            background: "rgba(239,68,68,0.08)", color: "#f87171",
            fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
          }}>Delete project</button>
        </div>
      </Card>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION: HOSTING
// ─────────────────────────────────────────────────────────────────────────────
function SectionHosting() {
  return (
    <>
      <PageHeader title="Hosting" subtitle="Manage deployments, domains, and environments." />

      <Card title="Deployment status" subtitle="Current production deployment.">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <StatusDot status="live" />
          <GhostBtn small>Redeploy</GhostBtn>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {[
            { label: "Environment", value: "Production" },
            { label: "Last deploy", value: "2 min ago" },
            { label: "Build time", value: "12s" },
          ].map((s) => (
            <div key={s.label} style={{ background: "#0a0a10", borderRadius: 8, padding: "12px 14px", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: "rgba(255,255,255,0.75)" }}>{s.value}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Custom domain" subtitle="Connect your own domain to this project.">
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <input placeholder="yourdomain.com" style={{
            flex: 1, background: "#0a0a10", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8, padding: "9px 12px", color: "rgba(255,255,255,0.7)",
            fontSize: 13, outline: "none", fontFamily: "inherit",
          }} />
          <PrimaryBtn small>Add domain</PrimaryBtn>
        </div>
        <EmptyState
          icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>}
          title="No custom domain"
          subtitle="Add your domain above to point it to this project."
        />
      </Card>

      <Card title="Preview deployments" subtitle="Auto-deploy branches for testing.">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)" }}>Enable preview deployments</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>Each push creates a shareable preview URL.</div>
          </div>
          <Toggle on={true} onChange={() => {}} />
        </div>
      </Card>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION: VERSIONS
// ─────────────────────────────────────────────────────────────────────────────
function SectionVersions() {
  const { sleekApp } = useEditor();
  const versions = sleekApp
    ? [{ label: `Generated — ${sleekApp.appName}`, screens: sleekApp.screens.length, time: "now", current: true }]
    : [];

  return (
    <>
      <PageHeader title="Versions" subtitle="Browse and restore previous app versions." />
      <Card title="Version history" subtitle="Every generation and edit is saved automatically.">
        {versions.length === 0 ? (
          <EmptyState
            icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>}
            title="No versions yet"
            subtitle="Generate an app to start your version history."
          />
        ) : (
          versions.map((v, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.05)",
            }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(124,92,252,0.15)", border: "1px solid rgba(124,92,252,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(160,140,255,0.8)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                  <rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.8)" }}>
                  {v.label}
                  {v.current && <span style={{ marginLeft: 8, fontSize: 10, color: "#60a5fa", background: "rgba(59,130,246,0.15)", padding: "1px 7px", borderRadius: 10, fontWeight: 600 }}>Current</span>}
                </div>
                <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{v.screens} screens · {v.time}</div>
              </div>
              {!v.current && <GhostBtn small>↩ Restore</GhostBtn>}
            </div>
          ))
        )}
      </Card>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION: USERS
// ─────────────────────────────────────────────────────────────────────────────
function SectionUsers() {
  const [email, setEmail] = useState("");
  return (
    <>
      <PageHeader title="Users" subtitle="Manage who can access and collaborate on this project." />
      <Card title="Invite collaborator" subtitle="Give team members access to this project.">
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="colleague@company.com"
            style={{
              flex: 1, background: "#0a0a10", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8, padding: "9px 12px", color: "rgba(255,255,255,0.7)",
              fontSize: 13, outline: "none", fontFamily: "inherit",
            }}
          />
          <div style={{ display: "flex", gap: 6 }}>
            <select style={{ background: "#0a0a10", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "9px 10px", color: "rgba(255,255,255,0.55)", fontSize: 12.5, outline: "none", fontFamily: "inherit", cursor: "pointer" }}>
              <option>Viewer</option><option>Editor</option><option>Admin</option>
            </select>
            <PrimaryBtn small>Send invite</PrimaryBtn>
          </div>
        </div>
      </Card>
      <Card title="Members" subtitle="People with access to this project.">
        {[{ name: "You", email: "yonathanbenzaki@gmail.com", role: "Owner", avatar: "Y" }].map((u) => (
          <div key={u.email} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#7c5cfc,#4878ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "white", flexShrink: 0 }}>{u.avatar}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.8)" }}>{u.name}</div>
              <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.3)" }}>{u.email}</div>
            </div>
            <span style={{ fontSize: 11.5, color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.06)", padding: "3px 10px", borderRadius: 20 }}>{u.role}</span>
          </div>
        ))}
      </Card>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION: AUTHENTICATION
// ─────────────────────────────────────────────────────────────────────────────
function SectionAuthentication() {
  const [providers, setProviders] = useState({ email: true, google: true, apple: false, github: false });
  const toggle = (k: keyof typeof providers) => setProviders((p) => ({ ...p, [k]: !p[k] }));

  const rows = [
    { key: "email" as const, label: "Email / Password", desc: "Classic email + password login", icon: "✉" },
    { key: "google" as const, label: "Google", desc: "Sign in with Google OAuth 2.0", icon: "G" },
    { key: "apple" as const, label: "Apple", desc: "Sign in with Apple ID", icon: "" },
    { key: "github" as const, label: "GitHub", desc: "Sign in with GitHub OAuth", icon: "⌥" },
  ];

  return (
    <>
      <PageHeader title="Authentication" subtitle="Configure sign-in providers for your app." />
      <Card title="Providers" subtitle="Enable the sign-in methods your users can use.">
        {rows.map((row) => (
          <div key={row.key} style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.6)", flexShrink: 0 }}>{row.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 500, color: "rgba(255,255,255,0.78)" }}>{row.label}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{row.desc}</div>
            </div>
            <Toggle on={providers[row.key]} onChange={() => toggle(row.key)} />
          </div>
        ))}
      </Card>
      <Card title="Session settings" subtitle="Control how long users stay logged in.">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)" }}>Session duration</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>How long before users must re-authenticate.</div>
          </div>
          <select style={{ background: "#0a0a10", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 12px", color: "rgba(255,255,255,0.6)", fontSize: 12.5, outline: "none", fontFamily: "inherit", cursor: "pointer" }}>
            <option>7 days</option><option>30 days</option><option>90 days</option><option>1 year</option>
          </select>
        </div>
      </Card>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION: API KEYS
// ─────────────────────────────────────────────────────────────────────────────
function SectionApiKeys() {
  const [keys] = useState([{ name: "Production key", key: "em_pk_••••••••••••••••", created: "Today", last: "Just now" }]);
  return (
    <>
      <PageHeader title="API Keys" subtitle="Manage API keys for accessing your app programmatically." />
      <Card title="Your keys" subtitle="Use these keys to authenticate API requests.">
        <div style={{ marginBottom: 14 }}>
          <PrimaryBtn>+ Create new key</PrimaryBtn>
        </div>
        {keys.map((k) => (
          <div key={k.name} style={{ background: "#0a0a10", borderRadius: 8, padding: "14px 16px", border: "1px solid rgba(255,255,255,0.07)", marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>{k.name}</div>
              <div style={{ display: "flex", gap: 6 }}>
                <GhostBtn small>Copy</GhostBtn>
                <button style={{ padding: "5px 12px", borderRadius: 7, border: "1px solid rgba(239,68,68,0.25)", background: "rgba(239,68,68,0.07)", color: "#f87171", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Revoke</button>
              </div>
            </div>
            <code style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", fontFamily: "ui-monospace,'SF Mono',monospace" }}>{k.key}</code>
            <div style={{ marginTop: 8, fontSize: 11.5, color: "rgba(255,255,255,0.25)" }}>Created {k.created} · Last used {k.last}</div>
          </div>
        ))}
      </Card>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION: SECRETS
// ─────────────────────────────────────────────────────────────────────────────
function SectionSecrets() {
  const [vars, setVars] = useState([{ key: "OPENAI_API_KEY", value: "sk-••••••••••••", env: "Production" }]);
  const [newKey, setNewKey] = useState("");
  const [newVal, setNewVal] = useState("");

  const add = () => {
    if (!newKey.trim()) return;
    setVars((v) => [...v, { key: newKey.toUpperCase().replace(/ /g, "_"), value: newVal, env: "Production" }]);
    setNewKey(""); setNewVal("");
  };

  return (
    <>
      <PageHeader title="Secrets" subtitle="Store API keys and environment variables securely." />
      <Card title="Add secret" subtitle="Secrets are encrypted and injected at build time.">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
          <div><Label>Name</Label><input value={newKey} onChange={(e) => setNewKey(e.target.value)} placeholder="VARIABLE_NAME" style={{ width: "100%", boxSizing: "border-box", background: "#0a0a10", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "9px 12px", color: "rgba(255,255,255,0.7)", fontSize: 13, outline: "none", fontFamily: "ui-monospace,'SF Mono',monospace" }} /></div>
          <div><Label>Value</Label><input value={newVal} onChange={(e) => setNewVal(e.target.value)} placeholder="sk-..." type="password" style={{ width: "100%", boxSizing: "border-box", background: "#0a0a10", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "9px 12px", color: "rgba(255,255,255,0.7)", fontSize: 13, outline: "none", fontFamily: "inherit" }} /></div>
        </div>
        <PrimaryBtn small onClick={add}>Add secret</PrimaryBtn>
      </Card>
      <Card title="Secrets" subtitle={`${vars.length} secret${vars.length !== 1 ? "s" : ""} stored`}>
        {vars.map((v, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            <div style={{ flex: 1 }}>
              <code style={{ fontSize: 12.5, fontWeight: 600, color: "rgba(255,255,255,0.7)", fontFamily: "ui-monospace,'SF Mono',monospace" }}>{v.key}</code>
              <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.25)", marginTop: 2 }}>{v.env}</div>
            </div>
            <code style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", fontFamily: "ui-monospace,'SF Mono',monospace" }}>{v.value}</code>
            <button onClick={() => setVars((prev) => prev.filter((_, j) => j !== i))} style={{ background: "none", border: "none", color: "rgba(239,68,68,0.5)", cursor: "pointer", fontSize: 15, padding: "2px 6px" }}>×</button>
          </div>
        ))}
      </Card>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION: SECURITY
// ─────────────────────────────────────────────────────────────────────────────
function SectionSecurity() {
  const [settings, setSettings] = useState({ rateLimit: true, cors: false, twoFa: false, https: true });
  const tog = (k: keyof typeof settings) => setSettings((s) => ({ ...s, [k]: !s[k] }));
  const rows = [
    { key: "rateLimit" as const, label: "Rate limiting", desc: "Limit requests per IP to prevent abuse (100 req/min)." },
    { key: "cors" as const, label: "CORS restrictions", desc: "Only allow requests from your registered domains." },
    { key: "twoFa" as const, label: "Require 2FA", desc: "Enforce two-factor auth for all collaborators." },
    { key: "https" as const, label: "Force HTTPS", desc: "Redirect all HTTP traffic to HTTPS." },
  ];
  return (
    <>
      <PageHeader title="Security" subtitle="Protect your project and its users." />
      <Card title="Security settings">
        {rows.map((r) => (
          <div key={r.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 500, color: "rgba(255,255,255,0.75)" }}>{r.label}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 3 }}>{r.desc}</div>
            </div>
            <Toggle on={settings[r.key]} onChange={() => tog(r.key)} />
          </div>
        ))}
      </Card>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION: CONNECTORS
// ─────────────────────────────────────────────────────────────────────────────
function SectionConnectors() {
  const connectors = [
    { name: "Supabase", desc: "Postgres database + auth + storage", color: "#3ecf8e", connected: true },
    { name: "Stripe", desc: "Payments & subscriptions", color: "#635bff", connected: false },
    { name: "Resend", desc: "Transactional email at scale", color: "#000000", connected: false },
    { name: "Cloudinary", desc: "Image & video management CDN", color: "#3448c5", connected: false },
    { name: "Twilio", desc: "SMS, voice & messaging API", color: "#f22f46", connected: false },
    { name: "OpenAI", desc: "GPT-4, embeddings & more", color: "#10a37f", connected: true },
  ];
  return (
    <>
      <PageHeader title="Connectors" subtitle="Connect third-party services to supercharge your app." />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {connectors.map((c) => (
          <div key={c.name} style={{ background: "#111118", border: `1px solid ${c.connected ? "rgba(52,211,153,0.2)" : "rgba(255,255,255,0.07)"}`, borderRadius: 12, padding: "18px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: `${c.color}22`, border: `1px solid ${c.color}44`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 14, height: 14, borderRadius: 3, background: c.color, opacity: 0.85 }} />
              </div>
              {c.connected
                ? <span style={{ fontSize: 11, fontWeight: 600, color: "#34d399", background: "rgba(52,211,153,0.12)", padding: "3px 9px", borderRadius: 20 }}>Connected</span>
                : <GhostBtn small>Connect</GhostBtn>
              }
            </div>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: "rgba(255,255,255,0.8)", marginBottom: 4 }}>{c.name}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", lineHeight: 1.4 }}>{c.desc}</div>
          </div>
        ))}
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NAV ICONS
// ─────────────────────────────────────────────────────────────────────────────
function GridNavIcon({ active }: { active?: boolean }) {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.7} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>;
}
function GlobeNavIcon({ active }: { active?: boolean }) {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.7} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
}
function ClockNavIcon({ active }: { active?: boolean }) {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.7} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>;
}
function UsersNavIcon({ active }: { active?: boolean }) {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.7} strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
}
function ShieldNavIcon({ active }: { active?: boolean }) {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.7} strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
}
function KeyNavIcon({ active }: { active?: boolean }) {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.7} strokeLinecap="round" strokeLinejoin="round"><circle cx="7.5" cy="15.5" r="5.5"/><path d="M21 2l-9.6 9.6M15.5 7.5l3 3"/></svg>;
}
function LockNavIcon({ active }: { active?: boolean }) {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.7} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
}
function PlugNavIcon({ active }: { active?: boolean }) {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.7} strokeLinecap="round" strokeLinejoin="round"><path d="M12 22v-5M9 8V2M15 8V2M9 14H7a2 2 0 0 1-2-2V8h14v4a2 2 0 0 1-2 2h-2"/></svg>;
}
