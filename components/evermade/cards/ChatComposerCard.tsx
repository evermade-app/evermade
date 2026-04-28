"use client";

import React, { useState } from "react";

interface ChatComposerCardProps {
  placeholder?: string;
  onSubmit?: (message: string) => void;
  tags?: string[];
  className?: string;
}

const ChatComposerCard: React.FC<ChatComposerCardProps> = ({
  placeholder = "Imagine Something...✦˚",
  onSubmit,
  tags = ["Create An Image", "Analyse Data", "More"],
  className = "",
}) => {
  const [message, setMessage] = useState("");
  const [submitHovered, setSubmitHovered] = useState(false);
  const [btnHovered, setBtnHovered] = useState<number | null>(null);

  const handleSubmit = () => {
    if (onSubmit && message.trim()) {
      onSubmit(message);
      setMessage("");
    }
  };

  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        maxWidth: "260px",
        width: "100%",
      }}
    >
      {/* Main chat box */}
      <div
        style={{
          position: "relative",
          display: "flex",
          background: "linear-gradient(to bottom right, #7e7e7e, #363636, #363636, #363636, #363636)",
          borderRadius: "16px",
          padding: "1.5px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "rgba(0,0,0,0.5)",
            borderRadius: "15px",
            width: "100%",
            overflow: "hidden",
          }}
        >
          {/* Textarea */}
          <div style={{ position: "relative", display: "flex" }}>
            <textarea
              id="chat_bot"
              name="chat_bot"
              placeholder={placeholder}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{
                backgroundColor: "transparent",
                borderRadius: "16px",
                border: "none",
                width: "100%",
                height: "80px",
                color: "#ffffff",
                fontFamily: "sans-serif",
                fontSize: "12px",
                fontWeight: 400,
                padding: "10px",
                resize: "none",
                outline: "none",
              }}
            />
          </div>

          {/* Options bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              padding: "10px",
            }}
          >
            {/* Action buttons */}
            <div style={{ display: "flex", gap: "8px" }}>
              {[
                <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" key="attach">
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8v8a5 5 0 1 0 10 0V6.5a3.5 3.5 0 1 0-7 0V15a2 2 0 0 0 4 0V8" />
                </svg>,
                <svg viewBox="0 0 24 24" height={20} width={20} xmlns="http://www.w3.org/2000/svg" key="grid">
                  <path d="M4 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zm0 10a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zm10 0a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1zm0-8h6m-3-3v6" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" stroke="currentColor" fill="none" />
                </svg>,
                <svg viewBox="0 0 24 24" height={20} width={20} xmlns="http://www.w3.org/2000/svg" key="globe">
                  <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10m-2.29-2.333A17.9 17.9 0 0 1 8.027 13H4.062a8.01 8.01 0 0 0 5.648 6.667M10.03 13c.151 2.439.848 4.73 1.97 6.752A15.9 15.9 0 0 0 13.97 13zm9.908 0h-3.965a17.9 17.9 0 0 1-1.683 6.667A8.01 8.01 0 0 0 19.938 13M4.062 11h3.965A17.9 17.9 0 0 1 9.71 4.333A8.01 8.01 0 0 0 4.062 11m5.969 0h3.938A15.9 15.9 0 0 0 12 4.248A15.9 15.9 0 0 0 10.03 11m4.259-6.667A17.9 17.9 0 0 1 15.973 11h3.965a8.01 8.01 0 0 0-5.648-6.667" fill="currentColor" />
                </svg>,
              ].map((icon, i) => (
                <button
                  key={i}
                  onMouseEnter={() => setBtnHovered(i)}
                  onMouseLeave={() => setBtnHovered(null)}
                  style={{
                    display: "flex",
                    color: btnHovered === i ? "#ffffff" : "rgba(255,255,255,0.1)",
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    transform: btnHovered === i ? "translateY(-5px)" : "none",
                  }}
                >
                  {icon}
                </button>
              ))}
            </div>

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              onMouseEnter={() => setSubmitHovered(true)}
              onMouseLeave={() => setSubmitHovered(false)}
              style={{
                display: "flex",
                padding: "2px",
                backgroundImage: "linear-gradient(to top, #292929, #555555, #292929)",
                borderRadius: "10px",
                boxShadow: "inset 0 6px 2px -4px rgba(255,255,255,0.5)",
                cursor: "pointer",
                border: "none",
                outline: "none",
                transition: "all 0.15s ease",
                transform: submitHovered ? "scale(0.92)" : "none",
              }}
            >
              <i
                style={{
                  width: "30px",
                  height: "30px",
                  padding: "6px",
                  background: "rgba(0,0,0,0.1)",
                  borderRadius: "10px",
                  backdropFilter: "blur(3px)",
                  color: submitHovered ? "#f3f6fd" : "#8b8b8b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  filter: submitHovered ? "drop-shadow(0 0 5px #ffffff)" : "none",
                }}
              >
                <svg viewBox="0 0 512 512" width={16} height={16}>
                  <path
                    fill="currentColor"
                    d="M473 39.05a24 24 0 0 0-25.5-5.46L47.47 185h-.08a24 24 0 0 0 1 45.16l.41.13l137.3 58.63a16 16 0 0 0 15.54-3.59L422 80a7.07 7.07 0 0 1 10 10L226.66 310.26a16 16 0 0 0-3.59 15.54l58.65 137.38c.06.2.12.38.19.57c3.2 9.27 11.3 15.81 21.09 16.25h1a24.63 24.63 0 0 0 23-15.46L478.39 64.62A24 24 0 0 0 473 39.05"
                  />
                </svg>
              </i>
            </button>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div
        style={{
          padding: "14px 0",
          display: "flex",
          color: "#ffffff",
          fontSize: "10px",
          gap: "4px",
        }}
      >
        {tags.map((tag, i) => (
          <span
            key={i}
            style={{
              padding: "4px 8px",
              backgroundColor: "#1b1b1b",
              border: "1.5px solid #363636",
              borderRadius: "10px",
              cursor: "pointer",
              userSelect: "none",
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ChatComposerCard;
