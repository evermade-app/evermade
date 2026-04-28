"use client";

import React, { useState } from "react";

interface ContactAiFormProps {
  onSubmit?: (data: { name: string; email: string; message: string }) => void;
  className?: string;
}

const ContactAiForm: React.FC<ContactAiFormProps> = ({
  onSubmit,
  className = "",
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [btnHovered, setBtnHovered] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({ name, email, message });
  };

  return (
    <div
      className={className}
      style={{ position: "relative", display: "inline-block" }}
    >
      {/* Gradient border */}
      <div
        style={{
          backgroundImage: "linear-gradient(45deg, #ff0000, #ffb700)",
          height: "calc(100% + 8px)",
          width: "calc(100% + 8px)",
          position: "absolute",
          top: "-4px",
          left: "-4px",
          zIndex: -1,
          borderRadius: "2.7em",
        }}
      />
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          gap: "10px",
          backgroundImage: "linear-gradient(45deg, #330808, #3a2c09)",
          borderRadius: "2.5em",
          padding: "30px",
          width: "300px",
          height: "350px",
          position: "relative",
        }}
      >
        {/* Name input */}
        <input
          className="input"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: "calc(100% - 10px)",
            padding: "8px",
            marginBottom: "0",
            border: "1px solid transparent",
            borderBottom: "1px solid #ff5900",
            outline: "none",
            backgroundColor: "transparent",
            color: "#ff5900",
            fontFamily: "Arial, Helvetica, sans-serif",
            transition: "0.2s",
          }}
        />
        {/* Email input */}
        <input
          className="input"
          type="text"
          placeholder="E-Mail I.D."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "calc(100% - 10px)",
            padding: "8px",
            border: "1px solid transparent",
            borderBottom: "1px solid #ff5900",
            outline: "none",
            backgroundColor: "transparent",
            color: "#ff5900",
            fontFamily: "Arial, Helvetica, sans-serif",
            transition: "0.2s",
          }}
        />
        {/* Message textarea */}
        <textarea
          placeholder="Enter message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{
            fontFamily: "Arial, Helvetica, sans-serif",
            width: "calc(100% - 10px)",
            padding: "8px",
            height: "100px",
            border: "1px solid transparent",
            borderBottom: "1px solid #ff5900",
            outline: "none",
            backgroundColor: "transparent",
            color: "#ff5900",
            resize: "none",
          }}
        />
        {/* Submit */}
        <center>
          <button
            type="submit"
            onMouseEnter={() => setBtnHovered(true)}
            onMouseLeave={() => setBtnHovered(false)}
            style={{
              marginTop: "10px",
              fontFamily: "Arial, Helvetica, sans-serif",
              fontSize: "17px",
              background: btnHovered ? "transparent" : "#ff5900",
              color: btnHovered ? "#ff5900" : "black",
              padding: "0.7em 5.5em",
              display: "flex",
              alignItems: "center",
              border: btnHovered ? "2px solid #ff5900" : "2px solid transparent",
              borderRadius: "5em",
              overflow: "hidden",
              transition: "all 0.2s",
              cursor: "pointer",
            }}
          >
            Submit
          </button>
        </center>
      </form>
    </div>
  );
};

export default ContactAiForm;
