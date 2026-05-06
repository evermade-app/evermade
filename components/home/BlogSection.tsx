"use client";
import { motion } from "motion/react";

const spring = { type: "spring" as const, damping: 80, stiffness: 400 };

const BLOGS = [
  {
    date: "Jul 10, 2025",
    title: "A web developer who's passionate about great user experience.",
    img: "https://framerusercontent.com/images/mCctIXPf7pufEP5bkV8dRpLPTg.png",
  },
  {
    date: "Jul 23, 2025",
    title: "Passionate about building websites users love to interact with.",
    img: "https://framerusercontent.com/images/DZNAFF2intk8tEIPC0EqKmsQk8.png",
  },
  {
    date: "Aug 11, 2025",
    title: "Focused on designing web experiences that feel effortless and engaging.",
    img: "https://framerusercontent.com/images/jC7w5zq28JscXoE0R8xV0rDAQgo.png",
  },
];

export default function BlogSection() {
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
          <h2 style={{ margin: 0, maxWidth: 710, fontSize: "clamp(28px,4vw,48px)", fontWeight: 600, letterSpacing: "-0.02em", color: "#fff" }}>
            Read our latest blogs
          </h2>
          <p style={{ margin: 0, maxWidth: 710, fontSize: 18, opacity: 0.6, color: "#fff" }}>
            A web developer who&apos;s passionate about performance, security, and great user experience. From concept to clean code passionate about performance
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={spring}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24 }}
        >
          {BLOGS.map((blog, i) => (
            <a key={i} href="/blog" style={{ textDecoration: "none", display: "flex", flexDirection: "column", gap: 0, cursor: "pointer" }}>
              <div style={{ border: "2px solid rgba(255,255,255,0.05)", borderRadius: 15, overflow: "hidden", aspectRatio: "1.5" }}>
                <img src={blog.img} alt={blog.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
              <div style={{ padding: "16px 4px 0", display: "flex", flexDirection: "column", gap: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 400, opacity: 0.6, color: "#fff" }}>{blog.date}</span>
                <span style={{ fontSize: 18, fontWeight: 500, letterSpacing: "-0.02em", color: "#fff", lineHeight: "1.4em" }}>{blog.title}</span>
              </div>
            </a>
          ))}

          {/* CTA card */}
          <a href="/blog" style={{ textDecoration: "none", display: "flex" }}>
            <div style={{
              flex: 1, background: "#0a0813", border: "2px solid rgba(255,255,255,0.05)", borderRadius: 27,
              padding: "82px 40px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 40, cursor: "pointer",
            }}>
              <svg width="18" height="21" viewBox="0 0 18 21" fill="none">
                <rect x="1" y="1" width="16" height="19" rx="2" stroke="white" strokeWidth="1.5" />
                <path d="M5 6h8M5 10h8M5 14h5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 16, fontWeight: 700, textTransform: "uppercase", letterSpacing: "-0.02em", color: "#fff" }}>
                  Read All Blogs
                </span>
                <div style={{ width: "100%", height: 1, background: "#fff" }} />
              </div>
            </div>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
