"use client";

import React, { useState, useRef } from "react";

interface SearchGlassInputProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
  className?: string;
}

const SearchGlassInput: React.FC<SearchGlassInputProps> = ({
  placeholder = "Search...",
  onSearch,
  className = "",
}) => {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = () => {
    if (onSearch) onSearch(value);
  };

  return (
    <form
      className={`form relative ${className}`}
      onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
    >
      <button
        type="button"
        className="absolute left-2 -translate-y-1/2 top-1/2 p-1"
        onClick={() => inputRef.current?.focus()}
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
        ref={inputRef}
        className="input rounded-full px-8 py-3 border-2 border-transparent focus:outline-none focus:border-blue-500 placeholder-gray-400 transition-all duration-300 shadow-md"
        placeholder={placeholder}
        required
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          background: focused ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.07)",
          color: "white",
        }}
      />
      <button
        type="reset"
        className="absolute right-3 -translate-y-1/2 top-1/2 p-1"
        onClick={() => setValue("")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-gray-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </form>
  );
};

export default SearchGlassInput;
