import React from "react";

interface LoadingSpectrumRingSpinnerProps {
  size?: string;
  className?: string;
}

const LoadingSpectrumRingSpinner: React.FC<LoadingSpectrumRingSpinnerProps> = ({
  size = "3em",
  className = "",
}) => {
  return (
    <div className={className} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          width: size,
          height: size,
          cursor: "not-allowed",
          borderRadius: "50%",
          border: "2px solid #444",
          boxShadow:
            "-10px -10px 10px #6359f8, 0px -10px 10px 0px #9c32e2, 10px -10px 10px #f36896, 10px 0 10px #ff0b0b, 10px 10px 10px 0px #ff5500, 0 10px 10px 0px #ff9500, -10px 10px 10px 0px #ffb700",
          animationName: "rot55",
          animationDuration: "0.7s",
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
          position: "relative",
        }}
      >
        <div
          style={{
            border: "2px solid #444",
            width: "1.5em",
            height: "1.5em",
            borderRadius: "50%",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>
    </div>
  );
};

export default LoadingSpectrumRingSpinner;
