"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase, loginClient } from "@/lib/auth";

function CallbackInner() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "error">("loading");

  useEffect(() => {
    const next = searchParams.get("next") ?? "/dashboard";
    const code = searchParams.get("code");

    async function exchange() {
      if (!supabase) {
        loginClient();
        window.location.href = next;
        return;
      }

      // PKCE flow: exchange code for session
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
          loginClient();
          window.location.href = next;
          return;
        }
      }

      // Implicit flow: session already in URL hash — Supabase SDK picks it up automatically
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        loginClient();
        window.location.href = next;
        return;
      }

      setStatus("error");
    }

    exchange();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status === "error") {
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        height: "100vh", background: "#050505", gap: 16,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
      }}>
        <div style={{ fontSize: 28 }}>⚠️</div>
        <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 15, fontWeight: 600 }}>Sign-in failed</div>
        <div style={{ color: "rgba(255,255,255,0.38)", fontSize: 13 }}>Google OAuth may not be configured in Supabase.</div>
        <button
          onClick={() => { window.location.href = "/login"; }}
          style={{
            marginTop: 8, padding: "10px 24px", borderRadius: 8,
            background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
            color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: 500, cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Back to login
        </button>
      </div>
    );
  }

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      height: "100vh", background: "#050505", gap: 14,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
    }}>
      {/* Spinner */}
      <div style={{
        width: 36, height: 36, borderRadius: "50%",
        border: "2.5px solid rgba(255,255,255,0.08)",
        borderTopColor: "#4f8eff",
        animation: "spin 0.7s linear infinite",
      }} />
      <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>Signing you in…</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense>
      <CallbackInner />
    </Suspense>
  );
}
