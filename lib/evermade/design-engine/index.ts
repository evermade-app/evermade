/**
 * Evermade Design Intelligence Engine
 *
 * Provides category detection, design system generation, and prompt enrichment.
 * Pure TypeScript — no Python subprocess, no external deps, works in any environment.
 */

// ── App category ──────────────────────────────────────────────────────────────

export type AppCategory =
  | "fitness" | "finance" | "crypto" | "social" | "productivity"
  | "food" | "travel" | "health" | "entertainment" | "ecommerce"
  | "education" | "creative" | "utility";

export function detectCategory(prompt: string): AppCategory {
  const p = prompt.toLowerCase();
  if (/crypto|bitcoin|ethereum|defi|nft|blockchain|wallet|token/.test(p)) return "crypto";
  if (/fitness|gym|workout|exercise|run|sport|training|muscle|hiit|yoga/.test(p)) return "fitness";
  if (/financ|bank|money|invest|portfolio|budget|trading|stocks|fund/.test(p)) return "finance";
  if (/social|chat|message|friend|communit|dating|network|post|feed/.test(p)) return "social";
  if (/task|todo|note|productive|focus|calendar|plan|project|organiz/.test(p)) return "productivity";
  if (/food|recipe|restaurant|delivery|cook|meal|diet|nutrition/.test(p)) return "food";
  if (/travel|trip|flight|hotel|booking|map|explore|adventure/.test(p)) return "travel";
  if (/health|medical|doctor|wellness|mental|meditation|sleep|mindful/.test(p)) return "health";
  if (/shop|store|product|buy|sell|ecommerce|market|commerce/.test(p)) return "ecommerce";
  if (/learn|course|education|school|quiz|study|tutor|lesson/.test(p)) return "education";
  if (/music|video|movie|game|entertain|stream|podcast|play/.test(p)) return "entertainment";
  if (/photo|design|art|creative|portfolio|studio|draw/.test(p)) return "creative";
  return "utility";
}

// ── Design system per category ────────────────────────────────────────────────

export interface DesignSystem {
  aesthetic: string;
  appCategory: AppCategory;
  colorBackground: string;
  colorSurface: string;
  colorSurfaceElevated: string;
  colorPrimary: string;
  colorSecondary: string;
  colorSuccess: string;
  colorWarning: string;
  colorDanger: string;
  gradientPrimary: string;
  gradientHero: [string, string];
  typographyScale: { display: number; h1: number; h2: number; h3: number; body: number; small: number; caption: number };
  borderRadius: { sm: number; md: number; lg: number; xl: number; pill: number };
  spacing: { xs: number; sm: number; md: number; lg: number; xl: number };
  shadowStyle: "glow" | "soft" | "hard" | "none";
  tabBarTabs: Array<{ icon: string; label: string }>;
}

