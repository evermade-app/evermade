"use client";
import { motion } from "motion/react";

const spring = { type: "spring" as const, damping: 80, stiffness: 400 };
const BG_CARD = "https://framerusercontent.com/images/4VMQwZcSpg0V59gQOVc2WxjIxc.png";

const ROW2_LOGOS_A = [
  "https://framerusercontent.com/images/Xzs46aCMMGx9mTz2VIEM7Xw5M.svg",
  "https://framerusercontent.com/images/C5g9VyFLJQa8z4aC4u2YhF72TE.svg",
  "https://framerusercontent.com/images/bgu3FmUygP0HkmbGzvgwrxZ76k.svg",
  "https://framerusercontent.com/images/5EievjhKcuDRaad1Me3P6dIUgE.svg",
  "https://framerusercontent.com/images/qxqmiAp2BQgeemEN1hUSeUFKoc.svg",
  "https://framerusercontent.com/images/iaGoWAvDZuD8uuZaKzprg4z06s.svg",
];
const ROW2_LOGOS_B = [
  "https://framerusercontent.com/images/E10OIURi029FTCsrqgCeunF42I.svg",
  "https://framerusercontent.com/images/IQQ24V8Iz0BIcbswy1mzGs69is.svg",
  "https://framerusercontent.com/images/pJGEy7nWepsWNDT9KPyKSVr0ow.svg",
  "https://framerusercontent.com/images/3guO13FYIVmEeXYbkkDagJDfQD8.svg",
  "https://framerusercontent.com/images/SHG965ndFmPlpoTjhR5GQS81lE.svg",
  "https://framerusercontent.com/images/XCxSBC0Qz4OxytMdOE7kSSGM8gQ.svg",
  "https://framerusercontent.com/images/amTUXuLT44ex1uOInq5VXUU5umU.svg",
];

const logoBoxShadow = "inset 1.9px 3.81px 15.24px 0px rgba(248,248,248,0.05), 0px 9px 19px 0px rgba(0,0,0,0.3)";
const cardBorder = "2px solid rgba(255,255,255,0.05)";
const cardStyle = { border: cardBorder, borderRadius: 30, overflow: "hidden", position: "relative" as const, flex: 1 };

const subCards = [
  {
    title: "Monthly workforce insights",
    desc: "Make instant, informed decisions on global payments across 150 currencies.",
    img: "https://framerusercontent.com/images/fRmxCWNGxkqHwQKj5hN30FpjL2o.png",
  },
  {
    title: "HR insights dashboard",
    desc: "Monitor international transactions and execute decisions instantly across.",
    img: "https://framerusercontent.com/images/iocEIULAiRc8pGoEhUa8unMkr4.png",
  },
  {
    title: "Reformat any text",
    desc: "Get real-time control over cross-border payments in 150+ currencies.",
    img: "https://framerusercontent.com/images/IFI6pJYHgOVlSmzykwQMVviWCAU.png",
  },
];

function HorizontalTicker() {
  const ITEM = "https://framerusercontent.com/images/fJf6dvBP6UYTxdwXrjqmfrP665s.svg";
  const CENTER = "https://framerusercontent.com/images/6aniSXzWHldv34PtQfV2xJw7dcY.svg";
  const items = Array(6).fill(ITEM);

  return (
    <div style={{ height: 118, overflow: "hidden", position: "relative" }}>
      <div style={{
        position: "absolute", inset: 0,
        maskImage: "linear-gradient(to right,transparent 0%,black 12.5%,black 87.5%,transparent 100%)",
        WebkitMaskImage: "linear-gradient(to right,transparent 0%,black 12.5%,black 87.5%,transparent 100%)",
        zIndex: 1,
      }}>
        <div style={{ display: "flex", animation: "ticker-left 18s linear infinite", width: "max-content" }}>
          {items.map((src, i) => (
            <img key={i} src={src} width={256} height={72} alt="" style={{ flexShrink: 0, display: "block" }} />
          ))}
        </div>
      </div>
      <img src={CENTER} width={118} height={118} alt="" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 2 }} />
    </div>
  );
}

