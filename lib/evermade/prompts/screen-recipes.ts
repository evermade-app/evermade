/**
 * Pre-built screen JSON examples injected into AI prompts as few-shot examples.
 * Each recipe is a complete screen object that demonstrates the expected output format.
 */

export type ScreenRecipe = {
  name: string;
  style: Record<string, string>;
  components: Array<{
    id: string;
    type: string;
    props: Record<string, unknown>;
  }>;
};

// ── Fitness / Health ──────────────────────────────────────────────────────────

export const FITNESS_HOME_RECIPE: ScreenRecipe = {
  name: "Home",
  style: { background: "#080510" },
  components: [
    { id: "c1", type: "hero-banner", props: { title: "Good Morning, Alex", subtitle: "Let's crush today", badge: "Day 14 Streak", gradientStart: "#7c3aed", gradientEnd: "#2563eb" } },
    { id: "c2", type: "spacer", props: { height: 10 } },
    { id: "c3", type: "bento-grid", props: { items: [
      { title: "Steps", value: "8,420", icon: "👟", color: "#7c5cfc" },
      { title: "Sleep", value: "7.5h", icon: "😴", color: "#06b6d4" },
      { title: "Calories", value: "1,840", icon: "🔥", color: "#f97316" },
      { title: "Water", value: "2.1L", icon: "💧", color: "#34d399" },
    ] } },
    { id: "c4", type: "spacer", props: { height: 10 } },
    { id: "c5", type: "gradient-analytics-card", props: { title: "Weekly Activity", period: "This week", bars: [40, 65, 50, 78, 62, 88, 74] } },
    { id: "c6", type: "spacer", props: { height: 10 } },
    { id: "c7", type: "subtitle", props: { text: "Recent Workouts" } },
    { id: "c8", type: "list_item", props: { registryComponentId: "activity-list-item", title: "Morning Run", timestamp: "Today · 7:30 AM", message: "32 min · 284 cal", icon: "🏃" } },
    { id: "c9", type: "list_item", props: { registryComponentId: "activity-list-item", title: "Strength Training", timestamp: "Yesterday · 5:15 PM", message: "45 min · 310 cal", icon: "🏋️" } },
    { id: "c10", type: "spacer", props: { height: 10 } },
    { id: "c11", type: "cta_button", props: { registryComponentId: "pill-generate-button", label: "Log Workout" } },
    { id: "c12", type: "spacer", props: { height: 8 } },
    { id: "c13", type: "metric_card", props: { registryComponentId: "app-tab-bar", tabs: [
      { icon: "🏠", label: "Home", active: true },
      { icon: "📊", label: "Stats" },
      { icon: "🏋️", label: "Workout" },
      { icon: "👤", label: "Profile" },
    ] } },
  ],
};

// ── Finance ───────────────────────────────────────────────────────────────────

export const FINANCE_HOME_RECIPE: ScreenRecipe = {
  name: "Home",
  style: { background: "#06060e" },
  components: [
    { id: "c1", type: "hero-banner", props: { title: "$24,850.00", subtitle: "Total Balance", badge: "Portfolio", gradientStart: "#1e3a5f", gradientEnd: "#0a1628" } },
    { id: "c2", type: "spacer", props: { height: 10 } },
    { id: "c3", type: "metric_card", props: { registryComponentId: "kpi-glow-card", value: "+$1,240", label: "Today's P&L" } },
    { id: "c4", type: "spacer", props: { height: 8 } },
    { id: "c5", type: "metric_card", props: { registryComponentId: "quick-actions-row", actions: [
      { icon: "💸", label: "Send", color: "#7c5cfc" },
      { icon: "📥", label: "Receive", color: "#06b6d4" },
      { icon: "💳", label: "Pay", color: "#34d399" },
      { icon: "📊", label: "Invest", color: "#f97316" },
    ] } },
    { id: "c6", type: "spacer", props: { height: 10 } },
    { id: "c7", type: "subtitle", props: { text: "Recent Transactions" } },
    { id: "c8", type: "metric_card", props: { registryComponentId: "transaction-item", title: "Netflix", amount: "$15.99", date: "Today", icon: "🎬", positive: false, category: "Subscription" } },
    { id: "c9", type: "spacer", props: { height: 4 } },
    { id: "c10", type: "metric_card", props: { registryComponentId: "transaction-item", title: "Salary Deposit", amount: "$4,500.00", date: "Yesterday", icon: "🏦", positive: true, category: "Income" } },
    { id: "c11", type: "spacer", props: { height: 4 } },
    { id: "c12", type: "metric_card", props: { registryComponentId: "transaction-item", title: "Whole Foods", amount: "$67.42", date: "Mon", icon: "🛒", positive: false, category: "Groceries" } },
    { id: "c13", type: "spacer", props: { height: 10 } },
    { id: "c14", type: "metric_card", props: { registryComponentId: "app-tab-bar", tabs: [
      { icon: "🏠", label: "Home", active: true },
      { icon: "📈", label: "Portfolio" },
      { icon: "💸", label: "Pay" },
      { icon: "👤", label: "Profile" },
    ] } },
  ],
};

