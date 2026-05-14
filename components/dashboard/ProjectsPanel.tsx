"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { type ProjectMeta, timeAgo, getProjects, deleteProject } from "@/lib/projects-store";

// ─── Template catalogue ───────────────────────────────────────────────────────

interface TemplateMeta {
  id: string;
  name: string;
  category: string;
  gradient: string;
  accent: string;
  icon: string;
}

const TEMPLATES: TemplateMeta[] = [
  { id: "t-fitness", name: "FitTrack Pro", category: "Health & Fitness", gradient: "linear-gradient(135deg,#0f0c29 0%,#302b63 50%,#667eea 100%)", accent: "#a78bfa", icon: "🏃" },
  { id: "t-finance", name: "Finance Buddy", category: "Finance & Banking", gradient: "linear-gradient(135deg,#0f2027 0%,#203a43 50%,#2c5364 100%)", accent: "#34d399", icon: "💳" },
  { id: "t-social", name: "Social Hub", category: "Social Network", gradient: "linear-gradient(135deg,#1a0533 0%,#6b21a8 60%,#ec4899 100%)", accent: "#f472b6", icon: "✨" },
  { id: "t-recipe", name: "Recipe Book", category: "Food & Drink", gradient: "linear-gradient(135deg,#064e3b 0%,#065f46 50%,#059669 100%)", accent: "#6ee7b7", icon: "🍳" },
  { id: "t-travel", name: "Travel Planner", category: "Travel & Maps", gradient: "linear-gradient(135deg,#0c1445 0%,#1e3a8a 50%,#3b82f6 100%)", accent: "#60a5fa", icon: "✈️" },
  { id: "t-learn", name: "Learning Path", category: "Education", gradient: "linear-gradient(135deg,#2d1600 0%,#92400e 50%,#f59e0b 100%)", accent: "#fcd34d", icon: "📚" },
];

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "projects" | "recent" | "templates";

// ─── Sub-components ───────────────────────────────────────────────────────────

function Avatar({ initial }: { initial: string }) {
  return (
    <div style={{
      width: 24, height: 24, borderRadius: "50%",
      background: "linear-gradient(135deg,#7c5cfc,#4878ff)",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
      fontSize: 10, fontWeight: 700, color: "#fff",
    }}>
      {initial}
    </div>
  );
}

function PublishedBadge() {
  return (
    <div style={{
      position: "absolute", bottom: 10, left: 10,
      padding: "3px 10px",
      borderRadius: 999,
      background: "rgba(0,0,0,0.6)",
      backdropFilter: "blur(8px)",
      fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.85)",
      border: "1px solid rgba(255,255,255,0.12)",
    }}>
      Published
    </div>
  );
}

function DeleteBtn({ onClick }: { onClick: (e: React.MouseEvent) => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "absolute", top: 8, right: 8,
        width: 26, height: 26, borderRadius: "50%",
        background: hov ? "rgba(239,68,68,0.85)" : "rgba(0,0,0,0.55)",
        border: "1px solid rgba(255,255,255,0.12)",
        backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer",
        transition: "background 0.15s ease",
        color: "#fff", fontSize: 13, fontWeight: 700,
        lineHeight: 1,
      }}
      title="Delete project"
    >
      ×
    </button>
  );
}

function ProjectCard({
  project,
  onDelete,
  onOpen,
}: {
  project: ProjectMeta;
  onDelete: (e: React.MouseEvent, id: string) => void;
  onOpen: (id: string) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={() => onOpen(project.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: "pointer",
        borderRadius: 12,
        overflow: "visible",
        transition: "transform 0.15s ease",
        transform: hovered ? "translateY(-2px)" : "none",
      }}
    >
      {/* Thumbnail */}
      <div style={{
        position: "relative",
        height: 160,
        borderRadius: 10,
        overflow: "hidden",
        background: project.gradient,
        border: hovered
          ? "1px solid rgba(255,255,255,0.16)"
          : "1px solid rgba(255,255,255,0.06)",
        transition: "border-color 0.15s ease",
      }}>
        {/* Subtle noise/texture overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg,rgba(0,0,0,0) 50%,rgba(0,0,0,0.35) 100%)",
        }} />
        {/* App icon placeholder */}
        <div style={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%, -60%)",
          width: 48, height: 48, borderRadius: 12,
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.12)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22,
        }}>
          📱
        </div>
        {project.published && <PublishedBadge />}
        {hovered && (
          <DeleteBtn onClick={(e) => onDelete(e, project.id)} />
        )}
      </div>

      {/* Info row */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        marginTop: 10, padding: "0 2px",
      }}>
        <Avatar initial={project.name.charAt(0).toUpperCase()} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            margin: 0, fontSize: 13, fontWeight: 500,
            color: "#fff", overflow: "hidden",
            textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {project.name}
          </p>
          <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.38)" }}>
            Edited {timeAgo(project.updatedAt)}
          </p>
        </div>
      </div>
    </div>
  );
}

