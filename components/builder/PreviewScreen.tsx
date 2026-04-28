"use client";

import React from "react";
import { useEditor } from "@/lib/editor/EditorContext";
import {
  getComponent,
  getWorkoutComponents,
  getRingComponent,
} from "@/lib/editor/projectState";
import type {
  GreetingComponent,
  SectionHeaderComponent,
  GenericComponent,
  NavIcon,
} from "@/lib/editor/project";
import EditableRegion from "./editor/EditableRegion";
import { resolveRegistryComponent } from "@/lib/evermade/component-resolver";

const C_MOVE = 220;
const C_EXERCISE = 157;
const C_STAND = 94;

function ringDash(circumference: number, value: number, goal: number): string {
  const pct = Math.min(1, Math.max(0, value / goal));
  const fill = circumference * pct;
  return `${fill.toFixed(1)} ${(circumference - fill).toFixed(1)}`;
}

function hexToRgb(hex: string): string {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m ? `${parseInt(m[1], 16)},${parseInt(m[2], 16)},${parseInt(m[3], 16)}` : "124,92,252";
}

function NavIconSvg({ icon, size = 20 }: { icon: NavIcon; size?: number }) {
  const s = size;
  switch (icon) {
    case "home":
      return (
        <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
          <rect x="2" y="2" width="7" height="7" rx="2" fill="currentColor" />
          <rect x="11" y="2" width="7" height="7" rx="2" fill="currentColor" opacity="0.45" />
          <rect x="2" y="11" width="7" height="7" rx="2" fill="currentColor" opacity="0.45" />
          <rect x="11" y="11" width="7" height="7" rx="2" fill="currentColor" opacity="0.45" />
        </svg>
      );
    case "activity":
      return (
        <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
          <polyline points="2,13 6,8 10,11 14,5 18,8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "health":
      return (
        <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
          <path d="M10 17C10 17 2.5 12 2.5 6.8C2.5 4.6 4.2 3 6.5 3C7.9 3 9.1 3.8 10 5C10.9 3.8 12.1 3 13.5 3C15.8 3 17.5 4.6 17.5 6.8C17.5 12 10 17 10 17Z" stroke="currentColor" strokeWidth="1.6" fill="none" />
        </svg>
      );
    case "profile":
    case "user":
      return (
        <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.6" />
          <path d="M3 18C3 14.5 6.1 12 10 12C13.9 12 17 14.5 17 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "settings":
      return (
        <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.6" />
          <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.6 4.6l1.4 1.4M14 14l1.4 1.4M4.6 15.4l1.4-1.4M14 6l1.4-1.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
    case "chart":
      return (
        <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
          <rect x="3" y="11" width="3" height="6" rx="1" fill="currentColor" opacity="0.6" />
          <rect x="8.5" y="7" width="3" height="10" rx="1" fill="currentColor" />
          <rect x="14" y="3" width="3" height="14" rx="1" fill="currentColor" opacity="0.6" />
        </svg>
      );
    case "star":
      return (
        <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
          <path d="M10 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4L10 14.4l-4.8 2.5.9-5.4L2.2 7.7l5.4-.8L10 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      );
    case "bell":
      return (
        <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
          <path d="M10 2a6 6 0 0 0-6 6v4l-1.5 2h15L16 12V8a6 6 0 0 0-6-6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M8.5 16a1.5 1.5 0 0 0 3 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "search":
      return (
        <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
          <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.6" />
          <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="6" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
  }
}

// Padding applied around every component row inside the phone screen
const ROW_PX = "0 10px";

function GenericComponentRenderer({ comp, primaryColor, primaryRgb }: {
  comp: GenericComponent;
  primaryColor: string;
  primaryRgb: string;
}) {
  const p = comp.props as Record<string, string>;

  // Real Evermade component — resolve phone-optimized version from resolver
  if (p.registryComponentId) {
    const rendered = resolveRegistryComponent(p.registryComponentId, comp.props as Record<string, unknown>);
    if (rendered) {
      // width:100% so it fills the padded row perfectly
      return <>{rendered}</>;
    }
  }

  // ── Generic fallback renderers ──────────────────────────────────────────────
  switch (comp.type) {
    case "title":
      return (
        <div style={{ fontSize: 20, fontWeight: 700, color: "rgba(255,255,255,0.93)", letterSpacing: -0.4, lineHeight: 1.15 }}>
          {p.text ?? "Title"}
        </div>
      );
    case "subtitle":
      return (
        <div style={{ fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,0.48)", lineHeight: 1.5 }}>
          {p.text ?? ""}
        </div>
      );
    case "text":
      return (
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.36)", lineHeight: 1.55 }}>
          {p.text ?? ""}
        </div>
      );
    case "metric_card":
      return (
        <div style={{ padding: "10px 12px", borderRadius: 13, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontSize: 8, fontWeight: 700, color: "rgba(255,255,255,0.28)", letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 5 }}>{p.label ?? "Metric"}</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
            <span style={{ fontSize: 22, fontWeight: 700, color: "rgba(255,255,255,0.92)", letterSpacing: -0.8 }}>{p.value ?? "—"}</span>
            {p.unit && <span style={{ fontSize: 10, color: "rgba(255,255,255,0.28)" }}>{p.unit}</span>}
          </div>
        </div>
      );
    case "stat_row":
      return (
        <div style={{ padding: "9px 12px", borderRadius: 11, background: "rgba(255,255,255,0.03)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.55)" }}>{p.label ?? "Stat"}</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.88)" }}>{p.value ?? "—"}{p.unit ? ` ${p.unit}` : ""}</span>
        </div>
      );
    case "list_item":
      return (
        <div style={{ padding: "9px 12px", borderRadius: 11, background: "rgba(255,255,255,0.032)", border: "1px solid rgba(255,255,255,0.065)", display: "flex", alignItems: "center", gap: 9 }}>
          {p.icon && <span style={{ fontSize: 16, flexShrink: 0 }}>{p.icon}</span>}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.88)" }}>{p.title ?? "Item"}</div>
            {p.subtitle && <div style={{ fontSize: 9, color: "rgba(255,255,255,0.33)", marginTop: 1 }}>{p.subtitle}</div>}
          </div>
        </div>
      );
    case "cta_button":
      return (
        <div style={{ padding: "10px 0", borderRadius: 13, background: p.color ?? primaryColor, textAlign: "center", fontSize: 12, fontWeight: 700, color: "white" }}>
          {p.label ?? "Action"}
        </div>
      );
    case "avatar":
      return (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg, ${primaryColor} 0%, #4878ff 100%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "white", flexShrink: 0 }}>
            {(p.name ?? "?").charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>{p.name ?? "User"}</div>
            {p.subtitle && <div style={{ fontSize: 10, color: "rgba(255,255,255,0.36)", marginTop: 1 }}>{p.subtitle}</div>}
          </div>
        </div>
      );
    case "settings_row":
      return (
        <div style={{ padding: "10px 12px", borderRadius: 11, background: "rgba(255,255,255,0.032)", border: "1px solid rgba(255,255,255,0.055)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.72)" }}>{p.label ?? "Setting"}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            {p.value && <span style={{ fontSize: 10, color: "rgba(255,255,255,0.32)" }}>{p.value}</span>}
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M4 2.5l4 3.5-4 3.5" stroke="rgba(255,255,255,0.2)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      );
    case "spacer":
      return <div style={{ height: Number(p.height) || 8 }} />;
    case "activity_chart":
      return (
        <div style={{ padding: "10px 12px", borderRadius: 13, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          {p.label && <div style={{ fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.33)", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.7 }}>{p.label}</div>}
          <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 44 }}>
            {[40, 65, 30, 80, 55, 90, 70].map((h, i) => (
              <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: 3, background: i === 6 ? primaryColor : `rgba(${primaryRgb},0.3)` }} />
            ))}
          </div>
          {p.period && <div style={{ fontSize: 8, color: "rgba(255,255,255,0.2)", marginTop: 5, textAlign: "center" }}>{p.period}</div>}
        </div>
      );
    case "divider":
      return <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />;
    case "image_banner":
      return (
        <div style={{ height: 80, borderRadius: 14, background: `linear-gradient(135deg, rgba(${primaryRgb},0.14) 0%, rgba(72,120,255,0.09) 100%)`, border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.22)" }}>{p.label ?? "Image"}</span>
        </div>
      );
    default:
      return null;
  }
}

function GenericScreenRenderer({ screenId, primaryColor, primaryRgb }: { screenId: string; primaryColor: string; primaryRgb: string }) {
  const { project } = useEditor();
  const screen = project.screens.find((s) => s.id === screenId);
  if (!screen) return null;

  const LEGACY = new Set(["greeting", "activity-card", "ring-stat", "section-header", "workout-item"]);

  // Filter out legacy components AND app-tab-bar (we render our own clickable one below)
  const eligible = screen.components.filter((c) => {
    if (LEGACY.has(c.type)) return false;
    const rid = (c.props as Record<string, unknown>).registryComponentId;
    if (rid === "app-tab-bar") return false;
    return true;
  }) as GenericComponent[];

  if (eligible.length === 0) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 220, gap: 10 }}>
        <div style={{ fontSize: 28, opacity: 0.5 }}>✦</div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.22)", textAlign: "center", maxWidth: 150, lineHeight: 1.55 }}>
          Screen is empty — describe what to add in the chat
        </div>
      </div>
    );
  }

  // Build rows: consecutive kpi-glow-card pairs render side by side
  const rows: React.ReactNode[] = [];
  let i = 0;
  while (i < eligible.length) {
    const comp = eligible[i];
    const isKpi = (c: GenericComponent) =>
      (c.props as Record<string, unknown>).registryComponentId === "kpi-glow-card";

    if (isKpi(comp) && i + 1 < eligible.length && isKpi(eligible[i + 1])) {
      rows.push(
        <div key={`kpi-${i}`} style={{ display: "flex", gap: 5, padding: ROW_PX }}>
          <GenericComponentRenderer comp={comp} primaryColor={primaryColor} primaryRgb={primaryRgb} />
          <GenericComponentRenderer comp={eligible[i + 1]} primaryColor={primaryColor} primaryRgb={primaryRgb} />
        </div>
      );
      i += 2;
    } else {
      rows.push(
        <div key={comp.id} style={{ padding: ROW_PX }}>
          <GenericComponentRenderer comp={comp} primaryColor={primaryColor} primaryRgb={primaryRgb} />
        </div>
      );
      i++;
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5, paddingTop: 4, paddingBottom: 8 }}>
      {rows}
    </div>
  );
}

