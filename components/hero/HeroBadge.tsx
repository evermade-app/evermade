export default function HeroBadge() {
  return (
    <div
      className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm text-white/90"
      style={{
        background: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(16px)",
        boxShadow: "0 2px 16px rgba(0,0,0,0.18)",
      }}
    >
      <span style={{ color: "#9f7aea" }}>✦</span>
      <span>Introducing Evermade</span>
      <span className="opacity-40">·</span>
      <span className="opacity-70">Create apps instantly</span>
    </div>
  );
}
