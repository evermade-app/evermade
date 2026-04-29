import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  console.log("[auth/callback] code:", code ? code.slice(0, 20) + "…" : "MISSING");
  console.log("[auth/callback] next:", next);

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    console.log("[auth/callback] exchange result:", {
      userId: data?.user?.id ?? "null",
      error: error?.message ?? "none",
      status: error?.status ?? "n/a",
    });

    if (!error && data?.user) {
      const jar = await cookies();
      jar.set("evermade-auth", "true", { path: "/", maxAge: 2592000, sameSite: "lax" });
      jar.set("evermade-uid", data.user.id, { path: "/", maxAge: 2592000, sameSite: "lax" });
      console.log("[auth/callback] ✅ cookies set — redirecting to", next);
      return NextResponse.redirect(new URL(next, origin));
    }
  }

  console.error("[auth/callback] ❌ exchange failed — redirecting to /login");
  return NextResponse.redirect(new URL("/login?error=auth_failed", origin));
}
