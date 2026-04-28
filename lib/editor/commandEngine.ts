import type { Project, Selection, AppComponent, Screen, NavItem } from "./project";
import type { ParsedCommand } from "./commandParser";
import { updateComponentProps } from "./projectState";
import { applyGeneratedScreen } from "./screenGenerator";

// ── AI action types ────────────────────────────────────────────────────────────

export type AiAction =
  | {
      type: "update_component_props";
      screenId?: string;
      componentId?: string;
      props?: Record<string, unknown>;
    }
  | {
      type: "update_screen_props";
      screenId?: string;
      props?: Record<string, unknown>;
    }
  | {
      type: "update_theme";
      props?: Record<string, unknown>;
    }
  | {
      type: "update_project_name";
      value?: string;
    }
  | {
      type: "rename_screen";
      screenId?: string;
      value?: string;
    }
  | {
      type: "switch_screen";
      screenId?: string;
    }
  | {
      type: "add_screen";
      screen: Screen;
    }
  | {
      type: "add_component";
      screenId?: string;
      component: AppComponent;
    }
  | {
      type: "generate_screen";
      screen: Screen;
    }
  | {
      type: "update_navigation";
      items: NavItem[];
    }
  | {
      type: "link_nav_item_to_screen";
      navItemId: string;
      screenId: string;
    };

