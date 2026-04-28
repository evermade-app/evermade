"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PreviewPage() {
  const router = useRouter();

  // Old single-slot preview URL — redirect to home
  useEffect(() => {
    router.replace("/");
  }, [router]);

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      height: "100dvh", background: "#08080F",
      color: "rgba(255,255,255,0.4)", fontSize: 14,
      fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      Redirecting…
    </div>
  );
}
