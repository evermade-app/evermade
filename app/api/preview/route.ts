import { NextResponse } from "next/server";

const g = globalThis as { __evermadePreview?: string };

export async function POST(req: Request) {
  g.__evermadePreview = await req.text();
  return NextResponse.json({ ok: true });
}

export async function GET() {
  return new Response(g.__evermadePreview ?? "null", {
    headers: { "Content-Type": "application/json" },
  });
}
