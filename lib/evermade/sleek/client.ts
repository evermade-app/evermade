const BASE = "https://sleek.design/api/v1";
const POLL_INTERVAL = 3000;
const MAX_POLLS = 60; // 3 min max

export interface SleekScreen {
  id: string;
  name: string;
  html: string;
  screenshotUrl?: string;
}

export interface SleekProject {
  id: string;
  screens: SleekScreen[];
}

function authHeaders() {
  const key = process.env.SLEEK_API_KEY;
  if (!key) throw new Error("SLEEK_API_KEY not configured");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${key}`,
  };
}

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { ...authHeaders(), ...(init?.headers ?? {}) },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Sleek ${res.status} ${path}: ${body}`);
  }
  // All responses are wrapped in { data: ... }
  const json = await res.json() as { data: T };
  return json.data;
}

// Step 1 — create project, returns project id
async function createProject(name: string): Promise<string> {
  const data = await api<{ id: string }>("/projects", {
    method: "POST",
    body: JSON.stringify({ name: name.slice(0, 80) }),
  });
  return data.id;
}

// Step 2 — send design prompt, returns run id
async function sendMessage(projectId: string, prompt: string): Promise<string> {
  const data = await api<{ runId: string }>(`/projects/${projectId}/chat/messages`, {
    method: "POST",
    body: JSON.stringify({
      message: { text: prompt },
      mode: "sync",
    }),
  });
  return data.runId;
}

// Step 3 — poll until completed
async function pollRun(projectId: string, runId: string): Promise<void> {
  for (let i = 0; i < MAX_POLLS; i++) {
    const data = await api<{ status: string; error?: string }>(
      `/projects/${projectId}/chat/runs/${runId}`
    );

    if (data.status === "completed") return;
    if (data.status === "failed" || data.status === "error") {
      throw new Error(`Sleek run failed: ${data.error ?? data.status}`);
    }

    await new Promise((r) => setTimeout(r, POLL_INTERVAL));
  }

  throw new Error("Sleek run timed out after 3 minutes");
}

// Canonical screen order — used to sort Sleek's response
const CANONICAL_SCREENS = [
  "Onboarding Welcome",
  "Onboarding Features",
  "Onboarding Sign Up",
  "Home Dashboard",
  "Core Feature",
  "Secondary Feature",
  "Detail Screen",
  "Profile Screen",
  "Settings Screen",
] as const;

// Step 4 — list all components (screens), each has full HTML in versions[0].code
async function listComponents(projectId: string): Promise<SleekScreen[]> {
  const data = await api<Array<{
    id: string;
    name: string;
    activeVersion: number;
    versions: Array<{ id: string; version: number; code: string }>;
  }>>(`/projects/${projectId}/components`);

  const screens = data.map((comp) => {
    const activeVersion = comp.versions.find((v) => v.version === comp.activeVersion)
      ?? comp.versions[comp.versions.length - 1];
    return {
      id: comp.id,
      name: comp.name,
      html: activeVersion?.code ?? "",
    };
  });

  // Sort by canonical order so the first screen is always Onboarding Welcome
  screens.sort((a, b) => {
    const ai = CANONICAL_SCREENS.findIndex(
      (c) => a.name.toLowerCase().includes(c.toLowerCase()) || c.toLowerCase().includes(a.name.toLowerCase())
    );
    const bi = CANONICAL_SCREENS.findIndex(
      (c) => b.name.toLowerCase().includes(c.toLowerCase()) || c.toLowerCase().includes(b.name.toLowerCase())
    );
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });

  return screens;
}

function buildSleekPrompt(userPrompt: string): string {
  return `${userPrompt}

Design a COMPLETE mobile app with EXACTLY these 9 screens in this precise order. Name each screen EXACTLY as written below:

Screen 1: "Onboarding Welcome" — hero screen with the app's value proposition, full-bleed design, NO bottom tab bar
Screen 2: "Onboarding Features" — showcase 3 key features with icons, full-bleed design, NO bottom tab bar
Screen 3: "Onboarding Sign Up" — final CTA with account creation options (email, Google, Apple), NO bottom tab bar
Screen 4: "Home Dashboard" — main screen with key metrics, quick actions, activity feed, WITH bottom tab bar
Screen 5: "Core Feature" — the primary feature of this app, richly designed, WITH bottom tab bar
Screen 6: "Secondary Feature" — the second most important feature, WITH bottom tab bar
Screen 7: "Detail Screen" — detail view of a specific item or card, WITH bottom tab bar
Screen 8: "Profile Screen" — user profile with stats and achievements, WITH bottom tab bar
Screen 9: "Settings Screen" — app settings grouped by category, WITH bottom tab bar

Design requirements:
- Dark premium aesthetic with rich, saturated colors matching the app domain
- Bottom tab navigation on screens 4–9 (onboarding screens 1–3: full-bleed, no tab bar)
- Beautiful, production-ready, world-class design
- Consistent design system across all 9 screens`;
}

function buildSleekPromptFree(userPrompt: string): string {
  return `${userPrompt}

Design a FREE PREVIEW mobile app with EXACTLY these 3 screens in this precise order. Name each screen EXACTLY as written below:

Screen 1: "Onboarding Welcome" — hero screen with the app's value proposition, full-bleed design, NO bottom tab bar
Screen 2: "Home Dashboard" — main screen with key metrics and quick actions, WITH bottom tab bar
Screen 3: "Core Feature" — the primary feature of this app, richly designed, WITH bottom tab bar

Design requirements:
- Dark premium aesthetic with rich, saturated colors matching the app domain
- Beautiful, production-ready, world-class design
- Consistent design system across all 3 screens`;
}

export async function generateWithSleek(
  userPrompt: string,
  maxScreens = 9,
): Promise<SleekProject> {
  const appName = userPrompt.slice(0, 60);
  const promptFn = maxScreens <= 3 ? buildSleekPromptFree : buildSleekPrompt;

  const projectId = await createProject(appName);
  const runId = await sendMessage(projectId, promptFn(userPrompt));
  await pollRun(projectId, runId);
  const screens = await listComponents(projectId);

  return { id: projectId, screens: screens.slice(0, maxScreens) };
}
