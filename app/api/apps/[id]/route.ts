import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextauth";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

// ── DELETE /api/apps/[id] ─────────────────────────────────────────────────────
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.uid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const supabase = createServiceSupabaseClient();

  // Double-filter: service role key + explicit user_id guard
  const { error } = await supabase
    .from("apps")
    .delete()
    .eq("id", id)
    .eq("user_id", session.user.uid);

  if (error) {
    console.error("[DELETE /api/apps/[id]]", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
}

// ── PATCH /api/apps/[id] — update name / published flag ──────────────────────
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.uid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => ({})) as {
    name?: string;
    published?: boolean;
  };

  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (body.name !== undefined) patch.name = body.name.trim().slice(0, 120);
  if (body.published !== undefined) patch.published = body.published;

  const supabase = createServiceSupabaseClient();
  const { error } = await supabase
    .from("apps")
    .update(patch)
    .eq("id", id)
    .eq("user_id", session.user.uid);

  if (error) {
    console.error("[PATCH /api/apps/[id]]", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
}
