"use client";

import { useState } from "react";

type View = "main" | "payments" | "device" | "ai";

const DEVICE_GROUPS = [
  {
    label: "Media",
    items: [
      "Camera", "Image Picker", "Image Manipulator", "Audio", "Video",
      "Video Thumbnails", "Media Library", "Live Photo", "Screen Capture", "View Shot",
    ],
  },
  { label: "Graphics", items: ["Blur View", "Linear Gradient"] },
  {
    label: "Sensors",
    items: [
      "Accelerometer", "Gyroscope", "Device Motion",
      "Barometer", "Magnetometer", "Pedometer", "Light Sensor",
    ],
  },
  { label: "Location", items: ["Location", "Maps"] },
  {
    label: "Device",
    items: [
      "Battery", "Brightness", "Network", "Haptics", "Bluetooth",
      "Keep Awake", "Screen Orientation", "Status Bar", "Navigation Bar",
    ],
  },
  {
    label: "Communication",
    items: ["Notifications", "SMS", "Mail Composer", "Sharing", "Contacts", "Calendar"],
  },
  { label: "Storage", items: ["File System", "Secure Store", "SQLite", "Async Storage"] },
  {
    label: "Authentication",
    items: ["Biometric Auth", "Sign in with Apple", "Tracking Transparency"],
  },
  {
    label: "Utilities",
    items: [
      "Clipboard", "Deep Linking", "In-App Browser", "Barcode Scanner",
      "Document Picker", "Print", "In-App Purchases", "Store Review", "Speech",
    ],
  },
];

const PAYMENT_INTEGRATIONS = [
  {
    name: "Stripe",
    desc: "Payments · Subscriptions · Billing",
    color: "#635BFF",
    initial: "S",
  },
  {
    name: "RevenueCat",
    desc: "In-app purchases · Subscription management",
    color: "#F26430",
    initial: "R",
  },
];

const AI_MODELS = [
  {
    name: "Claude",
    desc: "Anthropic · Opus 4 · Sonnet 4 · Haiku 4",
    color: "#c87941",
    initial: "C",
  },
  {
    name: "GPT",
    desc: "OpenAI · GPT-4o · GPT-4 Turbo",
    color: "#10a37f",
    initial: "G",
  },
  {
    name: "Gemini",
    desc: "Google · Flash · Pro · Ultra",
    color: "#4285f4",
    initial: "G",
  },
];

type Props = { onClose: () => void };

export default function PlusMenu({ onClose }: Props) {
  const [view, setView] = useState<View>("main");

  return (
    <>
      {/* Click-outside backdrop */}
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, zIndex: 99 }}
      />

      {/* Panel */}
      <div
        style={{
          position: "absolute",
          bottom: "calc(100% + 10px)",
          left: 0,
          width: 316,
          maxHeight: 524,
          borderRadius: 18,
          background: "rgba(7,7,16,0.97)",
          backdropFilter: "blur(48px) saturate(1.6)",
          WebkitBackdropFilter: "blur(48px) saturate(1.6)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: [
            "0 -4px 60px rgba(0,0,0,0.8)",
            "0 8px 40px rgba(0,0,0,0.5)",
            "inset 0 1px 0 rgba(255,255,255,0.09)",
            "inset 0 0 0 0.5px rgba(255,255,255,0.03)",
          ].join(", "),
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          zIndex: 100,
        }}
      >
        {view === "main" && <MainView setView={setView} />}
        {view === "payments" && (
          <PaymentsView back={() => setView("main")} />
        )}
        {view === "device" && <DeviceView back={() => setView("main")} />}
        {view === "ai" && <AIView back={() => setView("main")} />}
      </div>
    </>
  );
}

/* ─────────────────────── MAIN VIEW ─────────────────────── */

