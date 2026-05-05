import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PreviewClient from "./PreviewClient";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

interface SleekPreviewApp {
  id: string;
  appName: string;
  screens: Array<{ id: string; name: string; html: string }>;
  activeIndex: number;
}

async function fetchSleekApp(id: string): Promise<SleekPreviewApp | null> {
  try {
    const res = await fetch(`${APP_URL}/api/preview/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json() as SleekPreviewApp;
    if (!data?.appName || !Array.isArray(data?.screens)) return null;
    return data;
  } catch {
    return null;
  }
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
