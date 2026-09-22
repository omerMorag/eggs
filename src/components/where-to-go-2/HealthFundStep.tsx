"use client";

import { HeartHandshake } from "lucide-react";
import type { HealthFund } from "@/data/careUnits";

export type HealthFundFilter = HealthFund | "all";

const FUNDS: { value: HealthFundFilter; label: string }[] = [
  { value: "כללית", label: "כללית" },
  { value: "מכבי", label: "מכבי" },
  { value: "מאוחדת", label: "מאוחדת" },
  { value: "לאומית", label: "לאומית" },
  { value: "all", label: "לא רוצה לסנן לפי קופה" },
];

function pillClass(active: boolean) {
  return `min-h-[40px] rounded-full px-4 text-sm font-semibold transition-colors duration-200 ${
    active ? "bg-teal-600 text-ink shadow-sm" : "bg-mist-100 text-ink/60 hover:bg-mist-200"
  }`;
}

interface HealthFundStepProps {
  value: HealthFundFilter;
  onChange: (value: HealthFundFilter) => void;
}

/**
 * שלב 1 באשף החדש (תיקון-שורש WHERE TO DO): "באיזו קופה את?" — מוצג תמיד,
 * ראשון, בלי תנאי הצגה. זו השאלה היחידה על מימון; אין יותר שאלת
 * ציבורי/פרטי/מסובסד נפרדת (ראו TrackTypeStep.tsx שנמחק).
 */
export default function HealthFundStep({ value, onChange }: HealthFundStepProps) {
  return (
    <div>
      <h3 className="flex items-center gap-1.5 text-sm font-bold text-ink">
        <HeartHandshake className="h-4 w-4 text-teal-700" strokeWidth={2} />
        באיזו קופה את?
      </h3>
      <p className="mt-0.5 text-xs text-ink/50">
        הקופה והתוכנית המשלימה שלך יכולות להשפיע משמעותית על המחיר.
      </p>
      <div className="mt-2.5 flex flex-wrap gap-2">
        {FUNDS.map((f) => (
          <button key={f.value} type="button" onClick={() => onChange(f.value)} className={pillClass(value === f.value)}>
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}
