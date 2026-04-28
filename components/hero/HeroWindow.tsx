"use client";

import PromptArea from "./PromptArea";

interface HeroWindowProps {
  authenticated?: boolean;
}

export default function HeroWindow({ authenticated = false }: HeroWindowProps) {
  return (
    <div className="relative w-full max-w-[760px] mx-auto mt-5">
      <div className="p-4 sm:p-5 md:p-7 rounded-2xl evermade-shimmer-shell">
        <div className="evermade-shimmer-content">
          <PromptArea authenticated={authenticated} />
        </div>
      </div>
    </div>
  );
}
