import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextauth";
import { createClient } from "@supabase/supabase-js";
import { PLANS, normalizePlan } from "@/lib/evermade/plans";

const FOUNDER_EMAIL = "yonathanbenzaki@gmail.com";

function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

function startOf(unit: "day" | "week" | "month" | "year", offset = 0): string {
  const d = new Date();
  if (unit === "day") {
    d.setDate(d.getDate() - offset);
    d.setHours(0, 0, 0, 0);
  } else if (unit === "week") {
    d.setDate(d.getDate() - 7 * offset - (d.getDay() || 7) + 1);
    d.setHours(0, 0, 0, 0);
  } else if (unit === "month") {
    d.setMonth(d.getMonth() - offset, 1);
    d.setHours(0, 0, 0, 0);
  } else {
    d.setFullYear(d.getFullYear() - offset, 0, 1);
    d.setHours(0, 0, 0, 0);
  }
  return d.toISOString();
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.email !== FOUNDER_EMAIL) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = db();

  // ── 1. All profiles ────────────────────────────────────────────────────────
  const { data: profiles, error: pErr } = await supabase
    .from("profiles")
    .select("id, email, plan, credits_used, credits_addons, created_at")
    .order("created_at", { ascending: false });

  if (pErr) return Response.json({ error: pErr.message }, { status: 500 });

  // ── 2. All generate transactions ───────────────────────────────────────────
  const { data: transactions } = await supabase
    .from("credit_transactions")
    .select("user_id, created_at, action, description")
    .order("created_at", { ascending: false });

  const txList = transactions ?? [];

  // Per-user: generation count + last active timestamp
  const genCount: Record<string, number> = {};
  const lastActive: Record<string, string> = {};

  for (const tx of txList) {
    if (!lastActive[tx.user_id]) lastActive[tx.user_id] = tx.created_at;
    if (tx.action === "generate") {
      genCount[tx.user_id] = (genCount[tx.user_id] ?? 0) + 1;
    }
  }

  // ── 3. Activity windows ────────────────────────────────────────────────────
  const now30Min = new Date(Date.now() - 30 * 60 * 1000).toISOString();
  const todayStart = startOf("day");
  const yesterdayStart = startOf("day", 1);
  const weekStart = startOf("week");
  const monthStart = startOf("month");
  const yearStart = startOf("year");
  const lastYearStart = startOf("year", 1);

  const activeInWindow = (userId: string, from: string, to?: string) => {
    const la = lastActive[userId];
    if (!la) return false;
    if (to) return la >= from && la < to;
    return la >= from;
  };

  const joinedInWindow = (createdAt: string, from: string, to?: string) => {
    if (to) return createdAt >= from && createdAt < to;
    return createdAt >= from;
  };

  const userSet = (from: string, to?: string) =>
    new Set(
      (profiles ?? [])
        .filter(
          (p) =>
            activeInWindow(p.id, from, to) ||
            joinedInWindow(p.created_at, from, to)
        )
        .map((p) => p.id)
    ).size;

  // ── 4. Build per-user rows ─────────────────────────────────────────────────
  const userRows = (profiles ?? []).map((p) => {
    const plan = normalizePlan(p.plan);
    const monthlyCredits =
      plan === "owner" ? 999_999_999 : PLANS[plan].monthlyCredits;
    const creditsRemaining = Math.max(
      0,
      monthlyCredits + (p.credits_addons ?? 0) - (p.credits_used ?? 0)
    );
    return {
      id: p.id,
      email: p.email ?? "—",
      plan,
      credits_used: p.credits_used ?? 0,
      credits_addons: p.credits_addons ?? 0,
      monthly_credits: monthlyCredits,
      credits_remaining: creditsRemaining,
      generations: genCount[p.id] ?? 0,
      created_at: p.created_at,
      last_active: lastActive[p.id] ?? null,
    };
  });

  // ── 5. Plan breakdown ──────────────────────────────────────────────────────
  const planBreakdown: Record<string, number> = {};
  for (const p of profiles ?? []) {
    const plan = normalizePlan(p.plan);
    planBreakdown[plan] = (planBreakdown[plan] ?? 0) + 1;
  }

  // ── 6. Totals ──────────────────────────────────────────────────────────────
  const liveNow = new Set(
    txList.filter((t) => t.created_at >= now30Min).map((t) => t.user_id)
  ).size;

  return Response.json({
    total_users: (profiles ?? []).length,
    live_now: liveNow,
    today: userSet(todayStart),
    yesterday: userSet(yesterdayStart, todayStart),
    this_week: userSet(weekStart),
    this_month: userSet(monthStart),
    this_year: userSet(yearStart),
    last_year: userSet(lastYearStart, yearStart),
    total_generations: Object.values(genCount).reduce((a, b) => a + b, 0),
    plan_breakdown: planBreakdown,
    users: userRows,
    generated_at: new Date().toISOString(),
  });
}
