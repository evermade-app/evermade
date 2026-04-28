import type { Screen, AppComponent, Theme } from "./project";
import { addScreenToProject } from "./projectState";
import type { Project } from "./project";

// ── Helpers ───────────────────────────────────────────────────────────────────

function uid(): string {
  return Math.random().toString(36).slice(2, 8);
}

function c(type: AppComponent["type"], props: Record<string, unknown>): AppComponent {
  return { id: `comp_gen_${uid()}`, type, props } as AppComponent;
}

// ── Screen type detection ─────────────────────────────────────────────────────

type ScreenType =
  | "home" | "dashboard" | "profile" | "settings"
  | "fitness" | "finance" | "health" | "social" | "explore";

export type ScreenRequest = {
  screenType: ScreenType;
  screenId: string;
  screenName: string;
};

const SCREEN_PATTERNS: Array<{ type: ScreenType; id: string; name: string; patterns: RegExp }> = [
  { type: "home",      id: "screen_home",     name: "Home",      patterns: /\b(home|main|landing|start|welcome|hero|overview|principal)\b/ },
  { type: "dashboard", id: "screen_dashboard", name: "Dashboard", patterns: /\b(dashboard|summary|stats|metrics|kpi|analytics)\b/ },
  { type: "profile",   id: "screen_profile",   name: "Profile",   patterns: /\b(profile|account|user|me|my account|avatar)\b/ },
  { type: "settings",  id: "screen_settings",  name: "Settings",  patterns: /\b(settings|preferences|config|options|parameter)\b/ },
  { type: "fitness",   id: "screen_fitness",   name: "Fitness",   patterns: /\b(fitness|workout|exercise|gym|sport|train|run|yoga|health|muscle)\b/ },
  { type: "finance",   id: "screen_finance",   name: "Finance",   patterns: /\b(finance|money|invest|bank|crypto|wallet|payment|spend|budget|earning)\b/ },
  { type: "health",    id: "screen_health",    name: "Health",    patterns: /\b(health|medical|wellness|mental|doctor|nurse|patient|vital|care)\b/ },
  { type: "social",    id: "screen_social",    name: "Social",    patterns: /\b(social|feed|post|community|friend|follow|chat|message|communit)\b/ },
  { type: "explore",   id: "screen_explore",   name: "Explore",   patterns: /\b(explore|discover|search|browse|find|trending|catalog)\b/ },
];

const IS_CREATE = /\b(create|generate|make|build|design|show|give me|add|new|beautiful|nice|cool|stunning|gorgeous|amazing|redesign|rebuild|fresh|modern|premium|refaire|créer|faire|construire)\b/;

const IS_SCREEN = /\b(screen|page|view|ui|interface|layout|section|dashboard|home|profile|settings|explore|discover|feed|social|fitness|finance|health|onboard|écran|page)\b/;

export function detectScreenRequest(text: string): ScreenRequest | null {
  const lower = text.toLowerCase();

  const hasCreate = IS_CREATE.test(lower);
  const hasScreen = IS_SCREEN.test(lower);

  // Need at least one "create" word OR explicit screen noun
  if (!hasCreate && !hasScreen) return null;

  for (const def of SCREEN_PATTERNS) {
    if (def.patterns.test(lower)) {
      return { screenType: def.type, screenId: def.id, screenName: def.name };
    }
  }

  // Generic "create a screen/page" → default to home
  if (hasCreate && hasScreen) {
    return { screenType: "home", screenId: "screen_home", screenName: "Home" };
  }

  return null;
}

// ── Component templates per screen type ──────────────────────────────────────

