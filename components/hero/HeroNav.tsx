"use client";

import Link from "next/link";
import EvermadeLogo from "../EvermadeLogo";

const links = [
  { name: "Pricing" },
  { name: "Community" },
  { name: "Resources" },
  { name: "Careers" },
];

export default function HeroNav() {
  return (
    <nav className="relative z-10 flex items-center justify-between w-full px-4 sm:px-8 md:px-16 lg:px-[120px] py-4">
      <EvermadeLogo height={22} />

      <div
        className="hidden md:flex items-center gap-7 rounded-full px-6 py-2 absolute left-1/2 -translate-x-1/2"
        style={{
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.12)",
        }}
      >
        {links.map((l) => (
          <a
            key={l.name}
            href="#"
            className="text-white/90 hover:text-white transition-colors"
            style={{ fontSize: 16, letterSpacing: "-0.2px" }}
          >
            {l.name}
          </a>
        ))}
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <Link
          href="/login?next=%2Fdashboard"
          className="text-white/80 hover:text-white px-3 md:px-4 text-xs md:text-sm transition-colors inline-flex items-center min-h-[44px]"
        >
          Log In
        </Link>

        <Link
          href="/signup?next=%2Fdashboard"
          className="text-black px-4 md:px-6 text-xs md:text-sm font-semibold transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] inline-flex items-center min-h-[44px]"
          style={{
            borderRadius: 999,
            background: "linear-gradient(135deg, #ffffff 0%, #e8e8e8 100%)",
            boxShadow: "0 0 14px 2px rgba(124,92,255,0.2), 0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
}
