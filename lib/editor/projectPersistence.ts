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
    // If no id provided, try to infer from evermade-active-project
    const projectId = id ?? localStorage.getItem("evermade-active-project") ?? null;
    if (!projectId) return null;
    const raw = localStorage.getItem(projectKey(projectId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Project;
    if (!parsed || typeof parsed !== "object" || !parsed.id || !Array.isArray(parsed.screens)) return null;
    return parsed;
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
