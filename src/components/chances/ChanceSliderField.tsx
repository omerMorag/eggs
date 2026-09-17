"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Minus, Plus } from "lucide-react";
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
  /**
   * שדה המספר עובד על טיוטת טקסט מקומית (draft) ולא על ה-value המחושב
   * ישירות. הבאג שהיה כאן קודם: כל הקשה הייתה מבצעת clamp מיידי ל-min/max
   * — כך שהקלדת גיל דו-ספרתי כמו "27" (כש-min הוא 25) הייתה תקועה על 25
   * כבר אחרי הספרה הראשונה, ולא הייתה דרך להקליד את הספרה השנייה. עכשיו
   * מותר להקליד/למחוק חופשי (כולל ריקון השדה זמנית), וה-clamp וה-onChange
   * קורים רק כשעוזבים את השדה (blur) או לוחצים Enter.
   */
  const [draft, setDraft] = useState(String(value));

  useEffect(() => {
    setDraft(String(value));
  }, [value]);

  const commitDraft = () => {
    const parsed = Number(draft.replace(/[^\d]/g, ""));
    if (draft === "" || Number.isNaN(parsed)) {
      setDraft(String(value));
      return;
    }
    const clamped = clamp(parsed, min, max);
    setDraft(String(clamped));
    if (clamped !== value) onChange(clamped);
  };

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-ink">
        {label}
      </label>
      {helperText && <p className="mt-1 text-xs leading-relaxed text-ink/55">{helperText}</p>}

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div dir="ltr" className="flex-1">
          <input
            id={id}
            type="range"
            min={min}
            max={max}
            step={1}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-mist-200 accent-teal-600"
          />
          <div className="mt-1 flex justify-between text-xs text-ink/40">
            <span>{min}</span>
            <span>{max}</span>
          </div>
        </div>

        <div dir="ltr" className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={() => onChange(clamp(value - 1, min, max))}
            disabled={value <= min}
            aria-label="הפחתה ב-1"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-mist-200 bg-white text-ink/70 transition-colors hover:border-teal-300 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Minus className="h-4 w-4" strokeWidth={2.5} />
          </button>
          <input
            type="number"
            inputMode="numeric"
            min={min}
            max={max}
            value={draft}
            onChange={(e) => setDraft(e.target.value.replace(/[^\d]/g, ""))}
            onBlur={commitDraft}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.currentTarget.blur();
              }
            }}
            aria-label={label}
            className="w-16 shrink-0 rounded-xl border-2 border-mist-200 bg-white px-2 py-2.5 text-center text-base font-bold text-ink focus:border-teal-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => onChange(clamp(value + 1, min, max))}
            disabled={value >= max}
            aria-label="הוספה ב-1"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-mist-200 bg-white text-ink/70 transition-colors hover:border-teal-300 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
