"use client";

import React, { useState } from "react";

interface EmojiReaction {
  emoji: string;
  label: string;
}

interface EmojiReactionMenuProps {
  reactions?: EmojiReaction[];
  onReact?: (emoji: string, label: string) => void;
  className?: string;
}

const defaultReactions: EmojiReaction[] = [
  { emoji: "👍", label: "Like" },
  { emoji: "👏🏻", label: "Cheer" },
  { emoji: "🎉", label: "Celebrate" },
  { emoji: "✨", label: "Appreciate" },
  { emoji: "🙂", label: "Smile" },
];

const EmojiReactionMenu: React.FC<EmojiReactionMenuProps> = ({
  reactions = defaultReactions,
  onReact,
  className = "",
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div
      className={`flex justify-start text-2xl items-center shadow-xl z-10 bg-[#191818] gap-2 p-2 rounded-full ${className}`}
    >
      {reactions.map((r, i) => (
        <div key={i} style={{ position: "relative" }}>
          {/* Tooltip */}
          {hoveredIdx === i && (
            <div
              style={{
                position: "absolute",
                top: "-36px",
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "black",
                color: "white",
                padding: "3px 8px",
                borderRadius: "6px",
                fontSize: "0.6rem",
                whiteSpace: "nowrap",
                pointerEvents: "none",
              }}
            >
              {r.label}
            </div>
          )}
          <button
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
            onClick={() => onReact?.(r.emoji, r.label)}
            style={{
              cursor: "pointer",
              backgroundColor: "#191818",
              borderRadius: "9999px",
              padding: "8px 12px",
              border: "none",
              transform: hoveredIdx === i ? "translateY(-20px) scale(1.25)" : "none",
              transition: "all 0.3s ease",
              display: "block",
            }}
          >
            {r.emoji}
          </button>
        </div>
      ))}
    </div>
  );
};

export default EmojiReactionMenu;
