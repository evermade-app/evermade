"use client";

import { useState, useEffect } from "react";
import { useEditor } from "@/lib/editor/EditorContext";
import { getComponent, getComponentLabel } from "@/lib/editor/projectState";
import type {
  AppComponent,
  RingStatComponent,
  WorkoutItemComponent,
  GreetingComponent,
  SectionHeaderComponent,
} from "@/lib/editor/project";

export default function ContextualEditor() {
  const { selection, setSelection, project, updateComponent } = useEditor();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  if (!selection) return null;
  const component = getComponent(project, selection.screenId, selection.componentId);
  if (!component) return null;
  const label = getComponentLabel(component);

  return (
    <div
      style={{
        flexShrink: 0,
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        background: "rgba(255,255,255,0.01)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(-5px)",
        transition: "opacity 0.18s ease, transform 0.18s ease",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "9px 16px 8px",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "#7c5cfc",
              boxShadow: "0 0 7px rgba(124,92,252,0.9)",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: 10,
              color: "rgba(255,255,255,0.28)",
              letterSpacing: 0.3,
            }}
          >
            Editing
          </span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 650,
              color: "rgba(255,255,255,0.75)",
              letterSpacing: -0.1,
            }}
          >
            {label}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setSelection(null)}
          style={{
            width: 20,
            height: 20,
            borderRadius: 6,
            border: "1px solid rgba(255,255,255,0.09)",
            background: "rgba(255,255,255,0.04)",
            color: "rgba(255,255,255,0.38)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            lineHeight: 1,
            cursor: "pointer",
            transition: "all 0.14s ease",
          }}
        >
          ×
        </button>
      </div>

      {/* Controls */}
      <div
        style={{
          padding: "11px 16px 13px",
          maxHeight: 240,
          overflowY: "auto",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(255,255,255,0.05) transparent",
        }}
      >
        <EditorControls
          component={component}
          screenId={selection.screenId}
          updateComponent={updateComponent}
        />
      </div>
    </div>
  );
}

function EditorControls({
  component,
  screenId,
  updateComponent,
}: {
  component: AppComponent;
  screenId: string;
  updateComponent: (
    screenId: string,
    componentId: string,
    patch: Record<string, unknown>
  ) => void;
}) {
  const upd = (patch: Record<string, unknown>) =>
    updateComponent(screenId, component.id, patch);

  if (component.type === "greeting") {
    const c = component as GreetingComponent;
    return (
      <>
        <Field
          label="Name"
          value={c.props.name}
          onChange={(v) => upd({ name: v })}
        />
        <Field
          label="Greeting"
          value={c.props.greeting}
          onChange={(v) => upd({ greeting: v })}
        />
      </>
    );
  }

  if (component.type === "activity-card") {
    return (
      <div
        style={{
          fontSize: 11,
          color: "rgba(255,255,255,0.26)",
          lineHeight: 1.65,
        }}
      >
        Activity overview card.
        <br />
        Select a ring stat on the right to edit values.
      </div>
    );
  }

  if (component.type === "ring-stat") {
    const c = component as RingStatComponent;
    return (
      <>
        <Field
          label="Current value"
          value={c.props.value.toString()}
          type="number"
          suffix={c.props.unit}
          onChange={(v) => upd({ value: Math.max(0, Number(v) || 0) })}
        />
        <Field
          label="Goal"
          value={c.props.goal.toString()}
          type="number"
          suffix={c.props.unit}
          onChange={(v) => upd({ goal: Math.max(1, Number(v) || 1) })}
        />
        <ProgressReadout
          value={c.props.value}
          goal={c.props.goal}
          color={c.props.color}
        />
      </>
    );
  }

  if (component.type === "section-header") {
    const c = component as SectionHeaderComponent;
    return (
      <Field
        label="Section title"
        value={c.props.title}
        onChange={(v) => upd({ title: v })}
      />
    );
  }

  if (component.type === "workout-item") {
    const c = component as WorkoutItemComponent;
    return (
      <>
        <Field
          label="Activity name"
          value={c.props.name}
          onChange={(v) => upd({ name: v })}
        />
        <Field
          label="Time"
          value={c.props.time}
          onChange={(v) => upd({ time: v })}
        />
        <div style={{ display: "flex", gap: 8 }}>
          <Field
            label="Duration"
            value={c.props.duration}
            onChange={(v) => upd({ duration: v })}
          />
          <Field
            label="Calories"
            value={c.props.calories}
            onChange={(v) => upd({ calories: v })}
          />
        </div>
      </>
    );
  }

  return null;
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  suffix,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: "text" | "number";
  suffix?: string;
}) {
  return (
    <div style={{ marginBottom: 9, flex: 1 }}>
      <div
        style={{
          fontSize: 9,
          fontWeight: 700,
          color: "rgba(255,255,255,0.22)",
          letterSpacing: 0.9,
          textTransform: "uppercase",
          marginBottom: 5,
        }}
      >
        {label}
      </div>
      <div style={{ position: "relative" }}>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 8,
            padding: suffix ? "6px 30px 6px 9px" : "6px 9px",
            color: "rgba(255,255,255,0.82)",
            fontSize: 12,
            outline: "none",
            caretColor: "#7c5cfc",
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
            transition: "border-color 0.14s ease",
            boxSizing: "border-box",
          }}
          onFocus={(e) => {
            (e.target as HTMLInputElement).style.borderColor =
              "rgba(124,92,252,0.45)";
          }}
          onBlur={(e) => {
            (e.target as HTMLInputElement).style.borderColor =
              "rgba(255,255,255,0.08)";
          }}
        />
        {suffix && (
          <span
            style={{
              position: "absolute",
              right: 9,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 9.5,
              color: "rgba(255,255,255,0.2)",
              pointerEvents: "none",
              fontWeight: 500,
            }}
          >
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

function ProgressReadout({
  value,
  goal,
  color,
}: {
  value: number;
  goal: number;
  color: string;
}) {
  const pct = Math.min(100, Math.round((value / goal) * 100));
  return (
    <div
      style={{
        marginTop: 2,
        padding: "7px 9px",
        borderRadius: 8,
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        alignItems: "center",
        gap: 9,
      }}
    >
      <div style={{ flex: 1 }}>
        <div
          style={{
            height: 2.5,
            borderRadius: 2,
            background: "rgba(255,255,255,0.06)",
          }}
        >
          <div
            style={{
              width: `${pct}%`,
              height: "100%",
              borderRadius: 2,
              background: color,
              boxShadow: `0 0 5px ${color}55`,
              transition: "width 0.25s ease",
            }}
          />
        </div>
      </div>
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: "rgba(255,255,255,0.38)",
          flexShrink: 0,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {pct}%
      </span>
    </div>
  );
}