// ── Social ────────────────────────────────────────────────────────────────────

export const SOCIAL_FEED_RECIPE: ScreenRecipe = {
  name: "Feed",
  style: { background: "#07080f" },
  components: [
    { id: "c1", type: "title", props: { text: "Feed" } },
    { id: "c2", type: "metric_card", props: { registryComponentId: "soft-pill-input", placeholder: "Search people & posts..." } },
    { id: "c3", type: "spacer", props: { height: 8 } },
    { id: "c4", type: "metric_card", props: { registryComponentId: "avatar-stack", label: "Active now (24)", count: 24, avatars: [
      { initial: "A", color: "#7c5cfc" },
      { initial: "K", color: "#f97316" },
      { initial: "M", color: "#06b6d4" },
      { initial: "J", color: "#f472b6" },
    ] } },
    { id: "c5", type: "spacer", props: { height: 10 } },
    { id: "c6", type: "metric_card", props: { registryComponentId: "user-list-item", name: "Alice Chen", role: "Just posted · 2m ago", avatar: "A", online: true, avatarColor: "#7c5cfc", action: "Follow" } },
    { id: "c7", type: "spacer", props: { height: 4 } },
    { id: "c8", type: "metric_card", props: { registryComponentId: "user-list-item", name: "Kevin Park", role: "Shared a story · 15m ago", avatar: "K", online: true, avatarColor: "#f97316", action: "View" } },
    { id: "c9", type: "spacer", props: { height: 4 } },
    { id: "c10", type: "metric_card", props: { registryComponentId: "user-list-item", name: "Maria Santos", role: "New post · 1h ago", avatar: "M", online: false, avatarColor: "#06b6d4" } },
    { id: "c11", type: "spacer", props: { height: 10 } },
    { id: "c12", type: "metric_card", props: { registryComponentId: "app-tab-bar", tabs: [
      { icon: "🏠", label: "Feed", active: true },
      { icon: "🔍", label: "Explore" },
      { icon: "➕", label: "Post" },
      { icon: "💬", label: "Messages" },
      { icon: "👤", label: "Profile" },
    ] } },
  ],
};

// ── Productivity ──────────────────────────────────────────────────────────────

export const PRODUCTIVITY_HOME_RECIPE: ScreenRecipe = {
  name: "Home",
  style: { background: "#070812" },
  components: [
    { id: "c1", type: "hero-banner", props: { title: "12 tasks today", subtitle: "Stay focused", badge: "Focus Mode", gradientStart: "#0f172a", gradientEnd: "#1e293b" } },
    { id: "c2", type: "spacer", props: { height: 10 } },
    { id: "c3", type: "metric_card", props: { registryComponentId: "bento-grid", items: [
      { title: "Done", value: "7", icon: "✅", color: "#34d399" },
      { title: "Pending", value: "5", icon: "⏳", color: "#f97316" },
      { title: "Overdue", value: "2", icon: "🔴", color: "#f87171" },
      { title: "Focus", value: "2.4h", icon: "🎯", color: "#7c5cfc" },
    ] } },
    { id: "c4", type: "spacer", props: { height: 10 } },
    { id: "c5", type: "subtitle", props: { text: "Today's Schedule" } },
    { id: "c6", type: "metric_card", props: { registryComponentId: "date-picker-row", label: "Week of Apr 14", dates: ["M\n14","T\n15","W\n16","T\n17","F\n18","S\n19","S\n20"], selectedIndex: 2 } },
    { id: "c7", type: "spacer", props: { height: 8 } },
    { id: "c8", type: "metric_card", props: { registryComponentId: "timeline-item", title: "Team Standup", subtitle: "Engineering · Zoom", time: "9:00 AM", color: "#7c5cfc" } },
    { id: "c9", type: "metric_card", props: { registryComponentId: "timeline-item", title: "Design Review", subtitle: "Product team", time: "11:30 AM", color: "#06b6d4" } },
    { id: "c10", type: "metric_card", props: { registryComponentId: "timeline-item", title: "Sprint Planning", subtitle: "All hands", time: "2:00 PM", color: "#f97316", isLast: true } },
    { id: "c11", type: "spacer", props: { height: 10 } },
    { id: "c12", type: "metric_card", props: { registryComponentId: "app-tab-bar", tabs: [
      { icon: "🏠", label: "Home", active: true },
      { icon: "✅", label: "Tasks" },
      { icon: "📅", label: "Calendar" },
      { icon: "👤", label: "Profile" },
    ] } },
  ],
};

