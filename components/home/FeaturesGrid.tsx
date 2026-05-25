"use client";
import { motion } from "motion/react";

const spring = { type: "spring" as const, damping: 80, stiffness: 400 };
const cardBorder = "2px solid rgba(255,255,255,0.05)";
const iconBoxShadow = "inset 1.9px 3.81px 15.24px 0px rgba(248,248,248,0.05), 0px 9px 19px 0px rgba(0,0,0,0.3)";
const ICON_BG = "https://framerusercontent.com/images/ZxhUSaGumFNAKNxQkF0oTN2raaY.svg";

const FEATURES = [
  {
    title: "Multi-model AI",
    desc: "Pick Claude 4, GPT-5, or Gemini for each build. Every model, one platform — always the best output for your idea.",
    icon: "https://framerusercontent.com/images/9Zc3oIZ5HwmR7CRNyYbn20u8U9Q.svg",
  },
  {
    title: "Chat-based editing",
    desc: "Refine any screen by chatting with Evermade. Change a layout, swap a color, add a flow — instantly applied.",
    icon: "https://framerusercontent.com/images/z1XtjQHCo838ZUI2VVMTFiqP0.svg",
  },
  {
    title: "Instant code export",
    desc: "Download clean, production-grade Expo & React Native code. No lock-in — it's your codebase.",
    icon: "https://framerusercontent.com/images/meHjODl19qK4JQ7uwyySf17JhZE.svg",
  },
  {
    title: "Backend generation",
    desc: "Evermade scaffolds your API routes, auth layer, and database schema — not just the UI.",
    icon: "https://framerusercontent.com/images/9tcsS4B1cNBMQQRgRJS7vTDPY4.svg",
  },
];

export default function FeaturesGrid() {
  return (
    <section style={{ padding: "0 30px 160px", background: "#090611" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 80 }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={spring}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, textAlign: "center" }}
        >
          <h2 style={{ margin: 0, maxWidth: 740, fontSize: "clamp(28px,4vw,48px)", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: "1.15em", color: "#fff" }}>
            Everything you need to ship a real app
          </h2>
          <p style={{ margin: 0, maxWidth: 740, fontSize: 18, fontWeight: 400, opacity: 0.6, color: "#fff" }}>
            From first prompt to App Store listing — Evermade handles the entire stack so you can focus on your vision.
          </p>
        </motion.div>

        {/* Cards layout */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={spring}
          style={{ display: "flex", gap: 10, flexWrap: "wrap" }}
        >
          {/* Big left card */}
          <div style={{
            flex: "0 0 386px", maxWidth: 386, minWidth: 260,
            borderRadius: 30, overflow: "hidden",
            backgroundImage: "url(https://framerusercontent.com/images/ZzAHnLjEuuzFRyTOYfLWbadoHY.png)",
            backgroundSize: "cover", backgroundPosition: "center",
            padding: "70px 30px 70px 40px",
            display: "flex", flexDirection: "column", gap: 40,
          }}>
            <svg width="66" height="66" viewBox="0 0 66 66" fill="none">
              <circle cx="33" cy="33" r="33" fill="rgba(77,51,239,0.3)" />
              <circle cx="33" cy="33" r="32" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              <g opacity="0.9">
                <path d="M33 20v6M33 40v6M20 33h6M40 33h6" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <path d="M33 28a5 5 0 100 10 5 5 0 000-10z" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="33" cy="33" r="2" fill="white" />
              </g>
            </svg>
            <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
              <div>
                <h4 style={{ margin: "0 0 12px", fontSize: 24, fontWeight: 500, letterSpacing: "-0.02em", color: "#fff" }}>
                  Design-to-code, at the speed of thought
                </h4>
                <p style={{ margin: 0, fontSize: 14, opacity: 0.6, color: "#fff", maxWidth: 211 }}>
                  Describe your app once. Evermade generates every screen, every component, every flow — production-ready.
                </p>
              </div>
            </div>
            <a href="/login?next=%2Fdashboard" style={{
              display: "inline-flex", alignSelf: "flex-start",
              padding: "16px 40px", borderRadius: 100,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(248,248,248,0.05)", backdropFilter: "blur(69px)", WebkitBackdropFilter: "blur(69px)",
              boxShadow: "inset 2px 4px 16px 0px rgba(248,248,248,0.05)",
              fontSize: 18, fontWeight: 700, textTransform: "uppercase" as const, color: "#fff", textDecoration: "none",
            }}>
              Build For Free
            </a>
          </div>

          {/* Right 2×2 grid */}
          <div style={{ flex: 1, minWidth: 260, display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10 }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{
                background: "#0a0813", border: cardBorder, borderRadius: 27,
                padding: "30px 14px 30px 30px",
                display: "flex", flexDirection: "column", gap: 39,
              }}>
                <div style={{ position: "relative", width: 60, height: 60, borderRadius: 100, boxShadow: iconBoxShadow }}>
                  <img src={ICON_BG} width={60} height={60} alt="" style={{ width: "100%", height: "100%", objectFit: "fill", borderRadius: 100 }} />
                  <img src={f.icon} width={24} height={24} alt="" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <h4 style={{ margin: 0, fontSize: "clamp(20px,2vw,24px)", fontWeight: 500, letterSpacing: "-0.02em", color: "#fff" }}>{f.title}</h4>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 400, opacity: 0.6, color: "#fff" }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
