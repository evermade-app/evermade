"use client";

import React from "react";

interface SecondarySimpleButtonProps {
  label?: string;
  sublabel?: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const SecondarySimpleButton: React.FC<SecondarySimpleButtonProps> = ({
  label = "Hello",
  sublabel = "simple button",
  onClick,
  disabled = false,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-block cursor-pointer items-center justify-center rounded-xl border-[1.58px] border-zinc-600 bg-zinc-950 px-5 py-3 font-medium text-slate-200 shadow-md transition-all duration-300 hover:[transform:translateY(-.335rem)] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {label}
      <span className="text-slate-300/85"> — {sublabel}</span>
    </button>
  );
};

export default SecondarySimpleButton;
