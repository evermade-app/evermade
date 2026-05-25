"use client";
import { motion } from "motion/react";

const LOGOS = [
  { src: "https://framerusercontent.com/images/kD1pVZ2akTFYmxxDfmL00fbb5Q.svg", w: 148, h: 33 },
  { src: "https://framerusercontent.com/images/uijyOuBAarPLamFFR1DRFx72MY.svg", w: 131, h: 32 },
  { src: "https://framerusercontent.com/images/eDsBoYkNqJktmO9CwZai3qom8Mk.svg", w: 145, h: 32 },
  { src: "https://framerusercontent.com/images/iVE9ry3NQnVpWGvGMWfcAhKubY.svg", w: 132, h: 32 },
  { src: "https://framerusercontent.com/images/bWXkAXpztKuqO4teDlGfzB9pSs.svg", w: 133, h: 32 },
];

const spring = { type: "spring" as const, damping: 80, stiffness: 400 };

export default function LogosTicker() {
  return (
    <section style={{ padding: "80px 30px", background: "#090611" }}>
      <div style={{ maxWidth: 1084, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
        <motion.p
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={spring}
          style={{ margin: 0, fontSize: 18, fontWeight: 500, letterSpacing: "-0.02em", lineHeight: "1.5em", opacity: 0.6, textAlign: "center", color: "#fff" }}
        >
          Trusted by founders building the next generation of mobile apps
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ ...spring, delay: 0.05 }}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", flexWrap: "wrap", gap: 24 }}
        >
          {LOGOS.map((logo, i) => (
            <img key={i} src={logo.src} width={logo.w} height={logo.h} alt="" style={{ opacity: 0.55, objectFit: "contain", maxWidth: "100%" }} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