function generateDefaultComponents(screen: Screen): AppComponent[] {
  const name = screen.name.toLowerCase();
  const b = screen.id;

  const tabBar = (tabs: Array<{ icon: string; label: string; active?: boolean }>): AppComponent =>
    ({ id: `${b}_tabs`, type: "spacer", props: { registryComponentId: "app-tab-bar", tabs } });

  // ── Workout / Exercise / Activity ──────────────────────────────────────────
  if (name.includes("activity") || name.includes("workout") || name.includes("exercise") || name.includes("training")) {
    return [
      { id: `${b}_hero`,  type: "image_banner", props: { registryComponentId: "hero-banner", title: "Today's Training 💪", subtitle: "You're on a 12-day streak — keep it up!", badge: "Active", gradientStart: "#1a0804", gradientEnd: "#0f0402" } },
      { id: `${b}_bento`, type: "metric_card",  props: { registryComponentId: "bento-grid", items: [{ title: "Steps", value: "8,247", icon: "👟", color: "#f97316" }, { title: "Calories", value: "482 kcal", icon: "🔥", color: "#ef4444" }, { title: "Active", value: "47 min", icon: "⏱️", color: "#f97316" }, { title: "Heart Rate", value: "72 bpm", icon: "❤️", color: "#f43f5e" }] } },
      { id: `${b}_chart`, type: "metric_card",  props: { registryComponentId: "gradient-analytics-card", title: "Active Minutes This Week", bars: [32, 55, 28, 67, 45, 80, 47], period: "Mon–Sun" } },
      { id: `${b}_kpi1`,  type: "metric_card",  props: { registryComponentId: "kpi-glow-card", value: "12", label: "Day Streak 🔥" } },
      { id: `${b}_kpi2`,  type: "metric_card",  props: { registryComponentId: "kpi-glow-card", value: "3,840", label: "Weekly Calories" } },
      { id: `${b}_w1`,    type: "list_item",    props: { registryComponentId: "activity-list-item", title: "Morning HIIT", timestamp: "Today · 6:30 AM", message: "35 min · 380 cal · High intensity 🔥", icon: "🏋️" } },
      { id: `${b}_w2`,    type: "list_item",    props: { registryComponentId: "activity-list-item", title: "Evening Run", timestamp: "Today · 6:00 PM", message: "28 min · 240 cal · Zone 2 🏃", icon: "🏃" } },
      { id: `${b}_w3`,    type: "list_item",    props: { registryComponentId: "activity-list-item", title: "Core Strength", timestamp: "Yesterday · 5:15 PM", message: "20 min · 180 cal · Upper body 💪", icon: "💪" } },
      { id: `${b}_cta`,   type: "cta_button",   props: { registryComponentId: "pill-generate-button", label: "Log a Workout" } },
      tabBar([{ icon: "🏠", label: "Home" }, { icon: "📊", label: "Stats" }, { icon: "🏋️", label: "Workout", active: true }, { icon: "👤", label: "Profile" }]),
    ];
  }

  // ── Health / Wellness / Vitals ─────────────────────────────────────────────
  if (name.includes("health") || name.includes("wellness") || name.includes("vital") || name.includes("sleep")) {
    return [
      { id: `${b}_hero`,  type: "image_banner", props: { registryComponentId: "hero-banner", title: "Your Health Today 🌿", subtitle: "All metrics looking great — keep it up!", badge: "Good", gradientStart: "#0d150e", gradientEnd: "#080f09" } },
      { id: `${b}_bento`, type: "metric_card",  props: { registryComponentId: "bento-grid", items: [{ title: "Heart Rate", value: "68 bpm", icon: "❤️", color: "#f43f5e" }, { title: "Sleep", value: "7h 42m", icon: "😴", color: "#8b5cf6" }, { title: "HRV", value: "52 ms", icon: "📈", color: "#34d399" }, { title: "SpO2", value: "98%", icon: "🫁", color: "#06b6d4" }] } },
      { id: `${b}_ring`,  type: "stat_row",     props: { registryComponentId: "progress-ring", value: "82%", label: "Readiness", percent: 82, accentColor: "#34d399" } },
      { id: `${b}_kpi1`,  type: "metric_card",  props: { registryComponentId: "kpi-glow-card", value: "8,247", label: "Steps Today" } },
      { id: `${b}_kpi2`,  type: "metric_card",  props: { registryComponentId: "kpi-glow-card", value: "482", label: "Calories Burned" } },
      { id: `${b}_chart`, type: "metric_card",  props: { registryComponentId: "gradient-analytics-card", title: "Weekly Health Score", bars: [78, 82, 75, 90, 85, 88, 92], period: "Mon–Sun" } },
      { id: `${b}_l1`,    type: "list_item",    props: { registryComponentId: "premium-list-item", icon: "🏃", iconBg: "rgba(249,115,22,0.15)", title: "Activity Goal", subtitle: "480 / 600 cal — 80% complete", value: "80%", showChevron: true } },
      { id: `${b}_l2`,    type: "list_item",    props: { registryComponentId: "premium-list-item", icon: "😴", iconBg: "rgba(139,92,246,0.15)", title: "Sleep Quality", subtitle: "Deep sleep: 1h 48m — above average", value: "Good", showChevron: true } },
      { id: `${b}_cta`,   type: "cta_button",   props: { registryComponentId: "cta-glow-arrow-button", label: "View Full Health Report" } },
      tabBar([{ icon: "🏠", label: "Home" }, { icon: "❤️", label: "Health", active: true }, { icon: "📊", label: "Trends" }, { icon: "👤", label: "Profile" }]),
    ];
  }

  // ── Profile / Account / User ───────────────────────────────────────────────
  if (name.includes("profile") || name.includes("account") || name.includes("user")) {
    return [
      { id: `${b}_ph`,    type: "avatar",       props: { registryComponentId: "profile-header", name: "Alex Chen", role: "Premium Member · Since 2022", avatarInitial: "A", avatarColor: "#7c5cfc", gradientStart: "#0f0a1e", gradientEnd: "#0a0812", stats: [{ value: "248", label: "Workouts" }, { value: "12", label: "Day Streak" }, { value: "4.8★", label: "Rating" }] } },
      { id: `${b}_qa`,    type: "list_item",    props: { registryComponentId: "quick-actions-row", actions: [{ icon: "✏️", label: "Edit", color: "#7c5cfc" }, { icon: "🔔", label: "Alerts", color: "#4878ff" }, { icon: "🔗", label: "Share", color: "#34d399" }, { icon: "⚙️", label: "Settings", color: "#f97316" }] } },
      { id: `${b}_kpi1`,  type: "metric_card",  props: { registryComponentId: "kpi-glow-card", value: "248", label: "Total Workouts" } },
      { id: `${b}_kpi2`,  type: "metric_card",  props: { registryComponentId: "kpi-glow-card", value: "48.2K", label: "Calories Burned" } },
      { id: `${b}_badge`, type: "spacer",       props: { registryComponentId: "shadcn-badge-status", label: "Premium Member ✓", type: "success" } },
      { id: `${b}_r1`,    type: "list_item",    props: { registryComponentId: "premium-list-item", icon: "🔔", iconBg: "rgba(124,92,252,0.15)", title: "Notifications", subtitle: "Push & email alerts", value: "On", showChevron: true } },
      { id: `${b}_r2`,    type: "list_item",    props: { registryComponentId: "premium-list-item", icon: "🔒", iconBg: "rgba(72,120,255,0.15)", title: "Privacy & Security", subtitle: "Two-factor auth enabled", value: "", showChevron: true } },
      { id: `${b}_r3`,    type: "list_item",    props: { registryComponentId: "premium-list-item", icon: "🔗", iconBg: "rgba(52,211,153,0.15)", title: "Connected Apps", subtitle: "Apple Health, Strava", value: "2 apps", showChevron: true } },
      { id: `${b}_cta`,   type: "cta_button",   props: { registryComponentId: "shadcn-button-secondary", label: "Sign Out" } },
      tabBar([{ icon: "🏠", label: "Home" }, { icon: "📊", label: "Stats" }, { icon: "🏋️", label: "Workout" }, { icon: "👤", label: "Profile", active: true }]),
    ];
  }

  // ── Settings / Preferences ─────────────────────────────────────────────────
  if (name.includes("setting") || name.includes("preference") || name.includes("config")) {
    return [
      { id: `${b}_hero`,  type: "image_banner", props: { registryComponentId: "hero-banner", title: "Settings", subtitle: "Manage your account & preferences", gradientStart: "#080810", gradientEnd: "#0e0820" } },
      { id: `${b}_s1`,    type: "spacer",       props: { registryComponentId: "shadcn-switch-row", label: "Push Notifications", description: "Get alerts for workouts & goals", defaultChecked: true } },
      { id: `${b}_s2`,    type: "spacer",       props: { registryComponentId: "shadcn-switch-row", label: "Email Digest", description: "Weekly progress summary", defaultChecked: false } },
      { id: `${b}_s3`,    type: "spacer",       props: { registryComponentId: "shadcn-switch-row", label: "Dark Mode", description: "Always active for best experience", defaultChecked: true } },
      { id: `${b}_r1`,    type: "list_item",    props: { registryComponentId: "premium-list-item", icon: "🔒", iconBg: "rgba(72,120,255,0.15)", title: "Privacy & Security", subtitle: "Two-factor auth enabled", value: "", showChevron: true } },
      { id: `${b}_r2`,    type: "list_item",    props: { registryComponentId: "premium-list-item", icon: "💳", iconBg: "rgba(52,211,153,0.15)", title: "Subscription", subtitle: "Premium · Renews Jan 12", value: "$9.99/mo", showChevron: true } },
      { id: `${b}_r3`,    type: "list_item",    props: { registryComponentId: "premium-list-item", icon: "📱", iconBg: "rgba(124,92,252,0.15)", title: "Connected Devices", subtitle: "iPhone 17, Apple Watch Ultra", value: "2", showChevron: true } },
      { id: `${b}_badge`, type: "spacer",       props: { registryComponentId: "shadcn-badge-status", label: "App Version 2.4.1", type: "neutral" } },
      { id: `${b}_cta`,   type: "cta_button",   props: { registryComponentId: "shadcn-button-secondary", label: "Sign Out" } },
      tabBar([{ icon: "🏠", label: "Home" }, { icon: "📊", label: "Stats" }, { icon: "🏋️", label: "Workout" }, { icon: "👤", label: "Profile" }]),
    ];
  }

  // ── Progress / Stats / Analytics ───────────────────────────────────────────
  if (name.includes("progress") || name.includes("stat") || name.includes("analytic") || name.includes("insight")) {
    return [
      { id: `${b}_badge`, type: "metric_card",  props: { registryComponentId: "stat-badge", value: "8,247", label: "Steps Today", trend: "+14%", trendUp: true, description: "vs last week average of 7,230", accentColor: "#f97316" } },
      { id: `${b}_nav`,   type: "spacer",       props: { registryComponentId: "cyber-segment-nav", segments: ["Day", "Week", "Month", "Year"] } },
      { id: `${b}_chart`, type: "metric_card",  props: { registryComponentId: "gradient-analytics-card", title: "Activity Minutes", bars: [32, 55, 28, 67, 45, 80, 47], period: "This Week" } },
      { id: `${b}_kpi1`,  type: "metric_card",  props: { registryComponentId: "kpi-glow-card", value: "12", label: "Day Streak 🔥" } },
      { id: `${b}_kpi2`,  type: "metric_card",  props: { registryComponentId: "kpi-glow-card", value: "3,840", label: "Weekly Calories" } },
      { id: `${b}_ring`,  type: "stat_row",     props: { registryComponentId: "progress-ring", value: "82%", label: "Weekly Goal", percent: 82, accentColor: "#7c5cfc" } },
      { id: `${b}_spark`, type: "stat_row",     props: { registryComponentId: "mini-sparkline", data: [40, 55, 35, 70, 50, 85, 65], color: "#7c5cfc", label: "Trend", currentValue: "↑ 14%" } },
      { id: `${b}_pb1`,   type: "stat_row",     props: { registryComponentId: "shadcn-progress-bar", label: "Steps Goal", value: 82, showPercent: true, accentColor: "#f97316" } },
      { id: `${b}_pb2`,   type: "stat_row",     props: { registryComponentId: "shadcn-progress-bar", label: "Calorie Goal", value: 68, showPercent: true, accentColor: "#ef4444" } },
      tabBar([{ icon: "🏠", label: "Home" }, { icon: "📊", label: "Stats", active: true }, { icon: "🏋️", label: "Workout" }, { icon: "👤", label: "Profile" }]),
    ];
  }

  // ── Courses / Learn / Education ────────────────────────────────────────────
  if (name.includes("course") || name.includes("learn") || name.includes("lesson") || name.includes("class") || name.includes("study")) {
    return [
      { id: `${b}_hero`,  type: "image_banner", props: { registryComponentId: "hero-banner", title: "Keep Learning 📚", subtitle: "3 courses in progress · 68% average completion", badge: "On Track", gradientStart: "#080d14", gradientEnd: "#0c1420" } },
      { id: `${b}_nav`,   type: "spacer",       props: { registryComponentId: "cyber-segment-nav", segments: ["All", "Active", "Done"] } },
      { id: `${b}_f1`,    type: "metric_card",  props: { registryComponentId: "shadcn-card-feature", icon: "🍳", title: "Italian Cooking Masterclass", description: "Module 4 of 8 · Pasta techniques", accentColor: "#f97316" } },
      { id: `${b}_f2`,    type: "metric_card",  props: { registryComponentId: "shadcn-card-feature", icon: "🥗", title: "Plant-Based Nutrition", description: "Module 2 of 6 · Protein sources", accentColor: "#34d399" } },
      { id: `${b}_f3`,    type: "metric_card",  props: { registryComponentId: "shadcn-card-feature", icon: "🍰", title: "French Pastry Basics", description: "Module 1 of 5 · Just started", accentColor: "#f472b6" } },
      { id: `${b}_pb1`,   type: "stat_row",     props: { registryComponentId: "shadcn-progress-bar", label: "Italian Masterclass", value: 62, showPercent: true, accentColor: "#f97316" } },
      { id: `${b}_pb2`,   type: "stat_row",     props: { registryComponentId: "shadcn-progress-bar", label: "Plant-Based Nutrition", value: 38, showPercent: true, accentColor: "#34d399" } },
      { id: `${b}_kpi1`,  type: "metric_card",  props: { registryComponentId: "kpi-glow-card", value: "14", label: "Lessons Done" } },
      { id: `${b}_kpi2`,  type: "metric_card",  props: { registryComponentId: "kpi-glow-card", value: "4.8★", label: "Avg Rating" } },
      tabBar([{ icon: "🏠", label: "Home" }, { icon: "📚", label: "Courses", active: true }, { icon: "📊", label: "Progress" }, { icon: "👤", label: "Profile" }]),
    ];
  }

  // ── Discover / Explore / Search / Feed ─────────────────────────────────────
  if (name.includes("discover") || name.includes("explore") || name.includes("search") || name.includes("feed") || name.includes("browse")) {
    return [
      { id: `${b}_hero`,  type: "image_banner", props: { registryComponentId: "hero-banner", title: "Discover ✨", subtitle: "Find what's trending today", gradientStart: "#0f0a1e", gradientEnd: "#0a0812" } },
      { id: `${b}_input`, type: "text",         props: { registryComponentId: "soft-pill-input", placeholder: "Search anything..." } },
      { id: `${b}_nav`,   type: "spacer",       props: { registryComponentId: "cyber-segment-nav", segments: ["Trending", "New", "Popular"] } },
      { id: `${b}_fc1`,   type: "list_item",    props: { registryComponentId: "featured-card", category: "FEATURED", title: "Top Pick of the Week", description: "The most-loved content this week by our community of 50K members.", accentColor: "#7c5cfc", meta: "4.9★ · 2.3K reviews" } },
      { id: `${b}_fc2`,   type: "list_item",    props: { registryComponentId: "featured-card", category: "NEW", title: "Just Launched Today", description: "Fresh content hot off the press — be the first to try it.", accentColor: "#4878ff", meta: "New · 142 views" } },
      { id: `${b}_stars`, type: "stat_row",     props: { registryComponentId: "rating-stars", title: "Top Rated This Week", rating: 4.8, count: "2.4K" } },
      { id: `${b}_l1`,    type: "list_item",    props: { registryComponentId: "premium-list-item", icon: "🔥", iconBg: "rgba(249,115,22,0.15)", title: "Most Popular Right Now", subtitle: "Trending in your region", value: "#1", showChevron: true } },
      { id: `${b}_l2`,    type: "list_item",    props: { registryComponentId: "premium-list-item", icon: "⭐", iconBg: "rgba(124,92,252,0.15)", title: "Staff Picks This Week", subtitle: "Handpicked by our editors", value: "12 new", showChevron: true } },
      { id: `${b}_cta`,   type: "cta_button",   props: { registryComponentId: "pill-explore-button", label: "Explore All" } },
      tabBar([{ icon: "🏠", label: "Home" }, { icon: "🔍", label: "Explore", active: true }, { icon: "❤️", label: "Saved" }, { icon: "👤", label: "Profile" }]),
    ];
  }

  // ── Home / Dashboard (default) ─────────────────────────────────────────────
  return [
    { id: `${b}_hero`,  type: "image_banner", props: { registryComponentId: "hero-banner", title: `Welcome to ${screen.name} 👋`, subtitle: "Your personalized dashboard — everything in one place", badge: "Active", gradientStart: "#0f0a1e", gradientEnd: "#0a0812" } },
    { id: `${b}_bento`, type: "metric_card",  props: { registryComponentId: "bento-grid", items: [{ title: "Today", value: "8 tasks", icon: "✅", color: "#7c5cfc" }, { title: "Streak", value: "12 days", icon: "🔥", color: "#f97316" }, { title: "Score", value: "94/100", icon: "⭐", color: "#fbbf24" }, { title: "Level", value: "Pro", icon: "🏆", color: "#34d399" }] } },
    { id: `${b}_chart`, type: "metric_card",  props: { registryComponentId: "gradient-analytics-card", title: "Weekly Activity", bars: [40, 65, 30, 80, 55, 90, 70], period: "Mon–Sun" } },
    { id: `${b}_kpi1`,  type: "metric_card",  props: { registryComponentId: "kpi-glow-card", value: "94", label: "Your Score" } },
    { id: `${b}_kpi2`,  type: "metric_card",  props: { registryComponentId: "kpi-glow-card", value: "12", label: "Day Streak 🔥" } },
    { id: `${b}_l1`,    type: "list_item",    props: { registryComponentId: "activity-list-item", title: "Latest Update", timestamp: "Just now", message: "Everything is set up and ready to go 🚀", icon: "✨" } },
    { id: `${b}_l2`,    type: "list_item",    props: { registryComponentId: "activity-list-item", title: "Getting Started", timestamp: "2 min ago", message: "Complete your profile to unlock premium features", icon: "🎯" } },
    { id: `${b}_l3`,    type: "list_item",    props: { registryComponentId: "activity-list-item", title: "Daily Challenge", timestamp: "Today", message: "Complete 3 tasks to maintain your streak", icon: "💡" } },
    { id: `${b}_cta`,   type: "cta_button",   props: { registryComponentId: "cta-glow-arrow-button", label: "Get Started" } },
    tabBar([{ icon: "🏠", label: "Home", active: true }, { icon: "🔍", label: "Explore" }, { icon: "➕", label: "Create" }, { icon: "👤", label: "Profile" }]),
  ];
}

