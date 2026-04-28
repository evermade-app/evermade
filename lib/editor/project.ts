export type Platform = "ios" | "android" | "cross-platform";

export type Theme = {
  primaryColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
  accentColor: string;
};

export type RingKey = "move" | "exercise" | "stand";

// ── FitTrack-specific components ─────────────────────────────────────────────

export type GreetingComponent = {
  id: string;
  type: "greeting";
  props: { name: string; greeting: string };
};

export type ActivityCardComponent = {
  id: string;
  type: "activity-card";
  props: { title: string };
};

export type RingStatComponent = {
  id: string;
  type: "ring-stat";
  props: { ringKey: RingKey; label: string; value: number; goal: number; unit: string; color: string };
};

export type SectionHeaderComponent = {
  id: string;
  type: "section-header";
  props: { title: string; actionLabel: string };
};

export type WorkoutItemComponent = {
  id: string;
  type: "workout-item";
  props: { name: string; time: string; duration: string; calories: string; icon: string; color: string };
};

// ── Generic screen components (used by AI-generated screens) ─────────────────

export type GenericComponentType =
  | "title"
  | "subtitle"
  | "text"
  | "metric_card"
  | "stat_row"
  | "list_item"
  | "cta_button"
  | "avatar"
  | "settings_row"
  | "spacer"
  | "activity_chart"
  | "divider"
  | "image_banner";

export type GenericComponent = {
  id: string;
  type: GenericComponentType;
  props: Record<string, unknown>;
};

// ── Union ─────────────────────────────────────────────────────────────────────

export type AppComponent =
  | GreetingComponent
  | ActivityCardComponent
  | RingStatComponent
  | SectionHeaderComponent
  | WorkoutItemComponent
  | GenericComponent;

export type ComponentType = AppComponent["type"];

// ── Screen ────────────────────────────────────────────────────────────────────

export type ScreenStyle = {
  backgroundColor?: string;
  accentColor?: string;
  surfaceColor?: string;
};

export type Screen = {
  id: string;
  name: string;
  components: AppComponent[];
  style?: ScreenStyle;
};

// ── Navigation ────────────────────────────────────────────────────────────────

export type NavIcon =
  | "home"
  | "activity"
  | "health"
  | "profile"
  | "settings"
  | "chart"
  | "star"
  | "user"
  | "bell"
  | "search";

export type NavItem = {
  id: string;
  label: string;
  screenId: string;
  icon: NavIcon;
};

export type Navigation = {
  items: NavItem[];
};

// ── Project ───────────────────────────────────────────────────────────────────

export type Project = {
  id: string;
  name: string;
  bundleId: string;
  platform: Platform;
  version: string;
  theme: Theme;
  activeScreenId: string;
  screens: Screen[];
  navigation: Navigation;
};

export type Selection = {
  screenId: string;
  componentId: string;
  componentType: ComponentType;
} | null;
