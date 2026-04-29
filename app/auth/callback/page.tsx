"use client";

import { useEffect, useState, Suspense } from "react";
import { getSupabase } from "@/lib/auth";

function CallbackHandler() {
  const [status, setStatus] = useState("Signing you in…");

  useEffect(() => {
    const supabase = getSupabase();
    console.log("STEP 1 — callback page loaded, full URL:", window.location.href);
    console.log("STEP 1 — hash:", window.location.hash.slice(0, 60));
    console.log("STEP 1 — supabase client:", supabase ? "OK" : "NULL");

    if (!supabase) {
      document.cookie = "evermade-auth=true; path=/; max-age=2592000; SameSite=Lax";
      window.location.replace("/dashboard");
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const error = params.get("error");
    if (error) {
      console.error("STEP 2 — OAuth error:", error, params.get("error_description"));
      setStatus("Auth error: " + error);
      setTimeout(() => window.location.replace("/login?error=" + error), 2000);
      return;
    }

    let redirected = false;

    function finish(session: { user: { id: string } }) {
      if (redirected) return;
      redirected = true;
      console.log("STEP 5 — session found, user:", session.user.id);
      document.cookie = "evermade-auth=true; path=/; max-age=2592000; SameSite=Lax";
      document.cookie = `evermade-uid=${session.user.id}; path=/; max-age=2592000; SameSite=Lax`;
      console.log("STEP 6 — cookies set ✅ — redirecting to /dashboard");
      window.location.replace("/dashboard");
    }

    // onAuthStateChange fires when the client processes the implicit-flow hash
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("STEP 3 — onAuthStateChange:", event, session ? "session OK" : "no session");
      if ((event === "SIGNED_IN" || event === "TOKEN_REFRESHED") && session) {
        finish(session);
      }
    });

    // Also try getSession() immediately in case it was already processed
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("STEP 4 — getSession():", session ? "session OK user=" + session.user.id : "no session");
      if (session) finish(session);
    });

    // Hard timeout: if nothing happens in 10s, bail out
    const timeout = setTimeout(() => {
      if (!redirected) {
        console.error("STEP 8 — timeout — no session after 10s");
        setStatus("Sign-in failed. Redirecting…");
        setTimeout(() => window.location.replace("/login?error=auth_failed"), 1500);
      }
    }, 10000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
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
