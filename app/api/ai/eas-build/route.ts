import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextauth";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import {
  buildProjectTarGz,
  triggerAndroidBuild,
  triggerIosBuild,
} from "@/lib/evermade/eas/client";
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

async function uploadArchive(buf: Buffer, slug: string): Promise<string> {
  const supabase = createServiceSupabaseClient();
  const BUCKET = "eas-archives";

  // Attempt to create bucket — ignore errors (bucket likely already exists).
  // Upload failure will surface any real storage misconfiguration.
  await supabase.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: 50 * 1024 * 1024,
  });

  const filePath = `${slug}/${Date.now()}.tar.gz`;
  const { error: uploadErr } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, buf, { contentType: "application/gzip", upsert: true });

  if (uploadErr) throw new Error(`Archive upload failed: ${uploadErr.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
  return data.publicUrl;
}

export async function POST(req: NextRequest) {
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
          error: "EAS build requires EverPro plan",
          message: "Upgrade to **EverPro ($25/mo)** to build and install on a real device.",
          upgradeUrl: "/pricing",
        },
        { status: 403 }
      );
    }

    const body = (await req.json()) as {
      appName: string;
      screens: Array<{ screenName: string; componentName: string; code: string }>;
      navigation?: { appTsx: string; navigatorTsx: string };
    };

    if (!body.appName || !Array.isArray(body.screens) || body.screens.length === 0) {
      return NextResponse.json(
        { error: "appName and screens are required" },
        { status: 400 }
      );
    }

    // Build tar.gz once, upload once — reuse for both platforms
    const tarGz = await buildProjectTarGz({
      appName: body.appName,
      screens: body.screens,
      navigation: body.navigation,
    });

    const archiveUrl = await uploadArchive(tarGz, userId || "anon");

    // Trigger Android + iOS simultaneously
    const [androidBuildId, iosBuildId] = await Promise.all([
      triggerAndroidBuild(archiveUrl, body.appName),
      triggerIosBuild(archiveUrl, body.appName),
    ]);

    console.log("[EAS] triggered builds — Android:", androidBuildId, "iOS:", iosBuildId);

    return NextResponse.json({ androidBuildId, iosBuildId });
  } catch (err) {
    console.error("[POST /api/ai/eas-build]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Build trigger failed" },
      { status: 500 }
    );
  }
}
