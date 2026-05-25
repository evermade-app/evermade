"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const spring = { type: "spring" as const, damping: 80, stiffness: 400 };

const FAQS = [
  {
    q: "What exactly is Evermade?",
    a: "Evermade is an AI-powered mobile app builder. You describe your app idea in plain English — Evermade generates every screen, every navigation flow, and every component as clean, production-ready React Native code. No wireframes, no developers, no months of waiting.",
  },
  {
    q: "Do I need to know how to code?",
    a: "Not at all. Just describe what you want to build. If you do know how to code, you can export the full Expo source and customize it however you like — Evermade never locks you in.",
  },
  {
    q: "What kind of apps can I build?",
    a: "Anything: marketplaces, social apps, fitness trackers, productivity tools, fintech dashboards, e-commerce stores, SaaS platforms, and more. If you can describe it, Evermade can build it.",
  },
  {
    q: "Which AI models does Evermade use?",
    a: "You choose: Claude 4 Sonnet, Claude 4 Opus, GPT-5, or Gemini. Each model has different strengths. EverMax subscribers get priority access to the most powerful models.",
  },
  {
    q: "Can I publish directly to the App Store?",
    a: "Yes. EverMax subscribers can publish directly to the Apple App Store and Google Play from inside Evermade. Or export the code at any time and publish yourself — you own everything.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section style={{ padding: "160px 30px", background: "#090611" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 80 }}>

        <motion.h2
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={spring}
          style={{ margin: 0, maxWidth: 1000, fontSize: "clamp(28px,4vw,48px)", fontWeight: 600, letterSpacing: "-0.02em", textAlign: "center", color: "#fff" }}
        >
          Everything you need to know.
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={spring}
          style={{ maxWidth: 784, width: "100%" }}
        >
          {FAQS.map((faq, i) => (
            <div
              key={i}
              style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "0 0 40px", marginTop: i === 0 ? 0 : 40 }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                style={{
                  width: "100%", background: "none", border: "none", cursor: "pointer", padding: 0,
                  display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16,
                }}
              >
                <h4 style={{ margin: 0, fontSize: 24, fontWeight: 500, letterSpacing: "-0.02em", color: "#fff", textAlign: "left", width: "88%" }}>
                  {faq.q}
                </h4>
                <svg
                  width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  style={{ flexShrink: 0, transform: openIndex === i ? "rotate(0deg)" : "rotate(180deg)", transition: "transform 0.3s ease" }}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                  >
                    <p style={{ margin: "20px 0 0", fontSize: 18, fontWeight: 400, opacity: 0.6, color: "#fff", maxWidth: 715 }}>
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