// ── Sleek preview — renders GPT-4o HTML screens in an iframe ─────────────────
function SleekPreview() {
  const { sleekApp, setSleekActiveIndex, setSleekApp } = useEditor();

  // Listen for postMessage navigation from inside the iframe
  React.useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.data?.type === "sleek-navigate" && typeof e.data.screenIndex === "number") {
        setSleekActiveIndex(e.data.screenIndex);
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [setSleekActiveIndex]);

  if (!sleekApp) return null;
  const active = sleekApp.screens[sleekApp.activeIndex];

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#080818", position: "relative" }}>
      {/* iframe — fills the phone body */}
      {active && (
        <iframe
          key={active.id}
          srcDoc={active.html}
          sandbox="allow-scripts allow-same-origin"
          style={{ flex: 1, width: "100%", border: "none", display: "block" }}
          title={active.name}
        />
      )}

      {/* Screen tab strip pinned at bottom of phone */}
      <div style={{
        display: "flex", overflowX: "auto", gap: 4, padding: "5px 6px",
        background: "rgba(8,8,24,0.97)", borderTop: "1px solid rgba(255,255,255,0.07)",
        scrollbarWidth: "none", flexShrink: 0,
      }}>
        {sleekApp.screens.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setSleekActiveIndex(i)}
            style={{
              flexShrink: 0, padding: "3px 8px", borderRadius: 6, border: "none",
              background: i === sleekApp.activeIndex ? "rgba(124,92,252,0.7)" : "rgba(255,255,255,0.06)",
              color: i === sleekApp.activeIndex ? "#fff" : "rgba(255,255,255,0.35)",
              fontSize: 9, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
              letterSpacing: 0.2,
            }}
          >
            {s.name}
          </button>
        ))}
        <button
          onClick={() => setSleekApp(null)}
          style={{
            flexShrink: 0, marginLeft: "auto", padding: "3px 8px",
            borderRadius: 6, border: "1px solid rgba(255,255,255,0.1)", background: "none",
            color: "rgba(255,255,255,0.25)", fontSize: 9, cursor: "pointer",
          }}
        >
          ✕ reset
        </button>
      </div>
    </div>
  );
}

