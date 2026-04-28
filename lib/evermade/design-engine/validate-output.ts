/**
 * Validates AI-generated screen JSON before applying it to the project.
 * Returns a score (0–100) and a list of issues found.
 */

export type ValidationResult = {
  score: number;
  passed: boolean;
  issues: string[];
  warnings: string[];
};

const KNOWN_TYPES = new Set([
  "title", "subtitle", "spacer", "divider",
  "hero-banner", "metric_card", "list_item", "cta_button",
  "avatar", "settings_row",
]);

const KNOWN_REGISTRY_IDS = new Set([
  // Core components
  "kpi-glow-card", "sales-metric-card", "gradient-analytics-card",
  "neumorph-dark-card", "premium-ribbon-card", "chat-composer-card",
  "activity-list-item", "stacked-notification-card", "pro-pricing-card",
  "pill-generate-button", "pill-explore-button", "cta-glow-arrow-button",
  "gradient-start-button", "floating-chat-button", "soft-pill-input",
  "toggle-neumorphic-switch", "cyber-segment-nav", "on-off-pill",
  "map-preview", "rating-stars", "glass-card", "hero-banner",
  "stat-badge", "avatar-stack", "bento-grid", "timeline-item",
  "premium-list-item", "onboarding-slide", "profile-header",
  "quick-actions-row", "featured-card", "progress-ring",
  "app-tab-bar", "mini-sparkline", "transaction-item",
  "horizontal-scroll-cards", "user-list-item", "empty-state",
  "date-picker-row", "status-banner",
  // shadcn/ui components
  "shadcn-button-primary", "shadcn-button-secondary", "shadcn-button-ghost",
  "shadcn-card-metric", "shadcn-card-feature", "shadcn-card-profile",
  "shadcn-badge-status", "shadcn-progress-bar", "shadcn-tabs",
  "shadcn-alert", "shadcn-switch-row", "shadcn-skeleton-card",
  // Untitled UI components
  "untitled-metric-card", "untitled-avatar-group", "untitled-feature-item",
  "untitled-pricing-row", "untitled-notification", "untitled-step-progress",
]);

type ComponentLike = {
  id?: unknown;
  type?: unknown;
  props?: unknown;
};

type ScreenLike = {
  id?: unknown;
  name?: unknown;
  style?: unknown;
  components?: unknown;
};

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

export function validateScreen(screen: unknown): ValidationResult {
  const issues: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  if (!isObject(screen)) {
    return { score: 0, passed: false, issues: ["Screen must be an object"], warnings: [] };
  }

  const s = screen as ScreenLike;

  // ── Required fields ────────────────────────────────────────────────────────
  if (typeof s.id !== "string" || !s.id) {
    issues.push("Screen missing required field: id");
    score -= 20;
  }
  if (typeof s.name !== "string" || !s.name) {
    issues.push("Screen missing required field: name");
    score -= 10;
  }

  // ── Components array ───────────────────────────────────────────────────────
  if (!Array.isArray(s.components)) {
    issues.push("Screen.components must be an array");
    score -= 30;
    return { score: Math.max(0, score), passed: score >= 60, issues, warnings };
  }

  const components = s.components as ComponentLike[];

  if (components.length === 0) {
    issues.push("Screen has no components");
    score -= 20;
  }

  if (components.length < 8) {
    warnings.push(`Screen has only ${components.length} component(s) — MINIMUM 8 required`);
    score -= 15;
  }

  // ── Component-level checks ─────────────────────────────────────────────────
  const ids = new Set<string>();
  let hasTabBar = false;

  for (let i = 0; i < components.length; i++) {
    const c = components[i];
    const prefix = `Component[${i}]`;

    if (!isObject(c)) {
      issues.push(`${prefix} is not an object`);
      score -= 5;
      continue;
    }

    if (typeof c.id !== "string" || !c.id) {
      issues.push(`${prefix} missing id`);
      score -= 5;
    } else {
      if (ids.has(c.id as string)) {
        issues.push(`Duplicate component id: "${c.id}"`);
        score -= 5;
      }
      ids.add(c.id as string);
    }

    if (typeof c.type !== "string" || !c.type) {
      issues.push(`${prefix} missing type`);
      score -= 5;
    } else if (!KNOWN_TYPES.has(c.type as string)) {
      warnings.push(`${prefix} has unknown type: "${c.type}"`);
    }

    if (!isObject(c.props)) {
      issues.push(`${prefix} props must be an object`);
      score -= 3;
    } else {
      const regId = (c.props as Record<string, unknown>).registryComponentId;
      if (typeof regId === "string") {
        if (!KNOWN_REGISTRY_IDS.has(regId)) {
          warnings.push(`${prefix} references unknown registryComponentId: "${regId}"`);
        }
        if (regId === "app-tab-bar") hasTabBar = true;
      }
    }
  }

  if (!hasTabBar) {
    warnings.push("Screen is missing app-tab-bar — all screens should have a tab bar");
    score -= 8;
  }

  // ── Style checks ───────────────────────────────────────────────────────────
  if (isObject(s.style)) {
    const style = s.style as Record<string, unknown>;
    if (!style.background) {
      warnings.push("Screen style missing background color");
      score -= 3;
    }
  } else if (s.style !== undefined) {
    warnings.push("Screen style should be an object");
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    passed: score >= 60,
    issues,
    warnings,
  };
}

export function validateAction(action: unknown): ValidationResult {
  const issues: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  if (!isObject(action)) {
    return { score: 0, passed: false, issues: ["Action must be an object"], warnings: [] };
  }

  const a = action as Record<string, unknown>;

  if (typeof a.type !== "string" || !a.type) {
    issues.push("Action missing required field: type");
    score -= 40;
  }

  if ((a.type === "add_screen" || a.type === "generate_screen") && isObject(a.screen)) {
    const screenResult = validateScreen(a.screen);
    issues.push(...screenResult.issues.map((i) => `Screen: ${i}`));
    warnings.push(...screenResult.warnings.map((w) => `Screen: ${w}`));
    score = Math.min(score, screenResult.score);
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    passed: score >= 60,
    issues,
    warnings,
  };
}

export function validateAiResponse(response: unknown): ValidationResult {
  const issues: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  if (!isObject(response)) {
    return { score: 0, passed: false, issues: ["Response must be an object"], warnings: [] };
  }

  const r = response as Record<string, unknown>;
  const actions = r.actions;

  if (!Array.isArray(actions) || actions.length === 0) {
    if (typeof r.message !== "string") {
      issues.push("Response has neither actions nor a message");
      score -= 30;
    }
  } else {
    for (let i = 0; i < actions.length; i++) {
      const result = validateAction(actions[i]);
      issues.push(...result.issues.map((x) => `Action[${i}]: ${x}`));
      warnings.push(...result.warnings.map((x) => `Action[${i}]: ${x}`));
      if (!result.passed) score -= 20;
    }
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    passed: score >= 60,
    issues,
    warnings,
  };
}
