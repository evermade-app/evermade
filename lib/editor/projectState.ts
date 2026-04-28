import type {
  Project,
  Screen,
  AppComponent,
  WorkoutItemComponent,
  RingStatComponent,
  ScreenStyle,
  Theme,
  NavItem,
} from "./project";

export const FITTRACK_PROJECT: Project = {
  id: "proj_fittrack",
  name: "FitTrack Pro",
  bundleId: "com.evermade.fittrack",
  platform: "ios",
  version: "0.4",
  theme: {
    primaryColor: "#7c5cfc",
    backgroundColor: "#090720",
    surfaceColor: "rgba(255,255,255,0.032)",
    textColor: "rgba(255,255,255,0.88)",
    accentColor: "#7c5cfc",
  },
  activeScreenId: "screen_home",
  navigation: {
    items: [
      { id: "nav_home",     label: "Home",     screenId: "screen_home",     icon: "home" },
      { id: "nav_activity", label: "Activity", screenId: "screen_activity", icon: "activity" },
      { id: "nav_health",   label: "Health",   screenId: "screen_health",   icon: "health" },
      { id: "nav_profile",  label: "Profile",  screenId: "screen_profile",  icon: "profile" },
    ],
  },
  screens: [
    {
      id: "screen_home",
      name: "Home",
      components: [
        {
          id: "comp_greeting",
          type: "greeting",
          props: { name: "Alex Chen", greeting: "Good morning" },
        },
        {
          id: "comp_activity_card",
          type: "activity-card",
          props: { title: "Activity — Today" },
        },
        {
          id: "comp_ring_move",
          type: "ring-stat",
          props: { ringKey: "move", label: "Move", value: 420, goal: 580, unit: "cal", color: "#ff375f" },
        },
        {
          id: "comp_ring_exercise",
          type: "ring-stat",
          props: { ringKey: "exercise", label: "Exercise", value: 28, goal: 45, unit: "min", color: "#30d158" },
        },
        {
          id: "comp_ring_stand",
          type: "ring-stat",
          props: { ringKey: "stand", label: "Stand", value: 10, goal: 12, unit: "hrs", color: "#0a84ff" },
        },
        {
          id: "comp_section_workouts",
          type: "section-header",
          props: { title: "Recent Workouts", actionLabel: "See all" },
        },
        {
          id: "comp_workout_0",
          type: "workout-item",
          props: { name: "Morning Run", time: "Today · 7:30 AM", duration: "32 min", calories: "284 cal", icon: "🏃", color: "#7c5cfc" },
        },
        {
          id: "comp_workout_1",
          type: "workout-item",
          props: { name: "Strength Training", time: "Yesterday · 5:15 PM", duration: "45 min", calories: "310 cal", icon: "💪", color: "#4878ff" },
        },
        {
          id: "comp_workout_2",
          type: "workout-item",
          props: { name: "Yoga Flow", time: "Mon · 8:00 AM", duration: "28 min", calories: "120 cal", icon: "🧘", color: "#30d158" },
        },
      ],
    },
    {
      id: "screen_activity",
      name: "Activity",
      components: [],
    },
    {
      id: "screen_health",
      name: "Health",
      components: [],
    },
    {
      id: "screen_profile",
      name: "Profile",
      components: [],
    },
  ],
};

// ── Read helpers ──────────────────────────────────────────────────────────────

export function getActiveScreen(project: Project): Screen | undefined {
  return project.screens.find((s) => s.id === project.activeScreenId);
}

export function getComponent(
  project: Project,
  screenId: string,
  componentId: string
): AppComponent | undefined {
  const screen = project.screens.find((s) => s.id === screenId);
  return screen?.components.find((c) => c.id === componentId);
}

export function getComponentLabel(component: AppComponent): string {
  switch (component.type) {
    case "greeting":      return "Profile";
    case "activity-card": return "Activity Card";
    case "ring-stat":     return component.props.label + " Ring";
    case "section-header":return component.props.title;
    case "workout-item":  return component.props.name;
    default:              return String((component.props as Record<string, unknown>).title ?? component.type);
  }
}

export function getWorkoutComponents(project: Project): WorkoutItemComponent[] {
  const screen = getActiveScreen(project);
  if (!screen) return [];
  return screen.components.filter(
    (c): c is WorkoutItemComponent => c.type === "workout-item"
  );
}

export function getRingComponent(
  project: Project,
  ringKey: "move" | "exercise" | "stand"
): RingStatComponent | undefined {
  const screen = getActiveScreen(project);
  if (!screen) return undefined;
  return screen.components.find(
    (c): c is RingStatComponent =>
      c.type === "ring-stat" && c.props.ringKey === ringKey
  );
}

// ── Write helpers (return new Project, do not mutate) ─────────────────────────

export function updateComponentProps(
  project: Project,
  screenId: string,
  componentId: string,
  patch: Record<string, unknown>
): Project {
  return {
    ...project,
    screens: project.screens.map((screen) =>
      screen.id !== screenId
        ? screen
        : {
            ...screen,
            components: screen.components.map((comp) =>
              comp.id !== componentId
                ? comp
                : ({ ...comp, props: { ...comp.props, ...patch } } as AppComponent)
            ),
          }
    ),
  };
}

export function updateScreenStyle(
  project: Project,
  screenId: string,
  patch: Partial<ScreenStyle>
): Project {
  return {
    ...project,
    screens: project.screens.map((s) =>
      s.id === screenId ? { ...s, style: { ...s.style, ...patch } } : s
    ),
  };
}

export function updateTheme(project: Project, patch: Partial<Theme>): Project {
  return { ...project, theme: { ...project.theme, ...patch } };
}

export function addScreenToProject(project: Project, screen: Screen): Project {
  const existingIndex = project.screens.findIndex((s) => s.id === screen.id);
  if (existingIndex !== -1) {
    // Screen exists — if incoming has components, replace the screen data; otherwise just switch to it
    if (screen.components.length > 0) {
      const screens = [...project.screens];
      screens[existingIndex] = { ...project.screens[existingIndex], ...screen };
      return { ...project, screens, activeScreenId: screen.id };
    }
    return { ...project, activeScreenId: screen.id };
  }
  return {
    ...project,
    screens: [...project.screens, screen],
    activeScreenId: screen.id,
  };
}

export function addComponentToScreen(
  project: Project,
  screenId: string,
  component: AppComponent
): Project {
  return {
    ...project,
    screens: project.screens.map((s) =>
      s.id !== screenId
        ? s
        : {
            ...s,
            components: s.components.some((c) => c.id === component.id)
              ? s.components
              : [...s.components, component],
          }
    ),
  };
}

export function updateProjectNavigation(
  project: Project,
  items: NavItem[]
): Project {
  return { ...project, navigation: { ...project.navigation, items } };
}

export function linkNavItemToScreen(
  project: Project,
  navItemId: string,
  screenId: string
): Project {
  return {
    ...project,
    navigation: {
      ...project.navigation,
      items: project.navigation.items.map((item) =>
        item.id === navItemId ? { ...item, screenId } : item
      ),
    },
  };
}
