// src/components/ui/numberInput/NumberInput.tsx
import React from 'react';
import Label from '@/components/ui/typography/Label';
import { Input } from '@/components/ui/input';

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  unit: string;
}

const NumberInput: React.FC<NumberInputProps> = ({ label, value, onChange, min, max, step, unit }) => (
  <div className="space-y-2">
    <Label htmlFor={label}>{label}</Label>
    <div className="flex items-center space-x-2">
      <Input
        id={label}
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        className="w-24"
      />
      <span className="text-sm text-gray-500 w-12">{unit}</span>
    </div>
  </div>
);

export default NumberInput;