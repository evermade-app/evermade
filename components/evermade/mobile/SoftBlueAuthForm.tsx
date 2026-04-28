"use client";

import React, { useState } from "react";

interface SoftBlueAuthFormProps {
  onSubmit?: (data: { email: string; password: string }) => void;
  className?: string;
}

const SoftBlueAuthForm: React.FC<SoftBlueAuthFormProps> = ({
  onSubmit,
  className = "",
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginHovered, setLoginHovered] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({ email, password });
  };

  return (
    <div
      className={className}
      style={{
        maxWidth: "350px",
        background: "linear-gradient(0deg, rgb(255,255,255) 0%, rgb(244,247,251) 100%)",
        borderRadius: "40px",
        padding: "25px 35px",
        border: "5px solid rgb(255,255,255)",
        boxShadow: "rgba(133,189,215,0.878) 0px 30px 30px -20px",
        margin: "20px",
      }}
    >
      <div style={{ textAlign: "center", fontWeight: 900, fontSize: "30px", color: "rgb(16,137,211)" }}>
        Sign In
      </div>

      <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
        <input
          required
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            background: "white",
            border: "none",
            padding: "15px 20px",
            borderRadius: "20px",
            marginTop: "15px",
            boxShadow: "rgba(207,240,255,1) 0px 10px 10px -5px",
            borderInline: "2px solid transparent",
            outline: "none",
            fontSize: "14px",
            boxSizing: "border-box",
          }}
        />
        <input
          required
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            background: "white",
            border: "none",
            padding: "15px 20px",
            borderRadius: "20px",
            marginTop: "15px",
            boxShadow: "rgba(207,240,255,1) 0px 10px 10px -5px",
            borderInline: "2px solid transparent",
            outline: "none",
            fontSize: "14px",
            boxSizing: "border-box",
          }}
        />

        <div style={{ display: "block", marginTop: "10px", marginLeft: "10px" }}>
          <a href="#" style={{ fontSize: "11px", color: "#0099ff", textDecoration: "none" }}>Forgot Password ?</a>
        </div>

        <button
          type="submit"
          onMouseEnter={() => setLoginHovered(true)}
          onMouseLeave={() => setLoginHovered(false)}
          style={{
            display: "block",
            width: "100%",
            fontWeight: "bold",
            background: "linear-gradient(45deg, rgb(16,137,211) 0%, rgb(18,177,209) 100%)",
            color: "white",
            paddingBlock: "15px",
            margin: "20px auto",
            borderRadius: "20px",
            boxShadow: "rgba(133,189,215,0.878) 0px 20px 10px -15px",
            border: "none",
            transition: "all 0.2s ease-in-out",
            cursor: "pointer",
            transform: loginHovered ? "scale(1.03)" : "scale(1)",
            fontSize: "16px",
          }}
        >
          Sign In
        </button>
      </form>

      {/* Social */}
      <div style={{ marginTop: "25px" }}>
        <span style={{ display: "block", textAlign: "center", fontSize: "10px", color: "rgb(170,170,170)" }}>
          Or Sign in with
        </span>
        <div style={{ width: "100%", display: "flex", justifyContent: "center", gap: "15px", marginTop: "5px" }}>
          {["G", "A", "X"].map((letter, i) => (
            <button
              key={i}
              style={{
                background: "linear-gradient(45deg, rgb(0,0,0) 0%, rgb(112,112,112) 100%)",
                border: "5px solid white",
                padding: "5px",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                aspectRatio: "1",
                display: "grid",
                placeContent: "center",
                boxShadow: "rgba(133,189,215,0.878) 0px 12px 10px -8px",
                transition: "all 0.2s ease-in-out",
                cursor: "pointer",
                color: "white",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      <span style={{ display: "block", textAlign: "center", marginTop: "15px" }}>
        <a href="#" style={{ textDecoration: "none", color: "#0099ff", fontSize: "9px" }}>
          Learn user licence agreement
        </a>
      </span>
    </div>
  );
};

export default SoftBlueAuthForm;
