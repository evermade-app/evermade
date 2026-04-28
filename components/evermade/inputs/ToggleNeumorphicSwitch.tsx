"use client";

import React, { useState } from "react";

interface ToggleNeumorphicSwitchProps {
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}

const ToggleNeumorphicSwitch: React.FC<ToggleNeumorphicSwitchProps> = ({
  defaultChecked = false,
  onChange,
  className = "",
}) => {
  const [checked, setChecked] = useState(defaultChecked);

  const handleChange = () => {
    const next = !checked;
    setChecked(next);
    onChange?.(next);
  };

  return (
    <div className={className}>
      <style>{`
        @keyframes evermade-track-vibrate {
          0%, 100% { transform: translateZ(0) translateY(0); }
          50% { transform: translateZ(0) translateY(-1px); }
        }
        @keyframes evermade-knob-pulse {
          0%, 100% { transform: translateZ(25px) scale(1); }
          50% { transform: translateZ(25px) scale(1.06); }
        }
        @keyframes evermade-track-etch {
          0%, 100% { box-shadow: inset 0 0 8px rgba(255,140,0,0.2); }
          50% { box-shadow: inset 0 0 12px rgba(255,140,0,0.4); }
        }
        .evermade-neumorph-toggle {
          perspective: 1800px;
          position: relative;
          cursor: pointer;
        }
        .evermade-neumorph-btn {
          position: relative;
          width: 150px;
          height: 70px;
          background: linear-gradient(145deg, #4a4a3a, #5a5a4a);
          border-radius: 35px;
          box-shadow: 10px 10px 20px rgba(0,0,0,0.5), -10px -10px 20px rgba(255,140,0,0.1), inset 0 3px 6px rgba(255,255,255,0.1), inset 0 -3px 6px rgba(0,0,0,0.6);
          transition: all 0.5s cubic-bezier(0.68,-0.55,0.265,1.55);
          transform-style: preserve-3d;
          animation: evermade-track-vibrate 0.1s ease-in-out 0.2s 3;
        }
        .evermade-neumorph-btn.checked {
          background: linear-gradient(145deg, #3a4a3a, #4a5a4a);
          box-shadow: 10px 10px 20px rgba(0,0,0,0.5), -10px -10px 20px rgba(154,205,50,0.1), inset 0 3px 6px rgba(255,255,255,0.1), inset 0 -3px 6px rgba(0,0,0,0.6);
        }
        .evermade-neumorph-knob {
          position: absolute;
          width: 64px;
          height: 64px;
          background: radial-gradient(circle at 30% 20%, #ff4500, #ff8c00);
          border-radius: 50%;
          top: 3px;
          left: 3px;
          box-shadow: 5px 5px 10px rgba(0,0,0,0.6), -5px -5px 10px rgba(255,255,255,0.15), inset 0 -2px 5px rgba(0,0,0,0.7), inset 0 2px 5px rgba(255,255,255,0.3);
          transition: all 0.5s cubic-bezier(0.77,-0.4,0.3,1.4);
          transform: translateZ(25px) scale(1);
          z-index: 2;
        }
        .evermade-neumorph-knob.checked {
          left: 82px;
          background: radial-gradient(circle at 30% 20%, #9acd32, #32cd32);
          transform: translateZ(25px) rotate(360deg) scale(1.08);
          animation: evermade-knob-pulse 1.6s infinite ease-in-out;
        }
        .evermade-neumorph-glow {
          position: absolute;
          width: 70px;
          height: 70px;
          background: radial-gradient(circle, rgba(255,140,0,0.3), transparent);
          border-radius: 50%;
          top: 0;
          left: 0;
          opacity: 0;
          transition: all 0.4s;
          transform: translateZ(20px);
          pointer-events: none;
        }
        .evermade-neumorph-glow.checked {
          background: radial-gradient(circle, rgba(154,205,50,0.3), transparent);
          left: 76px;
          opacity: 0.5;
        }
      `}</style>
      <label className="evermade-neumorph-toggle" onClick={handleChange}>
        <div className={`evermade-neumorph-btn ${checked ? "checked" : ""}`}>
          <div className={`evermade-neumorph-glow ${checked ? "checked" : ""}`} />
          <div className={`evermade-neumorph-knob ${checked ? "checked" : ""}`} />
        </div>
      </label>
    </div>
  );
};

export default ToggleNeumorphicSwitch;
