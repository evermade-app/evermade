import React from "react";

interface ProgressTrackLoaderProps {
  className?: string;
}

const ProgressTrackLoader: React.FC<ProgressTrackLoaderProps> = ({ className = "" }) => {
  return (
    <div
      className={className}
      style={{ display: "flex", justifyContent: "center" }}
    >
      <div
        style={{
          width: "60%",
          height: "10px",
          borderRadius: "2px",
          backgroundColor: "rgba(0,0,0,0.2)",
          position: "relative",
        }}
      >
        <div
          style={{
            content: "''",
            position: "absolute",
            backgroundColor: "rgb(9,188,9)",
            width: "0%",
            height: "100%",
            borderRadius: "2px",
            animationName: "progress-load",
            animationDuration: "3.5s",
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
            boxShadow: "rgb(9,188,9) 0px 2px 29px 0px",
          }}
        />
      </div>
    </div>
  );
};

export default ProgressTrackLoader;
