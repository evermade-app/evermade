"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

const FOUNDER_EMAIL = "yonathanbenzaki@gmail.com";

const PLAN_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  free:     { bg: "rgba(255,255,255,0.07)", text: "rgba(255,255,255,0.5)",   label: "Free" },
  everpro:  { bg: "rgba(79,142,255,0.15)",  text: "#4f8eff",                  label: "EverPro" },
  evermax:  { bg: "rgba(204,255,0,0.12)",   text: "#CCFF00",                  label: "EverMax" },
  owner:    { bg: "rgba(124,92,255,0.2)",   text: "#a78bfa",                  label: "Owner" },
};

interface UserRow {
  id: string;
  email: string;
  plan: string;
  credits_used: number;
  monthly_credits: number;
  credits_remaining: number;
  generations: number;
  created_at: string;
  last_active: string | null;
}

interface Stats {
  total_users: number;
  live_now: number;
  today: number;
  yesterday: number;
  this_week: number;
  this_month: number;
  this_year: number;
  last_year: number;
  total_generations: number;
  plan_breakdown: Record<string, number>;
  users: UserRow[];
  generated_at: string;
}

function timeAgo(iso: string | null): string {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function CreditBar({ used, total }: { used: number; total: number }) {
  if (total >= 999_999_999) {
    return <span style={{ fontSize: 11, color: "#a78bfa" }}>∞ unlimited</span>;
  }
  const pct = Math.min(100, Math.round((used / total) * 100));
  const color = pct > 80 ? "#f87171" : pct > 50 ? "#fbbf24" : "#34d399";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, width: "100%" }}>
      <div style={{ flex: 1, height: 4, background: "rgba(255,255,255,0.07)", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 99, transition: "width 0.4s ease" }} />
      </div>
      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.38)", whiteSpace: "nowrap" }}>
        {used} / {total}
      </span>
    </div>
  );
}

function StatCard({ label, value, sub, accent }: { label: string; value: number | string; sub?: string; accent?: string }) {
  return (
    <div style={{
      flex: 1, minWidth: 130,
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 16, padding: "18px 20px",
      display: "flex", flexDirection: "column", gap: 4,
    }}>
      <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
        {label}
      </span>
      <span style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.03em", color: accent ?? "#fff", lineHeight: 1.1 }}>
        {value}
      </span>
      {sub && <span style={{ fontSize: 11, color: "rgba(255,255,255,0.28)" }}>{sub}</span>}
    </div>
  );
}

