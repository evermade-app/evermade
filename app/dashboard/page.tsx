"use client";

import { useState, useEffect } from "react";
import VideoBackground from "@/components/hero/VideoBackground";
import HeroBadge from "@/components/hero/HeroBadge";
import HeroHeadline from "@/components/hero/HeroHeadline";
import HeroWindow from "@/components/hero/HeroWindow";
import DashboardHeroNav from "@/components/dashboard/DashboardHeroNav";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import ProjectsPanel from "@/components/dashboard/ProjectsPanel";
import { useSession } from "next-auth/react";

const USER_SCOPED_KEYS = [
  "evermade-projects-v1",
  "evermade-project-v1",
  "evermade-sleek-app-v1",
  "evermade-chat-v1",
  "evermade-active-project",
];

function extractFirstName(fullName?: string | null, email?: string | null): string | undefined {
  if (fullName) {
    return fullName.split(" ")[0];
  }
  if (email) {
    const local = email.split("@")[0];
    // Capitalize first letter only
    return local.charAt(0).toUpperCase() + local.slice(1).toLowerCase();
  }
  return undefined;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const firstName = extractFirstName(session?.user?.name, session?.user?.email);

  // Clear user-scoped localStorage data when a different account is detected.
  // Prevents one user from seeing another's builder state on a shared browser.
  useEffect(() => {
    const uid = session?.user?.uid;
    if (!uid) return;
    const stored = localStorage.getItem("evermade-uid");
    if (stored && stored !== uid) {
      USER_SCOPED_KEYS.forEach((k) => localStorage.removeItem(k));
    }
    localStorage.setItem("evermade-uid", uid);
  }, [session?.user?.uid]);

  return (
    <>
      {/* ── Collapsible left sidebar (overlay, doesn't push hero) ── */}
      <DashboardSidebar />

      <div style={{ background: "#050509" }}>
        {/* ── Hero ── */}
        <div className="relative min-h-screen overflow-hidden">
          <VideoBackground />

          <div className="relative z-10 flex min-h-screen flex-col">
            <DashboardHeroNav />

            <div
              className="flex flex-1 flex-col items-center justify-center"
              style={{ marginTop: -20 }}
            >
              <HeroBadge />

              <div className="mt-6 md:mt-[34px]">
                <HeroHeadline firstName={firstName} />
              </div>

              <div className="mt-8 w-full px-4 sm:px-8 md:mt-[44px] md:px-16 lg:px-[120px]">
                <HeroWindow authenticated />
              </div>
            </div>
          </div>
        </div>

        {/* ── Projects & Templates panel ── */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: 64,
        }}>
          <ProjectsPanel />
        </div>
      </div>
    </>
  );
}
