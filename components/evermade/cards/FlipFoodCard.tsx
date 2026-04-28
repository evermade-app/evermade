"use client";

import React, { useState } from "react";

interface FlipFoodCardProps {
  badge?: string;
  title?: string;
  subtitle?: string;
  meta?: string;
  className?: string;
}

const FlipFoodCard: React.FC<FlipFoodCardProps> = ({
  badge = "Pasta",
  title = "Spaghetti Bolognese",
  subtitle = "Hover Me",
  meta = "30 Mins | 1 Serving",
  className = "",
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={className}
      style={{ overflow: "visible", width: "190px", height: "254px" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          transition: "transform 300ms",
          boxShadow: "0px 0px 10px 1px #000000ee",
          borderRadius: "5px",
          transform: hovered ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Back face */}
        <div
          style={{
            backgroundColor: "#151515",
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            borderRadius: "5px",
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Rotating border */}
          <div
            style={{
              position: "absolute",
              content: "' '",
              display: "block",
              width: "160px",
              height: "160%",
              background: "linear-gradient(90deg, transparent, #ff9966, #ff9966, #ff9966, transparent)",
              animationName: "rotation-481",
              animationDuration: "5000ms",
              animationIterationCount: "infinite",
              animationTimingFunction: "linear",
            }}
          />
          <div
            style={{
              position: "absolute",
              width: "99%",
              height: "99%",
              backgroundColor: "#151515",
              borderRadius: "5px",
              color: "white",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "30px",
            }}
          >
            <svg stroke="#ffffff" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" height="50px" width="50px" fill="#ffffff">
              <path d="M20.84375 0.03125C20.191406 0.0703125 19.652344 0.425781 19.21875 1.53125C18.988281 2.117188 18.5 3.558594 18.03125 4.9375C17.792969 5.636719 17.570313 6.273438 17.40625 6.75C17.390625 6.796875 17.414063 6.855469 17.40625 6.90625C17.398438 6.925781 17.351563 6.949219 17.34375 6.96875L17.25 7.25C18.566406 7.65625 19.539063 8.058594 19.625 8.09375C22.597656 9.21875 28.351563 11.847656 33.28125 16.78125C38.5 22 41.183594 28.265625 42.09375 30.71875C42.113281 30.761719 42.375 31.535156 42.75 32.84375C42.757813 32.839844 42.777344 32.847656 42.78125 32.84375C43.34375 32.664063 44.953125 32.09375 46.3125 31.625C47.109375 31.351563 47.808594 31.117188 48.15625 31C49.003906 30.714844 49.542969 30.292969 49.8125 29.6875C50.074219 29.109375 50.066406 28.429688 49.75 27.6875C49.605469 27.347656 49.441406 26.917969 49.25 26.4375C47.878906 23.007813 45.007813 15.882813 39.59375 10.46875C33.613281 4.484375 25.792969 1.210938 22.125 0.21875C21.648438 0.0898438 21.234375 0.0078125 20.84375 0.03125Z M 16.46875 9.09375L0.0625 48.625C-0.09375 48.996094 -0.00390625 49.433594 0.28125 49.71875C0.472656 49.910156 0.738281 50 1 50C1.128906 50 1.253906 49.988281 1.375 49.9375L40.90625 33.59375C40.523438 32.242188 40.222656 31.449219 40.21875 31.4375C39.351563 29.089844 36.816406 23.128906 31.875 18.1875C27.035156 13.34375 21.167969 10.804688 18.875 9.9375C18.84375 9.925781 17.8125 9.5 16.46875 9.09375Z" />
            </svg>
            <strong>{subtitle}</strong>
          </div>
        </div>

        {/* Front face */}
        <div
          style={{
            backgroundColor: "#151515",
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            borderRadius: "5px",
            overflow: "hidden",
            color: "white",
            transform: "rotateY(180deg)",
          }}
        >
          {/* Colored blobs */}
          <div style={{ position: "absolute", width: "100%", height: "100%" }}>
            <div style={{ width: "90px", height: "90px", borderRadius: "50%", backgroundColor: "#ffbb66", position: "relative", filter: "blur(15px)", animationName: "card-floating", animationDuration: "2600ms", animationIterationCount: "infinite", animationTimingFunction: "linear" }} />
            <div style={{ backgroundColor: "#ff8866", left: "50px", top: "0px", width: "150px", height: "150px", borderRadius: "50%", position: "relative", filter: "blur(15px)", animationName: "card-floating", animationDuration: "2600ms", animationDelay: "-800ms", animationIterationCount: "infinite", animationTimingFunction: "linear" }} />
            <div style={{ backgroundColor: "#ff2233", left: "160px", top: "-80px", width: "30px", height: "30px", borderRadius: "50%", position: "relative", filter: "blur(15px)", animationName: "card-floating", animationDuration: "2600ms", animationDelay: "-1800ms", animationIterationCount: "infinite", animationTimingFunction: "linear" }} />
          </div>
          {/* Content */}
          <div style={{ position: "absolute", width: "100%", height: "100%", padding: "10px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <small style={{ backgroundColor: "rgba(0,0,0,0.33)", padding: "2px 10px", borderRadius: "10px", backdropFilter: "blur(2px)", width: "fit-content" }}>
              {badge}
            </small>
            <div style={{ boxShadow: "0px 0px 10px 5px rgba(0,0,0,0.53)", width: "100%", padding: "10px", backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(5px)", borderRadius: "5px" }}>
              <div style={{ fontSize: "11px", maxWidth: "100%", display: "flex", justifyContent: "space-between" }}>
                <p style={{ width: "50%" }}><strong>{title}</strong></p>
              </div>
              <p style={{ color: "rgba(255,255,255,0.53)", marginTop: "5px", fontSize: "8px" }}>{meta}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlipFoodCard;