export default function FounderDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [sortBy, setSortBy] = useState<keyof UserRow>("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [search, setSearch] = useState("");

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/founder/stats");
      if (!res.ok) return;
      const data = await res.json();
      setStats(data);
      setLastRefresh(new Date());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/login"); return; }
    if (status === "authenticated" && session?.user?.email !== FOUNDER_EMAIL) {
      router.push("/dashboard"); return;
    }
    if (status === "authenticated") {
      fetchStats();
      const interval = setInterval(fetchStats, 30_000);
      return () => clearInterval(interval);
    }
  }, [status, session, router, fetchStats]);

  if (status === "loading" || loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#050509", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", border: "2px solid rgba(204,255,0,0.3)", borderTopColor: "#CCFF00", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!stats) return null;

  // Sort + filter users
  const filtered = stats.users
    .filter((u) => !search || u.email.toLowerCase().includes(search.toLowerCase()) || u.plan.includes(search.toLowerCase()))
    .sort((a, b) => {
      const av = a[sortBy] ?? "";
      const bv = b[sortBy] ?? "";
      const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
      return sortDir === "asc" ? cmp : -cmp;
    });

  const toggleSort = (col: keyof UserRow) => {
    if (sortBy === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortBy(col); setSortDir("desc"); }
  };

  const colHead = (label: string, col: keyof UserRow) => (
    <th
      onClick={() => toggleSort(col)}
      style={{
        padding: "10px 14px", textAlign: "left", fontSize: 11, fontWeight: 600,
        color: sortBy === col ? "#CCFF00" : "rgba(255,255,255,0.35)",
        textTransform: "uppercase", letterSpacing: "0.07em",
        cursor: "pointer", whiteSpace: "nowrap", userSelect: "none",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {label} {sortBy === col ? (sortDir === "asc" ? "↑" : "↓") : ""}
    </th>
  );

  return (
    <div style={{
      minHeight: "100vh",
      background: "#050509",
      color: "#fff",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Geist', 'SF Pro Text', sans-serif",
      padding: "32px 24px 80px",
      maxWidth: 1400,
      margin: "0 auto",
    }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.04em" }}>[evermade]</span>
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
              background: "rgba(204,255,0,0.12)", color: "#CCFF00",
              border: "1px solid rgba(204,255,0,0.2)", borderRadius: 999, padding: "2px 8px",
            }}>
              Founder Dashboard
            </span>
          </div>
          <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.35)" }}>
            Auto-refresh every 30s — Last update: {lastRefresh.toLocaleTimeString()}
          </p>
        </div>
        <button
          onClick={fetchStats}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8, padding: "8px 16px", color: "rgba(255,255,255,0.7)",
            fontSize: 13, cursor: "pointer", fontFamily: "inherit",
          }}
        >
          ↻ Refresh now
        </button>
      </div>

      {/* ── Live stat ── */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        background: "rgba(204,255,0,0.05)", border: "1px solid rgba(204,255,0,0.15)",
        borderRadius: 12, padding: "10px 18px", marginBottom: 24, width: "fit-content",
      }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#CCFF00", boxShadow: "0 0 8px #CCFF00", flexShrink: 0, animation: "pulse 2s ease-in-out infinite" }} />
        <span style={{ fontSize: 14, fontWeight: 600, color: "#CCFF00" }}>
          {stats.live_now} active right now
        </span>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
          (generated something in the last 30 min)
        </span>
        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
      </div>

      {/* ── Main stat cards ── */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
        <StatCard label="Total users" value={stats.total_users} sub="all time" />
        <StatCard label="Joined today" value={stats.today} sub="active or signed up" accent="#CCFF00" />
        <StatCard label="Yesterday" value={stats.yesterday} />
        <StatCard label="This week" value={stats.this_week} />
        <StatCard label="This month" value={stats.this_month} />
        <StatCard label="This year" value={stats.this_year} />
        <StatCard label="Last year" value={stats.last_year} />
        <StatCard label="Total generations" value={stats.total_generations} sub="all time" accent="#a78bfa" />
      </div>

      {/* ── Plan breakdown ── */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 32 }}>
        {Object.entries(PLAN_COLORS).map(([plan, style]) => (
          <div key={plan} style={{
            display: "flex", alignItems: "center", gap: 8,
            background: style.bg, border: `1px solid ${style.text}33`,
            borderRadius: 10, padding: "8px 16px",
          }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: style.text }}>
              {stats.plan_breakdown[plan] ?? 0}
            </span>
            <span style={{ fontSize: 12, color: style.text, opacity: 0.8 }}>{style.label}</span>
          </div>
        ))}
      </div>

      {/* ── Users table ── */}
      <div style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 16, overflow: "hidden",
      }}>
        {/* Table header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)",
          flexWrap: "wrap", gap: 10,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 15, fontWeight: 600 }}>All users</span>
            <span style={{ fontSize: 12, background: "rgba(255,255,255,0.07)", borderRadius: 6, padding: "2px 7px", color: "rgba(255,255,255,0.5)" }}>
              {filtered.length}
            </span>
          </div>
          <input
            type="text"
            placeholder="Search email or plan…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)",
              borderRadius: 8, padding: "7px 12px", color: "#fff", fontSize: 13,
              outline: "none", fontFamily: "inherit", width: 220,
            }}
          />
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.02)" }}>
                {colHead("Email", "email")}
                {colHead("Plan", "plan")}
                {colHead("Credits used", "credits_used")}
                <th style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.07em", borderBottom: "1px solid rgba(255,255,255,0.06)", whiteSpace: "nowrap" }}>
                  Credits left
                </th>
                {colHead("Generations", "generations")}
                {colHead("Joined", "created_at")}
                {colHead("Last active", "last_active")}
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, i) => {
                const planStyle = PLAN_COLORS[user.plan] ?? PLAN_COLORS.free;
                const isLive = user.last_active
                  ? Date.now() - new Date(user.last_active).getTime() < 30 * 60 * 1000
                  : false;
                return (
                  <tr
                    key={user.id}
                    style={{
                      borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                      background: isLive ? "rgba(204,255,0,0.03)" : "transparent",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.025)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = isLive ? "rgba(204,255,0,0.03)" : "transparent"; }}
                  >
                    {/* Email */}
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        {isLive && (
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#CCFF00", flexShrink: 0 }} />
                        )}
                        <span style={{ fontSize: 13, color: user.email === "—" ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.88)", fontFamily: user.email === "—" ? "inherit" : "monospace" }}>
                          {user.email}
                        </span>
                      </div>
                    </td>

                    {/* Plan */}
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{
                        fontSize: 11, fontWeight: 700, letterSpacing: "0.04em",
                        background: planStyle.bg, color: planStyle.text,
                        borderRadius: 6, padding: "3px 8px",
                      }}>
                        {planStyle.label}
                      </span>
                    </td>

                    {/* Credits used */}
                    <td style={{ padding: "12px 14px", minWidth: 160 }}>
                      <CreditBar used={user.credits_used} total={user.monthly_credits} />
                    </td>

                    {/* Credits remaining */}
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{
                        fontSize: 13, fontWeight: 600,
                        color: user.credits_remaining === 0
                          ? "#f87171"
                          : user.credits_remaining >= 999_999_999
                          ? "#a78bfa"
                          : "#34d399",
                      }}>
                        {user.credits_remaining >= 999_999_999 ? "∞" : user.credits_remaining.toLocaleString()}
                      </span>
                    </td>

                    {/* Generations */}
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: user.generations > 0 ? "#fff" : "rgba(255,255,255,0.25)" }}>
                        {user.generations}
                      </span>
                    </td>

                    {/* Joined */}
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>{fmtDate(user.created_at)}</span>
                    </td>

                    {/* Last active */}
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{ fontSize: 12, color: isLive ? "#CCFF00" : "rgba(255,255,255,0.35)" }}>
                        {timeAgo(user.last_active)}
                      </span>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: 40, textAlign: "center", color: "rgba(255,255,255,0.25)", fontSize: 13 }}>
                    No users match your search
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Footer note ── */}
      <p style={{ marginTop: 24, fontSize: 11, color: "rgba(255,255,255,0.2)", textAlign: "center" }}>
        &quot;Live now&quot; and &quot;Last active&quot; are based on AI generation activity. For login-level tracking, add <code style={{ background: "rgba(255,255,255,0.05)", padding: "1px 5px", borderRadius: 4 }}>last_seen_at TIMESTAMPTZ</code> column to the profiles table in Supabase.
      </p>
    </div>
  );
}