function homeTemplate(theme: Theme): AppComponent[] {
  const primary = theme.primaryColor ?? "#7c5cfc";
  return [
    c("image_banner", {
      registryComponentId: "hero-banner",
      title: "Good morning", subtitle: "Here's your overview for today",
      badge: "Live Now", gradientStart: "#0f0518", gradientEnd: "#160b38",
    }),
    c("metric_card", {
      registryComponentId: "bento-grid",
      items: [
        { title: "Today's Goal", value: "78%",      icon: "🎯", color: primary  },
        { title: "Streak",       value: "12 days",   icon: "🔥", color: "#f97316" },
        { title: "Score",        value: "942 pts",   icon: "⭐", color: "#eab308" },
        { title: "Top Rank",     value: "#24",       icon: "🏆", color: "#06b6d4" },
      ],
    }),
    c("metric_card", {
      registryComponentId: "gradient-analytics-card",
      title: "Weekly Progress", bars: [42, 68, 55, 82, 74, 91, 86], period: "Mon–Sun",
    }),
    c("title", { text: "Recent Activity" }),
    c("list_item", {
      registryComponentId: "activity-list-item",
      title: "Morning Session Complete", timestamp: "Today · 7:30 AM",
      message: "35 min · All goals hit · Great work!", icon: "✅",
    }),
    c("list_item", {
      registryComponentId: "activity-list-item",
      title: "Weekly Report Ready", timestamp: "Yesterday · 6:00 PM",
      message: "Your best week yet — tap to view summary", icon: "📈",
    }),
    c("cta_button", { registryComponentId: "cta-glow-arrow-button", label: "View Full Dashboard" }),
    c("spacer", { registryComponentId: "app-tab-bar", tabs: [{ icon: "🏠", label: "Home", active: true }, { icon: "🔍", label: "Explore" }, { icon: "➕", label: "Create" }, { icon: "👤", label: "Profile" }] }),
  ];
}

function dashboardTemplate(theme: Theme): AppComponent[] {
  const primary = theme.primaryColor ?? "#7c5cfc";
  return [
    c("metric_card", {
      registryComponentId: "stat-badge",
      value: "94.2", label: "Overall Score",
      trend: "+12.4%", trendUp: true,
      description: "Your best performance this month", accentColor: primary,
    }),
    c("spacer", {
      registryComponentId: "quick-actions-row",
      actions: [
        { icon: "📊", label: "Reports",  color: primary   },
        { icon: "📅", label: "Schedule", color: "#06b6d4" },
        { icon: "🔔", label: "Alerts",   color: "#f97316" },
        { icon: "⚙️", label: "Settings", color: "#8b5cf6" },
      ],
    }),
    c("metric_card", {
      registryComponentId: "gradient-analytics-card",
      title: "Performance Trend", bars: [60, 72, 65, 85, 78, 92, 88], period: "Last 7 Days",
    }),
    c("metric_card", { registryComponentId: "kpi-glow-card", value: "2,847", label: "Total Actions" }),
    c("metric_card", { registryComponentId: "kpi-glow-card", value: "98.3%", label: "Accuracy Rate" }),
    c("title", { text: "Latest Updates" }),
    c("list_item", {
      registryComponentId: "premium-list-item", icon: "📌",
      iconBg: "rgba(124,92,252,0.2)", title: "New Milestone Reached",
      subtitle: "You hit 1,000 completions today", value: "🎉", showChevron: false,
    }),
    c("list_item", {
      registryComponentId: "premium-list-item", icon: "📤",
      iconBg: "rgba(6,182,212,0.2)", title: "Monthly Report Exported",
      subtitle: "Ready to download — Apr 2026", value: "PDF", showChevron: true,
    }),
    c("spacer", { registryComponentId: "app-tab-bar", tabs: [{ icon: "🏠", label: "Home" }, { icon: "📊", label: "Stats", active: true }, { icon: "📅", label: "Calendar" }, { icon: "👤", label: "Profile" }] }),
  ];
}

