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
};

const EditorContext = createContext<EditorContextValue | null>(null);

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

  // Load persisted project once on mount — skip when a project is injected directly
  useEffect(() => {
    if (isPreview) return;
    const saved = loadProject();
    if (saved) setProjectState(saved);
    setHydrated(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist mutations — skip for preview (read-only context)
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
