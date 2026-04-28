"use client";

import React, { useState } from "react";

interface ChatAttachInputProps {
  placeholder?: string;
  onSend?: (message: string) => void;
  className?: string;
}

const ChatAttachInput: React.FC<ChatAttachInputProps> = ({
  placeholder = "Message...",
  onSend,
  className = "",
}) => {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [sendHovered, setSendHovered] = useState(false);

  const handleSend = () => {
    if (onSend && value.trim()) {
      onSend(value);
      setValue("");
    }
  };

  return (
    <div
      className={className}
      style={{
        width: "fit-content",
        height: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#2d2d2d",
        padding: "0 15px",
        borderRadius: "10px",
        border: focused
          ? "1px solid rgb(110,110,110)"
          : "1px solid rgb(63,63,63)",
        transition: "border 0.2s",
      }}
    >
      {/* File attach */}
      <div
        style={{
          width: "fit-content",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <label
          htmlFor="evermade-chat-file"
          style={{
            cursor: "pointer",
            width: "fit-content",
            height: "fit-content",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 337 337" style={{ height: "18px" }}>
            <circle strokeWidth={20} stroke="#6c6c6c" fill="none" r="158.5" cy="168.5" cx="168.5" />
            <path strokeLinecap="round" strokeWidth={25} stroke="#6c6c6c" d="M167.759 79V259" />
            <path strokeLinecap="round" strokeWidth={25} stroke="#6c6c6c" d="M79 167.138H259" />
          </svg>
        </label>
        <input
          type="file"
          id="evermade-chat-file"
          name="evermade-chat-file"
          style={{ display: "none" }}
        />
      </div>

      {/* Text input */}
      <input
        required
        placeholder={placeholder}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        style={{
          width: "200px",
          height: "100%",
          backgroundColor: "transparent",
          outline: "none",
          border: "none",
          paddingLeft: "10px",
          color: "white",
        }}
      />

      {/* Send button */}
      <button
        onClick={handleSend}
        onMouseEnter={() => setSendHovered(true)}
        onMouseLeave={() => setSendHovered(false)}
        style={{
          width: "fit-content",
          height: "100%",
          backgroundColor: "transparent",
          outline: "none",
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "all 0.3s",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 664 663"
          style={{ height: "18px" }}
        >
          <path
            fill={sendHovered || value ? "#3c3c3c" : "none"}
            stroke={sendHovered || value ? "white" : "#6c6c6c"}
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="33.67"
            d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"
          />
        </svg>
      </button>
    </div>
  );
};

export default ChatAttachInput;
