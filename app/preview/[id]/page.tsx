import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PreviewClient from "./PreviewClient";
import type { Project } from "@/lib/editor/project";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

async function fetchProject(id: string): Promise<Project | null> {
  try {
    const res = await fetch(`${APP_URL}/api/preview/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as Project;
  } catch {
    return null;
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const project = await fetchProject(id);
  if (!project) return { title: "App Preview — Evermade" };

  const title = `${project.name} — Evermade Preview`;
  const description = `See this ${project.name} app built with Evermade — the AI app builder.`;

  return {
    title,
    description,
    openGraph: {
      title: `${project.name} — Built with Evermade`,
      description,
      type: "website",
      siteName: "Evermade",
    },
    twitter: {
      card: "summary",
      title: `${project.name} — Built with Evermade`,
      description,
    },
  };
}

export default async function PreviewPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const project = await fetchProject(id);
  if (!project) notFound();

  return <PreviewClient project={project} previewId={id} />;
}
