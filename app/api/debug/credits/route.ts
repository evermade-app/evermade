import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// GET /api/debug/credits — table health check, NO auth required
// Remove this endpoint before going to production
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

  const results: Record<string, unknown> = {
    supabaseUrl: url ? url.slice(0, 40) + "…" : "MISSING",
    serviceKeyPrefix: key ? key.slice(0, 20) + "…" : "MISSING",
  };

  if (!url || !key) {
    return NextResponse.json({ error: "env vars missing", ...results });
  }

  const db = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // 1. Check the table exists by counting rows
  const { count, error: countErr } = await db
    .from("credit_transactions")
    .select("*", { count: "exact", head: true });

  results.tableExists = !countErr;
  results.countError = countErr
    ? { code: countErr.code, message: countErr.message, hint: countErr.hint }
    : null;
  results.rowCount = count;

  if (countErr) {
    return NextResponse.json({ status: "TABLE_ERROR", ...results });
  }

  // 2. Try a test INSERT with a known profile id (first profile in DB)
  const { data: firstProfile } = await db
    .from("profiles")
    .select("id")
    .limit(1)
    .single();

  results.firstProfileId = firstProfile?.id ?? "none";

  if (firstProfile?.id) {
    const { data: inserted, error: insertErr } = await db
      .from("credit_transactions")
      .insert({
        user_id: firstProfile.id,
        amount: 0,
        balance_after: 0,
        action: "debug_check",
        description: "Automated health check — safe to delete",
      })
      .select()
      .single();

    results.insertOk = !insertErr;
    results.insertedRow = inserted ?? null;
    results.insertError = insertErr
      ? {
          code: insertErr.code,
          message: insertErr.message,
          details: insertErr.details,
          hint: insertErr.hint,
        }
      : null;

    // Clean up the test row
    if (inserted?.id) {
      await db.from("credit_transactions").delete().eq("id", inserted.id);
      results.cleanedUp = true;
    }
  }

  return NextResponse.json({ status: "OK", ...results });
}
