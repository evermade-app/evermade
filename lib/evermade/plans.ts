export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    screensPerMonth: 3,
    appsPerMonth: 0,
    canExport: false,
    canShare: true,
    description: "Try Evermade — 1 app preview",
  },
  starter: {
    name: "Starter",
    price: 19,
    screensPerMonth: 9,
    appsPerMonth: 1,
    canExport: true,
    canShare: true,
    description: "1 complete app per month",
  },
  pro: {
    name: "Pro",
    price: 49,
    screensPerMonth: 27,
    appsPerMonth: 3,
    canExport: true,
    canShare: true,
    description: "3 complete apps per month",
  },
  agency: {
    name: "Agency",
    price: 149,
    screensPerMonth: 90,
    appsPerMonth: 10,
    canExport: true,
    canShare: true,
    description: "10 complete apps per month",
  },
} as const;

export type PlanId = keyof typeof PLANS;

export function canGenerateApp(
  userPlan: PlanId,
  screensUsedThisMonth: number
): boolean {
  return screensUsedThisMonth + 9 <= PLANS[userPlan].screensPerMonth;
}

export function canExportApp(userPlan: PlanId): boolean {
  return PLANS[userPlan].canExport;
}
