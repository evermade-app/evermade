"use client";

import { useEditor } from "@/lib/editor/EditorContext";
import type { ComponentType } from "@/lib/editor/project";

type Props = {
  screenId: string;
  componentId: string;
  componentType: ComponentType;
  label: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  radius?: number;
};

export default function EditableRegion({
  screenId,
  componentId,
  componentType,
  label,
  children,
  style,
  radius = 14,
}: Props) {
  const { editMode, hoveredId, selection, setHoveredId, setSelection } =
    useEditor();

  const isHovered =
    editMode &&
    hoveredId === componentId &&
    selection?.componentId !== componentId;
  const isSelected = editMode && selection?.componentId === componentId;
  const resolvedRadius =
    style?.borderRadius !== undefined ? (style.borderRadius as number) : radius;

  return (
    <div
      style={{
        ...style,
        position: "relative",
        cursor: editMode ? "pointer" : undefined,
        borderRadius: resolvedRadius,
      }}
      onMouseEnter={editMode ? () => setHoveredId(componentId) : undefined}
      onMouseLeave={editMode ? () => setHoveredId(null) : undefined}
      onClick={
        editMode
          ? (e) => {
              e.stopPropagation();
              setSelection(
                isSelected
                  ? null
                  : { screenId, componentId, componentType }
              );
            }
          : undefined
      }
    >
      {children}

      {/* Hover ring */}
      {isHovered && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: resolvedRadius,
            border: "1px solid rgba(160,140,255,0.5)",
            boxShadow: "0 0 0 3px rgba(124,92,252,0.07)",
            pointerEvents: "none",
            zIndex: 20,
            transition: "opacity 0.14s ease",
          }}
        />
      )}

      {/* Selected ring + label */}
      {isSelected && (
        <>
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: resolvedRadius,
              border: "1.5px solid rgba(124,92,252,0.88)",
              boxShadow:
                "0 0 0 3px rgba(124,92,252,0.13), inset 0 0 0 1px rgba(124,92,252,0.08)",
              pointerEvents: "none",
              zIndex: 20,
            }}
          />
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: 3,
              left: 3,
              background: "rgba(100,80,220,0.92)",
              backdropFilter: "blur(6px)",
              color: "rgba(255,255,255,0.95)",
              fontSize: 8,
              fontWeight: 700,
              letterSpacing: 0.4,
              padding: "1.5px 5px",
              borderRadius: 4,
              pointerEvents: "none",
              zIndex: 21,
              whiteSpace: "nowrap",
              lineHeight: 1.5,
            }}
          >
            {label}
          </div>
        </>
      )}
    </div>
  );
}
