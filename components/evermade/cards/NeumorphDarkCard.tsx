import React from "react";

interface NeumorphDarkCardProps {
  children?: React.ReactNode;
  className?: string;
}

const NeumorphDarkCard: React.FC<NeumorphDarkCardProps> = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={className}
      style={{
        width: "190px",
        height: "254px",
        borderRadius: "30px",
        background: "#212121",
        boxShadow: "15px 15px 30px rgb(25, 25, 25), -15px -15px 30px rgb(60, 60, 60)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </div>
  );
};

export default NeumorphDarkCard;
