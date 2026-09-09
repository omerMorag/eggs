"use client";

import type { ReactNode } from "react";
import { clamp } from "@/data/chanceModel";

interface ChanceSliderFieldProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  helperText?: ReactNode;
}

export default function ChanceSliderField({
  id,
  label,
  value,
  min,
  max,
  onChange,
  helperText,
}: ChanceSliderFieldProps) {
  const handleNumberChange = (raw: string) => {
    if (raw === "") return;
    const parsed = Number(raw.replace(/[^\d]/g, ""));
    if (Number.isNaN(parsed)) return;
    onChange(clamp(parsed, min, max));
  };

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-ink">
        {label}
      </label>
      {helperText && <p className="mt-1 text-xs leading-relaxed text-ink/55">{helperText}</p>}

      <div dir="ltr" className="mt-3 flex items-center gap-4">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-mist-200 accent-teal-600"
        />
        <input
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={value}
          onChange={(e) => handleNumberChange(e.target.value)}
          aria-label={label}
          className="w-20 shrink-0 rounded-xl border-2 border-mist-200 bg-white px-2 py-1.5 text-center text-base font-bold text-ink focus:border-teal-400 focus:outline-none"
        />
      </div>
      <div dir="ltr" className="mt-1 flex justify-between text-xs text-ink/40">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
