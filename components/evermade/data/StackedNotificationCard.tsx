"use client";

import React, { useState } from "react";

interface Notification {
  title: string;
  time: string;
  message: string;
  meta?: string;
  icon?: "clock" | "mail" | "user";
  initials?: string;
}

interface StackedNotificationCardProps {
  notifications?: Notification[];
  className?: string;
}

const defaultNotifications: Notification[] = [
  {
    title: "Meeting Reminder",
    time: "now",
    message: "Team standup starts in 15 minutes",
    meta: "Conference Room A • Zoom Link Available",
    icon: "clock",
  },
  {
    title: "New Email",
    time: "2m",
    message: "Project update from Sarah Johnson",
    icon: "mail",
  },
  {
    title: "John Doe",
    time: "5m",
    message: "Hey! Are we still on for lunch today?",
    initials: "JD",
  },
];

const NotifIcon = ({ type }: { type?: string }) => {
  if (type === "clock") {
    return (
      <svg width={20} height={20} fill="rgba(255,255,255,0.8)" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
      </svg>
    );
  }
  if (type === "mail") {
    return (
      <>
        <svg width={18} height={18} fill="rgba(255,255,255,0.8)" viewBox="0 0 20 20">
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
        </svg>
      </>
    );
  }
  return null;
};

const StackedNotificationCard: React.FC<StackedNotificationCardProps> = ({
  notifications = defaultNotifications,
  className = "",
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const positions = [
    { zIndex: 30, top: 0, scale: 1, opacity: 1 },
    { zIndex: 20, top: 20, scale: 0.94, opacity: 0.75 },
    { zIndex: 10, top: 40, scale: 0.88, opacity: 0.5 },
  ];

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "380px",
        height: "160px",
        margin: "0 auto",
      }}
    >
      {notifications.slice(0, 3).map((notif, i) => {
        const pos = positions[i];
        const isHovered = hoveredIdx === i;
        return (
          <div
            key={i}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
            style={{
              position: "absolute",
              width: "100%",
              cursor: "pointer",
              transition: "all 0.3s ease-out",
              backdropFilter: "blur(20px)",
              borderRadius: "20px",
              zIndex: pos.zIndex,
              top: pos.top,
              transform: isHovered
                ? `translateY(-4px) scale(${pos.scale})`
                : `scale(${pos.scale})`,
              opacity: isHovered ? Math.min(pos.opacity + 0.15, 1) : pos.opacity,
              background: `rgba(255,255,255,${0.08 - i * 0.02})`,
              border: `1px solid rgba(255,255,255,${0.15 - i * 0.03})`,
            }}
          >
            <div
              style={{
                position: "relative",
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                height: "80px",
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  backdropFilter: "blur(10px)",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#ffffff",
                }}
              >
                {notif.initials ? notif.initials : <NotifIcon type={notif.icon} />}
              </div>
              {/* Body */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                  <div style={{ fontSize: "15px", fontWeight: 600, color: "#ffffff", lineHeight: 1.2 }}>{notif.title}</div>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", fontWeight: 400 }}>{notif.time}</div>
                </div>
                <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.8)", lineHeight: 1.3, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                  {notif.message}
                </div>
                {notif.meta && (
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", marginTop: "2px" }}>
                    {notif.meta}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StackedNotificationCard;
