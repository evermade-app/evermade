import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextauth";
import { generateWithSleek } from "@/lib/evermade/sleek/client";
import { getUserCredits, deductCredits } from "@/lib/credits";
import { canGenerate, creditsForScreens, PLANS } from "@/lib/evermade/plans";

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

    const userId = session.user.uid;
    if (!userId) {
      return NextResponse.json({ error: "User ID missing from session" }, { status: 401 });
    }

    // getUserCredits handles monthly reset automatically and applies founder rule
    const profile = await getUserCredits(userId, session.user.email ?? undefined);
    const { plan: userPlan, creditsRemaining, creditsUsed, creditsAddons, isFounder } = profile;
    const planConfig = PLANS[userPlan === "owner" ? "evermax" : userPlan];

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
      const screens = sleekProject.screens.slice(0, PLANS.free.maxScreensPerApp);

      const watermark = `<div style="position:fixed;bottom:12px;right:12px;z-index:99999;background:rgba(0,0,0,0.75);color:#fff;padding:5px 10px;border-radius:20px;font-size:10px;font-family:sans-serif;letter-spacing:0.3px;backdrop-filter:blur(8px)">Made with Evermade</div>`;
      const watermarkedScreens = screens.map((s) => ({
        ...s,
        html: s.html.replace("</body>", `${watermark}</body>`),
      }));

      const appName = (body?.appName?.trim() || prompt).slice(0, 60);
      await deductCredits(userId, PLANS.free.monthlyCredits, "generate", `Generated: ${appName} (${screens.length} screens)`);

      return NextResponse.json({
        app: {
          id: sleekProject.id,
          appName: `${appName} (Free Preview)`,
          screens: watermarkedScreens,
          activeIndex: 0,
        },
      });
    }

    // ── Owner / founder: skip credit check, always allow ──────────────────────
    if (isFounder || userPlan === "owner") {
      const sleekProject = await generateWithSleek(prompt);
      const appName = (body?.appName?.trim() || prompt).slice(0, 60);
      return NextResponse.json({
        app: {
          id: sleekProject.id,
          appName,
          screens: sleekProject.screens,
          activeIndex: 0,
        },
      });
    }

    // ── Paid plans: credit check ───────────────────────────────────────────────
    const screenCount = planConfig.maxScreensPerApp;
    const neededCredits = creditsForScreens(screenCount);

    if (!canGenerate(userPlan, creditsUsed, screenCount, creditsAddons)) {
      return NextResponse.json(
        {
          error: "Insufficient credits",
          message: `You have **${creditsRemaining} credits** left this month (need ${neededCredits} for ${screenCount} screens). Upgrade or purchase add-on credits.`,
          upgradeUrl: "/pricing",
        },
        { status: 403 },
      );
    }

    // ── Generate ──────────────────────────────────────────────────────────────
    const sleekProject = await generateWithSleek(prompt);
    const cost = creditsForScreens(sleekProject.screens.length);
    const appName = (body?.appName?.trim() || prompt).slice(0, 60);

    await deductCredits(
      userId,
      cost,
      "generate",
      `Generated: ${appName} (${sleekProject.screens.length} screens)`,
    );

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
