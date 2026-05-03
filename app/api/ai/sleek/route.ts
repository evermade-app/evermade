import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextauth";
import { generateWithSleek } from "@/lib/evermade/sleek/client";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import {
  normalizePlan,
  canGenerate,
  creditsForScreens,
  PLANS,
  type PlanId,
} from "@/lib/evermade/plans";

// ── DB helpers ────────────────────────────────────────────────────────────────

interface UsageRow {
  plan: string | null;
  credits_used: number;
  credits_reset_date: string | null;
  credits_addons: number;
}

async function getUsage(userId: string): Promise<{
  userPlan: PlanId;
  creditsUsed: number;
  creditsAddons: number;
  shouldReset: boolean;
}> {
  try {
    const supabase = createServiceSupabaseClient();
    const { data } = await supabase
      .from("profiles")
      .select("plan, credits_used, credits_reset_date, credits_addons")
      .eq("id", userId)
      .single<UsageRow>();

    const userPlan = normalizePlan(data?.plan);
    const creditsUsed = data?.credits_used ?? 0;
    const creditsAddons = data?.credits_addons ?? 0;

    let shouldReset = false;
    if (PLANS[userPlan].resetsMonthly && data?.credits_reset_date) {
      const resetDate = new Date(data.credits_reset_date);
      const now = new Date();
      shouldReset =
        now.getMonth() !== resetDate.getMonth() ||
        now.getFullYear() !== resetDate.getFullYear();
    }

    return { userPlan, creditsUsed, creditsAddons, shouldReset };
  } catch {
    return { userPlan: "free", creditsUsed: 0, creditsAddons: 0, shouldReset: false };
  }
}

async function deductCredits(
  userId: string,
  cost: number,
  currentUsed: number,
  shouldReset: boolean,
) {
  try {
    const supabase = createServiceSupabaseClient();
    const base = shouldReset ? 0 : currentUsed;
    await supabase
      .from("profiles")
      .update({
        credits_used: base + cost,
        ...(shouldReset ? { credits_reset_date: new Date().toISOString() } : {}),
      })
      .eq("id", userId);
  } catch {
    // Non-fatal — generation already happened
  }
}

// ── POST /api/ai/sleek ────────────────────────────────────────────────────────
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
    if (!prompt) {
      return NextResponse.json({ error: "prompt is required" }, { status: 400 });
    }

    const userId = session.user.uid ?? null;
    if (!userId) {
      return NextResponse.json({ error: "User ID missing from session" }, { status: 401 });
    }

    const { userPlan, creditsUsed, creditsAddons, shouldReset } = await getUsage(userId);
    const planConfig = PLANS[userPlan];

    // ── Free plan: 1 lifetime generation of 3 screens ─────────────────────────
    if (userPlan === "free") {
      if (!canGenerate("free", creditsUsed, 3)) {
        return NextResponse.json(
          {
            error: "Free preview used",
            message:
              "You've used your free preview. Upgrade to **EverPro ($25/mo)** to generate unlimited apps.",
            upgradeUrl: "/pricing",
          },
          { status: 403 },
        );
      }

      const sleekProject = await generateWithSleek(prompt);
      const screens = sleekProject.screens.slice(0, planConfig.maxScreensPerApp);

      // Inject watermark into each screen's HTML
      const watermark = `<div style="position:fixed;bottom:12px;right:12px;z-index:99999;background:rgba(0,0,0,0.75);color:#fff;padding:5px 10px;border-radius:20px;font-size:10px;font-family:sans-serif;letter-spacing:0.3px;backdrop-filter:blur(8px)">Made with Evermade</div>`;
      const watermarkedScreens = screens.map((s) => ({
        ...s,
        html: s.html.replace("</body>", `${watermark}</body>`),
      }));

      await deductCredits(userId, planConfig.monthlyCredits, creditsUsed, shouldReset);

      const appName = (body?.appName?.trim() || prompt).slice(0, 60);
      return NextResponse.json({
        app: {
          id: sleekProject.id,
          appName: `${appName} (Free Preview)`,
          screens: watermarkedScreens,
          activeIndex: 0,
        },
      });
    }

    // ── Paid plans: credit check ───────────────────────────────────────────────
    const screenCount = planConfig.maxScreensPerApp; // always 9 for paid plans
    const effectiveUsed = shouldReset ? 0 : creditsUsed;

    if (!canGenerate(userPlan, effectiveUsed, screenCount, creditsAddons)) {
      const creditsLeft = Math.max(
        0,
        planConfig.monthlyCredits + creditsAddons - effectiveUsed,
      );
      return NextResponse.json(
        {
          error: "Insufficient credits",
          message: `You have **${creditsLeft} credits** left this month (need ${creditsForScreens(screenCount)} for ${screenCount} screens). Upgrade or purchase add-on credits.`,
          upgradeUrl: "/pricing",
        },
        { status: 403 },
      );
    }

    // ── Generate ──────────────────────────────────────────────────────────────
    const sleekProject = await generateWithSleek(prompt);
    const cost = creditsForScreens(sleekProject.screens.length);

    if (userId) {
      await deductCredits(userId, cost, creditsUsed, shouldReset);
    }

    const appName = (body?.appName?.trim() || prompt).slice(0, 60);
    return NextResponse.json({
      app: {
        id: sleekProject.id,
        appName,
        screens: sleekProject.screens,
        activeIndex: 0,
      },
    });
  } catch (err) {
    console.error("[/api/ai/sleek]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Generation failed" },
      { status: 502 },
    );
  }
}
