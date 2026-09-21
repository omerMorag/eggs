"use client";

import { X } from "lucide-react";
import FloatingPortal from "@/components/shared/FloatingPortal";
import type { CareUnit } from "@/data/careUnits";
import { findPriceRow } from "@/data/careUnits";

interface ComparisonTableProps {
  /** ריק = סגור. FloatingPortal נשאר mounted תמיד, כמו CareUnitDetail/StoryDetailView */
  units: CareUnit[];
  onClose: () => void;
  onRemove: (id: string) => void;
}

const ROWS: { key: string; label: string; get: (u: CareUnit, price: ReturnType<typeof findPriceRow>) => string }[] = [
  { key: "type", label: "סוג מסלול", get: (u) => (u.type === "public" ? "ציבורי" : "פרטי") },
  { key: "base", label: "מחיר בסיס", get: (u, price) => price?.cycle1Price ?? "יש לברר" },
  { key: "subsidized", label: "מחיר מסובסד", get: () => "יש לברר" },
  { key: "meds", label: "תרופות", get: () => "יש לברר" },
  { key: "storage", label: "אחסון", get: () => "יש לברר" },
  { key: "funds", label: "קופות/הסדרים", get: (u) => u.healthFunds?.join(", ") ?? "-" },
  { key: "region", label: "מיקום", get: (u) => u.region ?? "יש לברר" },
  { key: "monitoring", label: "מיקום המעקבים", get: (u) => u.monitoringLocation ?? "יש לברר" },
  {
    key: "doctor",
    label: "בחירת רופא",
    get: (u) => (u.doctorChoice === "yes" ? "כן" : u.doctorChoice === "no" ? "לא" : u.doctorChoice === "depends" ? "תלוי במסלול" : "יש לברר"),
  },
  { key: "start", label: "איך מתחילים", get: (u) => u.howToStart ?? "יש לברר" },
];

/** §11: טבלת השוואה — בלי ציון כולל, בלי "הכי מתאים". מובייל: overflow-x-auto, לא נדחסת */
export default function ComparisonTable({ units, onClose, onRemove }: ComparisonTableProps) {
  const open = units.length >= 2;

  return (
    <FloatingPortal>
      <div
        className={`fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/40 p-4 backdrop-blur-sm transition-opacity duration-200 sm:items-center ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      >
        <div
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
          className="my-8 w-full max-w-3xl rounded-2xl border-2 border-mist-200 bg-white p-5 shadow-cardHover sm:p-7"
        >
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-lg font-bold leading-snug text-ink sm:text-xl">השוואה בין {units.length} מקומות</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="סגירה"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink/40 transition-colors hover:bg-mist-100 hover:text-ink/70"
            >
              <X className="h-4 w-4" strokeWidth={2.5} />
            </button>
          </div>

          <p className="mt-2 text-xs leading-relaxed text-ink/45">
            השדות כאן להשוואה בלבד ואינם מדרגים מקום כ״טוב יותר״ — הבחירה שלך.
          </p>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-right text-sm">
              <thead>
                <tr className="border-b border-mist-200 bg-mist-50/80">
                  <th className="whitespace-nowrap px-3 py-2.5 font-semibold text-ink/50">&nbsp;</th>
                  {units.map((u) => (
                    <th key={u.id} className="min-w-[150px] px-3 py-2.5 font-bold text-ink">
                      <div className="flex items-center justify-between gap-1.5">
                        {u.name}
                        <button
                          type="button"
                          onClick={() => onRemove(u.id)}
                          aria-label={`הסירי את ${u.name} מההשוואה`}
                          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-ink/30 hover:bg-mist-100 hover:text-ink/60"
                        >
                          <X className="h-3 w-3" strokeWidth={2.5} />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row, idx) => (
                  <tr key={row.key} className={idx % 2 === 1 ? "bg-mist-50/40" : undefined}>
                    <td className="whitespace-nowrap px-3 py-2.5 align-top text-xs font-semibold text-ink/45">{row.label}</td>
                    {units.map((u) => {
                      const price = u.hasPriceRef ? findPriceRow(u.name) : undefined;
                      return (
                        <td key={u.id} className="px-3 py-2.5 align-top leading-relaxed text-ink/75">
                          {row.get(u, price)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </FloatingPortal>
  );
}
