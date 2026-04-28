export type AestheticName =
  | "glassmorphism"
  | "dark-premium"
  | "vibrant-gradient"
  | "minimal-luxe"
  | "soft-clay"
  | "neo-brutalism"
  | "pastel-soft"
  | "material-you";

export interface EvermadeTheme {
  aesthetic: AestheticName;
  colors: {
    primary: string;
    accent: string;
    background: string;
    surface: string;
    surfaceElevated: string;
    border: string;
    text: { primary: string; secondary: string; tertiary: string };
    success: string;
    danger: string;
    warning: string;
  };
  radius: { sm: number; md: number; lg: number; xl: number; pill: number };
  spacing: { xs: number; sm: number; md: number; lg: number; xl: number };
  fontSizes: { xs: number; sm: number; md: number; lg: number; xl: number; xxl: number };
  shadow: { sm: string; md: string; lg: string };
  gradient: { primary: string; accent: string; surface: string };
}

export const THEMES: Record<AestheticName, EvermadeTheme> = {
  "dark-premium": {
    aesthetic: "dark-premium",
    colors: {
      primary: "#7c5cfc", accent: "#4878ff",
      background: "#08080f", surface: "rgba(255,255,255,0.04)",
      surfaceElevated: "rgba(255,255,255,0.07)", border: "rgba(255,255,255,0.08)",
      text: { primary: "rgba(255,255,255,0.95)", secondary: "rgba(255,255,255,0.55)", tertiary: "rgba(255,255,255,0.28)" },
      success: "#34d399", danger: "#f87171", warning: "#fbbf24",
    },
    radius: { sm: 8, md: 12, lg: 16, xl: 20, pill: 999 },
    spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 },
    fontSizes: { xs: 8, sm: 10, md: 12, lg: 14, xl: 18, xxl: 24 },
    shadow: { sm: "0 2px 8px rgba(0,0,0,0.3)", md: "0 6px 20px rgba(0,0,0,0.4)", lg: "0 12px 40px rgba(0,0,0,0.5)" },
    gradient: {
      primary: "linear-gradient(135deg, #7c5cfc 0%, #4878ff 100%)",
      accent: "linear-gradient(135deg, #a855f7 0%, #6366f1 100%)",
      surface: "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.025) 100%)",
    },
  },
  "glassmorphism": {
    aesthetic: "glassmorphism",
    colors: {
      primary: "#8b5cf6", accent: "#06b6d4",
      background: "#0f0a1e", surface: "rgba(139,92,246,0.08)",
      surfaceElevated: "rgba(139,92,246,0.14)", border: "rgba(139,92,246,0.22)",
      text: { primary: "rgba(255,255,255,0.95)", secondary: "rgba(255,255,255,0.6)", tertiary: "rgba(255,255,255,0.3)" },
      success: "#34d399", danger: "#f87171", warning: "#fbbf24",
    },
    radius: { sm: 10, md: 16, lg: 22, xl: 28, pill: 999 },
    spacing: { xs: 4, sm: 8, md: 14, lg: 20, xl: 28 },
    fontSizes: { xs: 8, sm: 10, md: 12, lg: 14, xl: 18, xxl: 24 },
    shadow: { sm: "0 2px 12px rgba(139,92,246,0.15)", md: "0 8px 24px rgba(139,92,246,0.2)", lg: "0 16px 48px rgba(139,92,246,0.3)" },
    gradient: {
      primary: "linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)",
      accent: "linear-gradient(135deg, #a78bfa 0%, #67e8f9 100%)",
      surface: "linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(6,182,212,0.08) 100%)",
    },
  },
  "vibrant-gradient": {
    aesthetic: "vibrant-gradient",
    colors: {
      primary: "#f97316", accent: "#eab308",
      background: "#0a0504", surface: "rgba(249,115,22,0.08)",
      surfaceElevated: "rgba(249,115,22,0.14)", border: "rgba(249,115,22,0.22)",
      text: { primary: "rgba(255,255,255,0.95)", secondary: "rgba(255,255,255,0.6)", tertiary: "rgba(255,255,255,0.3)" },
      success: "#34d399", danger: "#f87171", warning: "#fbbf24",
    },
    radius: { sm: 10, md: 14, lg: 20, xl: 26, pill: 999 },
    spacing: { xs: 4, sm: 8, md: 13, lg: 18, xl: 26 },
    fontSizes: { xs: 8, sm: 10, md: 12, lg: 14, xl: 18, xxl: 24 },
    shadow: { sm: "0 2px 10px rgba(249,115,22,0.2)", md: "0 6px 24px rgba(249,115,22,0.28)", lg: "0 12px 40px rgba(249,115,22,0.35)" },
    gradient: {
      primary: "linear-gradient(135deg, #f97316 0%, #eab308 100%)",
      accent: "linear-gradient(135deg, #fb923c 0%, #facc15 100%)",
      surface: "linear-gradient(135deg, rgba(249,115,22,0.1) 0%, rgba(234,179,8,0.07) 100%)",
    },
  },
  "minimal-luxe": {
    aesthetic: "minimal-luxe",
    colors: {
      primary: "#e2e8f0", accent: "#94a3b8",
      background: "#030305", surface: "rgba(255,255,255,0.03)",
      surfaceElevated: "rgba(255,255,255,0.055)", border: "rgba(255,255,255,0.06)",
      text: { primary: "rgba(255,255,255,0.92)", secondary: "rgba(255,255,255,0.4)", tertiary: "rgba(255,255,255,0.2)" },
      success: "#6ee7b7", danger: "#fca5a5", warning: "#fcd34d",
    },
    radius: { sm: 6, md: 10, lg: 14, xl: 18, pill: 999 },
    spacing: { xs: 4, sm: 8, md: 12, lg: 18, xl: 24 },
    fontSizes: { xs: 8, sm: 10, md: 12, lg: 14, xl: 18, xxl: 24 },
    shadow: { sm: "0 1px 4px rgba(0,0,0,0.4)", md: "0 4px 16px rgba(0,0,0,0.5)", lg: "0 8px 32px rgba(0,0,0,0.6)" },
    gradient: {
      primary: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)",
      accent: "linear-gradient(135deg, rgba(148,163,184,0.18) 0%, rgba(148,163,184,0.06) 100%)",
      surface: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
    },
  },
  "soft-clay": {
    aesthetic: "soft-clay",
    colors: {
      primary: "#f472b6", accent: "#a78bfa",
      background: "#0d080f", surface: "rgba(244,114,182,0.07)",
      surfaceElevated: "rgba(244,114,182,0.12)", border: "rgba(244,114,182,0.18)",
      text: { primary: "rgba(255,255,255,0.92)", secondary: "rgba(255,255,255,0.55)", tertiary: "rgba(255,255,255,0.28)" },
      success: "#34d399", danger: "#f87171", warning: "#fbbf24",
    },
    radius: { sm: 14, md: 18, lg: 24, xl: 30, pill: 999 },
    spacing: { xs: 4, sm: 8, md: 14, lg: 20, xl: 28 },
    fontSizes: { xs: 8, sm: 10, md: 12, lg: 14, xl: 18, xxl: 24 },
    shadow: {
      sm: "0 4px 12px rgba(244,114,182,0.15), inset 0 1px 0 rgba(255,255,255,0.08)",
      md: "0 8px 24px rgba(244,114,182,0.2), inset 0 1px 0 rgba(255,255,255,0.08)",
      lg: "0 16px 48px rgba(244,114,182,0.25), inset 0 1px 0 rgba(255,255,255,0.1)",
    },
    gradient: {
      primary: "linear-gradient(135deg, #f472b6 0%, #a78bfa 100%)",
      accent: "linear-gradient(135deg, #fb7185 0%, #c084fc 100%)",
      surface: "linear-gradient(135deg, rgba(244,114,182,0.1) 0%, rgba(167,139,250,0.07) 100%)",
    },
  },
  "neo-brutalism": {
    aesthetic: "neo-brutalism",
    colors: {
      primary: "#facc15", accent: "#f97316",
      background: "#0a0a00", surface: "rgba(250,204,21,0.06)",
      surfaceElevated: "rgba(250,204,21,0.1)", border: "rgba(250,204,21,0.4)",
      text: { primary: "rgba(255,255,255,0.95)", secondary: "rgba(250,204,21,0.75)", tertiary: "rgba(255,255,255,0.3)" },
      success: "#4ade80", danger: "#f87171", warning: "#facc15",
    },
    radius: { sm: 4, md: 6, lg: 8, xl: 10, pill: 999 },
    spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 },
    fontSizes: { xs: 8, sm: 10, md: 12, lg: 14, xl: 18, xxl: 24 },
    shadow: { sm: "2px 2px 0px rgba(250,204,21,0.6)", md: "4px 4px 0px rgba(250,204,21,0.6)", lg: "6px 6px 0px rgba(250,204,21,0.6)" },
    gradient: {
      primary: "linear-gradient(90deg, #facc15 0%, #f97316 100%)",
      accent: "linear-gradient(90deg, #fde047 0%, #fb923c 100%)",
      surface: "linear-gradient(90deg, rgba(250,204,21,0.08) 0%, rgba(249,115,22,0.05) 100%)",
    },
  },
  "pastel-soft": {
    aesthetic: "pastel-soft",
    colors: {
      primary: "#a5b4fc", accent: "#86efac",
      background: "#06060f", surface: "rgba(165,180,252,0.07)",
      surfaceElevated: "rgba(165,180,252,0.12)", border: "rgba(165,180,252,0.2)",
      text: { primary: "rgba(255,255,255,0.9)", secondary: "rgba(165,180,252,0.85)", tertiary: "rgba(255,255,255,0.3)" },
      success: "#86efac", danger: "#fca5a5", warning: "#fde68a",
    },
    radius: { sm: 12, md: 16, lg: 20, xl: 24, pill: 999 },
    spacing: { xs: 4, sm: 8, md: 12, lg: 18, xl: 24 },
    fontSizes: { xs: 8, sm: 10, md: 12, lg: 14, xl: 18, xxl: 24 },
    shadow: { sm: "0 2px 8px rgba(165,180,252,0.12)", md: "0 6px 20px rgba(165,180,252,0.18)", lg: "0 12px 40px rgba(165,180,252,0.22)" },
    gradient: {
      primary: "linear-gradient(135deg, #a5b4fc 0%, #86efac 100%)",
      accent: "linear-gradient(135deg, #c4b5fd 0%, #6ee7b7 100%)",
      surface: "linear-gradient(135deg, rgba(165,180,252,0.1) 0%, rgba(134,239,172,0.07) 100%)",
    },
  },
  "material-you": {
    aesthetic: "material-you",
    colors: {
      primary: "#4f8eff", accent: "#00bcd4",
      background: "#080d14", surface: "rgba(79,142,255,0.07)",
      surfaceElevated: "rgba(79,142,255,0.12)", border: "rgba(79,142,255,0.2)",
      text: { primary: "rgba(255,255,255,0.95)", secondary: "rgba(255,255,255,0.55)", tertiary: "rgba(255,255,255,0.28)" },
      success: "#69f0ae", danger: "#ff5252", warning: "#ffca28",
    },
    radius: { sm: 8, md: 14, lg: 20, xl: 28, pill: 999 },
    spacing: { xs: 4, sm: 8, md: 14, lg: 20, xl: 28 },
    fontSizes: { xs: 8, sm: 10, md: 12, lg: 14, xl: 18, xxl: 24 },
    shadow: { sm: "0 2px 8px rgba(79,142,255,0.15)", md: "0 6px 20px rgba(79,142,255,0.22)", lg: "0 12px 40px rgba(79,142,255,0.28)" },
    gradient: {
      primary: "linear-gradient(135deg, #4f8eff 0%, #00bcd4 100%)",
      accent: "linear-gradient(135deg, #738fff 0%, #26c6da 100%)",
      surface: "linear-gradient(135deg, rgba(79,142,255,0.1) 0%, rgba(0,188,212,0.07) 100%)",
    },
  },
};

