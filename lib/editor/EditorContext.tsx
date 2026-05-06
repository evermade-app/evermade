"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { saveProject, loadProject } from "./projectPersistence";
import type { Project, Selection, ScreenStyle, Theme, Screen, AppComponent, NavItem } from "./project";
import {
  FITTRACK_PROJECT,
  updateComponentProps,
  updateScreenStyle as updateScreenStyleUtil,
  updateTheme as updateThemeUtil,
  addScreenToProject,
  addComponentToScreen,
  updateProjectNavigation,
  linkNavItemToScreen,
} from "./projectState";

export interface SleekPreviewScreen {
  id: string;
  name: string;
  html: string;
  screenshotUrl?: string;
}

export interface SleekPreviewApp {
  id: string;
  appName: string;
  screens: SleekPreviewScreen[];
  activeIndex: number;
}

export interface VESelection {
  screenIndex: number;
  screenName: string;
  elementTag: string;
  elementText: string;
}

type EditorContextValue = {
  hydrated: boolean;
  editMode: boolean;
  toggleEditMode: () => void;
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
  selection: Selection;
  setSelection: (s: Selection) => void;
  project: Project;
  updateComponent: (screenId: string, componentId: string, patch: Record<string, unknown>) => void;
  updateScreenStyle: (screenId: string, patch: Partial<ScreenStyle>) => void;
  updateTheme: (patch: Partial<Theme>) => void;
  setProject: (p: Project) => void;
  addScreen: (screen: Screen) => void;
  addComponent: (screenId: string, component: AppComponent) => void;
  updateNavigation: (items: NavItem[]) => void;
  linkNavItem: (navItemId: string, screenId: string) => void;
  setActiveScreen: (screenId: string) => void;
  // Sleek live preview
  sleekApp: SleekPreviewApp | null;
  setSleekApp: (app: SleekPreviewApp | null) => void;
  setSleekActiveIndex: (index: number) => void;
  // Visual editor selection
  veSelection: VESelection | null;
  setVeSelection: (s: VESelection | null) => void;
};

const EditorContext = createContext<EditorContextValue | null>(null);

function sleekKey(projectId: string): string {
  return `evermade-sleek-${projectId}`;
}

function saveSleekApp(projectId: string, app: SleekPreviewApp | null): void {
  if (typeof window === "undefined") return;
  try {
    const key = sleekKey(projectId);
    if (app) {
      localStorage.setItem(key, JSON.stringify(app));
    } else {
      localStorage.removeItem(key);
    }
  } catch {
    // quota exceeded or private browsing
  }
}

function loadSleekApp(projectId: string): SleekPreviewApp | null {
  if (typeof window === "undefined") return null;
  try {
    // Try per-project key first (new format)
    const raw = localStorage.getItem(sleekKey(projectId));
    if (raw) {
      const parsed = JSON.parse(raw) as SleekPreviewApp;
      if (parsed?.id && Array.isArray(parsed.screens)) return parsed;
    }
    // Migration fallback: only apply legacy sleekApp to the project that was
    // last stored under evermade-project-v1 (id-matched, prevents wrong project)
    try {
      const legacyProj = localStorage.getItem("evermade-project-v1");
      if (legacyProj) {
        const legacyParsed = JSON.parse(legacyProj) as { id?: string };
        if (legacyParsed?.id === projectId) {
          const legacy = localStorage.getItem("evermade-sleek-app-v1");
          if (legacy) {
            const parsed = JSON.parse(legacy) as SleekPreviewApp;
            if (parsed?.id && Array.isArray(parsed.screens)) {
              localStorage.setItem(sleekKey(projectId), legacy);
              return parsed;
            }
          }
        }
      }
    } catch { /* ignore */ }
    return null;
  } catch {
    return null;
  }
}

