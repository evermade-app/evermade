import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextauth";
import { generateWithSleek } from "@/lib/evermade/sleek/client";
import { convertScreensToRN } from "@/lib/evermade/sleek/rn-converter";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import { canGenerate, normalizePlan, type PlanId } from "@/lib/evermade/plans";

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


// ── Plan + usage check ────────────────────────────────────────────────────────
interface UsageContext {
  userPlan: PlanId;
  screensUsed: number;
  shouldReset: boolean;
}

async function getUserUsage(userId: string): Promise<UsageContext> {
  try {
    const supabase = createServiceSupabaseClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan, screens_used_this_month, screens_reset_date")
      .eq("id", userId)
      .single();

    const userPlan = normalizePlan(profile?.plan);
    const screensUsed: number = profile?.screens_used_this_month ?? 0;

    const resetDate = new Date(profile?.screens_reset_date ?? Date.now());
    const now = new Date();
    const shouldReset =
      now.getMonth() !== resetDate.getMonth() ||
      now.getFullYear() !== resetDate.getFullYear();

    return { userPlan, screensUsed, shouldReset };
  } catch {
    return { userPlan: "free" as PlanId, screensUsed: 0, shouldReset: false };
  }
}

async function incrementScreenUsage(
  userId: string,
  currentUsed: number,
  shouldReset: boolean
): Promise<void> {
  try {
    const supabase = createServiceSupabaseClient();
    const newCount = (shouldReset ? 0 : currentUsed) + 9;
    await supabase
      .from("profiles")
      .update({
        screens_used_this_month: newCount,
        ...(shouldReset ? { screens_reset_date: new Date().toISOString() } : {}),
      })
      .eq("id", userId);
  } catch {
    // Non-fatal
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
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required", redirectUrl: "/login" },
        { status: 401 }
      );
    }

    // ── Plan enforcement ──────────────────────────────────────────────────────
    const userId = session.user.uid ?? null;

    let userPlan: PlanId = "free";
    let screensUsed = 0;
    let shouldReset = false;

    if (userId) {
      ({ userPlan, screensUsed, shouldReset } = await getUserUsage(userId));
    }

    const effectiveUsed = shouldReset ? 0 : screensUsed;

    if (!canGenerate(userPlan, effectiveUsed, 9)) {
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
    if (userId) {
      await incrementScreenUsage(userId, screensUsed, shouldReset);
    }

    return NextResponse.json({ app });
  } catch (err) {
    console.error("[/api/generate]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Generation failed" },
      { status: 502 }
    );
  }
}
