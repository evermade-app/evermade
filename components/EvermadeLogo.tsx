"use client";

/**
 * [evermade] wordmark.
 * Rendered as styled text — font-stack chosen to match the original logo's
 * monospace bracket aesthetic. Pass `height` to scale it.
 */

interface Props {
  height?: number;
  color?: string;
  className?: string;
}

export default function EvermadeLogo({
  height = 26,
  color = "white",
  className = "",
}: Props) {
  return (
    <span
      aria-label="Evermade"
      role="img"
      className={className}
      style={{
        display:     "inline-flex",
        alignItems:  "center",
        fontFamily:  "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Courier New', Courier, monospace",
        fontSize:    height,
        fontWeight:  700,
        lineHeight:  1,
        color,
        letterSpacing: "0.02em",
        userSelect:  "none",
        whiteSpace:  "nowrap",
      }}
    >
      {/* Brackets rendered slightly larger for the brand's visual weight */}
      <span style={{ fontSize: height * 1.15, fontWeight: 900, opacity: 0.95 }}>[</span>
      <span>evermade</span>
      <span style={{ fontSize: height * 1.15, fontWeight: 900, opacity: 0.95 }}>]</span>
    </span>
  );
}
