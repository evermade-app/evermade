"use client";
import { motion } from "motion/react";

const spring = { type: "spring" as const, damping: 80, stiffness: 400 };

const btnPrimary: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  padding: "16px 49px", borderRadius: 100, border: "none", cursor: "pointer",
  background: "#4d33ef", fontSize: 18, fontWeight: 700, textTransform: "uppercase",
  color: "#fff", textDecoration: "none",
  boxShadow: "inset -2.29px -2.29px 7px rgba(255,255,255,0.25), inset 0px 3px 7px rgba(255,255,255,0.3), inset 0px 0.76px 0.76px rgba(255,255,255,0.6), inset 0px -6px 20px rgba(0,0,0,0.3), inset 0px 1px 4px rgba(255,255,255,0.6)",
};

export default function IntegrationsSection() {
  return (
    <section style={{ padding: "80px 10px", background: "#090611" }}>
      <div style={{
        border: "1px solid rgba(255,255,255,0.05)", borderRadius: 20,
        padding: "80px 30px",
        backgroundImage: "url(https://framerusercontent.com/images/bQEgW40pVfzesYngcbbeJGuEzE.png)",
        backgroundSize: "cover", backgroundPosition: "center",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 80,
      }}>
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={spring}
          style={{ maxWidth: 930, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}
        >
          <div style={{ maxWidth: 545, display: "flex", flexDirection: "column", alignItems: "center", gap: 20, textAlign: "center" }}>
            <h2 style={{ margin: 0, fontSize: "clamp(28px,4vw,48px)", fontWeight: 600, letterSpacing: "-0.02em", color: "#fff" }}>
              Works with the tools you already love
            </h2>
            <p style={{ margin: 0, fontSize: 18, opacity: 0.6, color: "#fff" }}>
              Stripe for payments. Supabase for your database. Expo for deployment. Evermade connects to your existing stack out of the box.
            </p>
          </div>
          <a href="/login?next=%2Fdashboard" style={btnPrimary}>Start Building</a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ ...spring, delay: 0.1 }}
          style={{ maxWidth: 930, width: "100%" }}
        >
          <img
            src="https://framerusercontent.com/images/BVEvaVhQLp3qJKRQseQiOVUSI.png"
            alt="Integrations dashboard"
            style={{ width: "100%", display: "block", borderRadius: 16, objectFit: "cover", aspectRatio: "3.218" }}
          />
        </motion.div>
      </div>
    </section>
  );
}