const DESIGN_SYSTEMS: Record<AppCategory, DesignSystem> = {
  fitness: {
    aesthetic: "DARK ENERGETIC — deep blacks, coral/orange energy, bold type",
    appCategory: "fitness",
    colorBackground: "#080504",
    colorSurface: "rgba(249,115,22,0.07)",
    colorSurfaceElevated: "rgba(249,115,22,0.12)",
    colorPrimary: "#f97316",
    colorSecondary: "#ef4444",
    colorSuccess: "#34d399",
    colorWarning: "#fbbf24",
    colorDanger: "#f87171",
    gradientPrimary: "linear-gradient(135deg, #f97316 0%, #ef4444 100%)",
    gradientHero: ["#1a0804", "#0f0402"],
    typographyScale: { display: 28, h1: 22, h2: 17, h3: 14, body: 12, small: 10, caption: 9 },
    borderRadius: { sm: 10, md: 14, lg: 20, xl: 26, pill: 999 },
    spacing: { xs: 4, sm: 8, md: 13, lg: 18, xl: 26 },
    shadowStyle: "glow",
    tabBarTabs: [
      { icon: "🏠", label: "Home" },
      { icon: "📊", label: "Stats" },
      { icon: "🏋️", label: "Workout" },
      { icon: "👤", label: "Profile" },
    ],
  },
  finance: {
    aesthetic: "DARK PREMIUM — near-black, teal/gold accents, ultra-clean",
    appCategory: "finance",
    colorBackground: "#06060e",
    colorSurface: "rgba(52,211,153,0.06)",
    colorSurfaceElevated: "rgba(52,211,153,0.10)",
    colorPrimary: "#34d399",
    colorSecondary: "#7c5cfc",
    colorSuccess: "#34d399",
    colorWarning: "#fbbf24",
    colorDanger: "#f87171",
    gradientPrimary: "linear-gradient(135deg, #34d399 0%, #7c5cfc 100%)",
    gradientHero: ["#060e0a", "#04080a"],
    typographyScale: { display: 28, h1: 22, h2: 17, h3: 14, body: 12, small: 10, caption: 9 },
    borderRadius: { sm: 8, md: 12, lg: 16, xl: 20, pill: 999 },
    spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 },
    shadowStyle: "soft",
    tabBarTabs: [
      { icon: "🏠", label: "Home" },
      { icon: "📈", label: "Portfolio" },
      { icon: "💸", label: "Pay" },
      { icon: "👤", label: "Profile" },
    ],
  },
  crypto: {
    aesthetic: "GLASSMORPHISM — deep purple-black, frosted glass, neon glows",
    appCategory: "crypto",
    colorBackground: "#0f0a1e",
    colorSurface: "rgba(139,92,246,0.08)",
    colorSurfaceElevated: "rgba(139,92,246,0.14)",
    colorPrimary: "#8b5cf6",
    colorSecondary: "#06b6d4",
    colorSuccess: "#34d399",
    colorWarning: "#fbbf24",
    colorDanger: "#f87171",
    gradientPrimary: "linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)",
    gradientHero: ["#0f0a1e", "#1a0f3a"],
    typographyScale: { display: 28, h1: 22, h2: 17, h3: 14, body: 12, small: 10, caption: 9 },
    borderRadius: { sm: 10, md: 16, lg: 22, xl: 28, pill: 999 },
    spacing: { xs: 4, sm: 8, md: 14, lg: 20, xl: 28 },
    shadowStyle: "glow",
    tabBarTabs: [
      { icon: "🏠", label: "Home" },
      { icon: "📊", label: "Markets" },
      { icon: "💼", label: "Portfolio" },
      { icon: "👤", label: "Account" },
    ],
  },
  social: {
    aesthetic: "VIBRANT DARK — rich color, content-dense, gradient accents",
    appCategory: "social",
    colorBackground: "#0a0812",
    colorSurface: "rgba(124,92,252,0.08)",
    colorSurfaceElevated: "rgba(124,92,252,0.13)",
    colorPrimary: "#7c5cfc",
    colorSecondary: "#f97316",
    colorSuccess: "#34d399",
    colorWarning: "#fbbf24",
    colorDanger: "#f87171",
    gradientPrimary: "linear-gradient(135deg, #7c5cfc 0%, #f97316 100%)",
    gradientHero: ["#0f0a1e", "#1a0f2e"],
    typographyScale: { display: 28, h1: 22, h2: 17, h3: 14, body: 12, small: 10, caption: 9 },
    borderRadius: { sm: 12, md: 16, lg: 20, xl: 24, pill: 999 },
    spacing: { xs: 4, sm: 8, md: 12, lg: 18, xl: 24 },
    shadowStyle: "soft",
    tabBarTabs: [
      { icon: "🏠", label: "Feed" },
      { icon: "🔍", label: "Explore" },
      { icon: "➕", label: "Post" },
      { icon: "💬", label: "Messages" },
      { icon: "👤", label: "Profile" },
    ],
  },
  productivity: {
    aesthetic: "MINIMAL DARK — muted dark gray, single accent, breathing room",
    appCategory: "productivity",
    colorBackground: "#080d14",
    colorSurface: "rgba(79,142,255,0.07)",
    colorSurfaceElevated: "rgba(79,142,255,0.12)",
    colorPrimary: "#4f8eff",
    colorSecondary: "#00bcd4",
    colorSuccess: "#69f0ae",
    colorWarning: "#ffca28",
    colorDanger: "#ff5252",
    gradientPrimary: "linear-gradient(135deg, #4f8eff 0%, #00bcd4 100%)",
    gradientHero: ["#080d14", "#0d1520"],
    typographyScale: { display: 28, h1: 22, h2: 17, h3: 14, body: 12, small: 10, caption: 9 },
    borderRadius: { sm: 8, md: 14, lg: 20, xl: 28, pill: 999 },
    spacing: { xs: 4, sm: 8, md: 14, lg: 20, xl: 28 },
    shadowStyle: "soft",
    tabBarTabs: [
      { icon: "🏠", label: "Home" },
      { icon: "📋", label: "Tasks" },
      { icon: "📅", label: "Calendar" },
      { icon: "👤", label: "Profile" },
    ],
  },
  food: {
    aesthetic: "WARM RICH — deep burgundy/brown, warm amber, inviting",
    appCategory: "food",
    colorBackground: "#0c0704",
    colorSurface: "rgba(244,114,182,0.07)",
    colorSurfaceElevated: "rgba(244,114,182,0.12)",
    colorPrimary: "#f472b6",
    colorSecondary: "#fb923c",
    colorSuccess: "#34d399",
    colorWarning: "#fbbf24",
    colorDanger: "#f87171",
    gradientPrimary: "linear-gradient(135deg, #f472b6 0%, #fb923c 100%)",
    gradientHero: ["#180b0a", "#0f0804"],
    typographyScale: { display: 28, h1: 22, h2: 17, h3: 14, body: 12, small: 10, caption: 9 },
    borderRadius: { sm: 14, md: 18, lg: 24, xl: 30, pill: 999 },
    spacing: { xs: 4, sm: 8, md: 14, lg: 20, xl: 28 },
    shadowStyle: "soft",
    tabBarTabs: [
      { icon: "🏠", label: "Home" },
      { icon: "🔍", label: "Explore" },
      { icon: "❤️", label: "Saved" },
      { icon: "👤", label: "Profile" },
    ],
  },
  travel: {
    aesthetic: "IMMERSIVE — dark overlay, bold type, vivid imagery suggestion",
    appCategory: "travel",
    colorBackground: "#080a0f",
    colorSurface: "rgba(6,182,212,0.08)",
    colorSurfaceElevated: "rgba(6,182,212,0.14)",
    colorPrimary: "#06b6d4",
    colorSecondary: "#f97316",
    colorSuccess: "#34d399",
    colorWarning: "#fbbf24",
    colorDanger: "#f87171",
    gradientPrimary: "linear-gradient(135deg, #06b6d4 0%, #7c5cfc 100%)",
    gradientHero: ["#080e18", "#06121e"],
    typographyScale: { display: 28, h1: 22, h2: 17, h3: 14, body: 12, small: 10, caption: 9 },
    borderRadius: { sm: 10, md: 14, lg: 20, xl: 26, pill: 999 },
    spacing: { xs: 4, sm: 8, md: 12, lg: 18, xl: 26 },
    shadowStyle: "soft",
    tabBarTabs: [
      { icon: "🏠", label: "Home" },
      { icon: "🔍", label: "Explore" },
      { icon: "📍", label: "Saved" },
      { icon: "👤", label: "Profile" },
    ],
  },
  health: {
    aesthetic: "CALM DARK — dark blue-green, soft teal, serene wellness",
    appCategory: "health",
    colorBackground: "#0d0810",
    colorSurface: "rgba(244,114,182,0.07)",
    colorSurfaceElevated: "rgba(244,114,182,0.12)",
    colorPrimary: "#f472b6",
    colorSecondary: "#a78bfa",
    colorSuccess: "#34d399",
    colorWarning: "#fbbf24",
    colorDanger: "#f87171",
    gradientPrimary: "linear-gradient(135deg, #f472b6 0%, #a78bfa 100%)",
    gradientHero: ["#150812", "#0d0810"],
    typographyScale: { display: 28, h1: 22, h2: 17, h3: 14, body: 12, small: 10, caption: 9 },
    borderRadius: { sm: 14, md: 18, lg: 24, xl: 30, pill: 999 },
    spacing: { xs: 4, sm: 8, md: 14, lg: 20, xl: 28 },
    shadowStyle: "soft",
    tabBarTabs: [
      { icon: "🏠", label: "Home" },
      { icon: "❤️", label: "Health" },
      { icon: "📊", label: "Trends" },
      { icon: "👤", label: "Profile" },
    ],
  },
  entertainment: {
    aesthetic: "NEON DARK — pure black, vivid neon accents, bento grid",
    appCategory: "entertainment",
    colorBackground: "#050505",
    colorSurface: "rgba(250,204,21,0.06)",
    colorSurfaceElevated: "rgba(250,204,21,0.10)",
    colorPrimary: "#facc15",
    colorSecondary: "#f97316",
    colorSuccess: "#4ade80",
    colorWarning: "#facc15",
    colorDanger: "#f87171",
    gradientPrimary: "linear-gradient(90deg, #facc15 0%, #f97316 100%)",
    gradientHero: ["#0a0a00", "#100a00"],
    typographyScale: { display: 28, h1: 22, h2: 17, h3: 14, body: 12, small: 10, caption: 9 },
    borderRadius: { sm: 4, md: 8, lg: 12, xl: 16, pill: 999 },
    spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 },
    shadowStyle: "hard",
    tabBarTabs: [
      { icon: "🏠", label: "Home" },
      { icon: "🔥", label: "Trending" },
      { icon: "🔍", label: "Search" },
      { icon: "👤", label: "Profile" },
    ],
  },
  ecommerce: {
    aesthetic: "SLEEK DARK — charcoal, clean whites, premium product focus",
    appCategory: "ecommerce",
    colorBackground: "#0a0a0a",
    colorSurface: "rgba(165,180,252,0.07)",
    colorSurfaceElevated: "rgba(165,180,252,0.12)",
    colorPrimary: "#a5b4fc",
    colorSecondary: "#86efac",
    colorSuccess: "#86efac",
    colorWarning: "#fde68a",
    colorDanger: "#fca5a5",
    gradientPrimary: "linear-gradient(135deg, #a5b4fc 0%, #86efac 100%)",
    gradientHero: ["#0a0a12", "#080810"],
    typographyScale: { display: 28, h1: 22, h2: 17, h3: 14, body: 12, small: 10, caption: 9 },
    borderRadius: { sm: 12, md: 16, lg: 20, xl: 24, pill: 999 },
    spacing: { xs: 4, sm: 8, md: 12, lg: 18, xl: 24 },
    shadowStyle: "soft",
    tabBarTabs: [
      { icon: "🏠", label: "Home" },
      { icon: "🔍", label: "Explore" },
      { icon: "🛒", label: "Cart" },
      { icon: "👤", label: "Account" },
    ],
  },
  education: {
    aesthetic: "STRUCTURED DARK — navy, clear hierarchy, readable",
    appCategory: "education",
    colorBackground: "#080d14",
    colorSurface: "rgba(79,142,255,0.07)",
    colorSurfaceElevated: "rgba(79,142,255,0.12)",
    colorPrimary: "#4f8eff",
    colorSecondary: "#34d399",
    colorSuccess: "#34d399",
    colorWarning: "#fbbf24",
    colorDanger: "#f87171",
    gradientPrimary: "linear-gradient(135deg, #4f8eff 0%, #34d399 100%)",
    gradientHero: ["#080d14", "#0c1420"],
    typographyScale: { display: 28, h1: 22, h2: 17, h3: 14, body: 12, small: 10, caption: 9 },
    borderRadius: { sm: 8, md: 12, lg: 16, xl: 20, pill: 999 },
    spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 },
    shadowStyle: "soft",
    tabBarTabs: [
      { icon: "🏠", label: "Home" },
      { icon: "📚", label: "Courses" },
      { icon: "📊", label: "Progress" },
      { icon: "👤", label: "Profile" },
    ],
  },
  creative: {
    aesthetic: "BOLD CONTRAST — black + vivid accent, editorial design",
    appCategory: "creative",
    colorBackground: "#050508",
    colorSurface: "rgba(249,115,22,0.08)",
    colorSurfaceElevated: "rgba(249,115,22,0.14)",
    colorPrimary: "#f97316",
    colorSecondary: "#eab308",
    colorSuccess: "#34d399",
    colorWarning: "#eab308",
    colorDanger: "#f87171",
    gradientPrimary: "linear-gradient(135deg, #f97316 0%, #eab308 100%)",
    gradientHero: ["#0a0502", "#100802"],
    typographyScale: { display: 28, h1: 22, h2: 17, h3: 14, body: 12, small: 10, caption: 9 },
    borderRadius: { sm: 10, md: 14, lg: 20, xl: 26, pill: 999 },
    spacing: { xs: 4, sm: 8, md: 13, lg: 18, xl: 26 },
    shadowStyle: "hard",
    tabBarTabs: [
      { icon: "🏠", label: "Home" },
      { icon: "✨", label: "Create" },
      { icon: "🔍", label: "Explore" },
      { icon: "👤", label: "Profile" },
    ],
  },
  utility: {
    aesthetic: "FUNCTIONAL DARK — dark gray, minimal decoration, clarity first",
    appCategory: "utility",
    colorBackground: "#080810",
    colorSurface: "rgba(255,255,255,0.04)",
    colorSurfaceElevated: "rgba(255,255,255,0.07)",
    colorPrimary: "#7c5cfc",
    colorSecondary: "#4878ff",
    colorSuccess: "#34d399",
    colorWarning: "#fbbf24",
    colorDanger: "#f87171",
    gradientPrimary: "linear-gradient(135deg, #7c5cfc 0%, #4878ff 100%)",
    gradientHero: ["#080810", "#0e0820"],
    typographyScale: { display: 28, h1: 22, h2: 17, h3: 14, body: 12, small: 10, caption: 9 },
    borderRadius: { sm: 8, md: 12, lg: 16, xl: 20, pill: 999 },
    spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 },
    shadowStyle: "soft",
    tabBarTabs: [
      { icon: "🏠", label: "Home" },
      { icon: "🔍", label: "Explore" },
      { icon: "➕", label: "Create" },
      { icon: "👤", label: "Profile" },
    ],
  },
};

