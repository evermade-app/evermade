import type { Project } from "./project";

function projectKey(id: string): string {
  return `evermade-project-${id}`;
}

export function saveProject(project: Project): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(projectKey(project.id), JSON.stringify(project));
  } catch {
    // quota exceeded or private browsing — silently skip
  }
}

export function loadProject(id?: string): Project | null {
  if (typeof window === "undefined") return null;
  try {
    const projectId = id ?? localStorage.getItem("evermade-active-project") ?? null;
    if (!projectId) return null;

    // Try per-project key first (new format)
    const raw = localStorage.getItem(projectKey(projectId));
    if (raw) {
      const parsed = JSON.parse(raw) as Project;
      if (parsed?.id && Array.isArray(parsed.screens)) return parsed;
    }

    // Migration fallback: old single key — only use it when the stored id matches
    const legacy = localStorage.getItem("evermade-project-v1");
    if (legacy) {
      const parsed = JSON.parse(legacy) as Project;
      if (parsed?.id === projectId && Array.isArray(parsed.screens)) {
        localStorage.setItem(projectKey(projectId), legacy);
        return parsed;
      }
    }

    return null;
  } catch {
    return null;
  }
}

export function clearProject(id: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(projectKey(id));
  } catch {
    // ignore
  }
}