function MainView({ setView }: { setView: (v: View) => void }) {
  return (
    <div
      style={{
        overflowY: "auto",
        scrollbarWidth: "none",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "14px 16px 10px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.25)",
          }}
        >
          Command
        </span>
      </div>

      {/* ATTACH */}
      <div style={{ padding: "12px 12px 6px" }}>
        <SectionLabel>Attach</SectionLabel>
        <MenuRow
          iconBg="rgba(255,255,255,0.06)"
          icon={
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <rect x="1" y="1" width="13" height="13" rx="2.5" stroke="rgba(255,255,255,0.5)" strokeWidth="1.3"/>
              <circle cx="5" cy="5.5" r="1.5" fill="rgba(255,255,255,0.5)"/>
              <path d="M1.5 10.5l3-3 2.5 2.5 2.5-3 4 4" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          }
          label="Upload Image"
          desc="Add an image to your prompt"
        />
        <MenuRow
          iconBg="rgba(255,255,255,0.06)"
          icon={
            <svg width="13" height="15" viewBox="0 0 13 15" fill="none">
              <path d="M2 1h6l4 4v9a1 1 0 01-1 1H2a1 1 0 01-1-1V2a1 1 0 011-1z" stroke="rgba(255,255,255,0.5)" strokeWidth="1.3"/>
              <path d="M8 1v4h4" stroke="rgba(255,255,255,0.5)" strokeWidth="1.3"/>
              <path d="M4 8h5M4 11h3" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          }
          label="Attach File"
          desc="PDF, doc, or any media"
        />
      </div>

      <Divider />

      {/* INTEGRATIONS */}
      <div style={{ padding: "10px 12px 14px" }}>
        <SectionLabel>Integrations</SectionLabel>
        <MenuNavRow
          iconBg="rgba(99,91,255,0.12)"
          iconBorder="rgba(99,91,255,0.2)"
          icon={
            <svg width="15" height="13" viewBox="0 0 15 13" fill="none">
              <rect x="0.65" y="0.65" width="13.7" height="11.7" rx="2.35" stroke="#635BFF" strokeWidth="1.3"/>
              <path d="M0.65 4.5h13.7" stroke="#635BFF" strokeWidth="1.3"/>
              <circle cx="3.5" cy="8" r="1" fill="#635BFF"/>
            </svg>
          }
          label="Payments"
          desc="Stripe · RevenueCat"
          color="#635BFF"
          onClick={() => setView("payments")}
        />
        <MenuNavRow
          iconBg="rgba(124,92,252,0.1)"
          iconBorder="rgba(124,92,252,0.2)"
          icon={
            <svg width="13" height="15" viewBox="0 0 13 15" fill="none">
              <rect x="2" y="0.65" width="9" height="14" rx="2.35" stroke="#7c5cfc" strokeWidth="1.3"/>
              <circle cx="6.5" cy="2.5" r="0.8" fill="#7c5cfc"/>
              <rect x="3.5" y="5" width="6" height="1.2" rx="0.6" fill="#7c5cfc" fillOpacity="0.6"/>
              <rect x="3.5" y="7.5" width="4" height="1.2" rx="0.6" fill="#7c5cfc" fillOpacity="0.4"/>
              <rect x="2.5" y="13" width="8" height="1.2" rx="0.6" fill="#7c5cfc" fillOpacity="0.3"/>
            </svg>
          }
          label="Device"
          desc="60+ native capabilities"
          color="#7c5cfc"
          onClick={() => setView("device")}
        />
        <MenuNavRow
          iconBg="rgba(200,121,65,0.1)"
          iconBorder="rgba(200,121,65,0.2)"
          icon={
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M7.5 1L9.5 5.5H14L10.5 8.5L12 13L7.5 10L3 13L4.5 8.5L1 5.5H5.5L7.5 1Z" stroke="#c87941" strokeWidth="1.3" strokeLinejoin="round"/>
            </svg>
          }
          label="AI"
          desc="Claude · GPT · Gemini"
          color="#c87941"
          onClick={() => setView("ai")}
        />
      </div>
    </div>
  );
}

/* ─────────────────────── PAYMENTS VIEW ─────────────────────── */

