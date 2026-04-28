"use client";

import React, { useState } from "react";

interface SearchNavInputProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
  className?: string;
}

const SearchNavInput: React.FC<SearchNavInputProps> = ({
  placeholder = "Search...",
  onSearch,
  className = "",
}) => {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(value);
  };

  return (
    <form className={`form relative ${className}`} onSubmit={handleSubmit}>
      <button
        type="submit"
        style={{
          position: "absolute",
          left: "8px",
          top: "50%",
          transform: "translateY(-50%)",
          padding: "4px",
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
      >
        <svg
          width={17}
          height={16}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-gray-700"
        >
          <path
            d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9"
            stroke="currentColor"
            strokeWidth="1.333"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <input
        style={{
          background: focused ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.08)",
          color: "white",
          border: focused ? "2px solid #3b82f6" : "2px solid transparent",
          borderRadius: "9999px",
          padding: "12px 40px",
          outline: "none",
          transition: "all 0.3s",
          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
          minWidth: "200px",
        }}
        placeholder={placeholder}
        required
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      <button
        type="reset"
        onClick={() => setValue("")}
        style={{
          position: "absolute",
          right: "12px",
          top: "50%",
          transform: "translateY(-50%)",
          padding: "4px",
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-gray-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          width={20}
          height={20}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </form>
  );
};

export default SearchNavInput;
