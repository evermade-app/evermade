"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { saveProject } from "@/lib/editor/projectPersistence";
import type { Project } from "@/lib/editor/project";
import DashboardHeroNav from "@/components/dashboard/DashboardHeroNav";

const GRADIENTS = [
  "linear-gradient(135deg,#1a1a2e 0%,#16213e 45%,#0f3460 100%)",
  "linear-gradient(135deg,#0f0c29 0%,#302b63 50%,#24243e 100%)",
  "linear-gradient(135deg,#0d0d1a 0%,#1a0533 50%,#2d1b69 100%)",
  "linear-gradient(135deg,#0a0a12 0%,#1e3a5f 50%,#0d2137 100%)",
  "linear-gradient(135deg,#0f1923 0%,#1a3a4a 50%,#0d2f3f 100%)",
  "linear-gradient(135deg,#1a0a2e 0%,#3d1560 50%,#6b21a8 100%)",
  "linear-gradient(135deg,#0a1628 0%,#1e3a5f 50%,#2563eb 100%)",
  "linear-gradient(135deg,#1a1200 0%,#3d2c00 50%,#78540e 100%)",
];

const LOGIN_VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4";

function makeBlankProject(name: string): Project {
  const id = `proj-${Date.now()}`;
  const safe = name.trim() || "My App";
  return {
    id,
    name: safe,
    bundleId: `com.evermade.${safe.toLowerCase().replace(/[^a-z0-9]/g, "")}`,
    platform: "ios",
    version: "1.0",
    theme: {
      primaryColor: "#7c5cfc",
      backgroundColor: "#090720",
      surfaceColor: "rgba(255,255,255,0.032)",
      textColor: "rgba(255,255,255,0.88)",
      accentColor: "#7c5cfc",
    },
    activeScreenId: "screen_home",
    navigation: {
      items: [{ id: "nav_home", label: "Home", screenId: "screen_home", icon: "home" }],
    },
    screens: [
      {
        id: "screen_home",
        name: "Home",
        components: [
          { id: "comp_title", type: "title", props: { text: safe } },
          { id: "comp_sub", type: "subtitle", props: { text: "Describe your app to Evermade AI to get started" } },
        ],
      },
    ],
  };
}

function NewProjectInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [prompt, setPrompt] = useState(searchParams.get("prompt") ?? "");

  async function handleGenerate() {
    const trimmed = prompt.trim();
    const words = trimmed.split(/\s+/).slice(0, 3).join(" ");
    const name = words || "My App";
    const gradient = GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)];
    const project = makeBlankProject(name);
    saveProject(project);

    // Persist to Supabase (fire-and-forget — don't block navigation on failure)
    fetch("/api/apps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: project.id, name, gradient }),
    }).catch(console.error);

    if (trimmed) {
      localStorage.setItem("evermade-pending-prompt", trimmed);
    }

    router.push("/builder");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleGenerate();
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="fixed inset-0 z-0 w-full h-full object-cover pointer-events-none"
        style={{ opacity: 0.55 }}
      >
        <source src={LOGIN_VIDEO_URL} type="video/mp4" />
      </video>
      {/* Dark overlay */}
      <div
        className="fixed inset-0 z-[1] pointer-events-none"
        style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%)" }}
      />

      <div className="relative z-10 flex min-h-screen flex-col">
        <DashboardHeroNav />

        <div className="flex flex-1 flex-col items-center justify-center px-4 sm:px-8 md:px-16 lg:px-[120px]" style={{ marginTop: -40 }}>
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm text-white/90 mb-8"
            style={{
              background: "rgba(0,0,0,0.45)",
              backdropFilter: "blur(16px)",
              boxShadow: "0 2px 16px rgba(0,0,0,0.18)",
            }}
          >
            <span style={{ color: "#9f7aea" }}>✦</span>
            <span>New Project</span>
            <span className="opacity-40">·</span>
            <span className="opacity-70">Describe your app to get started</span>
          </div>

          {/* Headline */}
          <h1
            className="font-bold text-white text-center mb-10"
            style={{
              fontSize: "clamp(28px, 5vw, 64px)",
              lineHeight: 1.05,
              letterSpacing: "clamp(-1.5px, -0.4vw, -3.5px)",
            }}
          >
            What are you building?
          </h1>

          {/* Prompt card */}
          <div className="w-full max-w-[760px] p-4 sm:p-5 md:p-7 rounded-2xl evermade-shimmer-shell">
            <div className="evermade-shimmer-content">
              <div className="flex min-w-0 flex-col gap-4">
                <span
                  className="text-[13px] font-medium uppercase tracking-wider"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                >
                  Describe your app
                </span>

                <div
                  className="relative rounded-2xl"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    boxShadow: "inset 0 1px 3px rgba(0,0,0,0.10)",
                  }}
                >
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Build me a mobile app for tracking daily workouts with progress charts and a community feed…"
                    autoFocus
                    className="w-full resize-none border-none bg-transparent p-4 text-sm leading-[1.7] text-white/85 outline-none placeholder:text-white/30 md:p-6 md:text-[17px]"
                    style={{ caretColor: "#7C5CFF", minHeight: 110 }}
                  />
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span
                    className="text-[11px]"
                    style={{ color: "rgba(255,255,255,0.25)" }}
                  >
                    ⌘↵ to generate
                  </span>

                  <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={!prompt.trim()}
                    className="group flex items-center gap-2 rounded-full px-5 py-2 text-xs font-semibold text-white transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] md:px-7 md:py-2.5 md:text-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                    style={{
                      background: "linear-gradient(135deg, #1a1a1a 0%, #000000 100%)",
                      boxShadow:
                        "0 0 16px 2px rgba(124,92,255,0.25), 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
                    }}
                  >
                    Generate
                    <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                      →
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewProjectPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ background: "#050509" }} />}>
      <NewProjectInner />
    </Suspense>
  );
}
