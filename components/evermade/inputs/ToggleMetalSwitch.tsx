"use client";

import React, { useState } from "react";

interface ToggleMetalSwitchProps {
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}

const ToggleMetalSwitch: React.FC<ToggleMetalSwitchProps> = ({
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
        .evermade-metal-toggle-border {
          border: 2px solid #f0ebeb;
          border-radius: 130px;
          padding: 1px 2px;
          background: linear-gradient(to bottom right, white, rgba(220,220,220,.5)), white;
          box-shadow: 0 0 0 2px #fbfbfb;
          cursor: pointer;
          display: flex;
          align-items: center;
          width: fit-content;
        }
        .evermade-metal-label {
          position: relative;
          display: inline-block;
          width: 65px;
          height: 20px;
          background: #d13613;
          border-radius: 80px;
          cursor: pointer;
          box-shadow: inset 0 0 16px rgba(0,0,0,.3);
          transition: background .5s;
        }
        .evermade-metal-label.checked {
          background: #13d162;
        }
        .evermade-metal-handle {
          position: absolute;
          top: -8px;
          left: -10px;
          width: 35px;
          height: 35px;
          border: 1px solid #e5e5e5;
          background: repeating-radial-gradient(circle at 50% 50%, rgba(200,200,200,.2) 0%, rgba(200,200,200,.2) 2%, transparent 2%, transparent 3%, rgba(200,200,200,.2) 3%, transparent 3%), conic-gradient(white 0%, silver 10%, white 35%, silver 45%, white 60%, silver 70%, white 80%, silver 95%, white 100%);
          border-radius: 50%;
          box-shadow: 3px 5px 10px 0 rgba(0,0,0,.4);
          transition: left .4s;
        }
        .evermade-metal-handle.checked {
          left: calc(100% - 35px + 10px);
        }
      `}</style>
      <div className="evermade-metal-toggle-border" onClick={handleChange}>
        <label className={`evermade-metal-label ${checked ? "checked" : ""}`}>
          <div className={`evermade-metal-handle ${checked ? "checked" : ""}`} />
        </label>
      </div>
    </div>
  );
};

export default ToggleMetalSwitch;