function profileTemplate(theme: Theme): AppComponent[] {
  const primary = theme.primaryColor ?? "#7c5cfc";
  return [
    c("avatar", {
      registryComponentId: "profile-header",
      name: "Alex Chen", role: "Premium Member",
      avatarInitial: "A", avatarColor: primary,
      gradientStart: "#0f0518", gradientEnd: "#1a0835",
      stats: [{ value: "248", label: "Sessions" }, { value: "12", label: "Streak" }, { value: "4.9★", label: "Rating" }],
    }),
    c("spacer", {
      registryComponentId: "quick-actions-row",
      actions: [
        { icon: "✏️", label: "Edit",   color: primary   },
        { icon: "📊", label: "Stats",  color: "#06b6d4" },
        { icon: "🏆", label: "Awards", color: "#eab308" },
        { icon: "🔗", label: "Share",  color: "#f97316" },
      ],
    }),
    c("metric_card", { registryComponentId: "kpi-glow-card", value: "248",   label: "Total Sessions" }),
    c("metric_card", { registryComponentId: "kpi-glow-card", value: "94.2%", label: "Goal Rate"       }),
    c("title", { text: "Achievements" }),
    c("list_item", {
      registryComponentId: "featured-card", category: "MILESTONE",
      title: "100-Day Streak",
      description: "100 consecutive days without missing a single session",
      accentColor: "#f97316", meta: "Apr 2026",
    }),
    c("list_item", {
      registryComponentId: "featured-card", category: "PERSONAL BEST",
      title: "Peak Performance",
      description: "Highest score of 998 points in a single session",
      accentColor: primary, meta: "Mar 2026",
    }),
    c("cta_button", { registryComponentId: "pill-explore-button", label: "View All Achievements" }),
    c("spacer", { registryComponentId: "app-tab-bar", tabs: [{ icon: "🏠", label: "Home" }, { icon: "📊", label: "Stats" }, { icon: "🏋️", label: "Workout" }, { icon: "👤", label: "Profile", active: true }] }),
  ];
}

function settingsTemplate(theme: Theme): AppComponent[] {
  const primary = theme.primaryColor ?? "#7c5cfc";
  return [
    c("avatar", {
      registryComponentId: "profile-header",
      name: "Alex Chen", role: "Pro Plan · Renews May 12",
      avatarInitial: "A", avatarColor: primary,
      gradientStart: "#0a0810", gradientEnd: "#160b38",
      stats: [{ value: "Pro", label: "Plan" }, { value: "248", label: "Sessions" }, { value: "Apr", label: "Joined" }],
    }),
    c("title", { text: "Preferences" }),
    c("spacer", { registryComponentId: "toggle-neumorphic-switch", label: "Push Notifications" }),
    c("spacer", { registryComponentId: "toggle-neumorphic-switch", label: "Daily Reminders"    }),
    c("spacer", { registryComponentId: "toggle-neumorphic-switch", label: "Weekly Digest"      }),
    c("divider", {}),
    c("list_item", {
      registryComponentId: "premium-list-item", icon: "🔒",
      iconBg: "rgba(124,92,252,0.2)", title: "Privacy & Security",
      subtitle: "2FA enabled · Last login today", value: "", showChevron: true,
    }),
    c("list_item", {
      registryComponentId: "premium-list-item", icon: "🔔",
      iconBg: "rgba(249,115,22,0.2)", title: "Notifications",
      subtitle: "Push, email & in-app alerts", value: "", showChevron: true,
    }),
    c("list_item", {
      registryComponentId: "premium-list-item", icon: "💳",
      iconBg: "rgba(52,211,153,0.2)", title: "Billing & Plan",
      subtitle: "Pro Monthly · $9.99/month", value: "", showChevron: true,
    }),
    c("list_item", {
      registryComponentId: "premium-list-item", icon: "❓",
      iconBg: "rgba(255,255,255,0.08)", title: "Help & Support",
      subtitle: "Docs, FAQ and contact us", value: "", showChevron: true,
    }),
    c("cta_button", { registryComponentId: "pill-explore-button", label: "Sign Out" }),
    c("spacer", { registryComponentId: "app-tab-bar", tabs: [{ icon: "🏠", label: "Home" }, { icon: "📊", label: "Stats" }, { icon: "🏋️", label: "Workout" }, { icon: "👤", label: "Profile", active: true }] }),
  ];
}

