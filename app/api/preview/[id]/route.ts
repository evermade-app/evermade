import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

const MAX_SIZE = 1024 * 1024; // 1 MB

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const supabase = createServiceSupabaseClient();
    const { data, error } = await supabase
      .from("previews")
      .select("project")
      .eq("id", id)
      .single();

    if (!error && data?.project) {
      return new Response(JSON.stringify(data.project), {
        headers: { "Content-Type": "application/json" },
      });
    }
    if (error) console.error("[Preview GET] Supabase:", error.message);
  } catch (e) {
    console.error("[Preview GET] Error:", e);
  }

  return NextResponse.json({ error: "Preview not found" }, { status: 404 });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id || id.length < 3) {
    return NextResponse.json({ error: "Invalid preview ID" }, { status: 400 });
  }

  const body = await req.text();
  if (body.length > MAX_SIZE) {
    return NextResponse.json({ error: "Project too large" }, { status: 413 });
  }

  try {
    const project = JSON.parse(body);
    const supabase = createServiceSupabaseClient();
    const { error } = await supabase
      .from("previews")
      .upsert({ id, project }, { onConflict: "id" });

    if (!error) {
      return NextResponse.json({ ok: true, id });
    }
    console.error("[Preview POST] Supabase upsert error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } catch (e) {
    console.error("[Preview POST] Error:", e);
    return NextResponse.json({ error: "Failed to save preview" }, { status: 500 });
  }
}
