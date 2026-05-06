"use client";

import { useRef, useState } from "react";

export default function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <>
      <video
        ref={videoRef}
        src="/rocket-bg.mp4"
        muted
        autoPlay
        playsInline
        loop
        preload="auto"
        className="absolute inset-0 z-0 w-full h-full object-cover pointer-events-none"
        style={{ objectPosition: "center center" }}
      />
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.25) 100%)",
        }}
      />
      <button
        onClick={toggleSound}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 hover:scale-110 active:scale-95"
        style={{
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.15)",
        }}
        aria-label={isMuted ? "Enable sound" : "Mute sound"}
      >
        <span className="text-white/80 text-sm">{isMuted ? "🔇" : "🔊"}</span>
      </button>
    </>
  );
}