export function EditorProvider({
  children,
  initialProject,
}: {
  children: ReactNode;
  initialProject?: Project;
}) {
  const isPreview = initialProject !== undefined;
  const [editMode, setEditMode] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selection, setSelectionState] = useState<Selection>(null);
  const [project, setProjectState] = useState<Project>(initialProject ?? FITTRACK_PROJECT);
  const [hydrated, setHydrated] = useState(isPreview);
  const [sleekApp, setSleekAppState] = useState<SleekPreviewApp | null>(null);
  const [veSelection, setVeSelectionState] = useState<VESelection | null>(null);

  // Load persisted project and sleek app once on mount
  useEffect(() => {
    if (isPreview) return;
    // loadProject reads evermade-active-project to know which project to load
    const savedProject = loadProject();
    if (savedProject) {
      setProjectState(savedProject);
      const savedSleek = loadSleekApp(savedProject.id);
      if (savedSleek) setSleekAppState(savedSleek);
    } else {
      // Fallback: try active project signal for sleekApp even if no project data
      const activeProjectId = localStorage.getItem("evermade-active-project");
      if (activeProjectId) {
        const savedSleek = loadSleekApp(activeProjectId);
        if (savedSleek) setSleekAppState(savedSleek);
      }
    }
    setHydrated(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist project mutations
  useEffect(() => {
    if (hydrated && !isPreview) saveProject(project);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project, hydrated]);

  const toggleEditMode = useCallback(() => {
    setEditMode((v) => {
      if (v) {
        setHoveredId(null);
        setSelectionState(null);
      }
      return !v;
    });
  }, []);

  const setSelection = useCallback((s: Selection) => {
    setSelectionState(s);
  }, []);

  const setProject = useCallback((p: Project) => {
    setProjectState(p);
  }, []);

  const updateComponent = useCallback(
    (screenId: string, componentId: string, patch: Record<string, unknown>) => {
      setProjectState((prev) =>
        updateComponentProps(prev, screenId, componentId, patch)
      );
    },
    []
  );

  const updateScreenStyle = useCallback(
    (screenId: string, patch: Partial<ScreenStyle>) => {
      setProjectState((prev) => updateScreenStyleUtil(prev, screenId, patch));
    },
    []
  );

  const updateTheme = useCallback(
    (patch: Partial<Theme>) => {
      setProjectState((prev) => updateThemeUtil(prev, patch));
    },
    []
  );

  const addScreen = useCallback((screen: Screen) => {
    setProjectState((prev) => addScreenToProject(prev, screen));
  }, []);

  const addComponent = useCallback((screenId: string, component: AppComponent) => {
    setProjectState((prev) => addComponentToScreen(prev, screenId, component));
  }, []);

  const updateNavigation = useCallback((items: NavItem[]) => {
    setProjectState((prev) => updateProjectNavigation(prev, items));
  }, []);

  const linkNavItem = useCallback((navItemId: string, screenId: string) => {
    setProjectState((prev) => linkNavItemToScreen(prev, navItemId, screenId));
  }, []);

  const setActiveScreen = useCallback((screenId: string) => {
    setProjectState((prev) => ({ ...prev, activeScreenId: screenId }));
  }, []);

  const setSleekApp = useCallback((app: SleekPreviewApp | null) => {
    setSleekAppState(app);
    if (!isPreview) {
      setProjectState((prev) => {
        saveSleekApp(prev.id, app);
        return prev;
      });
    }
  }, [isPreview]);

  const setVeSelection = useCallback((s: VESelection | null) => {
    setVeSelectionState(s);
  }, []);

  const setSleekActiveIndex = useCallback((index: number) => {
    setSleekAppState((prev) => {
      const next = prev ? { ...prev, activeIndex: index } : prev;
      if (!isPreview && next) {
        setProjectState((p) => {
          saveSleekApp(p.id, next);
          return p;
        });
      }
      return next;
    });
  }, [isPreview]);

  return (
    <EditorContext.Provider
      value={{
        hydrated,
        editMode,
        toggleEditMode,
        hoveredId,
        setHoveredId,
        selection,
        setSelection,
        project,
        updateComponent,
        updateScreenStyle,
        updateTheme,
        setProject,
        addScreen,
        addComponent,
        updateNavigation,
        linkNavItem,
        setActiveScreen,
        sleekApp,
        setSleekApp,
        setSleekActiveIndex,
        veSelection,
        setVeSelection,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor(): EditorContextValue {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error("useEditor must be used inside EditorProvider");
  return ctx;
}
