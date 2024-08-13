import React from 'react';

interface SliderProps {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  marks?: { value: number; label: string }[];
}

export const Slider: React.FC<SliderProps> = ({ min, max, step, value, onChange, marks }) => {
  return (
    <div className="slider-container">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="slider"
      />
      {marks && (
        <div className="slider-marks flex justify-between mt-2">
          {marks.map((mark) => (
            <span key={mark.value} className={`slider-mark ${value === mark.value ? 'active' : ''}`}>
              {mark.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};