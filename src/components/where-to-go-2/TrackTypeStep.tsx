"use client";

import { useState } from "react";
import { Banknote, Building2, ChevronDown, HeartHandshake, LayoutGrid } from "lucide-react";

export type TrackFilter = "public" | "private" | "subsidized" | "all";

const TRACKS: { value: TrackFilter; label: string; icon: typeof Building2 }[] = [
  { value: "public", label: "ציבורי", icon: Building2 },
  { value: "private", label: "פרטי", icon: Banknote },
  { value: "subsidized", label: "מסלולים מסובסדים/בהסדר", icon: HeartHandshake },
  { value: "all", label: "תראי לי את כל האפשרויות", icon: LayoutGrid },
];

interface TrackTypeStepProps {
  value: TrackFilter;
  onChange: (value: TrackFilter) => void;
}

/** §3: סוג המסגרת (ציבורי/פרטי) ואופן המימון (מסובסד/הסדר) הם שני ממדים שונים בכוונה — לכן 4 כפתורים, לא 2 */
export default function TrackTypeStep({ value, onChange }: TrackTypeStepProps) {
  const [showExplainer, setShowExplainer] = useState(false);

  return (
    <div className="mt-5">
      <h3 className="text-sm font-bold text-ink">איזה סוג אפשרויות תרצי לראות?</h3>
      <div className="mt-2.5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {TRACKS.map((t) => {
          const Icon = t.icon;
          const isActive = value === t.value;
          return (
            <button
              key={t.value}
              type="button"
              onClick={() => onChange(t.value)}
              className={`flex min-h-[44px] items-center gap-2 rounded-2xl border-2 p-3 text-right text-sm font-bold transition-all duration-200 ${
                isActive
                  ? "border-teal-300 bg-teal-50/70 ring-2 ring-teal-200 text-ink"
                  : "border-mist-200 bg-white text-ink/70 hover:border-teal-200 hover:bg-teal-50/30"
              }`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                  isActive ? "bg-teal-600 text-white" : "bg-mist-100 text-deep"
                }`}
                aria-hidden="true"
              >
                <Icon className="h-3.5 w-3.5" strokeWidth={2} />
              </span>
              {t.label}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => setShowExplainer((v) => !v)}
        className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-ink/50 underline-offset-4 hover:text-teal-700 hover:underline"
      >
        לא בטוחה מה ההבדל?
        <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${showExplainer ? "rotate-180" : ""}`} strokeWidth={2.5} />
      </button>
      {showExplainer && (
        <div className="mt-2 rounded-xl bg-mist-50 p-3.5 text-xs leading-relaxed text-ink/65">
          <p>
            <span className="font-semibold text-ink/80">ציבורי:</span> עוברות את כל התהליך ביחידת IVF ציבורית ומשלמות
            ישירות לבית החולים.
          </p>
          <p className="mt-1.5">
            <span className="font-semibold text-ink/80">פרטי:</span> בוחרות רופא/ת פוריות פרטי/ת, והשאיבה מתבצעת ביחידה
            פרטית.
          </p>
          <p className="mt-1.5">
            <span className="font-semibold text-ink/80">מסובסד/בהסדר:</span> חלק מהעלות ממומן דרך הביטוח המשלים של
            הקופה או הסדר ישיר בין הקופה ליחידה.
          </p>
        </div>
      )}
    </div>
  );
}
