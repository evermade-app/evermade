"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";

const spring = { type: "spring" as const, damping: 80, stiffness: 400 };

const TESTIMONIALS = [
  {
    photo: "https://framerusercontent.com/images/SkcEvdAXpH2DYCETO5TQrD5AcE.png",
    quote: "A web developer who's passionate about performance, security, and great user experience. From concept to clean code passionate about Evermade.",
    author: "Alex Korle",
    role: "CEO & CO-Founder at Evermade",
  },
  {
    photo: "https://framerusercontent.com/images/wAfiOP0kiIsM2OshZzYWRNpZEc.png",
    quote: "Evermade is a web developer focused on performance, security, and polished UX. Clean code and thoughtful design are always part of the process.",
    author: "AB Clerk",
    role: "CEO & CO-Founder at Evermade",
  },
  {
    photo: "https://framerusercontent.com/images/huAmR7jwccUq9M8JeIw7KwpL6IU.png",
    quote: "Passionate about building fast, secure, and intuitive websites. Evermade turns concepts into clean, maintainable code users love.",
    author: "John Smith",
    role: "CEO & CO-Founder at Evermade",
  },
];

const STATS = [
  { end: 98, suffix: "%", label: "One Hour Saved, Every Day — That's the Difference" },
  { end: 10, suffix: "K", label: "By the end of the day, I'm still energized. That's never happened before." },
  { end: 40, suffix: "+", label: "I'm getting more done, and I'm not burnt out doing it." },
];

function CountUp({ end, suffix }: { end: number; suffix: string }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const duration = 2000;
        const startTime = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          setValue(Math.round(eased * end));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [end]);

  return (
    <div ref={ref} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7, flex: 1 }}>
      <span style={{ fontSize: "clamp(28px,5vw,60px)", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: "1.1em", color: "#fff", fontVariantNumeric: "tabular-nums" }}>
        {value}{suffix}
      </span>
    </div>
  );
}

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const prev = () => setActive((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const next = () => setActive((i) => (i + 1) % TESTIMONIALS.length);
  const t = TESTIMONIALS[active];

  return (
    <section style={{ padding: "80px 30px", background: "#090611" }}>
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
            Real stories. Real results.
          </h2>
          <p style={{ margin: 0, maxWidth: 710, fontSize: 18, opacity: 0.6, color: "#fff" }}>
            SaaS startup who&apos;s passionate about performance, security, and great user experience. From concept to clean code passionate about performance
          </p>
        </motion.div>

        {/* Slider */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={spring}
          style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", gap: 20 }}
        >
          <button onClick={prev} style={{ flexShrink: 0, background: "transparent", border: "none", cursor: "pointer", padding: 0 }}>
            <img src="https://framerusercontent.com/images/CFn8Z71bj7xhixgD5J8iOeqcpcE.svg" width={52} height={52} alt="Previous" />
          </button>

          <div style={{
            width: "100%", maxWidth: 821, minHeight: 315,
            border: "2px solid rgba(255,255,255,0.05)", borderRadius: 27, overflow: "hidden",
            backgroundImage: "url(https://framerusercontent.com/images/M7ZKbmFmQN2bMdFyVjvE3Bl20.png)",
            backgroundSize: "cover", backgroundPosition: "center",
            display: "flex", flexWrap: "wrap",
          }}>
            <div style={{ maxWidth: 331, paddingTop: 27, flexShrink: 0 }}>
              <img src={t.photo} alt={t.author} style={{ width: "100%", objectFit: "cover", display: "block" }} />
            </div>
            <div style={{ flex: 1, minWidth: 200, padding: "40px 30px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 40 }}>
              <blockquote style={{ margin: 0, fontSize: "clamp(16px,2vw,24px)", fontWeight: 500, letterSpacing: "-0.02em", lineHeight: "1.4em", color: "#fff" }}>
                &quot;{t.quote}&quot;
              </blockquote>
              <p style={{ margin: 0, fontSize: 18, fontWeight: 500, opacity: 0.6, color: "#fff" }}>
                {t.author}, {t.role}
              </p>
            </div>
          </div>

          <button onClick={next} style={{ flexShrink: 0, background: "transparent", border: "none", cursor: "pointer", padding: 0 }}>
            <img src="https://framerusercontent.com/images/F1eP2HqvRByZu0wLzRGBgHriAA.svg" width={52} height={52} alt="Next" />
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={spring}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", maxWidth: 821, margin: "0 auto", width: "100%", gap: 24, flexWrap: "wrap" }}
        >
          {STATS.map((s, i) => (
            <div key={i} style={{ flex: 1, minWidth: 140, display: "flex", flexDirection: "column", alignItems: "center", gap: 7, textAlign: "center" }}>
              <CountUp end={s.end} suffix={s.suffix} />
              <p style={{ margin: 0, fontSize: 16, fontWeight: 400, opacity: 0.6, color: "#fff", lineHeight: "1.4em" }}>{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