export function applyAiAction(
  action: AiAction,
  helpers: {
    selection?: { screenId?: string; componentId?: string } | null;
    activeScreenId: string;
    updateComponent: (screenId: string, componentId: string, props: Record<string, unknown>) => void;
    updateScreenStyle: (screenId: string, patch: Record<string, unknown>) => void;
    updateTheme: (patch: Record<string, unknown>) => void;
    setProjectName: (name: string) => void;
    renameScreen: (screenId: string, name: string) => void;
    setActiveScreen: (screenId: string) => void;
    addScreen: (screen: Screen) => void;
    addComponent: (screenId: string, component: AppComponent) => void;
    updateNavigation: (items: NavItem[]) => void;
    linkNavItem: (navItemId: string, screenId: string) => void;
  }
) {
  switch (action.type) {
    case "update_component_props": {
      const screenId = action.screenId || helpers.selection?.screenId;
      const componentId = action.componentId || helpers.selection?.componentId;
      if (!screenId || !componentId || !action.props) {
        throw new Error("Missing screenId, componentId, or props");
      }
      helpers.updateComponent(screenId, componentId, action.props);
      return;
    }

    case "update_screen_props": {
      const screenId = action.screenId || helpers.activeScreenId;
      if (!action.props) throw new Error("Missing props for update_screen_props");
      helpers.updateScreenStyle(screenId, action.props);
      return;
    }

    case "update_theme": {
      if (!action.props) throw new Error("Missing props for update_theme");
      helpers.updateTheme(action.props);
      return;
    }

    case "update_project_name": {
      if (action.value) helpers.setProjectName(action.value);
      return;
    }

    case "rename_screen": {
      if (action.screenId && action.value) {
        helpers.renameScreen(action.screenId, action.value);
      }
      return;
    }

    case "switch_screen": {
      if (action.screenId) helpers.setActiveScreen(action.screenId);
      return;
    }

    case "add_screen":
    case "generate_screen": {
      const screen = action.screen;
      helpers.addScreen(
        screen.components.length > 0 ? screen : { ...screen, components: generateDefaultComponents(screen) }
      );
      return;
    }

    case "add_component": {
      const screenId = action.screenId || helpers.activeScreenId;
      helpers.addComponent(screenId, action.component);
      return;
    }

    case "update_navigation": {
      helpers.updateNavigation(action.items);
      return;
    }

    case "link_nav_item_to_screen": {
      helpers.linkNavItem(action.navItemId, action.screenId);
      return;
    }

    default:
      throw new Error("Unsupported AI action");
  }
}

