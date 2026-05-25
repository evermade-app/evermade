"use client";

const NAV_COLS = [
  {
    title: "Pages",
    links: [
      { label: "Home", href: "/" },
      { label: "About us", href: "/about" },
      { label: "Features", href: "/features" },
      { label: "Integrations", href: "/integrations" },
      { label: "Blogs", href: "/blog" },
      { label: "Contact us", href: "/contact" },
    ],
  },
  {
    title: "Utility Pages",
    links: [
      { label: "Blog Details", href: "/blog" },
      { label: "Integrations Details", href: "/integrations" },
      { label: "404", href: "/404" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

const SOCIALS = [
  { href: "http://facebook.com/", src: "https://framerusercontent.com/images/mLCoQRTB0kKN35fs8NXdN4g3Uk.svg", alt: "Facebook" },
  { href: "https://x.com/", src: "https://framerusercontent.com/images/ZcNca1koi7Yfvv4TNFVxXXv8sE.svg", alt: "X" },
  { href: "http://linkedin.com/", src: "https://framerusercontent.com/images/GFdSTijuxrfepkItzyBqOD1K3ww.svg", alt: "LinkedIn" },
];

export default function FooterSection() {
  return (
    <footer style={{ background: "#090611", padding: "80px 30px 30px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Main row */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: 40, flexWrap: "wrap", marginBottom: 60 }}>
          {/* Brand column */}
          <div style={{ maxWidth: 305, display: "flex", flexDirection: "column", gap: 24 }}>
            <a href="/" style={{ textDecoration: "none" }}>
              <span style={{ fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: "-0.03em" }}>[evermade]</span>
            </a>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 400, opacity: 0.6, color: "#fff", lineHeight: "1.6em" }}>
              Turn your app idea into a complete, export-ready React Native app — powered by the world&apos;s best AI models.
            </p>
            <div style={{ display: "flex", gap: 16 }}>
              {SOCIALS.map((s) => (
                <a key={s.alt} href={s.href} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 24, height: 24 }}>
                  <img src={s.src} width={24} height={24} alt={s.alt} />
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          <div style={{ display: "flex", gap: 60, flexWrap: "wrap" }}>
            {NAV_COLS.map((col) => (
              <div key={col.title} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <span style={{ fontSize: 18, fontWeight: 500, color: "#fff" }}>{col.title}</span>
                {col.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    style={{
                      fontSize: 16, fontWeight: 400, color: "rgba(255,255,255,0.6)", textDecoration: "none",
                      transition: "color 0.5s cubic-bezier(0.44,0,0.56,1)",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,1)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.6)"; }}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 30, textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: 16, opacity: 0.6, color: "#fff" }}>
            Evermade 2025. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