function fitnessTemplate(theme: Theme): AppComponent[] {
  const primary = theme.primaryColor ?? "#7c5cfc";
  return [
    c("image_banner", {
      registryComponentId: "hero-banner",
      title: "Let's Crush It 💪", subtitle: "You're on a 12-day streak — keep going!",
      badge: "Active", gradientStart: "#0a0504", gradientEnd: "#1a0808",
    }),
    c("metric_card", {
      registryComponentId: "bento-grid",
      items: [
        { title: "Steps Today",  value: "8,247",  icon: "👟", color: "#f97316" },
        { title: "Calories",     value: "420 kcal", icon: "🔥", color: "#ef4444" },
        { title: "Active Min",   value: "47 min",  icon: "⏱️", color: primary  },
        { title: "Heart Rate",   value: "72 bpm",  icon: "❤️", color: "#f43f5e" },
      ],
    }),
    c("stat_row", {
      registryComponentId: "progress-ring",
      value: "8,247", label: "Steps · Goal: 10,000", percent: 82, accentColor: "#f97316",
    }),
    c("metric_card", {
      registryComponentId: "gradient-analytics-card",
      title: "Active Minutes This Week", bars: [32, 55, 28, 67, 45, 80, 47], period: "Mon–Sun",
    }),
    c("title", { text: "Today's Workouts" }),
    c("list_item", {
      registryComponentId: "activity-list-item",
      title: "Morning HIIT", timestamp: "Today · 6:30 AM",
      message: "35 min · 380 cal · High intensity 🔥", icon: "🏋️",
    }),
    c("list_item", {
      registryComponentId: "activity-list-item",
      title: "Evening Run", timestamp: "5:30 PM · Scheduled",
      message: "5 km target · Riverside route", icon: "🏃",
    }),
    c("cta_button", { registryComponentId: "pill-generate-button", label: "Log a Workout" }),
    c("spacer", { registryComponentId: "app-tab-bar", tabs: [{ icon: "🏠", label: "Home" }, { icon: "📊", label: "Stats" }, { icon: "🏋️", label: "Workout", active: true }, { icon: "👤", label: "Profile" }] }),
  ];
}

function financeTemplate(theme: Theme): AppComponent[] {
  const primary = theme.primaryColor ?? "#7c5cfc";
  return [
    c("metric_card", {
      registryComponentId: "stat-badge",
      value: "$24,892.50", label: "Total Portfolio",
      trend: "+3.2%", trendUp: true,
      description: "Market is open — last updated now", accentColor: "#34d399",
    }),
    c("spacer", {
      registryComponentId: "quick-actions-row",
      actions: [
        { icon: "💳", label: "Pay",    color: primary   },
        { icon: "📤", label: "Send",   color: "#06b6d4" },
        { icon: "📥", label: "Top Up", color: "#34d399" },
        { icon: "📊", label: "Invest", color: "#f97316" },
      ],
    }),
    c("metric_card", {
      registryComponentId: "gradient-analytics-card",
      title: "Portfolio Growth", bars: [55, 62, 58, 75, 70, 85, 90], period: "Last 30 Days",
    }),
    c("metric_card", { registryComponentId: "kpi-glow-card", value: "$3,240", label: "Monthly Income" }),
    c("metric_card", { registryComponentId: "kpi-glow-card", value: "$1,892", label: "Monthly Spent"  }),
    c("title", { text: "Recent Transactions" }),
    c("list_item", {
      registryComponentId: "premium-list-item", icon: "🛒",
      iconBg: "rgba(99,102,241,0.2)", title: "Amazon",
      subtitle: "Shopping · Today 3:24 PM", value: "-$84.99", showChevron: false,
    }),
    c("list_item", {
      registryComponentId: "premium-list-item", icon: "☕",
      iconBg: "rgba(234,179,8,0.2)", title: "Blue Bottle Coffee",
      subtitle: "Food & Drink · Today 8:15 AM", value: "-$6.50", showChevron: false,
    }),
    c("list_item", {
      registryComponentId: "premium-list-item", icon: "💰",
      iconBg: "rgba(52,211,153,0.2)", title: "Salary Deposit",
      subtitle: "Income · Yesterday", value: "+$4,200", showChevron: false,
    }),
    c("cta_button", { registryComponentId: "pill-explore-button", label: "View All Transactions" }),
    c("spacer", { registryComponentId: "app-tab-bar", tabs: [{ icon: "🏠", label: "Home", active: true }, { icon: "📈", label: "Portfolio" }, { icon: "💸", label: "Pay" }, { icon: "👤", label: "Profile" }] }),
  ];
}

