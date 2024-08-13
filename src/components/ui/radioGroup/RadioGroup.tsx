// src/components/ui/radioGroup/RadioGroup.tsx
import React from 'react';

interface RadioGroupProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}

const RadioGroup: React.FC<RadioGroupProps> = ({ options, value, onChange }) => {
  return (
    <div>
      {options.map((option) => (
        <label key={option.value} className="block text-sm font-medium text-gray-700">
          <input
            type="radio"
            name="radio-group"
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="mr-2"
          />
          {option.label}
        </label>
      ))}
    </div>
  );
};

export default RadioGroup;