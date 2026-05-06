"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const spring = { type: "spring" as const, damping: 80, stiffness: 400 };

const FAQS = [
  {
    q: "What are the key features of Evermade's app builder?",
    a: "A web developer who's passionate about performance, security, and great user experience. From concept to clean code passionate about performance",
  },
  {
    q: "What types of apps can I build with Evermade?",
    a: "Evermade supports a wide range of app types including marketplaces, dashboards, social apps, and more — all generated from a simple text description.",
  },
  {
    q: "How can I get started with Evermade?",
    a: "Simply describe your app idea in the prompt on the homepage, click Generate, and Evermade will build your app screens instantly.",
  },
  {
    q: "How does Evermade's AI generation work?",
    a: "Evermade uses a combination of advanced AI models to generate complete, functional app screens from your description, including layouts, flows, and interactions.",
  },
  {
    q: "Do you offer support for multiple programming languages?",
    a: "Evermade generates Expo/React Native compatible code, making it easy to deploy to both iOS and Android from a single codebase.",
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
          All your questions. Answered
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
