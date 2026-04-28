export default function PreviewNotFound() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#08080F",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
      textAlign: "center",
      padding: 24,
    }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>📱</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 8, letterSpacing: -0.4 }}>
        Preview not found
      </div>
      <div style={{ fontSize: 14, color: "rgba(255,255,255,0.38)", marginBottom: 32, maxWidth: 280, lineHeight: 1.55 }}>
        This app preview doesn&apos;t exist or was cleared from the server. Re-share from the builder to get a fresh link.
      </div>
      <a
        href="/"
        style={{
          padding: "11px 24px",
          borderRadius: 12,
          background: "linear-gradient(135deg, #7C5CFC, #4878FF)",
          color: "#fff",
          fontSize: 14,
          fontWeight: 700,
          textDecoration: "none",
          boxShadow: "0 4px 20px rgba(124,92,252,0.4)",
        }}
      >
        Build your own app →
      </a>
    </div>
  );
}
