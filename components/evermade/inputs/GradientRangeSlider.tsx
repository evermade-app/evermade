"use client";

import React, { useState } from "react";

interface GradientRangeSliderProps {
  min?: number;
  max?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  className?: string;
}

const GradientRangeSlider: React.FC<GradientRangeSliderProps> = ({
  min = 0,
  max = 100,
  defaultValue = 50,
  onChange,
  className = "",
}) => {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = Number(e.target.value);
    setValue(newVal);
    onChange?.(newVal);
  };

  return (
    <div className={className}>
      <style>{`
        .evermade-gradient-slider {
          -webkit-appearance: none;
          width: 100%;
          height: 10px;
          border-radius: 5px;
          background-image: linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%);
          outline: none;
          opacity: 0.85;
          transition: opacity .2s;
        }
        .evermade-gradient-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-image: linear-gradient(160deg, #4900f5 0%, #80D0C7 100%);
          cursor: pointer;
        }
        .evermade-gradient-slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-image: linear-gradient(160deg, #0093E9 0%, #80D0C7 100%);
          cursor: pointer;
        }
      `}</style>
      <input
        id="evermade-range"
        className="evermade-gradient-slider"
        defaultValue={value}
        max={max}
        min={min}
        type="range"
        onChange={handleChange}
      />
    </div>
  );
};

export default GradientRangeSlider;