function healthTemplate(theme: Theme): AppComponent[] {
  const primary = theme.primaryColor ?? "#7c5cfc";
  return [
    c("metric_card", {
      registryComponentId: "glass-card",
      title: "Daily Wellness Score", subtitle: "Excellent — keep it up!",
      value: "94", icon: "🌟", accentColor: "#34d399",
    }),
    c("metric_card", {
      registryComponentId: "bento-grid",
      items: [
        { title: "Sleep",      value: "7h 42m", icon: "😴", color: "#8b5cf6" },
        { title: "Heart Rate", value: "68 bpm", icon: "❤️", color: "#ef4444" },
        { title: "Steps",      value: "9,240",  icon: "👟", color: "#f97316" },
        { title: "Water",      value: "2.1 L",  icon: "💧", color: "#06b6d4" },
      ],
    }),
    c("metric_card", {
      registryComponentId: "gradient-analytics-card",
      title: "Health Trend This Week", bars: [72, 78, 65, 88, 82, 91, 94], period: "Mon–Sun",
    }),
    c("list_item", {
      registryComponentId: "timeline-item",
      title: "Morning Vitals Logged", subtitle: "Heart rate 68 bpm · BP 118/76",
      time: "07:15", color: "#34d399", isLast: false,
    }),
    c("list_item", {
      registryComponentId: "timeline-item",
      title: "Midday Mindfulness", subtitle: "10-min breathing session complete",
      time: "12:30", color: primary, isLast: false,
    }),
    c("list_item", {
      registryComponentId: "timeline-item",
      title: "Evening Walk", subtitle: "32-min walk · 3,200 steps",
      time: "18:00", color: "#f97316", isLast: true,
    }),
    c("cta_button", { registryComponentId: "cta-glow-arrow-button", label: "Start Today's Routine" }),
    c("spacer", { registryComponentId: "app-tab-bar", tabs: [{ icon: "🏠", label: "Home" }, { icon: "❤️", label: "Health", active: true }, { icon: "📊", label: "Trends" }, { icon: "👤", label: "Profile" }] }),
  ];
}

function socialTemplate(theme: Theme): AppComponent[] {
  const primary = theme.primaryColor ?? "#7c5cfc";
  return [
    c("image_banner", {
      registryComponentId: "hero-banner",
      title: "Community Hub", subtitle: "Connect, share and grow together",
      badge: "1,240 Active", gradientStart: "#0f0a1e", gradientEnd: "#1a0f4a",
    }),
    c("stat_row", {
      registryComponentId: "avatar-stack",
      count: 1240, label: "members active right now",
      avatars: [
        { initial: "A", color: primary   },
        { initial: "M", color: "#f97316" },
        { initial: "S", color: "#06b6d4" },
        { initial: "R", color: "#34d399" },
      ],
    }),
    c("spacer", { registryComponentId: "cyber-segment-nav", segments: ["All", "Following", "Trending", "New"] }),
    c("list_item", {
      registryComponentId: "activity-list-item",
      title: "Alex Chen posted a challenge", timestamp: "2 min ago",
      message: "30-day mindfulness streak — who's in? 🧘", icon: "🔥",
    }),
    c("list_item", {
      registryComponentId: "activity-list-item",
      title: "Maria hit a new personal best", timestamp: "15 min ago",
      message: "Ran 10 km in under 45 minutes 🏃‍♀️", icon: "🏆",
    }),
    c("list_item", {
      registryComponentId: "activity-list-item",
      title: "Sam shared a recipe", timestamp: "1 hour ago",
      message: "High-protein post-workout smoothie 💪", icon: "🥤",
    }),
    c("cta_button", { registryComponentId: "floating-chat-button", tooltipText: "Start a conversation" }),
    c("spacer", { registryComponentId: "app-tab-bar", tabs: [{ icon: "🏠", label: "Feed", active: true }, { icon: "🔍", label: "Explore" }, { icon: "➕", label: "Post" }, { icon: "💬", label: "Messages" }, { icon: "👤", label: "Profile" }] }),
  ];
}

