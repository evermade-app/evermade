const BASE = "https://sleek.design/api/v1";
const POLL_INTERVAL = 2500;
const MAX_POLLS = 60;

export interface SleekScreen {
  id: string;
  name: string;
  html: string;
  screenshotUrl?: string;
  screenshotBase64?: string;
}

export interface SleekProject {
  id: string;
  screens: SleekScreen[];
}

function headers() {
  const key = process.env.SLEEK_API_KEY;
  if (!key) throw new Error("SLEEK_API_KEY not configured");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${key}`,
  };
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { ...headers(), ...(init?.headers ?? {}) },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Sleek API ${res.status}: ${body}`);
  }
  return res.json() as Promise<T>;
}

function buildSleekPrompt(userPrompt: string): string {
  return `${userPrompt}

Design a COMPLETE mobile app with EXACTLY these 9 screens:
1. Onboarding Welcome — hero screen with the app's value proposition and a stunning visual
2. Onboarding Features — showcase 3 key features with icons and descriptions
3. Onboarding Get Started — final CTA with account creation options
4. Home / Dashboard — main screen with key metrics, quick actions, and an activity feed
5. Core Feature — the primary feature of this app, richly designed with real data
6. Secondary Feature — the second most important feature with its own unique layout
7. Detail Screen — a detail view of a specific item, card, or profile
8. Profile Screen — user profile with stats, achievements, and account info
9. Settings Screen — app settings and preferences with grouped options

Design requirements:
- Dark premium aesthetic with rich, saturated colors matching the app domain
- Bottom tab navigation (screens 4–9 share the same tab bar)
- Onboarding screens (1–3) have no tab bar — full-bleed hero layout
- Beautiful, production-ready, world-class design
- Consistent typography and design system across all 9 screens
- Make it look like it was built by a $100,000 designer`;
}

async function createProject(userPrompt: string): Promise<{ projectId: string; runId: string }> {
  const project = await request<{ id: string }>("/projects", {
    method: "POST",
    body: JSON.stringify({ name: userPrompt.slice(0, 80) }),
  });

  const fullPrompt = buildSleekPrompt(userPrompt);

  const run = await request<{ id: string }>(`/projects/${project.id}/messages`, {
    method: "POST",
    body: JSON.stringify({ content: fullPrompt }),
  });

  return { projectId: project.id, runId: run.id };
}

async function pollRun(projectId: string, runId: string): Promise<void> {
  for (let i = 0; i < MAX_POLLS; i++) {
    const run = await request<{ status: string; error?: string }>(
      `/projects/${projectId}/runs/${runId}`
    );

    if (
      run.status === "completed" ||
      run.status === "done" ||
      run.status === "success"
    )
      return;

    if (run.status === "failed" || run.status === "error") {
      throw new Error(`Sleek run failed: ${run.error ?? run.status}`);
    }

    await new Promise((r) => setTimeout(r, POLL_INTERVAL));
  }

  throw new Error("Sleek run timed out after 150s");
}

async function fetchScreens(projectId: string): Promise<SleekScreen[]> {
  const data = await request<{ screens?: SleekScreen[]; components?: SleekScreen[] }>(
    `/projects/${projectId}/screens`
  );
  return data.screens ?? data.components ?? [];
}

async function fetchScreenshot(
  projectId: string,
  screenId: string
): Promise<string | undefined> {
  try {
    const data = await request<{
      url?: string;
      base64?: string;
      screenshot?: string;
    }>(`/projects/${projectId}/screens/${screenId}/screenshot`);
    return (
      data.url ??
      data.screenshot ??
      (data.base64 ? `data:image/png;base64,${data.base64}` : undefined)
    );
  } catch {
    return undefined;
  }
}

export async function generateWithSleek(userPrompt: string): Promise<SleekProject> {
  const { projectId, runId } = await createProject(userPrompt);
  await pollRun(projectId, runId);

  const screens = await fetchScreens(projectId);

  const screensWithShots = await Promise.all(
    screens.map(async (screen) => ({
      ...screen,
      screenshotUrl: await fetchScreenshot(projectId, screen.id),
    }))
  );

  return { id: projectId, screens: screensWithShots };
}
