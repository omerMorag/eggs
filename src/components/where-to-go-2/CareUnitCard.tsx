"use client";

import { BadgeCheck, CircleAlert, Heart, MapPin } from "lucide-react";
import type { CareUnit } from "@/data/careUnits";
import { findPriceRow } from "@/data/careUnits";

interface CareUnitCardProps {
  unit: CareUnit;
  isSelected: boolean;
  isCompared: boolean;
  canAddToComparison: boolean;
  onOpenDetail: () => void;
  onToggleCompare: () => void;
}

/**
 * כרטיס מכווץ ליחידה (§6 בבקשת WHERE TO DO 2.0) — לא מציג הכול, רק את מה
 * שנדרש לסריקה מהירה: שם/אזור/תגיות, עלות משוערת (תמיד משוכפלת מתוך
 * hospitalPrices.ts דרך findPriceRow, לעולם לא ממציאה), מעקבים, בחירת רופא,
 * קופות/הסדרים, ושני CTA-ים. שום דירוג/"הכי מתאים" — ר' §5.
 */
export default function CareUnitCard({
  unit,
  isSelected,
  isCompared,
  canAddToComparison,
  onOpenDetail,
  onToggleCompare,
}: CareUnitCardProps) {
  const priceRow = unit.hasPriceRef ? findPriceRow(unit.name) : undefined;

  return (
    <div className="rounded-2xl border-2 border-mist-200 bg-white p-4 shadow-card sm:p-5">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
        <h3 className="font-sans text-base font-bold text-ink sm:text-lg">{unit.name}</h3>
        {isSelected && (
          <span className="inline-flex items-center rounded-full bg-teal-600 px-2 py-0.5 text-[11px] font-semibold text-white">
            נבחר
          </span>
        )}
      </div>

      <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink/50">
        {unit.region && (
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" strokeWidth={2} />
            {unit.region}
          </span>
        )}
        <span className="inline-flex items-center rounded-full bg-mist-100 px-2 py-0.5 font-semibold text-ink/60">
          {unit.type === "public" ? "ציבורי" : "פרטי"}
        </span>
        {unit.fundingOptions.includes("hmoArrangement") && (
          <span className="inline-flex items-center rounded-full bg-teal-50 px-2 py-0.5 font-semibold text-teal-700 ring-1 ring-inset ring-teal-100">
            הסדר קופה רלוונטי
          </span>
        )}
      </div>

      <dl className="mt-3 grid gap-2 text-sm leading-relaxed text-ink/70 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-semibold text-ink/45">עלות משוערת</dt>
          <dd className="mt-0.5 flex flex-wrap items-center gap-1.5">
            {priceRow ? (
              <>
                <span>{priceRow.cycle1Price}</span>
                {priceRow.verification === "verified" ? (
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-warm-100 px-1.5 py-0.5 text-[10px] font-semibold text-warm-500 ring-1 ring-inset ring-warm-300/60">
                    <BadgeCheck className="h-2.5 w-2.5" strokeWidth={2.5} />
                    מאומת
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-mist-100 px-1.5 py-0.5 text-[10px] font-semibold text-ink/50 ring-1 ring-inset ring-mist-200">
                    <CircleAlert className="h-2.5 w-2.5" strokeWidth={2.5} />
                    דורש אימות
                  </span>
                )}
              </>
            ) : (
              <span className="text-ink/45">יש לברר מול היחידה</span>
            )}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold text-ink/45">מעקבים</dt>
          <dd className="mt-0.5">{unit.monitoringLocation ?? "יש לברר מול היחידה"}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold text-ink/45">בחירת רופא/ה</dt>
          <dd className="mt-0.5">
            {unit.doctorChoice === "yes"
              ? "כן"
              : unit.doctorChoice === "no"
                ? "לא"
                : unit.doctorChoice === "depends"
                  ? "תלוי במסלול"
                  : "יש לברר מול היחידה"}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold text-ink/45">קופות/הסדרים</dt>
          <dd className="mt-0.5">{unit.healthFunds?.join(", ") ?? "יש לברר מול היחידה"}</dd>
        </div>
      </dl>

      <div className="mt-4 flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={onOpenDetail}
          className="min-h-[40px] rounded-full bg-teal-600 px-4 text-sm font-bold text-ink shadow-sm transition-colors hover:bg-teal-500"
        >
          לכל הפרטים ←
        </button>
        <button
          type="button"
          onClick={onToggleCompare}
          disabled={!isCompared && !canAddToComparison}
          aria-pressed={isCompared}
          className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-full border-2 px-3.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
            isCompared
              ? "border-warm-300 bg-warm-100/60 text-warm-500"
              : "border-mist-200 bg-white text-ink/60 hover:border-teal-200 hover:text-teal-700"
          }`}
        >
          <Heart className="h-3.5 w-3.5" strokeWidth={2.5} fill={isCompared ? "currentColor" : "none"} />
          להשוואה
        </button>
      </div>
    </div>
  );
}