function PaymentsView({ back }: { back: () => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", maxHeight: 524 }}>
      <PanelHeader title="Payments" back={back} />
      <div
        style={{
          padding: "10px 14px 14px",
          overflowY: "auto",
          scrollbarWidth: "none",
        }}
      >
        <p
          style={{
            margin: "0 0 14px",
            fontSize: 11,
            color: "rgba(255,255,255,0.28)",
            lineHeight: 1.6,
          }}
        >
          Add payment processing to your generated app.
        </p>
        {PAYMENT_INTEGRATIONS.map((item) => (
          <IntegrationCard key={item.name} {...item} />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────── DEVICE VIEW ─────────────────────── */

function DeviceView({ back }: { back: () => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", maxHeight: 524 }}>
      <PanelHeader title="Device Integrations" back={back} />
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(255,255,255,0.07) transparent",
          paddingBottom: 14,
        }}
      >
        {DEVICE_GROUPS.map((group) => (
          <DeviceGroup
            key={group.label}
            label={group.label}
            items={group.items}
          />
        ))}
      </div>
    </div>
  );
}

function DeviceGroup({
  label,
  items,
}: {
  label: string;
  items: string[];
}) {
  return (
    <div>
      <div
        style={{
          fontSize: 9,
          fontWeight: 700,
          color: "rgba(255,255,255,0.2)",
          letterSpacing: 1.2,
          textTransform: "uppercase",
          padding: "12px 16px 5px",
        }}
      >
        {label}
      </div>
      {items.map((item) => (
        <DeviceItem key={item} name={item} />
      ))}
    </div>
  );
}

function DeviceItem({ name }: { name: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "6px 16px",
        cursor: "pointer",
        background: hovered ? "rgba(124,92,252,0.08)" : "transparent",
        transition: "background 0.12s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
        <div
          style={{
            width: 5,
            height: 5,
            borderRadius: 2,
            background: hovered ? "#7c5cfc" : "rgba(255,255,255,0.18)",
            transition: "background 0.12s ease",
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontSize: 12,
            color: hovered
              ? "rgba(255,255,255,0.88)"
              : "rgba(255,255,255,0.52)",
            transition: "color 0.12s ease",
          }}
        >
          {name}
        </span>
      </div>
      <span
        style={{
          fontSize: 10,
          fontWeight: 600,
          color: hovered ? "rgba(124,92,252,0.8)" : "transparent",
          transition: "color 0.12s ease",
        }}
      >
        Add
      </span>
    </div>
  );
}

/* ─────────────────────── AI VIEW ─────────────────────── */

function AIView({ back }: { back: () => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", maxHeight: 524 }}>
      <PanelHeader title="AI Models" back={back} />
      <div
        style={{
          padding: "10px 14px 14px",
          overflowY: "auto",
          scrollbarWidth: "none",
        }}
      >
        <p
          style={{
            margin: "0 0 14px",
            fontSize: 11,
            color: "rgba(255,255,255,0.28)",
            lineHeight: 1.6,
          }}
        >
          Connect an AI engine to power your generated app.
        </p>
        {AI_MODELS.map((model) => (
          <IntegrationCard key={model.name} {...model} />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────── SHARED COMPONENTS ─────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 9,
        fontWeight: 700,
        color: "rgba(255,255,255,0.22)",
        letterSpacing: 1.2,
        textTransform: "uppercase",
        marginBottom: 6,
        paddingLeft: 2,
      }}
    >
      {children}
    </div>
  );
}

function Divider() {
  return (
    <div
      style={{
        height: 1,
        background: "rgba(255,255,255,0.06)",
        margin: "2px 0",
      }}
    />
  );
}

function PanelHeader({ title, back }: { title: string; back: () => void }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "13px 14px 12px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        flexShrink: 0,
      }}
    >
      <button
        type="button"
        onClick={back}
        style={{
          width: 26,
          height: 26,
          borderRadius: 8,
          border: "1px solid rgba(255,255,255,0.1)",
          background: "rgba(255,255,255,0.04)",
          color: "rgba(255,255,255,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          fontSize: 13,
        }}
      >
        ←
      </button>
      <span
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: "rgba(255,255,255,0.78)",
        }}
      >
        {title}
      </span>
    </div>
  );
}

function MenuRow({
  icon,
  iconBg,
  label,
  desc,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  desc: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 11,
        padding: "8px 10px",
        borderRadius: 11,
        background: hovered ? "rgba(255,255,255,0.05)" : "transparent",
        cursor: "pointer",
        transition: "background 0.12s ease",
        marginBottom: 2,
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 10,
          background: iconBg,
          border: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <div
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: "rgba(255,255,255,0.82)",
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: 11,
            color: "rgba(255,255,255,0.32)",
            marginTop: 1,
          }}
        >
          {desc}
        </div>
      </div>
    </div>
  );
}

function MenuNavRow({
  icon,
  iconBg,
  iconBorder,
  label,
  desc,
  color,
  onClick,
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconBorder: string;
  label: string;
  desc: string;
  color: string;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 11,
        padding: "8px 10px",
        borderRadius: 11,
        background: hovered ? `${color}0d` : "transparent",
        cursor: "pointer",
        transition: "all 0.12s ease",
        marginBottom: 2,
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 10,
          background: hovered ? `${color}18` : iconBg,
          border: `1px solid ${hovered ? `${color}30` : iconBorder}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transition: "all 0.12s ease",
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: "rgba(255,255,255,0.82)",
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: 11,
            color: "rgba(255,255,255,0.32)",
            marginTop: 1,
          }}
        >
          {desc}
        </div>
      </div>
      <svg
        width="6"
        height="10"
        viewBox="0 0 6 10"
        fill="none"
        style={{ flexShrink: 0 }}
      >
        <path
          d="M1 1l4 4-4 4"
          stroke={hovered ? color : "rgba(255,255,255,0.2)"}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function IntegrationCard({
  name,
  desc,
  color,
  initial,
}: {
  name: string;
  desc: string;
  color: string;
  initial: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "11px 12px",
        borderRadius: 13,
        background: hovered ? `${color}12` : "rgba(255,255,255,0.03)",
        border: `1px solid ${hovered ? `${color}2a` : "rgba(255,255,255,0.07)"}`,
        cursor: "pointer",
        transition: "all 0.15s ease",
        marginBottom: 8,
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: `${color}1a`,
          border: `1px solid ${color}38`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 14,
          fontWeight: 700,
          color,
          flexShrink: 0,
        }}
      >
        {initial}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "rgba(255,255,255,0.88)",
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontSize: 11,
            color: "rgba(255,255,255,0.33)",
            marginTop: 2,
          }}
        >
          {desc}
        </div>
      </div>
      <div
        style={{
          fontSize: 10,
          fontWeight: 600,
          color: hovered ? color : "rgba(255,255,255,0.18)",
          transition: "color 0.15s ease",
          flexShrink: 0,
        }}
      >
        {hovered ? "Connect" : "→"}
      </div>
    </div>
  );
}