function exploreTemplate(theme: Theme): AppComponent[] {
  const primary = theme.primaryColor ?? "#7c5cfc";
  return [
    c("title", { text: "Explore" }),
    c("text", { registryComponentId: "soft-pill-input", placeholder: "Search anything…" }),
    c("spacer", { registryComponentId: "cyber-segment-nav", segments: ["All", "Popular", "New", "Near You"] }),
    c("metric_card", {
      registryComponentId: "premium-ribbon-card",
      ribbonText: "FEATURED", label: "Summer Challenge 2026",
      subtitle: "Join 12,400 participants in the biggest challenge of the year",
    }),
    c("list_item", {
      registryComponentId: "featured-card", category: "TRENDING",
      title: "30-Day Transformation",
      description: "A proven program followed by 50,000+ users with real results",
      accentColor: primary, meta: "12.4K joined",
    }),
    c("list_item", {
      registryComponentId: "featured-card", category: "COMMUNITY PICK",
      title: "Mindful Mornings",
      description: "Start each day with focus — 10 minutes that change everything",
      accentColor: "#06b6d4", meta: "8.2K joined",
    }),
    c("list_item", {
      registryComponentId: "featured-card", category: "EXPERT GUIDE",
      title: "Peak Performance System",
      description: "Science-backed methods to optimize energy, sleep and output",
      accentColor: "#f97316", meta: "4.8★ · 3.1K reviews",
    }),
    c("cta_button", { registryComponentId: "pill-explore-button", label: "Load More" }),
    c("spacer", { registryComponentId: "app-tab-bar", tabs: [{ icon: "🏠", label: "Home" }, { icon: "🔍", label: "Explore", active: true }, { icon: "❤️", label: "Saved" }, { icon: "👤", label: "Profile" }] }),
  ];
}

// ── Background per screen type ────────────────────────────────────────────────

const SCREEN_BG: Record<ScreenType, string> = {
  home:      "#08080f",
  dashboard: "#06060e",
  profile:   "#08080f",
  settings:  "#08080a",
  fitness:   "#0a0504",
  finance:   "#06060e",
  health:    "#0d0810",
  social:    "#0f0a1e",
  explore:   "#08080f",
};

// ── Main export ───────────────────────────────────────────────────────────────

/**
 * Generate a beautiful screen from user text + project theme.
 * Returns null if the text doesn't express a screen creation intent.
 */
export function generateScreen(text: string, theme: Theme): Screen | null {
  const request = detectScreenRequest(text);
  if (!request) return null;

  const { screenType, screenId, screenName } = request;

  const templateMap: Record<ScreenType, (t: Theme) => AppComponent[]> = {
    home:      homeTemplate,
    dashboard: dashboardTemplate,
    profile:   profileTemplate,
    settings:  settingsTemplate,
    fitness:   fitnessTemplate,
    finance:   financeTemplate,
    health:    healthTemplate,
    social:    socialTemplate,
    explore:   exploreTemplate,
  };

  return {
    id: screenId,
    name: screenName,
    style: { backgroundColor: SCREEN_BG[screenType] },
    components: templateMap[screenType](theme),
  };
}

/**
 * Convenience: generate + apply to project.
 * Returns the new project and the generated screen name, or null if not a generation request.
 */
export function applyGeneratedScreen(
  text: string,
  project: Project
): { project: Project; screenName: string } | null {
  const screen = generateScreen(text, project.theme);
  if (!screen) return null;
  return {
    project: addScreenToProject(project, screen),
    screenName: screen.name,
  };
}
