"use client";

import { ChevronDown } from "lucide-react";
import type { CareUnit } from "@/data/careUnits";
import { findPriceRow } from "@/data/careUnits";

/**
 * אקורדיון קטן "מה כלול?" (§8) — לא מציג רשימת קטגוריות בדויה, רק את
 * הטקסט החופשי הקיים כבר ב-hospitalPrices.ts (row.whatsIncluded), באותו
 * ניסוח בדיוק כמו בפאנל המורחב הקיים ב-HospitalPriceTable.tsx.
 */
export default function WhatsIncludedDetails({ unit }: { unit: CareUnit }) {
  const priceRow = unit.hasPriceRef ? findPriceRow(unit.name) : undefined;

  return (
    <details className="group rounded-xl border-2 border-mist-200 bg-mist-50/60 p-3.5">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-sm font-semibold text-ink">
        מה כלול?
        <ChevronDown className="h-4 w-4 text-ink/40 transition-transform duration-300 group-open:rotate-180" strokeWidth={2.5} />
      </summary>
      <p className="mt-2 text-sm leading-relaxed text-ink/70">
        {priceRow?.whatsIncluded ?? "לא פורסם — יש לברר מול היחידה"}
      </p>
    </details>
  );
}
