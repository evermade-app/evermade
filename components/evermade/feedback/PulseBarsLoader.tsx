import React from "react";

interface PulseBarsLoaderProps {
  className?: string;
}

const PulseBarsLoader: React.FC<PulseBarsLoaderProps> = ({ className = "" }) => {
  const bars = [
    { gradient: "linear-gradient(to right, #00e6e6, #00ccff, #0099ff, #0066ff)", shadow: "#00e6e6", delay: "0s" },
    { gradient: "linear-gradient(to right, #00ccff, #0099ff, #0066ff, #00e6e6)", shadow: "#00ccff", delay: "0.1s" },
    { gradient: "linear-gradient(to right, #0099ff, #0066ff, #00e6e6, #00ccff)", shadow: "#0099ff", delay: "0.2s" },
    { gradient: "linear-gradient(to right, #0066ff, #00e6e6, #00ccff, #0099ff)", shadow: "#0066ff", delay: "0.3s" },
  ];

  return (
    <div
      className={className}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        gap: "6px",
      }}
    >
      {bars.map((bar, i) => (
        <div
          key={i}
          style={{
            height: "25px",
            width: "6px",
            borderRadius: "20px",
            background: bar.gradient,
            boxShadow: `0px 0px 15px 3px ${bar.shadow}`,
            animationName: "pulse-bars",
            animationDuration: "2s",
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
            animationDelay: bar.delay,
          }}
        />
      ))}
    </div>
  );
};

export default PulseBarsLoader;
