import { createClient } from "@supabase/supabase-js";
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

// ── Supabase admin client — created directly, never via helper ────────────────
// Uses SERVICE_ROLE key explicitly. This key bypasses RLS on all tables.

function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) throw new Error("[credits] NEXT_PUBLIC_SUPABASE_URL is not set");
  if (!key) throw new Error("[credits] SUPABASE_SERVICE_ROLE_KEY is not set");

  console.log("[credits] using service key prefix:", key.slice(0, 16));

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// ── Founder & plan resolution ─────────────────────────────────────────────────

function resolveEffectivePlan(rawPlan: string | null, email: string): PlanId {
  // Email override is a fallback only — if the DB has an explicit plan, trust it.
  // This lets the founder test restricted plans by manually setting them in the DB.
  if (!rawPlan && email === FOUNDER_EMAIL) return "owner";
  return normalizePlan(rawPlan);
}

// ── Core: getUserCredits ──────────────────────────────────────────────────────

export async function getUserCredits(
  userId: string,
  userEmail?: string,
): Promise<CreditProfile> {
  const db = adminClient();

  const { data, error } = await db
    .from("profiles")
    .select("plan, credits_used, credits_reset_date, credits_addons, email")
    .eq("id", userId)
    .single();

  if (error) console.error("[credits:getUserCredits] error:", error.message);

  const email = (userEmail ?? data?.email ?? "").toLowerCase();
  const isFounder = email === FOUNDER_EMAIL;
  const plan = resolveEffectivePlan(data?.plan, email);

  let creditsUsed = data?.credits_used ?? 0;
  const creditsAddons = data?.credits_addons ?? 0;

  // Monthly reset
  if (PLANS[plan].resetsMonthly && data?.credits_reset_date) {
    const resetDate = new Date(data.credits_reset_date);
    const now = new Date();
    if (
      now.getMonth() !== resetDate.getMonth() ||
      now.getFullYear() !== resetDate.getFullYear()
    ) {
      creditsUsed = 0;
      await db
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
  console.log("[credits:deduct] ── START ──", { userId, amount, action, description });

  const db = adminClient();

  // 1. Fetch current profile
  const { data: profile, error: profileErr } = await db
    .from("profiles")
    .select("plan, credits_used, credits_addons, email")
    .eq("id", userId)
    .single();

  if (profileErr) {
    console.error("[credits:deduct] profile fetch FAILED:", profileErr.message);
  }
  console.log("[credits:deduct] profile row:", JSON.stringify(profile));

  const email = (profile?.email ?? "").toLowerCase();
  const isFounder = email === FOUNDER_EMAIL;
  const plan = normalizePlan(profile?.plan);
  const isOwner = plan === "owner" || isFounder;

  const currentUsed  = profile?.credits_used  ?? 0;
  const creditsAddons = profile?.credits_addons ?? 0;
  const monthlyCredits = isOwner ? 999_999_999 : PLANS[plan].monthlyCredits;
  const newUsed      = isOwner ? currentUsed : currentUsed + amount;
  const newRemaining = isOwner
    ? 999_999_999
    : Math.max(0, monthlyCredits + creditsAddons - newUsed);

  // 2. Check available credits (skip for owner/founder)
  if (!isOwner) {
    const available = Math.max(0, monthlyCredits + creditsAddons - currentUsed);
    if (available < amount) {
      console.log("[credits:deduct] insufficient credits", { available, needed: amount });
      return { success: false, remaining: available };
    }

    // 3. Update credits_used in profiles
    const { error: updateErr } = await db
      .from("profiles")
      .update({ credits_used: newUsed })
      .eq("id", userId);

    if (updateErr) {
      console.error("[credits:deduct] profile update FAILED:", updateErr.message);
    } else {
      console.log("[credits:deduct] profile credits_used updated →", newUsed);
    }
  }

  // 4. Insert transaction row — log everything regardless of plan
  console.log("[credits:deduct] inserting into credit_transactions:", {
    user_id: userId,
    amount: isOwner ? 0 : -amount,
    balance_after: newRemaining,
    action,
    description,
  });

  const { data: txData, error: txError } = await db
    .from("credit_transactions")
    .insert({
      user_id: userId,
      amount: isOwner ? 0 : -amount,
      balance_after: newRemaining,
      action,
      description,
    })
    .select();

  if (txError) {
    console.error(
      "[credits:deduct] credit_transactions INSERT FAILED",
      "\n  code:", txError.code,
      "\n  message:", txError.message,
      "\n  details:", txError.details,
      "\n  hint:", txError.hint,
    );
  } else {
    console.log("[credits:deduct] credit_transactions INSERT OK:", JSON.stringify(txData));
  }

  console.log("[credits:deduct] ── END ──", { success: true, remaining: newRemaining });
  return { success: true, remaining: newRemaining };
}

// ── Core: addCredits ──────────────────────────────────────────────────────────

export async function addCredits(
  userId: string,
  amount: number,
  source: string,
): Promise<void> {
  const db = adminClient();

  const { data: profile } = await db
    .from("profiles")
    .select("credits_addons, credits_used, plan")
    .eq("id", userId)
    .single();

  const newAddons = (profile?.credits_addons ?? 0) + amount;
  await db.from("profiles").update({ credits_addons: newAddons }).eq("id", userId);

  const plan = normalizePlan(profile?.plan);
  const used = profile?.credits_used ?? 0;
  const remaining = Math.max(0, PLANS[plan].monthlyCredits + newAddons - used);

  const { error: txError } = await db.from("credit_transactions").insert({
    user_id: userId,
    amount,
    balance_after: remaining,
    action: "purchase",
    description: source,
  });
  if (txError) console.error("[credits:addCredits] INSERT FAILED:", txError.message);
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
  const db = adminClient();
  await db
    .from("profiles")
    .update({ credits_used: 0, credits_reset_date: new Date().toISOString() })
    .eq("id", userId);
}

// ── Credit history ────────────────────────────────────────────────────────────

export async function getCreditHistory(userId: string): Promise<CreditTransaction[]> {
  const db = adminClient();
  const { data, error } = await db
    .from("credit_transactions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(25);
  if (error) console.error("[credits:getCreditHistory] FAILED:", error.message, error.code);
  return (data ?? []) as CreditTransaction[];
}