function TemplateCard({ template, onUse }: { template: TemplateMeta; onUse: (id: string) => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={() => onUse(template.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: "pointer",
        borderRadius: 12,
        overflow: "visible",
        transition: "transform 0.15s ease",
        transform: hovered ? "translateY(-2px)" : "none",
      }}
    >
      {/* Thumbnail */}
      <div style={{
        position: "relative",
        height: 160,
        borderRadius: 10,
        overflow: "hidden",
        background: template.gradient,
        border: hovered
          ? "1px solid rgba(255,255,255,0.18)"
          : "1px solid rgba(255,255,255,0.06)",
        transition: "border-color 0.15s ease",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg,rgba(0,0,0,0) 40%,rgba(0,0,0,0.4) 100%)",
        }} />
        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 26, position: "relative", zIndex: 1,
          boxShadow: `0 8px 24px rgba(0,0,0,0.4), 0 0 0 1px ${template.accent}22`,
        }}>
          {template.icon}
        </div>
        {/* Use template pill — shown on hover */}
        {hovered && (
          <div style={{
            position: "absolute", bottom: 10, left: "50%",
            transform: "translateX(-50%)",
            padding: "4px 14px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.14)",
            border: "1px solid rgba(255,255,255,0.2)",
            backdropFilter: "blur(8px)",
            fontSize: 11, fontWeight: 600, color: "#fff",
            whiteSpace: "nowrap",
          }}>
            Use template →
          </div>
        )}
      </div>

      {/* Info row */}
      <div style={{ marginTop: 10, padding: "0 2px" }}>
        <p style={{
          margin: 0, fontSize: 13, fontWeight: 500, color: "#fff",
        }}>
          {template.name}
        </p>
        <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.38)" }}>
          {template.category}
        </p>
      </div>
    </div>
  );
}

function NewProjectCard({ onClick }: { onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: "pointer",
        borderRadius: 12,
        transition: "transform 0.15s ease",
        transform: hovered ? "translateY(-2px)" : "none",
      }}
    >
      <div style={{
        height: 160,
        borderRadius: 10,
        border: hovered
          ? "1.5px dashed rgba(255,255,255,0.25)"
          : "1.5px dashed rgba(255,255,255,0.1)",
        background: hovered ? "rgba(255,255,255,0.04)" : "transparent",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: 10,
        transition: "all 0.15s ease",
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          border: "1.5px solid rgba(255,255,255,0.18)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "rgba(255,255,255,0.5)", fontSize: 20, lineHeight: 1,
        }}>
          +
        </div>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>
          New project
        </span>
      </div>
    </div>
  );
}

// ─── Main panel ───────────────────────────────────────────────────────────────

