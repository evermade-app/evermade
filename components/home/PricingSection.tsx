"use client";
import { useState } from "react";
import { motion } from "motion/react";

const spring = { type: "spring" as const, damping: 80, stiffness: 400 };

const btnPrimary: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  padding: "16px 49px", borderRadius: 100, border: "none", cursor: "pointer",
  background: "#4d33ef", fontSize: 18, fontWeight: 700, textTransform: "uppercase",
  color: "#fff", textDecoration: "none",
  boxShadow: "inset -2.29px -2.29px 7px rgba(255,255,255,0.25), inset 0px 3px 7px rgba(255,255,255,0.3), inset 0px 0.76px 0.76px rgba(255,255,255,0.6), inset 0px -6px 20px rgba(0,0,0,0.3), inset 0px 1px 4px rgba(255,255,255,0.6)",
};

const FEATURES = [
  "Advanced responsive design",
  "2 revision rounds",
  "Delivery in 7–10 days",
  "Design system included",
];

export default function PricingSection() {
  const [plan, setPlan] = useState<"starter" | "team">("starter");

  return (
    <section style={{ padding: "0 10px", background: "#090611" }}>
      <div style={{
        border: "1px solid rgba(255,255,255,0.05)", borderRadius: 20,
        padding: "80px 20px",
        backgroundImage: "url(https://framerusercontent.com/images/kHeJN7mi6NACVvLDYcSVS2hME8.png)",
        backgroundSize: "cover", backgroundPosition: "center",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 40,
      }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={spring}
          style={{ maxWidth: 710, display: "flex", flexDirection: "column", alignItems: "center", gap: 20, textAlign: "center" }}
        >
          <h2 style={{ margin: 0, fontSize: "clamp(28px,4vw,48px)", fontWeight: 600, letterSpacing: "-0.02em", color: "#fff" }}>
            Choose The Right Plan
          </h2>
          <p style={{ margin: 0, fontSize: 18, opacity: 0.6, color: "#fff" }}>
            A web developer who&apos;s passionate about performance, security, and great user experience. From concept to clean code passionate about performance
          </p>
        </motion.div>

        {/* Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={spring}
          style={{ display: "flex", gap: 10 }}
        >
          <button
            onClick={() => setPlan("starter")}
            style={{
              padding: "6px 26px", borderRadius: 100, border: "none", cursor: "pointer",
              fontSize: 18, fontWeight: 500,
              ...(plan === "starter"
                ? { background: "linear-gradient(180deg,#41d8f1 0%,#4965ed 100%)", color: "#090611", boxShadow: "inset 0px -1.48px 3.7px rgba(255,255,255,0.33), inset 0px 1.48px 16.28px white" }
                : { background: "rgba(248,248,248,0.05)", backdropFilter: "blur(39px)", WebkitBackdropFilter: "blur(39px)", color: "#fff", opacity: 0.4 }),
            }}
          >
            Starter
          </button>
          <button
            onClick={() => setPlan("team")}
            style={{
              padding: "6px 26px", borderRadius: 100, border: "none", cursor: "pointer",
              fontSize: 18, fontWeight: 500,
              ...(plan === "team"
                ? { background: "linear-gradient(180deg,#41d8f1 0%,#4965ed 100%)", color: "#090611", boxShadow: "inset 0px -1.48px 3.7px rgba(255,255,255,0.33), inset 0px 1.48px 16.28px white" }
                : { background: "rgba(248,248,248,0.05)", backdropFilter: "blur(39px)", WebkitBackdropFilter: "blur(39px)", color: "#fff", opacity: 0.4 }),
            }}
          >
            Team Plan
          </button>
        </motion.div>

        {/* Pricing Card */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={spring}
          style={{
            maxWidth: 1062, width: "100%",
            border: "1px solid rgba(255,255,255,0.1)", borderRadius: 30,
            padding: "40px 60px",
            backgroundImage: "url(https://framerusercontent.com/images/wTqNe6hA0KFm9rc6p9Nctcoiyg.png)",
            backgroundSize: "cover", backgroundPosition: "center",
            display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 40,
          }}
        >
          {/* Left */}
          <div style={{ maxWidth: 400, display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <img src="https://framerusercontent.com/images/veBPoxlOM64y70LBJXrF9c9h3m4.svg" width={33} height={33} alt="" />
              <h4 style={{ margin: 0, fontSize: 24, fontWeight: 500, color: "#fff" }}>
                {plan === "starter" ? "Starter Plan" : "Team Plan"}
              </h4>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
              <h2 style={{ margin: 0, fontSize: 48, fontWeight: 600, color: "#fff" }}>
                {plan === "starter" ? "$299" : "$799"}
              </h2>
              <h4 style={{ margin: "0 0 6px", fontSize: 24, color: "#fff" }}>/ One-Time</h4>
            </div>
            <p style={{ margin: 0, fontSize: 18, opacity: 0.6, color: "#fff" }}>
              {plan === "starter" ? "Best for startups and growing teams" : "Best for large teams and enterprises"}
            </p>
          </div>

          {/* Right */}
          <div style={{ maxWidth: 350, display: "flex", flexDirection: "column", gap: 16 }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", flexShrink: 0 }} />
                <span style={{ fontSize: 20, fontWeight: 500, color: "#fff" }}>{f}</span>
              </div>
            ))}
            <a href="/contact" style={{ ...btnPrimary, marginTop: 8 }}>Start for free</a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
