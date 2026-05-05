import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import PreviewClient from "./PreviewClient";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

interface SleekPreviewApp {
  id: string;
  appName: string;
  screens: Array<{ id: string; name: string; html: string }>;
  activeIndex: number;
}

async function fetchSleekApp(id: string): Promise<SleekPreviewApp | null> {
  // Query Supabase directly — avoids the localhost vs production URL problem
  try {
    const supabase = createServiceSupabaseClient();
    const { data, error } = await supabase
      .from("previews")
      .select("project")
      .eq("id", id)
      .single();
    if (!error && data?.project) {
      const app = data.project as SleekPreviewApp;
      if (app?.appName && Array.isArray(app?.screens)) return app;
    }
  } catch (e) {
    console.error("[Preview page] Supabase error:", e);
  }

  // Fallback: HTTP fetch using the actual request host (handles any deploy URL)
  try {
    const headersList = await headers();
    const host = headersList.get("host") ?? "localhost:3000";
    const proto = host.includes("localhost") ? "http" : "https";
    const baseUrl = `${proto}://${host}`;
    const res = await fetch(`${baseUrl}/api/preview/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json() as SleekPreviewApp;
    if (data?.appName && Array.isArray(data?.screens)) return data;
  } catch {
    // ignore
  }

  return null;
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const app = await fetchSleekApp(id);
  if (!app) return { title: "App Preview — Evermade" };

  const title = `${app.appName} — Live Preview on Evermade`;
  const description = `${app.appName} — a ${app.screens.length}-screen app built with Evermade AI. See the live preview and build your own!`;

  return {
    title,
    description,
    openGraph: {
      title: `${app.appName} — Built with Evermade AI`,
      description,
      type: "website",
      siteName: "Evermade",
    },
    twitter: {
      card: "summary_large_image",
      title: `${app.appName} — Built with Evermade AI`,
      description,
    },
  };
}

export default async function PreviewPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const app = await fetchSleekApp(id);
  if (!app) notFound();

  return <PreviewClient sleekApp={app} previewId={id} />;
}
