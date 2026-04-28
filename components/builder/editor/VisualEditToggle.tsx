"use client";

import { useEditor } from "@/lib/editor/EditorContext";

export default function VisualEditToggle() {
  const { editMode, toggleEditMode } = useEditor();

  return (
    <div
      style={{
        padding: "10px 18px 11px",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        {/* Left — label + hint */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: editMode ? 3 : 0,
            }}
          >
            {/* Pen icon */}
            <svg
              width="11"
              height="11"
              viewBox="0 0 11 11"
              fill="none"
              style={{ flexShrink: 0 }}
            >
              <path
                d="M1.5 9L7 3.5l1.5 1.5-5.5 5.5H1.5V9z"
                stroke={
                  editMode
                    ? "rgba(180,160,255,0.9)"
                    : "rgba(255,255,255,0.35)"
                }
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 4.5l1.5-1.5 1.5 1.5"
                stroke={
                  editMode
                    ? "rgba(180,160,255,0.9)"
                    : "rgba(255,255,255,0.35)"
                }
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: editMode
                  ? "rgba(255,255,255,0.82)"
                  : "rgba(255,255,255,0.42)",
                letterSpacing: -0.1,
                transition: "color 0.18s ease",
              }}
            >
              Visual Edit
            </span>

            {editMode && (
              <span
                style={{
                  fontSize: 8.5,
                  fontWeight: 700,
                  padding: "1.5px 6px",
                  borderRadius: 5,
                  background: "rgba(124,92,252,0.16)",
                  border: "1px solid rgba(124,92,252,0.28)",
                  color: "rgba(160,130,255,0.9)",
                  letterSpacing: 0.5,
                }}
              >
                ON
              </span>
            )}
          </div>

          {editMode && (
            <div
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.24)",
                letterSpacing: 0.1,
              }}
            >
              Hover &amp; click elements to edit
            </div>
          )}
        </div>

        {/* Toggle pill */}
        <button
          type="button"
          onClick={toggleEditMode}
          title={editMode ? "Exit Visual Edit" : "Enter Visual Edit"}
          style={{
            width: 40,
            height: 22,
            borderRadius: 11,
            border: `1px solid ${
              editMode
                ? "rgba(124,92,252,0.55)"
                : "rgba(255,255,255,0.12)"
            }`,
            background: editMode
              ? "linear-gradient(135deg, #7c5cfc 0%, #4878ff 100%)"
              : "rgba(255,255,255,0.06)",
            position: "relative",
            cursor: "pointer",
            flexShrink: 0,
            transition: "background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
            boxShadow: editMode
              ? "0 0 14px rgba(124,92,252,0.35)"
              : "none",
          }}
          aria-label={editMode ? "Disable visual editing" : "Enable visual editing"}
        >
          {/* Sliding dot */}
          <div
            style={{
              position: "absolute",
              top: 2,
              left: editMode ? 20 : 2,
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: editMode ? "white" : "rgba(255,255,255,0.4)",
              transition: "left 0.2s ease, background 0.2s ease",
              boxShadow: editMode ? "0 1px 4px rgba(0,0,0,0.35)" : "none",
            }}
          />
        </button>
      </div>
    </div>
  );
}
