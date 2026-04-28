import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { assembleExpoZip } from "@/lib/evermade/sleek/expo-assembler";
import { getCachedApp } from "@/app/api/generate/route";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { canExportApp, type PlanId } from "@/lib/evermade/plans";

async function getUserPlan(sessionId: string): Promise<PlanId> {
  try {
    const supabase = createServerSupabaseClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan")
      .eq("session_id", sessionId)
      .single();
    return ((profile?.plan ?? "free") as PlanId);
  } catch {
    return "free";
  }
}

// ── GET /api/apps/[id]/export — download ZIP using cached app data ─────────────
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const jar = await cookies();

    // Auth guard
    if (jar.get("evermade-auth")?.value !== "true") {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // Plan guard
    const sessionId = jar.get("evermade-sid")?.value ?? "";
    const userPlan = await getUserPlan(sessionId);

    if (!canExportApp(userPlan)) {
      return NextResponse.json(
        {
          error: "Export not available on free plan",
          message: "Upgrade to Starter or higher to export your app as an Expo ZIP.",
          upgradeUrl: "/pricing",
        },
        { status: 403 }
      );
    }

    const { id } = await params;
    const app = getCachedApp(id);

    if (!app) {
      return NextResponse.json(
        { error: "App not found or session expired. Regenerate the app." },
        { status: 404 }
      );
    }

    const zip = await assembleExpoZip({
      appName: app.appName,
      screens: app.screens.map((s) => ({
        screenName: s.name,
        componentName: s.componentName,
        code: s.rnCode,
      })),
      screenshots: app.screens.map((s) => ({ name: s.name, url: s.screenshotUrl })),
    });

    const filename = `${app.appName.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase()}-expo.zip`;

    return new NextResponse(new Uint8Array(zip), {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": zip.byteLength.toString(),
      },
    });
  } catch (err) {
    console.error("[GET /api/apps/[id]/export]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Export failed" },
      { status: 500 }
    );
  }
}

// ── POST /api/apps/[id]/export — accepts full screen data in body ─────────────
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await params;
    const jar = await cookies();

    if (jar.get("evermade-auth")?.value !== "true") {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const sessionId = jar.get("evermade-sid")?.value ?? "";
    const userPlan = await getUserPlan(sessionId);

    if (!canExportApp(userPlan)) {
      return NextResponse.json(
        {
          error: "Export not available on free plan",
          message: "Upgrade to Starter or higher to export your app as an Expo ZIP.",
          upgradeUrl: "/pricing",
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { appName, screens } = body as {
      appName: string;
      screens: Array<{ screenName: string; componentName: string; code: string }>;
    };

    if (!appName || !Array.isArray(screens) || screens.length === 0) {
      return NextResponse.json({ error: "appName and screens are required" }, { status: 400 });
    }

    const zip = await assembleExpoZip({ appName, screens, screenshots: [] });
    const filename = `${appName.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase()}-expo.zip`;

    return new NextResponse(new Uint8Array(zip), {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": zip.byteLength.toString(),
      },
    });
  } catch (err) {
    console.error("[POST /api/apps/[id]/export]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Export failed" },
      { status: 500 }
    );
  }
}
