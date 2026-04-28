import React from "react";
import ComponentShowcase from "./ComponentShowcase";
import { componentRegistry } from "@/lib/evermade/component-registry";

export const metadata = {
  title: "Evermade Component Library",
  description: "Premium internal component workbench — all UI building blocks in one place.",
};

export default function LibraryPage() {
  const totalComponents = componentRegistry.length;
  const categories = [...new Set(componentRegistry.map((c) => c.category))];

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0a0a0b",
        color: "white",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(20px)",
          position: "sticky",
          top: 0,
          zIndex: 100,
          padding: "0 32px",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "64px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #7c5ff7, #ff6b6b)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
              }}
            >
              ✦
            </div>
            <div>
              <span style={{ fontSize: "16px", fontWeight: 700, letterSpacing: "-0.02em" }}>
                Evermade
              </span>
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginLeft: "8px" }}>
                Component Library
              </span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <div style={{ display: "flex", gap: "16px" }}>
              {[
                { label: "Components", value: totalComponents },
                { label: "Categories", value: categories.length },
              ].map((stat) => (
                <div key={stat.label} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "18px", fontWeight: 700, color: "white" }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                padding: "6px 14px",
                borderRadius: "8px",
                background: "rgba(124,95,247,0.15)",
                border: "1px solid rgba(124,95,247,0.3)",
                fontSize: "12px",
                color: "#a78bfa",
                fontWeight: 500,
              }}
            >
              v1.0 · Batch 1
            </div>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div
        style={{
          padding: "80px 32px 60px",
          maxWidth: "1400px",
          margin: "0 auto",
          position: "relative",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "800px",
            height: "400px",
            background: "radial-gradient(ellipse at center, rgba(124,95,247,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              borderRadius: "9999px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              fontSize: "12px",
              color: "rgba(255,255,255,0.6)",
              marginBottom: "24px",
            }}
          >
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
            Internal design system · Production ready
          </div>
          <h1
            style={{
              fontSize: "clamp(36px, 5vw, 64px)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
              margin: "0 0 16px",
              background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.5) 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            The Evermade
            <br />
            Component Library
          </h1>
          <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.5)", maxWidth: "560px", lineHeight: 1.6, margin: 0 }}>
            Every UI building block, precisely crafted. Dark-first, production-ready,
            animated — all in one workbench.
          </p>
        </div>
      </div>

      {/* Component Grid */}
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 32px 120px",
        }}
      >
        <ComponentShowcase />
      </div>

      {/* Footer */}
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "32px",
          textAlign: "center",
          color: "rgba(255,255,255,0.3)",
          fontSize: "13px",
        }}
      >
        Evermade Component Library · Batch 1 · {totalComponents} components across {categories.length} categories
      </div>
    </main>
  );
}