export type CommandResult = {
  success: boolean;
  updatedProject: Project;
  message: string;
};

export function applyCommand(
  cmd: ParsedCommand,
  selection: Selection,
  project: Project
): CommandResult {
  const fail = (msg: string): CommandResult => ({
    success: false,
    updatedProject: project,
    message: msg,
  });

  // ── Global commands ────────────────────────────────────────────────────────
  if (cmd.action === "update_project_name" && cmd.value) {
    return {
      success: true,
      updatedProject: { ...project, name: cmd.value },
      message: `Renamed project to **${cmd.value}**.`,
    };
  }

  // ── Screen generation (local — works without AI) ───────────────────────────
  if (cmd.action === "generate_screen") {
    const text = cmd.value ?? cmd.raw;
    const result = applyGeneratedScreen(text, project);
    if (result) {
      return {
        success: true,
        updatedProject: { ...result.project, activeScreenId: result.project.screens.find(s => s.name === result.screenName)?.id ?? result.project.activeScreenId },
        message: `Done — created a beautiful **${result.screenName}** screen with hero banner, metrics, and premium components.`,
      };
    }
    // Couldn't detect screen type — fall through to AI
  }

  if (cmd.action === "unknown") {
    if (!selection) {
      return fail(
        "I didn't understand that. Try selecting an element on the preview first, then describe what you'd like to change."
      );
    }
    return fail(
      "I didn't understand that change. Try: *\"change the name to Alex\"*, *\"set the goal to 600\"*, or *\"make it red\"*."
    );
  }

  // ── Selection required ─────────────────────────────────────────────────────
  if (!selection) {
    return fail(
      "Select an element on the preview first — then I can apply that change directly to it."
    );
  }

  const { screenId, componentId, componentType } = selection;

  if (cmd.action === "rename_screen" && cmd.value) {
    return {
      success: true,
      updatedProject: {
        ...project,
        screens: project.screens.map((s) =>
          s.id === screenId ? { ...s, name: cmd.value! } : s
        ),
      },
      message: `Renamed screen to **${cmd.value}**.`,
    };
  }

  if (!cmd.value) {
    return fail(
      "What value should I set? Try putting the new value in quotes, like *\"Morning Workout\"*."
    );
  }

  return routeToComponent(cmd, componentType, screenId, componentId, project);
}

