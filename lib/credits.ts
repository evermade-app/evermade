import { createServiceSupabaseClient } from "@/lib/supabase/server";
import { normalizePlan, PLANS, type PlanId } from "@/lib/evermade/plans";

export const FOUNDER_EMAIL = "yonathanbenzaki@gmail.com";

export interface CreditProfile {
  plan: PlanId;
  planName: string;
  isFounder: boolean;
  monthlyCredits: number;
  creditsUsed: number;
  creditsAddons: number;
  creditsRemaining: number;
  resetDate: string | null;
}

export interface CreditTransaction {
  id: string;
  amount: number;
  balance_after: number;
  action: string;
  description: string;
  created_at: string;
}

// ── Founder & plan resolution ─────────────────────────────────────────────────

function resolveEffectivePlan(rawPlan: string | null, email: string): PlanId {
  if (email === FOUNDER_EMAIL) return "owner";
  return normalizePlan(rawPlan);
}

// ── Core: getUserCredits ──────────────────────────────────────────────────────

export async function getUserCredits(
  userId: string,
  userEmail?: string,
): Promise<CreditProfile> {
  const supabase = createServiceSupabaseClient();

  const { data } = await supabase
    .from("profiles")
    .select("plan, credits_used, credits_reset_date, credits_addons, email")
    .eq("id", userId)
    .single();

  const email = (userEmail ?? data?.email ?? "").toLowerCase();
  const isFounder = email === FOUNDER_EMAIL;
  const plan = resolveEffectivePlan(data?.plan, email);

  let creditsUsed = data?.credits_used ?? 0;
  const creditsAddons = data?.credits_addons ?? 0;

  // Monthly reset check
  if (PLANS[plan].resetsMonthly && data?.credits_reset_date) {
    const resetDate = new Date(data.credits_reset_date);
    const now = new Date();
    const needsReset =
      now.getMonth() !== resetDate.getMonth() ||
      now.getFullYear() !== resetDate.getFullYear();
    if (needsReset) {
      creditsUsed = 0;
      await supabase
        .from("profiles")
        .update({ credits_used: 0, credits_reset_date: now.toISOString() })
        .eq("id", userId);
    }
  }

  const monthlyCredits = PLANS[plan].monthlyCredits;
  const creditsRemaining = isFounder
    ? 999_999_999
    : Math.max(0, monthlyCredits + creditsAddons - creditsUsed);

  return {
    plan,
    planName: isFounder ? "EverMax" : PLANS[plan].name,
    isFounder,
    monthlyCredits,
    creditsUsed,
    creditsAddons,
    creditsRemaining,
    resetDate: data?.credits_reset_date ?? null,
  };
}

// ── Core: deductCredits ───────────────────────────────────────────────────────

export async function deductCredits(
  userId: string,
  amount: number,
  action: string,
  description: string,
): Promise<{ success: boolean; remaining: number }> {
  const supabase = createServiceSupabaseClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, credits_used, credits_addons, email")
    .eq("id", userId)
    .single();

  const email = (profile?.email ?? "").toLowerCase();
  if (email === FOUNDER_EMAIL) return { success: true, remaining: 999_999_999 };

  const plan = normalizePlan(profile?.plan);
  if (plan === "owner") return { success: true, remaining: 999_999_999 };

  const currentUsed = profile?.credits_used ?? 0;
  const creditsAddons = profile?.credits_addons ?? 0;
  const monthlyCredits = PLANS[plan].monthlyCredits;
  const available = Math.max(0, monthlyCredits + creditsAddons - currentUsed);

  if (available < amount) return { success: false, remaining: available };

  const newUsed = currentUsed + amount;
  const newRemaining = Math.max(0, monthlyCredits + creditsAddons - newUsed);

  await supabase
    .from("profiles")
    .update({ credits_used: newUsed })
    .eq("id", userId);

  // Log transaction (non-fatal if table doesn't exist)
  try {
    await supabase.from("credit_transactions").insert({
      user_id: userId,
      amount: -amount,
      balance_after: newRemaining,
      action,
      description,
    });
  } catch { /* table may not exist yet */ }

  return { success: true, remaining: newRemaining };
}

// ── Core: addCredits ──────────────────────────────────────────────────────────

export async function addCredits(
  userId: string,
  amount: number,
  source: string,
): Promise<void> {
  const supabase = createServiceSupabaseClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("credits_addons, credits_used, plan")
    .eq("id", userId)
    .single();

  const newAddons = (profile?.credits_addons ?? 0) + amount;
  await supabase.from("profiles").update({ credits_addons: newAddons }).eq("id", userId);

  try {
    const plan = normalizePlan(profile?.plan);
    const used = profile?.credits_used ?? 0;
    const remaining = Math.max(0, PLANS[plan].monthlyCredits + newAddons - used);
    await supabase.from("credit_transactions").insert({
      user_id: userId,
      amount,
      balance_after: remaining,
      action: "purchase",
      description: source,
    });
  } catch { /* non-fatal */ }
}

// ── Core: checkCreditsBeforeAction ────────────────────────────────────────────

export async function checkCreditsBeforeAction(
  userId: string,
  requiredAmount: number,
  userEmail?: string,
): Promise<{ allowed: boolean; remaining: number; plan: PlanId }> {
  const credits = await getUserCredits(userId, userEmail);
  return {
    allowed: credits.isFounder || credits.creditsRemaining >= requiredAmount,
    remaining: credits.creditsRemaining,
    plan: credits.plan,
  };
}

// ── Core: resetMonthlyCredits ─────────────────────────────────────────────────

export async function resetMonthlyCredits(userId: string): Promise<void> {
  const supabase = createServiceSupabaseClient();
  await supabase
    .from("profiles")
    .update({ credits_used: 0, credits_reset_date: new Date().toISOString() })
    .eq("id", userId);
}

// ── Credit history ────────────────────────────────────────────────────────────

export async function getCreditHistory(userId: string): Promise<CreditTransaction[]> {
  const supabase = createServiceSupabaseClient();
  try {
    const { data } = await supabase
      .from("credit_transactions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(25);
    return (data ?? []) as CreditTransaction[];
  } catch {
    return [];
  }
}
