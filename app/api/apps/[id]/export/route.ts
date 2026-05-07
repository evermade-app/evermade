import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextauth";
import { assembleExpoZip } from "@/lib/evermade/sleek/expo-assembler";
import { getCachedApp } from "@/app/api/generate/route";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import { canExportApp, normalizePlan, type PlanId } from "@/lib/evermade/plans";

async function getUserPlan(userId: string): Promise<PlanId> {
  try {
    const supabase = createServiceSupabaseClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", userId)
      .single();
    return normalizePlan(profile?.plan);
  } catch {
    return "free";
  }
}

// ── GET /api/apps/[id]/export — download ZIP using cached app data ─────────────
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const userId = session.user.uid ?? "";
    const userPlan = userId ? await getUserPlan(userId) : "free";

    if (!canExportApp(userPlan)) {
      return NextResponse.json(
        {
          error: "Export not available on Free plan",
          message: "Upgrade to **EverPro ($25/mo)** to export your app as an Expo ZIP.",
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
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const userId = session.user.uid ?? "";
    const userPlan = userId ? await getUserPlan(userId) : "free";

    if (!canExportApp(userPlan)) {
      return NextResponse.json(
        {
          error: "Export not available on Free plan",
          message: "Upgrade to **EverPro ($25/mo)** to export your app as an Expo ZIP.",
          upgradeUrl: "/pricing",
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { appName, screens, navigation } = body as {
      appName: string;
      screens: Array<{ screenName: string; componentName: string; code: string }>;
      navigation?: { appTsx: string; navigatorTsx: string };
    };

    if (!appName || !Array.isArray(screens) || screens.length === 0) {
      return NextResponse.json({ error: "appName and screens are required" }, { status: 400 });
    }

    const zip = await assembleExpoZip({ appName, screens, screenshots: [], navigation });
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