// ── E-commerce ────────────────────────────────────────────────────────────────

export const ECOMMERCE_HOME_RECIPE: ScreenRecipe = {
  name: "Home",
  style: { background: "#080a10" },
  components: [
    { id: "c1", type: "hero-banner", props: { title: "Summer Sale", subtitle: "Up to 50% off", badge: "Limited Time", gradientStart: "#831843", gradientEnd: "#1e1b4b" } },
    { id: "c2", type: "spacer", props: { height: 10 } },
    { id: "c3", type: "metric_card", props: { registryComponentId: "soft-pill-input", placeholder: "Search products..." } },
    { id: "c4", type: "spacer", props: { height: 10 } },
    { id: "c5", type: "subtitle", props: { text: "Featured" } },
    { id: "c6", type: "metric_card", props: { registryComponentId: "horizontal-scroll-cards", cards: [
      { title: "Electronics", value: "240+", icon: "📱", color: "#7c5cfc" },
      { title: "Fashion", value: "1.2K", icon: "👗", color: "#f472b6" },
      { title: "Home", value: "380+", icon: "🏠", color: "#f97316" },
      { title: "Sports", value: "620+", icon: "⚽", color: "#34d399" },
    ] } },
    { id: "c7", type: "spacer", props: { height: 10 } },
    { id: "c8", type: "subtitle", props: { text: "Trending Now" } },
    { id: "c9", type: "metric_card", props: { registryComponentId: "premium-list-item", icon: "📱", iconBg: "rgba(124,92,252,0.2)", title: "iPhone 16 Pro Case", subtitle: "MagSafe Compatible · Midnight", value: "$49" } },
    { id: "c10", type: "spacer", props: { height: 4 } },
    { id: "c11", type: "metric_card", props: { registryComponentId: "premium-list-item", icon: "🎧", iconBg: "rgba(6,182,212,0.2)", title: "AirPods Pro 3", subtitle: "Noise Cancelling · White", value: "$249" } },
    { id: "c12", type: "spacer", props: { height: 10 } },
    { id: "c13", type: "metric_card", props: { registryComponentId: "app-tab-bar", tabs: [
      { icon: "🏠", label: "Home", active: true },
      { icon: "🔍", label: "Search" },
      { icon: "🛒", label: "Cart" },
      { icon: "👤", label: "Account" },
    ] } },
  ],
};

// ── Registry ──────────────────────────────────────────────────────────────────

export const SCREEN_RECIPES: Record<string, ScreenRecipe> = {
  fitness: FITNESS_HOME_RECIPE,
  finance: FINANCE_HOME_RECIPE,
  social: SOCIAL_FEED_RECIPE,
  productivity: PRODUCTIVITY_HOME_RECIPE,
  ecommerce: ECOMMERCE_HOME_RECIPE,
};

export function getRecipeForCategory(category: string): ScreenRecipe | null {
  return SCREEN_RECIPES[category] ?? null;
}

export function buildRecipesExampleBlock(): string {
  const examples = [
    { category: "fitness", recipe: FITNESS_HOME_RECIPE },
    { category: "finance", recipe: FINANCE_HOME_RECIPE },
  ];
  return examples.map(({ category, recipe }) =>
    `### ${category.toUpperCase()} example\n\`\`\`json\n${JSON.stringify(recipe, null, 2)}\n\`\`\``
  ).join("\n\n");
}
