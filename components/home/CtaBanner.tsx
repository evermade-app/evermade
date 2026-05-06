"use client";
import { motion } from "motion/react";

const spring = { type: "spring" as const, damping: 80, stiffness: 400 };

const glassBadge: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  padding: "8px 24px", borderRadius: 100,
  background: "rgba(248,248,248,0.05)", backdropFilter: "blur(39px)", WebkitBackdropFilter: "blur(39px)",
  boxShadow: "inset 2px 4px 16px 0px rgba(248,248,248,0.06)",
  fontSize: 14, fontWeight: 400, color: "#fff",
};

const btnPrimary: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  padding: "16px 49px", borderRadius: 100, border: "none", cursor: "pointer",
  background: "#4d33ef", fontSize: 18, fontWeight: 700, textTransform: "uppercase",
  color: "#fff", textDecoration: "none",
  boxShadow: "inset -2.29px -2.29px 7px rgba(255,255,255,0.25), inset 0px 3px 7px rgba(255,255,255,0.3), inset 0px 0.76px 0.76px rgba(255,255,255,0.6), inset 0px -6px 20px rgba(0,0,0,0.3), inset 0px 1px 4px rgba(255,255,255,0.6)",
};

const btnGlass: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  padding: "16px 40px", borderRadius: 100, border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer",
  background: "rgba(248,248,248,0.05)", backdropFilter: "blur(69px)", WebkitBackdropFilter: "blur(69px)",
  boxShadow: "inset 2px 4px 16px 0px rgba(248,248,248,0.05)",
  fontSize: 18, fontWeight: 700, textTransform: "uppercase" as const, color: "#fff", textDecoration: "none",
};

export default function CtaBanner() {
  return (
    <section style={{ padding: "10px", background: "#090611" }}>
      <div style={{
        border: "1px solid rgba(255,255,255,0.05)", borderRadius: 20,
        padding: "80px 20px",
        backgroundImage: "url(https://framerusercontent.com/images/w8XGuTVlk7sPGPz4gF0io5iMDG8.png)",
        backgroundSize: "cover", backgroundPosition: "center",
        display: "flex", flexDirection: "column", alignItems: "center",
      }}>
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={spring}
          style={{ maxWidth: 660, display: "flex", flexDirection: "column", alignItems: "center", gap: 40, textAlign: "center" }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
            <span style={glassBadge}>Smarter Workflow. Better Words</span>
            <h1 style={{ margin: 0, fontSize: "clamp(32px,5vw,62px)", fontWeight: 600, letterSpacing: "-0.02em", color: "#fff", lineHeight: "1.1em" }}>
              Boost creativity.<br />Maximize efficiency.
            </h1>
            <p style={{ margin: 0, fontSize: 18, opacity: 0.6, color: "#fff" }}>
              A web developer who&apos;s passionate about performance, security, and great user experience. From concept to clean code
            </p>
          </div>

          <div style={{ display: "flex", gap: 30, flexWrap: "wrap", justifyContent: "center" }}>
            <a href="/contact" style={btnPrimary}>Start for free</a>
            <a href="/pricing" style={btnGlass}>Get a Plan</a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
