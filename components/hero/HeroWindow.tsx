"use client";

import PromptArea from "./PromptArea";

interface HeroWindowProps {
  authenticated?: boolean;
}

export default function HeroWindow({ authenticated = false }: HeroWindowProps) {
  return (
    <div className="relative w-full max-w-[760px] mx-auto mt-5">
      <div
        style={{
          padding: "20px 22px 18px",
          borderRadius: 20,
          background: "rgba(8,8,14,0.88)",
          backdropFilter: "blur(32px) saturate(1.4)",
          WebkitBackdropFilter: "blur(32px) saturate(1.4)",
          border: "1px solid rgba(204,255,0,0.2)",
          boxShadow: "0 8px 48px rgba(0,0,0,0.55), 0 0 0 1px rgba(204,255,0,0.06), 0 0 32px rgba(204,255,0,0.06)",
        }}
      >
        <PromptArea authenticated={authenticated} />
      </div>
    </div>
  );
}
