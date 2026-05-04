export interface ProjectMeta {
  id: string;
  name: string;
  gradient: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
}

const STORE_KEY = "evermade-projects-v1";

const GRADIENTS = [
  "linear-gradient(135deg, #1a1a2e 0%, #16213e 45%, #0f3460 100%)",
  "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
  "linear-gradient(135deg, #0d0d1a 0%, #1a0533 50%, #2d1b69 100%)",
  "linear-gradient(135deg, #0a0a12 0%, #1e3a5f 50%, #0d2137 100%)",
  "linear-gradient(135deg, #0f1923 0%, #1a3a4a 50%, #0d2f3f 100%)",
  "linear-gradient(135deg, #1a0a2e 0%, #3d1560 50%, #6b21a8 100%)",
  "linear-gradient(135deg, #0a1628 0%, #1e3a5f 50%, #2563eb 100%)",
  "linear-gradient(135deg, #1a1200 0%, #3d2c00 50%, #78540e 100%)",
];

function seedDefaults(): ProjectMeta[] {
  const now = Date.now();
  return [
    {
      id: "demo-evermade-studio",
      name: "Evermade Studio",
      gradient: GRADIENTS[0],
      createdAt: new Date(now - 9 * 864e5).toISOString(),
      updatedAt: new Date(now - 9 * 864e5).toISOString(),
      published: true,
    },
    {
      id: "demo-fittrack",
      name: "FitTrack Pro",
      gradient: GRADIENTS[1],
      createdAt: new Date(now - 15 * 864e5).toISOString(),
      updatedAt: new Date(now - 15 * 864e5).toISOString(),
      published: false,
    },
    {
      id: "demo-dealflow",
      name: "DealFlow AI",
      gradient: GRADIENTS[2],
      createdAt: new Date(now - 21 * 864e5).toISOString(),
      updatedAt: new Date(now - 21 * 864e5).toISOString(),
      published: true,
    },
  ];
}

export function getProjects(): ProjectMeta[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ProjectMeta[];
  } catch {
    return [];
  }
}

export function saveProjectMeta(meta: ProjectMeta): void {
  if (typeof window === "undefined") return;
  const projects = getProjects();
  const idx = projects.findIndex((p) => p.id === meta.id);
  if (idx >= 0) projects[idx] = meta;
  else projects.unshift(meta);
  localStorage.setItem(STORE_KEY, JSON.stringify(projects));
}

export function deleteProject(id: string): ProjectMeta[] {
  if (typeof window === "undefined") return [];
  const updated = getProjects().filter((p) => p.id !== id);
  localStorage.setItem(STORE_KEY, JSON.stringify(updated));
  return updated;
}

export function createProjectMeta(name: string): ProjectMeta {
  const now = new Date().toISOString();
  const id = `proj-${Date.now()}`;
  const gradient = GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)];
  const meta: ProjectMeta = { id, name, gradient, createdAt: now, updatedAt: now, published: false };
  const projects = [meta, ...getProjects()];
  if (typeof window !== "undefined") {
    localStorage.setItem(STORE_KEY, JSON.stringify(projects));
  }
  return meta;
}

export function timeAgo(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const d = Math.floor(diffMs / 864e5);
  if (d === 0) return "Today";
  if (d === 1) return "Yesterday";
  if (d < 7) return `${d} days ago`;
  if (d < 30) return `${Math.floor(d / 7)} week${Math.floor(d / 7) > 1 ? "s" : ""} ago`;
  const m = Math.floor(d / 30);
  return `${m} month${m > 1 ? "s" : ""} ago`;
}
