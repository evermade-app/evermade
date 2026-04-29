"use client";

import { useEffect, useState, Suspense } from "react";
import { getSupabase } from "@/lib/auth";

function CallbackHandler() {
  const [status, setStatus] = useState("Signing you in…");

  useEffect(() => {
    async function handle() {
      console.log("STEP 1 — callback page loaded, full URL:", window.location.href);

      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const error = params.get("error");
      const errorDescription = params.get("error_description");

      console.log("STEP 2 — code:", code ? code.slice(0, 20) + "…" : "MISSING");
      console.log("STEP 2 — error param:", error, errorDescription);

      if (error) {
        console.error("STEP 2 ERROR — OAuth error from Supabase:", error, errorDescription);
        setStatus("Auth error: " + error);
        setTimeout(() => window.location.replace("/login?error=" + error), 2000);
        return;
      }

      const supabase = getSupabase();
      console.log("STEP 3 — supabase client:", supabase ? "OK" : "NULL (no env vars?)");

      if (!supabase) {
        console.log("STEP 3 — no Supabase client, demo mode — setting cookie and redirecting");
        document.cookie = "evermade-auth=true; path=/; max-age=2592000; SameSite=Lax";
        window.location.replace("/dashboard");
        return;
      }

      if (!code) {
        console.warn("STEP 4 — no code in URL, trying getSession fallback");
        const { data: { session } } = await supabase.auth.getSession();
        console.log("STEP 4 — getSession result:", session ? "session found, user=" + session.user.id : "NO SESSION");
        if (session) {
          document.cookie = "evermade-auth=true; path=/; max-age=2592000; SameSite=Lax";
          document.cookie = `evermade-uid=${session.user.id}; path=/; max-age=2592000; SameSite=Lax`;
          console.log("STEP 4 — cookies set, redirecting to /dashboard");
          window.location.replace("/dashboard");
        } else {
          console.error("STEP 4 — no code AND no session — auth failed");
          window.location.replace("/login?error=no_code");
        }
        return;
      }

      console.log("STEP 5 — calling exchangeCodeForSession…");
      const { data, error: exchError } = await supabase.auth.exchangeCodeForSession(code);
      console.log("STEP 5 — exchange result:", {
        userId: data?.user?.id ?? "null",
        error: exchError?.message ?? "none",
        status: exchError?.status ?? "n/a",
      });

      if (!exchError && data?.user) {
        document.cookie = "evermade-auth=true; path=/; max-age=2592000; SameSite=Lax";
        document.cookie = `evermade-uid=${data.user.id}; path=/; max-age=2592000; SameSite=Lax`;
        console.log("STEP 6 — cookies set ✅");
        console.log("STEP 6 — evermade-auth:", document.cookie.includes("evermade-auth=true"));
        console.log("STEP 6 — redirecting to /dashboard…");
        window.location.replace("/dashboard");
        return;
      }

      // Exchange failed — try getSession as last resort
      console.warn("STEP 7 — exchange failed, trying getSession as last resort");
      const { data: { session } } = await supabase.auth.getSession();
      console.log("STEP 7 — getSession:", session ? "found user=" + session.user.id : "empty");

      if (session) {
        document.cookie = "evermade-auth=true; path=/; max-age=2592000; SameSite=Lax";
        document.cookie = `evermade-uid=${session.user.id}; path=/; max-age=2592000; SameSite=Lax`;
        console.log("STEP 7 — cookies set via fallback, redirecting to /dashboard");
        window.location.replace("/dashboard");
        return;
      }

      console.error("STEP 8 — ALL PATHS FAILED — redirecting to /login");
      setStatus("Sign-in failed. Redirecting…");
      setTimeout(() => window.location.replace("/login?error=auth_failed"), 2000);
    }

    handle();
  }, []);

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", height: "100vh", background: "#050505",
      gap: 14, fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: "50%",
        border: "2.5px solid rgba(255,255,255,0.08)",
        borderTopColor: "#4f8eff",
        animation: "spin 0.7s linear infinite",
      }} />
      <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>{status}</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={null}>
      <CallbackHandler />
    </Suspense>
  );
}
