"use client";

import React, { useState } from "react";

interface SoftPillInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const SoftPillInput: React.FC<SoftPillInputProps> = ({
  placeholder = "Username",
  value,
  onChange,
  className = "",
}) => {
  const [internalValue, setInternalValue] = useState(value ?? "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalValue(e.target.value);
    onChange?.(e.target.value);
  };

  return (
    <input
      placeholder={placeholder}
      name="text"
      type="text"
      value={internalValue}
      onChange={handleChange}
      className={className}
      style={{
        background: "none",
        border: "none",
        outline: "none",
        maxWidth: "190px",
        padding: "10px 20px",
        fontSize: "16px",
        borderRadius: "9999px",
        boxShadow: "inset 2px 5px 10px rgb(5,5,5)",
        color: "#fff",
        margin: "10px",
      }}
    />
  );
};

export default SoftPillInput;
