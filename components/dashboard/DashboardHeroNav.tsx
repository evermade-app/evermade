"use client";

import { useState } from "react";
import EvermadeLogo from "../EvermadeLogo";
import PricingModal from "./PricingModal";

export default function DashboardHeroNav() {
  const [showPricing, setShowPricing] = useState(false);

  return (
    <>
      <nav className="relative z-10 flex items-center justify-between w-full px-4 sm:px-8 md:px-16 lg:px-[120px] py-4">
        <EvermadeLogo height={22} />

        {/* Centered shimmer pill */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <div className="evermade-shimmer-pill">
            <button
              onClick={() => setShowPricing(true)}
              className="relative z-10 px-7 py-2.5 text-sm font-semibold text-white/90 hover:text-white transition-colors"
              style={{ letterSpacing: "-0.2px" }}
            >
              Upgrade your plan
            </button>
          </div>
        </div>

        {/* Spacer to balance the logo */}
        <div style={{ width: 160 }} />
      </nav>

      {showPricing && <PricingModal onClose={() => setShowPricing(false)} />}
    </>
  );
}
