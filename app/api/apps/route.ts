import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextauth";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

// ── GET /api/apps — list the current user's apps ──────────────────────────────
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.uid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceSupabaseClient();
  const { data, error } = await supabase
    .from("apps")
    .select("id, name, gradient, published, created_at, updated_at")
    .eq("user_id", session.user.uid)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("[GET /api/apps]", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const apps = (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    gradient: row.gradient,
    published: row.published,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));

  return NextResponse.json(apps);
}

// ── POST /api/apps — create a new app ─────────────────────────────────────────
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.uid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({})) as {
    id?: string;
    name?: string;
    gradient?: string;
  };

  const id = body.id ?? `proj-${Date.now()}`;
  const name = (body.name ?? "My App").trim().slice(0, 120);
  const gradient = body.gradient ?? "linear-gradient(135deg,#0f0c29 0%,#302b63 50%,#24243e 100%)";

  const supabase = createServiceSupabaseClient();
  const { data, error } = await supabase
    .from("apps")
    .insert({ id, name, gradient, user_id: session.user.uid })
    .select("id, name, gradient, published, created_at, updated_at")
    .single();

  if (error) {
    console.error("[POST /api/apps]", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    {
      id: data.id,
      name: data.name,
      gradient: data.gradient,
      published: data.published,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    },
    { status: 201 },
  );
}
