import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextauth";
import { getBuildStatus } from "@/lib/evermade/eas/client";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ buildId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { buildId } = await params;
    if (!buildId) {
      return NextResponse.json({ error: "buildId required" }, { status: 400 });
    }

    const result = await getBuildStatus(buildId);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[GET /api/ai/eas-build/[buildId]]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Status poll failed" },
      { status: 500 }
    );
  }
}
