import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextauth";
import { generateWithSleek } from "@/lib/evermade/sleek/client";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import { canGenerateApp, type PlanId } from "@/lib/evermade/plans";

async function getUserPlanAndUsage(userId: string | null): Promise<{
  userPlan: PlanId;
  screensUsed: number;
  shouldReset: boolean;
}> {
  if (!userId) return { userPlan: "starter", screensUsed: 0, shouldReset: false };
  try {
    const supabase = createServiceSupabaseClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan, screens_used_this_month, screens_reset_date")
      .eq("id", userId)
      .single();

    const userPlan = (profile?.plan ?? "starter") as PlanId;
    const screensUsed: number = profile?.screens_used_this_month ?? 0;
    const resetDate = new Date(profile?.screens_reset_date ?? Date.now());
    const now = new Date();
    const shouldReset =
      now.getMonth() !== resetDate.getMonth() ||
      now.getFullYear() !== resetDate.getFullYear();

    return { userPlan, screensUsed, shouldReset };
  } catch {
    return { userPlan: "starter", screensUsed: 0, shouldReset: false };
  }
}

async function incrementUsage(userId: string, currentUsed: number, shouldReset: boolean) {
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

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    if (!process.env.SLEEK_API_KEY) {
      return NextResponse.json({ error: "SLEEK_API_KEY not configured" }, { status: 503 });
    }

    const body = await req.json();
    const prompt: string = body?.prompt?.trim() ?? "";
    const appName: string = body?.appName?.trim() || prompt.slice(0, 60);

    if (!prompt) {
      return NextResponse.json({ error: "prompt is required" }, { status: 400 });
    }

    // ── Plan enforcement ──────────────────────────────────────────────────────
    const userId = session.user.uid ?? null;
    const { userPlan, screensUsed, shouldReset } = await getUserPlanAndUsage(userId);
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

    if (userId) {
      await incrementUsage(userId, screensUsed, shouldReset);
    }

    return NextResponse.json({
      app: {
        id: sleekProject.id,
        appName,
        screens: sleekProject.screens.map((s) => ({
          id: s.id,
          name: s.name,
          html: s.html,
        })),
        activeIndex: 0,
      },
    });
  } catch (err) {
    console.error("[/api/ai/sleek]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Sleek generation failed" },
      { status: 502 }
    );
  }
}
