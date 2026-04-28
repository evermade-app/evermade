import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Supabase client (server-side, uses anon key with public RLS)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// In-memory fallback for local dev without Supabase table
const g = globalThis as { __evermadePreviewMap?: Map<string, string> };
if (!g.__evermadePreviewMap) g.__evermadePreviewMap = new Map();
const store = g.__evermadePreviewMap;

const MAX_SIZE = 512 * 1024; // 512 KB

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (supabase) {
    const { data, error } = await supabase
      .from("previews")
      .select("project")
      .eq("id", id)
      .single();
    if (!error && data) {
      return new Response(JSON.stringify(data.project), {
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  // Fallback: in-memory
  const raw = store.get(id);
  if (!raw) return NextResponse.json({ error: "Preview not found" }, { status: 404 });
  return new Response(raw, { headers: { "Content-Type": "application/json" } });
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

  if (supabase) {
    try {
      const project = JSON.parse(body);
      const { error } = await supabase
        .from("previews")
        .upsert({ id, project }, { onConflict: "id" });
      if (!error) return NextResponse.json({ ok: true, id, storage: "supabase" });
      console.error("[Preview] Supabase upsert error:", error.message);
    } catch (e) {
      console.error("[Preview] Supabase error:", e);
    }
  }

  // Fallback: in-memory
  store.set(id, body);
  return NextResponse.json({ ok: true, id, storage: "memory" });
}
