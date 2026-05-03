import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextauth";
import { getUserCredits } from "@/lib/credits";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.uid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceSupabaseClient();

  const [credits, historyResult] = await Promise.all([
    getUserCredits(session.user.uid, session.user.email ?? undefined),
    supabase
      .from("credit_transactions")
      .select("*")
      .eq("user_id", session.user.uid)
      .order("created_at", { ascending: false })
      .limit(25),
  ]);

  // Surface the table error in the response so it's visible in DevTools
  if (historyResult.error) {
    console.error("[GET /api/credits] credit_transactions error:", historyResult.error);
    return NextResponse.json({
      credits,
      history: [],
      _tableError: historyResult.error.message,
    });
  }

  return NextResponse.json({
    credits,
    history: historyResult.data ?? [],
  });
}
