"use client";

import React from "react";

interface UploadFolderSelectorProps {
  onFileSelect?: (file: File) => void;
  className?: string;
}

const UploadFolderSelector: React.FC<UploadFolderSelectorProps> = ({
  onFileSelect,
  className = "",
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileSelect) onFileSelect(file);
  };

  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: "10px",
        background: "linear-gradient(135deg, #6dd5ed, #2193b0)",
        borderRadius: "15px",
        boxShadow: "0 15px 30px rgba(0,0,0,0.2)",
        height: "calc(80px * 1.7)",
        position: "relative",
        width: "160px",
      }}
    >
      {/* Floating folder */}
      <div
        style={{
          position: "absolute",
          top: "-20px",
          left: "calc(50% - 60px)",
          animationName: "card-float",
          animationDuration: "2.5s",
          animationIterationCount: "infinite",
          animationTimingFunction: "ease-in-out",
        }}
      >
        {/* Back side */}
        <div
          style={{
            position: "absolute",
            transformOrigin: "bottom center",
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(255,255,255,0.5)",
              zIndex: 0,
              width: "120px",
              height: "80px",
              position: "absolute",
              transformOrigin: "bottom center",
              borderRadius: "15px",
              top: 0,
              left: 0,
            }}
          />
        </div>
        {/* Front side */}
        <div style={{ zIndex: 1, position: "relative" }}>
          {/* Tab tip */}
          <div
            style={{
              background: "linear-gradient(135deg, #ff9a56, #ff6f56)",
              width: "80px",
              height: "20px",
              borderRadius: "12px 12px 0 0",
              boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
              position: "absolute",
              top: "-10px",
              zIndex: 2,
            }}
          />
          {/* Cover */}
          <div
            style={{
              background: "linear-gradient(135deg, #ffe563, #ffc663)",
              width: "120px",
              height: "80px",
              boxShadow: "0 15px 30px rgba(0,0,0,0.3)",
              borderRadius: "10px",
            }}
          />
        </div>
      </div>

      {/* File input button */}
      <label
        style={{
          fontSize: "1.1em",
          color: "#ffffff",
          textAlign: "center",
          background: "rgba(255,255,255,0.2)",
          border: "none",
          borderRadius: "10px",
          boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
          cursor: "pointer",
          display: "inline-block",
          width: "100%",
          padding: "10px 20px",
          position: "relative",
          transition: "background 350ms ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLLabelElement).style.background = "rgba(255,255,255,0.4)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLLabelElement).style.background = "rgba(255,255,255,0.2)";
        }}
      >
        Choose a file
        <input
          className="title"
          type="file"
          onChange={handleChange}
          style={{ display: "none" }}
        />
      </label>
    </div>
  );
};

export default UploadFolderSelector;