export default function PreviewScreen() {
  const { project, editMode, setSelection, setActiveScreen, sleekApp } = useEditor();

  // Sleek preview takes over the whole phone screen
  if (sleekApp) return <SleekPreview />;

  const screenId = project.activeScreenId;
  const activeScreen = project.screens.find((s) => s.id === screenId);
  const screenBg = activeScreen?.style?.backgroundColor ?? project.theme.backgroundColor ?? "#08080F";
  const primaryColor = project.theme.primaryColor;
  const primaryRgb = hexToRgb(primaryColor);

  const isHomeScreen = screenId === "screen_home";

  // Home screen shows the hardcoded FitTrack template ONLY if no AI-generated
  // (generic) components have been added. Once the AI adds any component, the
  // generic renderer takes over so changes are actually visible.
  const LEGACY_TYPES = new Set(["greeting", "activity-card", "ring-stat", "section-header", "workout-item"]);
  const hasAIComponents = activeScreen
    ? activeScreen.components.some((c) => !LEGACY_TYPES.has(c.type))
    : false;
  const showLegacyHome = isHomeScreen && !hasAIComponents;

  const greetingComp = getComponent(project, screenId, "comp_greeting") as GreetingComponent | undefined;
  const sectionComp = getComponent(project, screenId, "comp_section_workouts") as SectionHeaderComponent | undefined;
  const ringMove = getRingComponent(project, "move");
  const ringExercise = getRingComponent(project, "exercise");
  const ringStand = getRingComponent(project, "stand");
  const workouts = getWorkoutComponents(project);

  const navItems = project.navigation?.items ?? [];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: screenBg,
        overflow: "hidden",
        position: "relative",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', sans-serif",
      }}
      onClick={editMode ? (e) => { e.stopPropagation(); setSelection(null); } : undefined}
    >
      {/* Radial glow */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: "50%",
          transform: "translateX(-50%)",
          width: 320,
          height: 280,
          background: `radial-gradient(ellipse at 50% 0%, rgba(${primaryRgb},0.18) 0%, transparent 65%)`,
          pointerEvents: "none",
        }}
      />

      {/* ── Status bar ── */}
      <div style={{ position: "absolute", top: 14, left: 22, fontSize: 13, fontWeight: 650, color: "rgba(255,255,255,0.92)", letterSpacing: 0.1, zIndex: 2, pointerEvents: "none" }}>
        9:41
      </div>
      <div style={{ position: "absolute", top: 16, right: 20, display: "flex", alignItems: "center", gap: 5, zIndex: 2, pointerEvents: "none" }}>
        <div style={{ display: "flex", gap: 1.5, alignItems: "flex-end", height: 10 }}>
          {[3, 6, 8, 10].map((h, i) => (
            <div key={i} style={{ width: 2.5, height: h, background: i < 3 ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.22)", borderRadius: 0.8 }} />
          ))}
        </div>
        <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
          <path d="M1 4C3.2 1.8 5.4 1 7 1C8.6 1 10.8 1.8 13 4" stroke="rgba(255,255,255,0.88)" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M3 6.5C4.2 5.3 5.4 4.8 7 4.8C8.6 4.8 9.8 5.3 11 6.5" stroke="rgba(255,255,255,0.88)" strokeWidth="1.3" strokeLinecap="round" />
          <circle cx="7" cy="9.5" r="1.1" fill="rgba(255,255,255,0.88)" />
        </svg>
        <div style={{ width: 23, height: 11, border: "1.5px solid rgba(255,255,255,0.5)", borderRadius: 3, padding: "1.5px", position: "relative" }}>
          <div style={{ position: "absolute", right: -4, top: "50%", transform: "translateY(-50%)", width: 2, height: 5, background: "rgba(255,255,255,0.4)", borderRadius: "0 1px 1px 0" }} />
          <div style={{ width: "80%", height: "100%", background: "rgba(255,255,255,0.88)", borderRadius: 1.5 }} />
        </div>
      </div>

      {/* ── Scrollable body ── */}
      <div
        style={{
          position: "absolute",
          top: 52,
          left: 0,
          right: 0,
          bottom: navItems.length > 0 ? 58 : 0,
          overflowY: "auto",
          overflowX: "visible",
          scrollbarWidth: "none",
        }}
      >
        {showLegacyHome ? (
          <>
            {/* Greeting */}
            <EditableRegion screenId={screenId} componentId="comp_greeting" componentType="greeting" label="Profile" style={{ padding: "12px 18px 0" }} radius={12}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.38)", marginBottom: 2 }}>{greetingComp?.props.greeting ?? "Good morning"}</div>
                  <div style={{ fontSize: 19, fontWeight: 700, color: "rgba(255,255,255,0.93)", letterSpacing: -0.5 }}>{greetingComp?.props.name ?? ""}</div>
                </div>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #7c5cfc 0%, #4878ff 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "white", boxShadow: "0 3px 12px rgba(124,92,252,0.5)", flexShrink: 0 }}>
                  {(greetingComp?.props.name ?? "A").charAt(0).toUpperCase()}
                </div>
              </div>
            </EditableRegion>

            {/* Activity Hero Card */}
            <EditableRegion screenId={screenId} componentId="comp_activity_card" componentType="activity-card" label="Activity Card" style={{ margin: "12px 14px 0" }} radius={20}>
              <div style={{ borderRadius: 20, background: "linear-gradient(145deg, rgba(124,92,252,0.1) 0%, rgba(72,120,255,0.06) 100%)", border: "1px solid rgba(124,92,252,0.2)", padding: "14px 14px 12px", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: 1.1, textTransform: "uppercase", marginBottom: 12 }}>Activity — Today</div>
                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <svg width="88" height="88" viewBox="0 0 90 90" style={{ flexShrink: 0, pointerEvents: "none" }}>
                    <circle cx="45" cy="45" r="35" fill="none" stroke="rgba(255,55,95,0.14)" strokeWidth="7" />
                    <circle cx="45" cy="45" r="35" fill="none" stroke="url(#pr-move)" strokeWidth="7" strokeDasharray={ringDash(C_MOVE, ringMove?.props.value ?? 0, ringMove?.props.goal ?? 1)} strokeLinecap="round" transform="rotate(-90 45 45)" />
                    <circle cx="45" cy="45" r="25" fill="none" stroke="rgba(48,209,88,0.14)" strokeWidth="7" />
                    <circle cx="45" cy="45" r="25" fill="none" stroke="url(#pr-ex)" strokeWidth="7" strokeDasharray={ringDash(C_EXERCISE, ringExercise?.props.value ?? 0, ringExercise?.props.goal ?? 1)} strokeLinecap="round" transform="rotate(-90 45 45)" />
                    <circle cx="45" cy="45" r="15" fill="none" stroke="rgba(10,132,255,0.14)" strokeWidth="7" />
                    <circle cx="45" cy="45" r="15" fill="none" stroke="url(#pr-stand)" strokeWidth="7" strokeDasharray={ringDash(C_STAND, ringStand?.props.value ?? 0, ringStand?.props.goal ?? 1)} strokeLinecap="round" transform="rotate(-90 45 45)" />
                    <defs>
                      <linearGradient id="pr-move" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor={ringMove?.props.color ?? "#ff375f"} />
                        <stop offset="100%" stopColor="#ff6b6b" />
                      </linearGradient>
                      <linearGradient id="pr-ex" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor={ringExercise?.props.color ?? "#30d158"} />
                        <stop offset="100%" stopColor="#4ade80" />
                      </linearGradient>
                      <linearGradient id="pr-stand" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor={ringStand?.props.color ?? "#0a84ff"} />
                        <stop offset="100%" stopColor="#60a5fa" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                    {([{ compId: "comp_ring_move", ring: ringMove }, { compId: "comp_ring_exercise", ring: ringExercise }, { compId: "comp_ring_stand", ring: ringStand }] as const).map(({ compId, ring }) => {
                      if (!ring) return null;
                      const pct = Math.min(100, Math.round((ring.props.value / ring.props.goal) * 100));
                      return (
                        <EditableRegion key={compId} screenId={screenId} componentId={compId} componentType="ring-stat" label={ring.props.label + " Ring"} radius={8}>
                          <div>
                            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
                              <div style={{ width: 5, height: 5, borderRadius: "50%", background: ring.props.color, boxShadow: `0 0 5px ${ring.props.color}99`, flexShrink: 0, marginBottom: 1 }} />
                              <span style={{ fontSize: 9, color: "rgba(255,255,255,0.32)", width: 42 }}>{ring.props.label}</span>
                              <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.9)", letterSpacing: -0.3 }}>{ring.props.value}</span>
                              <span style={{ fontSize: 8, color: "rgba(255,255,255,0.28)" }}>{ring.props.unit}</span>
                            </div>
                            <div style={{ height: 2.5, borderRadius: 2, background: "rgba(255,255,255,0.06)" }}>
                              <div style={{ width: `${pct}%`, height: "100%", borderRadius: 2, background: ring.props.color, boxShadow: `0 0 5px ${ring.props.color}66`, transition: "width 0.3s ease" }} />
                            </div>
                          </div>
                        </EditableRegion>
                      );
                    })}
                  </div>
                </div>
              </div>
            </EditableRegion>

            {/* Workouts section */}
            <div style={{ padding: "14px 14px 0" }}>
              <EditableRegion screenId={screenId} componentId="comp_section_workouts" componentType="section-header" label="Workouts Section" style={{ marginBottom: 9 }} radius={8}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "2px 0" }}>
                  <span style={{ fontSize: 12, fontWeight: 650, color: "rgba(255,255,255,0.85)", letterSpacing: -0.1 }}>{sectionComp?.props.title ?? "Recent Workouts"}</span>
                  <span style={{ fontSize: 10, color: `rgba(${primaryRgb},0.85)`, fontWeight: 500 }}>{sectionComp?.props.actionLabel ?? "See all"}</span>
                </div>
              </EditableRegion>

              {workouts.map((w) => (
                <EditableRegion key={w.id} screenId={screenId} componentId={w.id} componentType="workout-item" label={w.props.name} style={{ marginBottom: 6 }} radius={14}>
                  <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 10px", borderRadius: 14, background: "rgba(255,255,255,0.032)", border: "1px solid rgba(255,255,255,0.065)" }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: `${w.props.color}20`, border: `1px solid ${w.props.color}35`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>{w.props.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.88)" }}>{w.props.name}</div>
                      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginTop: 1 }}>{w.props.time}</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2, flexShrink: 0 }}>
                      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.42)", fontWeight: 500 }}>{w.props.duration}</span>
                      <span style={{ fontSize: 9, color: "rgba(255,255,255,0.24)" }}>{w.props.calories}</span>
                    </div>
                  </div>
                </EditableRegion>
              ))}
              <div style={{ height: 8 }} />
            </div>
          </>
        ) : (
          <GenericScreenRenderer screenId={screenId} primaryColor={primaryColor} primaryRgb={primaryRgb} />
        )}
      </div>

      {/* ── Bottom navigation — pinned, all screen types ── */}
      {navItems.length > 0 && (
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 58,
          background: "rgba(8,8,15,0.96)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "flex-start",
          paddingTop: 8,
          zIndex: 20,
        }}>
          {navItems.map((item) => {
            const isActive = item.screenId === screenId;
            return (
              <button
                key={item.id}
                onClick={() => setActiveScreen(item.screenId)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 3,
                  padding: "0 10px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: isActive ? primaryColor : "rgba(255,255,255,0.28)",
                  filter: isActive ? `drop-shadow(0 0 6px rgba(${primaryRgb},0.85))` : "none",
                  position: "relative",
                }}
              >
                {isActive && (
                  <div style={{
                    position: "absolute",
                    top: -8,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 24,
                    height: 2,
                    borderRadius: 999,
                    background: `rgba(${primaryRgb},0.9)`,
                  }} />
                )}
                <NavIconSvg icon={item.icon} size={20} />
                <span style={{
                  fontSize: 8.5,
                  fontWeight: isActive ? 700 : 400,
                  letterSpacing: 0.2,
                  color: isActive ? `rgba(${primaryRgb},0.9)` : "rgba(255,255,255,0.22)",
                }}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Home indicator */}
      {navItems.length === 0 && (
        <div style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", width: 100, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.18)" }} />
      )}
    </div>
  );
}
