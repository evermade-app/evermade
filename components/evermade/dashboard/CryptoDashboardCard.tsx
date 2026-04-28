"use client";

import React, { useState } from "react";

type CryptoKey = "bitcoin" | "ethereum" | "solana" | "tether";

const CRYPTO_DATA: Record<CryptoKey, { price: string; amount: string; change: string }> = {
  bitcoin: { price: "$57,256.15", amount: "12.458 BTC", change: "+10.4%" },
  ethereum: { price: "$3,452.12", amount: "34.123 ETH", change: "+8.2%" },
  solana: { price: "$145.78", amount: "150.78 SOL", change: "+12.1%" },
  tether: { price: "$1.00", amount: "10,000 TET", change: "+0.0%" },
};

const CRYPTO_PATHS: Record<CryptoKey, string> = {
  bitcoin: "M0,48 L5,45 L10,42 L15,38 L20,40 L25,35 L30,32 L35,28 L40,30 L45,25 L50,28 L55,22 L60,25 L65,20 L70,23 L75,18 L80,20 L85,15 L90,18 L95,12 L100,15 L100,190",
  ethereum: "M0,40 L5,38 L10,36 L15,34 L20,32 L25,30 L30,28 L35,26 L40,24 L45,22 L50,20 L55,22 L60,18 L65,20 L70,15 L75,18 L80,14 L85,16 L90,12 L95,14 L100,10 L100,190",
  solana: "M0,35 L5,33 L10,31 L15,29 L20,27 L25,25 L30,23 L35,21 L40,19 L45,18 L50,16 L55,15 L60,14 L65,12 L70,11 L75,10 L80,9 L85,8 L90,7 L95,6 L100,5 L100,190",
  tether: "M0,25 L100,25",
};

interface CryptoDashboardCardProps {
  className?: string;
}

const CryptoDashboardCard: React.FC<CryptoDashboardCardProps> = ({ className = "" }) => {
  const [selected, setSelected] = useState<CryptoKey>("bitcoin");
  const cryptoData = CRYPTO_DATA[selected];

  const tabs: Array<{ key: CryptoKey; label: string }> = [
    { key: "bitcoin", label: "BTC" },
    { key: "ethereum", label: "ETH" },
    { key: "solana", label: "SOL" },
    { key: "tether", label: "TET" },
  ];

  const selectedIdx = tabs.findIndex((t) => t.key === selected);

  return (
    <div
      className={className}
      style={{
        maxWidth: "360px",
        width: "90%",
        padding: "20px",
        borderRadius: "35px",
        background: "#000",
        color: "#fff",
        boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <span style={{ fontWeight: "bold", fontSize: "1.2em" }}>CryptoApp</span>
        <span style={{ fontSize: "0.85em", color: "#888", cursor: "pointer" }}>Open App →</span>
      </div>

      {/* Tab switch */}
      <div style={{ position: "relative", display: "flex", background: "#222", borderRadius: "20px", padding: "4px", gap: "8px", marginBottom: "16px", userSelect: "none" }}>
        {/* Slider */}
        <div
          style={{
            position: "absolute",
            top: "4px",
            bottom: "4px",
            width: `calc((100% - 24px) / 4)`,
            background: "rgba(255,255,255,0.4)",
            backdropFilter: "blur(1px)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "16px",
            zIndex: 1,
            transition: "transform 0.4s cubic-bezier(0.68,-0.55,0.265,1.55)",
            boxShadow: "0 4px 8px rgba(0,0,0,0.4), inset 0 -2px 4px rgba(255,255,255,0.2)",
            transform: `translateX(calc(${selectedIdx} * 105%))`,
          }}
        />
        {tabs.map((tab) => (
          <label
            key={tab.key}
            onClick={() => setSelected(tab.key)}
            style={{
              flex: 1,
              textAlign: "center",
              padding: "8px 0",
              borderRadius: "16px",
              cursor: "pointer",
              color: selected === tab.key ? "#fff" : "#ccc",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.9em",
              zIndex: 2,
              position: "relative",
              transition: "color 0.3s",
            }}
          >
            {tab.label}
          </label>
        ))}
      </div>

      {/* Price info */}
      <div style={{ marginBottom: "16px" }}>
        <div style={{ fontSize: "1.6em", fontWeight: "bold", marginBottom: "4px" }}>{cryptoData.price}</div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9em" }}>
          <span>{cryptoData.amount}</span>
          <span style={{ color: "#0f0", fontWeight: "bold" }}>{cryptoData.change}</span>
        </div>
      </div>

      {/* Chart */}
      <div style={{ height: "90px", background: "#1b1b1b", borderRadius: "12px", position: "relative", overflow: "hidden", width: "100%" }}>
        <svg viewBox="0 0 100 50" preserveAspectRatio="none" style={{ width: "100%", height: "100%", transform: "translateX(2px) scale(1.05)" }}>
          <path
            d={CRYPTO_PATHS[selected]}
            stroke="#0f0"
            strokeWidth="0.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="500"
            strokeDashoffset="0"
            fill="rgba(0,255,0,0.2)"
            style={{ animationName: "draw-chart", animationDuration: "3s", animationFillMode: "forwards" }}
          />
        </svg>
      </div>
    </div>
  );
};

export default CryptoDashboardCard;
