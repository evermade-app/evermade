// ── Plan definitions ──────────────────────────────────────────────────────────
export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    monthlyCredits: 5,       // lifetime total, never resets
    resetsMonthly: false,
    maxScreensPerApp: 3,     // preview only — 3 screens shown, watermarked
    watermark: true,
    canExport: false,
    canPublish: false,
    canEditChat: false,
    canBackend: false,
    description: "Try the magic",
  },
  everpro: {
    name: "EverPro",
    price: 25,
    monthlyCredits: 1500,    // ≈ 50 screens ≈ 5 full apps/month
    resetsMonthly: true,
    maxScreensPerApp: 9,
    watermark: false,
    canExport: true,
    canPublish: false,
    canEditChat: true,
    canBackend: false,
    description: "Build real apps. Fast.",
  },
  evermax: {
    name: "EverMax",
    price: 59,
    monthlyCredits: 6000,    // ≈ 200 screens ≈ 20 full apps/month
    resetsMonthly: true,
    maxScreensPerApp: 9,
    watermark: false,
    canExport: true,
    canPublish: true,
    canEditChat: true,
    canBackend: true,
    description: "From idea to App Store.",
  },
  owner: {
    name: "Owner",
    price: 0,
    monthlyCredits: 999_999_999,
    resetsMonthly: false,
    maxScreensPerApp: 9,
    watermark: false,
    canExport: true,
    canPublish: true,
    canEditChat: true,
    canBackend: true,
    description: "Unlimited — internal owner account",
  },
} as const;

export type PlanId = keyof typeof PLANS;

// ── Credit costs ──────────────────────────────────────────────────────────────
export const CREDIT_COSTS = {
  generateScreen: 30,  // per screen
  editChat: 15,        // per chat edit (avg of 10–20 depending on complexity)
  regenerate: 15,      // per screen regeneration
} as const;

// ── Normalize legacy plan names from DB ───────────────────────────────────────
export function normalizePlan(raw: string | null | undefined): PlanId {
  if (!raw) return "free";
  if (raw in PLANS) return raw as PlanId;
  // Map old plan names → new
  const legacy: Record<string, PlanId> = {
    starter: "everpro",
    pro:     "everpro",
    agency:  "evermax",
  };
  return legacy[raw] ?? "free";
}

// ── Credit helpers ────────────────────────────────────────────────────────────
export function creditsForScreens(count: number): number {
  return count * CREDIT_COSTS.generateScreen;
}

export function creditsRemaining(
  plan: PlanId,
  creditsUsed: number,
  creditsAddons = 0,
): number {
  if (plan === "owner") return 999_999_999;
  return Math.max(0, PLANS[plan].monthlyCredits + creditsAddons - creditsUsed);
}

export function canGenerate(
  plan: PlanId,
  creditsUsed: number,
  screenCount: number,
  creditsAddons = 0,
): boolean {
  if (plan === "owner") return true;
  if (plan === "free") return creditsUsed < PLANS.free.monthlyCredits; // 1 free try
  return creditsRemaining(plan, creditsUsed, creditsAddons) >= creditsForScreens(screenCount);
}

export function canExportApp(plan: PlanId): boolean {
  return PLANS[plan].canExport;
}

export function canPublishApp(plan: PlanId): boolean {
  return PLANS[plan].canPublish;
}
