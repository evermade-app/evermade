import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { generateWithSleek } from "@/lib/evermade/sleek/client";
import { convertScreensToRN } from "@/lib/evermade/sleek/rn-converter";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { canGenerateApp, type PlanId } from "@/lib/evermade/plans";

export interface GeneratedApp {
  id: string;
  prompt: string;
  appName: string;
  screens: Array<{
    id: string;
    name: string;
    html: string;
    screenshotUrl?: string;
    componentName: string;
    rnCode: string;
  }>;
  createdAt: string;
}

// In-memory cache keyed by Sleek project ID (TTL: 1 hour)
const appCache = new Map<string, { app: GeneratedApp; expiresAt: number }>();

function purgeExpired() {
  const now = Date.now();
  for (const [k, v] of appCache) {
    if (v.expiresAt < now) appCache.delete(k);
  }
}

export function getCachedApp(id: string): GeneratedApp | undefined {
  purgeExpired();
  return appCache.get(id)?.app;
}

// ── Session helper ────────────────────────────────────────────────────────────
// Returns a stable session ID from cookie. When real Supabase auth is wired in,
// replace this with the authenticated user's UUID.
async function getSessionId(): Promise<string | null> {
  const jar = await cookies();
  return jar.get("evermade-sid")?.value ?? null;
}

// ── Plan + usage check ────────────────────────────────────────────────────────
interface UsageContext {
  userPlan: PlanId;
  screensUsed: number;
  shouldReset: boolean;
}

async function getUserUsage(sessionId: string): Promise<UsageContext> {
  try {
    const supabase = createServerSupabaseClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan, screens_used_this_month, screens_reset_date")
      .eq("session_id", sessionId)
      .single();

    const userPlan = ((profile?.plan ?? "free") as PlanId);
    const screensUsed: number = profile?.screens_used_this_month ?? 0;

    const resetDate = new Date(profile?.screens_reset_date ?? Date.now());
    const now = new Date();
    const shouldReset =
      now.getMonth() !== resetDate.getMonth() ||
      now.getFullYear() !== resetDate.getFullYear();

    return { userPlan, screensUsed, shouldReset };
  } catch {
    // Supabase table not set up yet — treat as free plan with 0 usage
    return { userPlan: "free", screensUsed: 0, shouldReset: false };
  }
}

async function incrementScreenUsage(
  sessionId: string,
  currentUsed: number,
  shouldReset: boolean
): Promise<void> {
  try {
    const supabase = createServerSupabaseClient();
    const newCount = (shouldReset ? 0 : currentUsed) + 9;
    await supabase
      .from("profiles")
      .upsert(
        {
          session_id: sessionId,
          screens_used_this_month: newCount,
          screens_reset_date: shouldReset ? new Date().toISOString() : undefined,
        },
        { onConflict: "session_id" }
      );
  } catch {
    // Non-fatal — generation still succeeds even if we can't track
  }
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt: string = body?.prompt?.trim() ?? "";
    const appName: string = body?.appName?.trim() || prompt.slice(0, 60);

    if (!prompt) {
      return NextResponse.json({ error: "prompt is required" }, { status: 400 });
    }

    if (!process.env.SLEEK_API_KEY) {
      return NextResponse.json({ error: "SLEEK_API_KEY not configured" }, { status: 503 });
    }

    // ── Auth guard ────────────────────────────────────────────────────────────
    const jar = await cookies();
    const authCookie = jar.get("evermade-auth")?.value;
    if (authCookie !== "true") {
      return NextResponse.json(
        { error: "Authentication required", redirectUrl: "/login" },
        { status: 401 }
      );
    }

    // ── Plan enforcement ──────────────────────────────────────────────────────
    let sessionId = jar.get("evermade-sid")?.value;
    if (!sessionId) {
      // Generate a new session ID on first API call
      sessionId = `sid_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    }

    const { userPlan, screensUsed, shouldReset } = await getUserUsage(sessionId);
    const effectiveUsed = shouldReset ? 0 : screensUsed;

    if (!canGenerateApp(userPlan, effectiveUsed)) {
      return NextResponse.json(
        {
          error: "Screen limit reached",
          message: `You've used all ${effectiveUsed} screens this month on the ${userPlan} plan. Upgrade to generate more apps.`,
          upgradeUrl: "/pricing",
        },
        { status: 403 }
      );
    }

    // ── Generate ──────────────────────────────────────────────────────────────
    const sleekProject = await generateWithSleek(prompt);
    const rnScreens = await convertScreensToRN(sleekProject.screens);

    const screens = sleekProject.screens.map((screen, i) => ({
      id: screen.id,
      name: screen.name,
      html: screen.html,
      screenshotUrl: screen.screenshotUrl,
      componentName: rnScreens[i]?.componentName ?? `Screen${i}`,
      rnCode: rnScreens[i]?.code ?? "",
    }));

    const app: GeneratedApp = {
      id: sleekProject.id,
      prompt,
      appName,
      screens,
      createdAt: new Date().toISOString(),
    };

    appCache.set(app.id, { app, expiresAt: Date.now() + 60 * 60 * 1000 });

    // ── Track usage ───────────────────────────────────────────────────────────
    await incrementScreenUsage(sessionId, screensUsed, shouldReset);

    // ── Response — set session cookie if new ──────────────────────────────────
    const response = NextResponse.json({ app });
    const existingSid = await getSessionId();
    if (!existingSid) {
      response.cookies.set("evermade-sid", sessionId, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
        httpOnly: true,
      });
    }

    return response;
  } catch (err) {
    console.error("[/api/generate]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Generation failed" },
      { status: 502 }
    );
  }
}
