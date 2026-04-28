import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { generateWithSleek } from "@/lib/evermade/sleek/client";

// Lightweight Sleek route for the builder live preview.
// Returns screens with HTML + screenshot URLs — NO React Native conversion
// (that only happens at export time via /api/generate).

export async function POST(req: NextRequest) {
  try {
    // Auth guard
    const jar = await cookies();
    if (jar.get("evermade-auth")?.value !== "true") {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    if (!process.env.SLEEK_API_KEY) {
      return NextResponse.json({ error: "SLEEK_API_KEY not configured" }, { status: 503 });
    }

    const body = await req.json();
    const prompt: string = body?.prompt?.trim() ?? "";
    const appName: string = body?.appName?.trim() || prompt.slice(0, 60);

    if (!prompt) {
      return NextResponse.json({ error: "prompt is required" }, { status: 400 });
    }

    const sleekProject = await generateWithSleek(prompt);

    return NextResponse.json({
      app: {
        id: sleekProject.id,
        appName,
        screens: sleekProject.screens.map((s) => ({
          id: s.id,
          name: s.name,
          html: s.html,
          screenshotUrl: s.screenshotUrl,
        })),
        activeIndex: 0,
      },
    });
  } catch (err) {
    console.error("[/api/ai/sleek]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Sleek generation failed" },
      { status: 502 }
    );
  }
}
