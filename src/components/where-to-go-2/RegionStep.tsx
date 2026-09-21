"use client";

import { MapPin } from "lucide-react";
import type { Region } from "@/data/careUnits";

export type RegionFilter = Region | "all";

/** שרון הושמט בכוונה — בנתונים הקיימים אין תיוג אזור כזה במקור אמין (ר' תוכנית WHERE TO DO 2.0) */
const REGIONS: { value: RegionFilter; label: string }[] = [
  { value: "מרכז", label: "מרכז" },
  { value: "ירושלים", label: "ירושלים" },
  { value: "צפון", label: "צפון" },
  { value: "דרום", label: "דרום" },
  { value: "all", label: "לא משנה לי" },
];

function pillClass(active: boolean) {
  return `min-h-[40px] rounded-full px-4 text-sm font-semibold transition-colors duration-200 ${
    active ? "bg-teal-600 text-ink shadow-sm" : "bg-mist-100 text-ink/60 hover:bg-mist-200"
  }`;
}

interface RegionStepProps {
  value: RegionFilter;
  onChange: (value: RegionFilter) => void;
}

/** §2: "איפה נוח לך לעבור את התהליך?" — צ'יפים, לא מסך נפרד */
export default function RegionStep({ value, onChange }: RegionStepProps) {
  return (
    <div>
      <h3 className="flex items-center gap-1.5 text-sm font-bold text-ink">
        <MapPin className="h-4 w-4 text-teal-700" strokeWidth={2} />
        איפה נוח לך לעבור את התהליך?
      </h3>
      <div className="mt-2.5 flex flex-wrap gap-2">
        {REGIONS.map((r) => (
          <button key={r.value} type="button" onClick={() => onChange(r.value)} className={pillClass(value === r.value)}>
            {r.label}
          </button>
        ))}
      </div>
    </div>
  );
}
