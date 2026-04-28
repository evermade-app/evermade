import React from "react";

interface KpiGlowCardProps {
  value?: string;
  label?: string;
  className?: string;
}

const KpiGlowCard: React.FC<KpiGlowCardProps> = ({
  value = "750k",
  label = "Views",
  className = "",
}) => {
  return (
    <div
      className={className}
      style={{
        width: "300px",
        height: "250px",
        borderRadius: "10px",
        padding: "1px",
        background: "radial-gradient(circle 230px at 0% 0%, #ffffff, #0c0d0d)",
        position: "relative",
      }}
    >
      {/* Animated dot */}
      <div
        style={{
          width: "5px",
          aspectRatio: "1",
          position: "absolute",
          backgroundColor: "#fff",
          boxShadow: "0 0 10px #ffffff",
          borderRadius: "100px",
          zIndex: 2,
          right: "10%",
          top: "10%",
          animationName: "moveDot",
          animationDuration: "6s",
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
        }}
      />
      {/* Card */}
      <div
        style={{
          zIndex: 1,
          width: "100%",
          height: "100%",
          borderRadius: "9px",
          border: "solid 1px #202222",
          background: "radial-gradient(circle 280px at 0% 0%, #444444, #0c0d0d)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          flexDirection: "column",
          color: "#fff",
        }}
      >
        {/* Ray */}
        <div
          style={{
            width: "220px",
            height: "45px",
            borderRadius: "100px",
            position: "absolute",
            backgroundColor: "#c7c7c7",
            opacity: 0.4,
            boxShadow: "0 0 50px #fff",
            filter: "blur(10px)",
            transformOrigin: "10%",
            top: "0%",
            left: 0,
            transform: "rotate(40deg)",
          }}
        />
        {/* Value */}
        <div
          style={{
            fontWeight: "bolder",
            fontSize: "4rem",
            background: "linear-gradient(45deg, #000000 4%, #fff, #000)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {value}
        </div>
        <div>{label}</div>
        {/* Border lines */}
        <div style={{ width: "100%", height: "1px", position: "absolute", top: "10%", background: "linear-gradient(90deg, #888888 30%, #1d1f1f 70%)" }} />
        <div style={{ width: "100%", height: "1px", position: "absolute", bottom: "10%", backgroundColor: "#2c2c2c" }} />
        <div style={{ left: "10%", width: "1px", height: "100%", position: "absolute", background: "linear-gradient(180deg, #747474 30%, #222424 70%)" }} />
        <div style={{ right: "10%", width: "1px", height: "100%", position: "absolute", backgroundColor: "#2c2c2c" }} />
      </div>
    </div>
  );
};

export default KpiGlowCard;
