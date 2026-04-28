"use client";

import React, { useState } from "react";

interface CleanAuthFormProps {
  onSubmit?: (data: { email: string; password: string }) => void;
  onSignUp?: () => void;
  className?: string;
}

const CleanAuthForm: React.FC<CleanAuthFormProps> = ({
  onSubmit,
  onSignUp,
  className = "",
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);
  const [googleHovered, setGoogleHovered] = useState(false);
  const [appleHovered, setAppleHovered] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({ email, password });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        backgroundColor: "#ffffff",
        padding: "30px",
        width: "450px",
        borderRadius: "20px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* Email */}
      <div><label style={{ color: "#151717", fontWeight: 600 }}>Email</label></div>
      <div
        style={{
          border: emailFocused ? "1.5px solid #2d79f3" : "1.5px solid #ecedec",
          borderRadius: "10px",
          height: "50px",
          display: "flex",
          alignItems: "center",
          paddingLeft: "10px",
          transition: "0.2s ease-in-out",
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width={20} viewBox="0 0 32 32" height={20}>
          <g data-name="Layer 3" id="Layer_3">
            <path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z" fill="#666" />
          </g>
        </svg>
        <input
          placeholder="Enter your Email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => setEmailFocused(true)}
          onBlur={() => setEmailFocused(false)}
          style={{
            marginLeft: "10px",
            borderRadius: "10px",
            border: "none",
            width: "100%",
            height: "100%",
            outline: "none",
            fontSize: "14px",
          }}
        />
      </div>

      {/* Password */}
      <div><label style={{ color: "#151717", fontWeight: 600 }}>Password</label></div>
      <div
        style={{
          border: passFocused ? "1.5px solid #2d79f3" : "1.5px solid #ecedec",
          borderRadius: "10px",
          height: "50px",
          display: "flex",
          alignItems: "center",
          paddingLeft: "10px",
          transition: "0.2s ease-in-out",
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width={20} viewBox="-64 0 512 512" height={20}>
          <path fill="#666" d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0" />
          <path fill="#666" d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0" />
        </svg>
        <input
          placeholder="Enter your Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onFocus={() => setPassFocused(true)}
          onBlur={() => setPassFocused(false)}
          style={{ marginLeft: "10px", borderRadius: "10px", border: "none", width: "100%", height: "100%", outline: "none", fontSize: "14px" }}
        />
      </div>

      {/* Remember row */}
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "10px", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <input type="checkbox" />
          <label style={{ fontSize: "14px", color: "black", fontWeight: 400 }}>Remember me</label>
        </div>
        <span style={{ fontSize: "14px", marginLeft: "5px", color: "#2d79f3", fontWeight: 500, cursor: "pointer" }}>Forgot password?</span>
      </div>

      {/* Submit */}
      <button
        type="submit"
        style={{ margin: "20px 0 10px 0", backgroundColor: "#151717", border: "none", color: "white", fontSize: "15px", fontWeight: 500, borderRadius: "10px", height: "50px", width: "100%", cursor: "pointer" }}
      >
        Sign In
      </button>

      <p style={{ textAlign: "center", color: "black", fontSize: "14px", margin: "5px 0" }}>
        {"Don't have an account? "}
        <span onClick={onSignUp} style={{ color: "#2d79f3", fontWeight: 500, cursor: "pointer" }}>Sign Up</span>
      </p>
      <p style={{ textAlign: "center", color: "black", fontSize: "14px", margin: "5px 0" }}>Or With</p>

      {/* Social buttons */}
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "10px", justifyContent: "space-between" }}>
        <button
          type="button"
          onMouseEnter={() => setGoogleHovered(true)}
          onMouseLeave={() => setGoogleHovered(false)}
          style={{ marginTop: "10px", width: "100%", height: "50px", borderRadius: "10px", display: "flex", justifyContent: "center", alignItems: "center", fontWeight: 500, gap: "10px", border: googleHovered ? "1px solid #2d79f3" : "1px solid #ededef", backgroundColor: "white", cursor: "pointer", transition: "0.2s ease-in-out", fontSize: "14px" }}
        >
          Google
        </button>
        <button
          type="button"
          onMouseEnter={() => setAppleHovered(true)}
          onMouseLeave={() => setAppleHovered(false)}
          style={{ marginTop: "10px", width: "100%", height: "50px", borderRadius: "10px", display: "flex", justifyContent: "center", alignItems: "center", fontWeight: 500, gap: "10px", border: appleHovered ? "1px solid #2d79f3" : "1px solid #ededef", backgroundColor: "white", cursor: "pointer", transition: "0.2s ease-in-out", fontSize: "14px" }}
        >
          Apple
        </button>
      </div>
    </form>
  );
};

export default CleanAuthForm;