function LogoRow({ logos, direction }: { logos: string[]; direction: "left" | "right" }) {
  const doubled = [...logos, ...logos];
  return (
    <div style={{
      overflow: "hidden",
      maskImage: "linear-gradient(to right,transparent 0%,black 12.5%,black 87.5%,transparent 100%)",
      WebkitMaskImage: "linear-gradient(to right,transparent 0%,black 12.5%,black 87.5%,transparent 100%)",
    }}>
      <div style={{
        display: "flex",
        gap: 28,
        animation: `${direction === "left" ? "ticker-left" : "ticker-right"} 22s linear infinite`,
        width: "max-content",
      }}>
        {doubled.map((src, i) => (
          <div key={i} style={{ width: 61, height: 61, borderRadius: 100, boxShadow: logoBoxShadow, flexShrink: 0, overflow: "hidden", background: "rgba(255,255,255,0.04)" }}>
            <img src={src} width={61} height={61} alt="" style={{ width: "100%", height: "100%", objectFit: "fill" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BentoFeatures() {
  return (
    <section style={{ padding: "80px 30px 160px", background: "#090611" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 80 }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={spring}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24 }}
        >
          <h2 style={{ margin: 0, maxWidth: 600, fontSize: "clamp(28px,4vw,48px)", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: "1.15em", color: "#fff" }}>
            Where Innovation Meets the Written Word
          </h2>
          <a href="/contact" style={{
            display: "inline-flex", alignItems: "center",
            padding: "16px 40px", borderRadius: 100, border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(248,248,248,0.05)", backdropFilter: "blur(69px)", WebkitBackdropFilter: "blur(69px)",
            boxShadow: "inset 2px 4px 16px 0px rgba(248,248,248,0.05)",
            fontSize: 18, fontWeight: 700, textTransform: "uppercase" as const, color: "#fff", textDecoration: "none",
          }}>
            Learn More
          </a>
        </motion.div>

        {/* Row 1 */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={spring}
          style={{ display: "flex", gap: 14, flexWrap: "wrap" }}
        >
          {/* Card 1 */}
          <div style={{ ...cardStyle, maxWidth: 555, backgroundImage: `url(${BG_CARD})`, backgroundSize: "cover", backgroundPosition: "center", minWidth: 280 }}>
            <div style={{ padding: "43px 32px 0", display: "flex", flexDirection: "column", gap: 16, marginBottom: 99 }}>
              <h4 style={{ margin: 0, fontSize: 24, fontWeight: 500, letterSpacing: "-0.02em", color: "#fff" }}>
                From Voice to Words — Instantly
              </h4>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 400, opacity: 0.6, color: "#fff" }}>
                A web developer who&apos;s passionate about performance, security, and great user experience. From concept to clean code
              </p>
            </div>
            <HorizontalTicker />
            <div style={{ paddingBottom: 49 }} />
          </div>

          {/* Card 2 */}
          <div style={{ ...cardStyle, maxWidth: 635, backgroundImage: `url(${BG_CARD})`, backgroundSize: "cover", backgroundPosition: "center", minWidth: 280 }}>
            <div style={{ padding: "43px 32px 0", display: "flex", flexDirection: "column", gap: 16, marginBottom: 84 }}>
              <h4 style={{ margin: 0, fontSize: 24, fontWeight: 500, letterSpacing: "-0.02em", color: "#fff" }}>
                Integrate Seamlessly with 40+ Popular Apps
              </h4>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 400, opacity: 0.6, color: "#fff" }}>
                Track cross-border payment senders and receivers, making real-time decisions across 150+ currencies.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "0 0 37px" }}>
              <LogoRow logos={ROW2_LOGOS_A} direction="left" />
              <LogoRow logos={ROW2_LOGOS_B} direction="right" />
            </div>
          </div>
        </motion.div>

        {/* Row 2 */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={spring}
          style={{ display: "flex", gap: 14, flexWrap: "wrap" }}
        >
          {subCards.map((card, i) => (
            <div key={i} style={{ flex: 1, minWidth: 260, maxWidth: 428, background: "#0a0813", border: cardBorder, borderRadius: 30, overflow: "hidden" }}>
              <div style={{ padding: "40px 24px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
                <h4 style={{ margin: 0, fontSize: 24, fontWeight: 500, letterSpacing: "-0.02em", color: "#fff" }}>{card.title}</h4>
                <p style={{ margin: 0, fontSize: 16, opacity: 0.6, color: "#fff" }}>{card.desc}</p>
              </div>
              <img src={card.img} alt={card.title} style={{ width: "100%", display: "block", objectFit: "cover", aspectRatio: "1.91" }} />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