export const APP_CATEGORY_AESTHETICS: Record<string, AestheticName> = {
  fitness: "vibrant-gradient", sport: "vibrant-gradient", workout: "vibrant-gradient",
  health: "soft-clay", wellness: "soft-clay", meditation: "pastel-soft",
  finance: "dark-premium", banking: "dark-premium", crypto: "dark-premium",
  investment: "minimal-luxe", luxury: "minimal-luxe", premium: "minimal-luxe",
  social: "glassmorphism", community: "glassmorphism", dating: "soft-clay",
  productivity: "minimal-luxe", task: "material-you", notes: "material-you",
  education: "material-you", learning: "material-you",
  travel: "vibrant-gradient", food: "pastel-soft", recipe: "pastel-soft",
  shopping: "neo-brutalism", marketplace: "neo-brutalism",
  creative: "vibrant-gradient", music: "glassmorphism", game: "neo-brutalism",
  nurse: "soft-clay", doctor: "material-you", medical: "material-you",
};

export function getThemeForPrompt(prompt: string): EvermadeTheme {
  const lower = prompt.toLowerCase();
  for (const [keyword, aesthetic] of Object.entries(APP_CATEGORY_AESTHETICS)) {
    if (lower.includes(keyword)) return THEMES[aesthetic];
  }
  return THEMES["dark-premium"];
}

export function getTheme(aesthetic: AestheticName): EvermadeTheme {
  return THEMES[aesthetic] ?? THEMES["dark-premium"];
}
