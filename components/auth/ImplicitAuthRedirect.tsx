"use client";

import { useEffect } from "react";

// With implicit flow, if /auth/callback isn't in Supabase's allowlist,
// Supabase redirects to the Site URL (/) with the token in the hash.
// This component detects that hash and forwards it to the callback page.
export default function ImplicitAuthRedirect() {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("access_token=")) {
      console.log("ImplicitAuthRedirect — hash detected on homepage, forwarding to /auth/callback");
      window.location.replace("/auth/callback" + hash);
    }
  }, []);
  return null;
}
