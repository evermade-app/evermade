"use client";

import PromptArea from "./PromptArea";

interface HeroWindowProps {
  authenticated?: boolean;
}

export default function HeroWindow({ authenticated = false }: HeroWindowProps) {
  return (
    <div className="relative w-full max-w-[760px] mx-auto mt-5">
      {/* Outer shell carries the spinning lime border */}
      <div
        className="ev-lime-shell"
        style={{
          borderRadius: 21.5,
          boxShadow: "0 8px 48px rgba(0,0,0,0.55), 0 0 48px rgba(204,255,0,0.07)",
        }}
      >
        {/* Inner carries the dark background */}
        <div
          className="ev-lime-inner"
          style={{ borderRadius: 20, padding: "20px 22px 18px" }}
        >
          <PromptArea authenticated={authenticated} />
        </div>
      </div>
    </div>
  );
}
