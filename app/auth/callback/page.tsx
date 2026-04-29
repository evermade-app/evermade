"use client";

import { useEffect, useState, Suspense } from "react";
import { getSupabase } from "@/lib/auth";

function CallbackHandler() {
  const [status, setStatus] = useState("Signing you in…");

  useEffect(() => {
    async function handle() {
      const code = new URLSearchParams(window.location.search).get("code");
      console.log("[auth/callback] code present:", !!code);

      const supabase = getSupabase();

      // No Supabase — demo mode, just set auth cookie and go
      if (!supabase) {
        console.log("[auth/callback] no supabase client — demo mode");
        document.cookie = "evermade-auth=true; path=/; max-age=2592000; SameSite=Lax";
        window.location.replace("/dashboard");
        return;
      }

      // PKCE exchange — browser client reads verifier from localStorage
      if (code) {
        console.log("[auth/callback] calling exchangeCodeForSession…");
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        console.log("[auth/callback] exchange result — user:", data?.user?.id, "error:", error?.message);

        if (!error && data.user) {
          document.cookie = "evermade-auth=true; path=/; max-age=2592000; SameSite=Lax";
          document.cookie = `evermade-uid=${data.user.id}; path=/; max-age=2592000; SameSite=Lax`;
          console.log("[auth/callback] cookies set — redirecting to /dashboard");
          window.location.replace("/dashboard");
          return;
        }

        console.warn("[auth/callback] exchange failed, trying getSession fallback");
      }

      // Fallback: Supabase SDK may have already set the session from the URL hash
      const { data: { session } } = await supabase.auth.getSession();
      console.log("[auth/callback] getSession fallback — session:", session?.user?.id);

      if (session) {
        document.cookie = "evermade-auth=true; path=/; max-age=2592000; SameSite=Lax";
        document.cookie = `evermade-uid=${session.user.id}; path=/; max-age=2592000; SameSite=Lax`;
        console.log("[auth/callback] session recovered — redirecting to /dashboard");
        window.location.replace("/dashboard");
        return;
      }

      console.error("[auth/callback] all auth paths failed — redirecting to /login");
      setStatus("Sign-in failed — redirecting…");
      setTimeout(() => window.location.replace("/login?error=auth_failed"), 1500);
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
