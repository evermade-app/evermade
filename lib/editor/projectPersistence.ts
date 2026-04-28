import type { Project } from "./project";

const PROJECT_STORAGE_KEY = "evermade-project-v1";

export function saveProject(project: Project): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(project));
  } catch {
    // quota exceeded or private browsing — silently skip
  }
}

export function loadProject(): Project | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PROJECT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Project;
    if (!parsed || typeof parsed !== "object" || !parsed.id || !Array.isArray(parsed.screens)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearProject(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(PROJECT_STORAGE_KEY);
  } catch {
    // ignore
  }
}