export function getDesignSystem(category: AppCategory): DesignSystem {
  return DESIGN_SYSTEMS[category];
}

/**
 * Build the design system context block injected into the AI system prompt.
 * Tells the AI exactly which colors, radii, spacing and tabs to use.
 */
export function buildDesignSystemBlock(userPrompt: string): string {
  const category = detectCategory(userPrompt);
  const ds = getDesignSystem(category);
  return `
══════════════════════════════════════
DESIGN SYSTEM FOR THIS REQUEST
══════════════════════════════════════
Category detected: ${category.toUpperCase()}
Aesthetic: ${ds.aesthetic}

MANDATORY DESIGN SYSTEM — use these exact values in ALL components:
{
  "designSystem": {
    "appCategory": "${category}",
    "aesthetic": "${ds.aesthetic}",
    "colorBackground": "${ds.colorBackground}",
    "colorSurface": "${ds.colorSurface}",
    "colorSurfaceElevated": "${ds.colorSurfaceElevated}",
    "colorPrimary": "${ds.colorPrimary}",
    "colorSecondary": "${ds.colorSecondary}",
    "colorSuccess": "${ds.colorSuccess}",
    "colorWarning": "${ds.colorWarning}",
    "colorDanger": "${ds.colorDanger}",
    "gradientPrimary": "${ds.gradientPrimary}",
    "gradientHeroStart": "${ds.gradientHero[0]}",
    "gradientHeroEnd": "${ds.gradientHero[1]}"
  }
}

TAB BAR — append app-tab-bar as the LAST component on EVERY screen:
tabs: ${JSON.stringify(ds.tabBarTabs)}

RULES FOR THIS AESTHETIC:
- colorPrimary = "${ds.colorPrimary}" → use for accentColor, hero gradients, active states
- colorSecondary = "${ds.colorSecondary}" → use for secondary accents and chart bars
- colorBackground = "${ds.colorBackground}" → use for ALL screen backgroundColor values
- borderRadius lg = ${ds.borderRadius.lg}px → use for all card components
- shadowStyle = "${ds.shadowStyle}" → ${ds.shadowStyle === "glow" ? "add colored box-shadow glows matching accentColor" : ds.shadowStyle === "hard" ? "hard offset shadows (e.g. 4px 4px 0 accentColor)" : "soft subtle shadows"}
══════════════════════════════════════`;
}