function apply(
  project: Project,
  screenId: string,
  componentId: string,
  patch: Record<string, unknown>,
  message: string
): CommandResult {
  return {
    success: true,
    updatedProject: updateComponentProps(project, screenId, componentId, patch),
    message,
  };
}

function routeToComponent(
  cmd: ParsedCommand,
  componentType: AppComponent["type"],
  screenId: string,
  componentId: string,
  project: Project
): CommandResult {
  const fail = (msg: string): CommandResult => ({
    success: false,
    updatedProject: project,
    message: msg,
  });

  switch (componentType) {
    case "greeting": {
      if (cmd.action === "update_name" || cmd.action === "update_text") {
        return apply(project, screenId, componentId, { name: cmd.value }, `Updated name to **${cmd.value}**.`);
      }
      if (cmd.action === "update_greeting") {
        return apply(project, screenId, componentId, { greeting: cmd.value }, `Updated greeting to **${cmd.value}**.`);
      }
      return fail("For Profile, try: *\"change the name to Alex\"* or *\"set greeting to Good evening\"*.");
    }

    case "activity-card": {
      if (cmd.action === "update_text") {
        return apply(project, screenId, componentId, { title: cmd.value }, `Updated card title to **${cmd.value}**.`);
      }
      return fail("For the Activity Card, try: *\"change the title to...\"*.");
    }

    case "ring-stat": {
      if (cmd.action === "update_value") {
        const num = Math.max(0, Number(cmd.value) || 0);
        return apply(project, screenId, componentId, { value: num }, `Updated ring value to **${num}**.`);
      }
      if (cmd.action === "update_goal") {
        const num = Math.max(1, Number(cmd.value) || 1);
        return apply(project, screenId, componentId, { goal: num }, `Updated ring goal to **${num}**.`);
      }
      if (cmd.action === "update_color") {
        return apply(project, screenId, componentId, { color: cmd.value }, `Updated ring color to **${cmd.value}**.`);
      }
      return fail("For rings, try: *\"set value to 500\"*, *\"set goal to 600\"*, or *\"make it red\"*.");
    }

    case "section-header": {
      if (cmd.action === "update_text") {
        return apply(project, screenId, componentId, { title: cmd.value }, `Updated section title to **${cmd.value}**.`);
      }
      return fail("For this section, try: *\"change the title to Recent Activity\"*.");
    }

    case "workout-item": {
      if (cmd.action === "update_name" || cmd.action === "update_text") {
        return apply(project, screenId, componentId, { name: cmd.value }, `Updated workout name to **${cmd.value}**.`);
      }
      if (cmd.action === "update_color") {
        return apply(project, screenId, componentId, { color: cmd.value }, `Updated workout color to **${cmd.value}**.`);
      }
      if (cmd.action === "update_greeting") {
        return apply(project, screenId, componentId, { time: cmd.value }, `Updated workout time to **${cmd.value}**.`);
      }
      return fail("For workouts, try: *\"rename to Evening Run\"* or *\"make it purple\"*.");
    }

    default:
      return fail("I'm not sure how to edit that element yet.");
  }
}
