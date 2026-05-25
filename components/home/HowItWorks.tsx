"use client";
import { motion } from "motion/react";

const spring = { type: "spring" as const, damping: 80, stiffness: 400 };

const glassBadge: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  padding: "6px 20px", borderRadius: 100,
  background: "rgba(248,248,248,0.05)", backdropFilter: "blur(39px)", WebkitBackdropFilter: "blur(39px)",
  boxShadow: "inset 2px 4px 16px 0px rgba(248,248,248,0.06)",
  fontSize: 14, fontWeight: 400, color: "#fff",
};

const STEPS = [
  {
    badge: "Step 001",
    title: "Describe your app",
    desc: "Type your idea in plain English. The more detail you give, the better the result. No wireframes, no specs — just words.",
    iconContent: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
    iconStyle: {
      background: "rgba(248,248,248,0.05)",
      border: "0.95px solid #0a0813",
      boxShadow: "0px 9.5px 19px rgba(0,0,0,0.3), inset 1.9px 3.8px 15.2px rgba(248,248,248,0.06)",
    } as React.CSSProperties,
  },
  {
    badge: "Step 002",
    title: "AI builds it instantly",
    desc: "Evermade generates every screen, navigation flow, and component — powered by Claude 4, GPT-5, or Gemini. Your choice.",
    iconContent: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    iconStyle: {
      border: "1px solid #f4f4f4",
      backgroundImage: "url(https://framerusercontent.com/images/ugGBjdzFjk3yd1OjdPA4P0jBuk.png)",
      backgroundSize: "cover",
      boxShadow: "inset 0px 1.48px 16.28px rgba(255,255,255,1), inset 0px -1.48px 3.7px rgba(255,255,255,0.33)",
    } as React.CSSProperties,
  },
  {
    badge: "Step 003",
    title: "Ship to the world",
    desc: "Export clean React Native code, or publish directly to the App Store and Google Play — straight from inside Evermade.",
    iconContent: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    ),
    iconStyle: {
      backgroundImage: "url(https://framerusercontent.com/images/FMrQxe4X6gQBYM2yVREeLV41urY.png)",
      backgroundSize: "cover",
      boxShadow: "inset 0px 0.96px 4.82px rgba(255,255,255,0.6), inset 0px -7.71px 25.06px rgba(0,0,0,0.3), inset 0px 2.89px 8.67px rgba(255,255,255,0.3)",
    } as React.CSSProperties,
  },
];

export default function HowItWorks() {
  return (
    <section style={{ padding: "0 10px 80px", background: "#090611" }}>
      <div style={{
        border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: 5,
      }}>
        <div style={{
          background: "linear-gradient(#030014e6 0%, #0a0813e6 100%)",
          backdropFilter: "blur(60px)", WebkitBackdropFilter: "blur(60px)",
          borderRadius: 20, padding: "80px 30px",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 80,
        }}>
          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={spring}
            style={{ margin: 0, fontSize: "clamp(32px,5vw,62px)", fontWeight: 600, letterSpacing: "-0.02em", textAlign: "center", color: "#fff" }}
          >
            From idea to App Store in 3 steps
          </motion.h1>

          <div style={{ display: "flex", flexDirection: "row", gap: 20, width: "100%", maxWidth: 1100, flexWrap: "wrap" }}>
            {STEPS.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ ...spring, delay: i * 0.08 }}
                style={{
                  position: "relative",
                  background: "rgba(3,0,20,0.4)", backdropFilter: "blur(60px)", WebkitBackdropFilter: "blur(60px)",
                  border: "2px solid rgba(255,255,255,0.05)", borderRadius: 30,
                  padding: "30px 15px 30px 30px",
                  display: "flex", flexDirection: "column", gap: 32,
                  flex: 1, minWidth: 260,
                }}
              >
                <span style={{ ...glassBadge, position: "absolute", top: 45, right: 30 }}>{step.badge}</span>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{
                    width: 62, height: 62, borderRadius: 952,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                    ...step.iconStyle,
                  }}>
                    {step.iconContent}
                  </div>
                  <h4 style={{ margin: 0, fontSize: 24, fontWeight: 500, letterSpacing: "-0.02em", color: "#fff" }}>{step.title}</h4>
                  <p style={{ margin: 0, fontSize: 16, opacity: 0.6, color: "#fff" }}>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