export default function ProjectsPanel() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("projects");
  const [projects, setProjects] = useState<ProjectMeta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/apps")
      .then((r) => r.ok ? r.json() : [])
      .then((data: unknown) => {
        const apiProjects: ProjectMeta[] = Array.isArray(data) ? data as ProjectMeta[] : [];
        // Merge with localStorage — API is authoritative, but local projects
        // not yet synced (e.g. Supabase POST failed) still show up
        const localProjects = getProjects();
        const apiIds = new Set(apiProjects.map((p) => p.id));
        const localOnly = localProjects.filter((p) => !apiIds.has(p.id));
        setProjects([...apiProjects, ...localOnly]);
      })
      .catch(() => {
        // Full fallback: API unreachable → show localStorage projects
        setProjects(getProjects());
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = useCallback(async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    // Update UI immediately
    setProjects((prev) => prev.filter((p) => p.id !== id));
    // Remove from localStorage — without this the project reappears on refresh
    deleteProject(id);
    // Clean up all per-project localStorage keys
    try {
      localStorage.removeItem(`evermade-project-${id}`);
      localStorage.removeItem(`evermade-sleek-${id}`);
      localStorage.removeItem(`evermade-chat-${id}`);
      // If this was the active project, clear the active signal
      if (localStorage.getItem("evermade-active-project") === id) {
        localStorage.removeItem("evermade-active-project");
      }
    } catch { /* private browsing */ }
    // Persist deletion to Supabase
    await fetch(`/api/apps/${id}`, { method: "DELETE" }).catch(console.error);
  }, []);

  const handleOpen = useCallback((id: string) => {
    localStorage.setItem("evermade-active-project", id);
    router.push("/builder");
  }, [router]);

  const handleUseTemplate = useCallback((templateId: string) => {
    router.push(`/new-project?template=${templateId}`);
  }, [router]);

  const handleNewProject = useCallback(() => {
    router.push("/new-project");
  }, [router]);

  // ── Skeleton while fetching ───────────────────────────────────────────────
  if (loading) {
    return (
      <section style={{ width: "100%", maxWidth: 1200, margin: "0 auto", padding: "0 48px 96px" }}>
        <div style={{
          borderRadius: 20,
          background: "rgba(8,8,14,0.88)",
          backdropFilter: "blur(32px) saturate(1.4)",
          WebkitBackdropFilter: "blur(32px) saturate(1.4)",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 8px 48px rgba(0,0,0,0.5)",
          padding: "22px 22px",
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 16 }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ height: 160, borderRadius: 10, background: "rgba(255,255,255,0.04)", animation: "pulse 1.5s ease-in-out infinite" }} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const displayedProjects =
    tab === "recent"
      ? [...projects].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 6)
      : projects;

  const TABS: { id: Tab; label: string }[] = [
    { id: "projects", label: "My projects" },
    { id: "recent", label: "Recently viewed" },
    { id: "templates", label: "Templates" },
  ];

  return (
    <section style={{
      width: "100%",
      maxWidth: 1200,
      margin: "0 auto",
      padding: "0 48px 96px",
    }}>
      {/* Outer glass shell */}
      <div style={{
        borderRadius: 20,
        background: "rgba(8,8,14,0.88)",
        backdropFilter: "blur(32px) saturate(1.4)",
        WebkitBackdropFilter: "blur(32px) saturate(1.4)",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 8px 48px rgba(0,0,0,0.5)",
        overflow: "hidden",
        position: "relative",
      }}>

          {/* ── Panel header ── */}
          <div style={{
            display: "flex", alignItems: "center",
            justifyContent: "space-between",
            padding: "18px 22px 0",
          }}>
            {/* Tab pills */}
            <div style={{ display: "flex", gap: 2 }}>
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 999,
                    border: "none",
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: tab === t.id ? 600 : 400,
                    background: tab === t.id
                      ? "rgba(204,255,0,0.1)"
                      : "transparent",
                    color: tab === t.id
                      ? "#CCFF00"
                      : "rgba(255,255,255,0.4)",
                    transition: "all 0.15s ease",
                    outline: "none",
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Browse all */}
            <button
              onClick={() => router.push("/new-project")}
              style={{
                background: "none", border: "none",
                color: "rgba(255,255,255,0.42)", fontSize: 13,
                cursor: "pointer", display: "flex",
                alignItems: "center", gap: 5,
                padding: "4px 8px",
              }}
            >
              Browse all <span style={{ fontSize: 15 }}>→</span>
            </button>
          </div>

          {/* ── Content grid ── */}
          <div style={{ padding: "18px 22px 22px" }}>
            {tab === "templates" ? (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                gap: 16,
              }}>
                {TEMPLATES.map((t) => (
                  <TemplateCard key={t.id} template={t} onUse={handleUseTemplate} />
                ))}
              </div>
            ) : (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
                gap: 16,
              }}>
                <NewProjectCard onClick={handleNewProject} />
                {displayedProjects.map((p) => (
                  <ProjectCard
                    key={p.id}
                    project={p}
                    onDelete={handleDelete}
                    onOpen={handleOpen}
                  />
                ))}
              </div>
            )}
          </div>

        </div>
    </section>
  );
}
