"use client";

import { BadgeCheck, CircleAlert, Heart, MapPin } from "lucide-react";
import type { CareUnit, HealthFund } from "@/data/careUnits";
import { fundsWithArrangement, routesForFund, selfPayRoute } from "@/data/careUnits";

interface CareUnitCardProps {
  unit: CareUnit;
  /** הקופה הנבחרת באשף (שלב 1), null/undefined = לא נבחרה קופה */
  selectedFund: HealthFund | null;
  isSelected: boolean;
  isCompared: boolean;
  canAddToComparison: boolean;
  onOpenDetail: () => void;
  onToggleCompare: () => void;
}

function VerificationChip({ verified }: { verified: boolean }) {
  return verified ? (
    <span className="inline-flex items-center gap-0.5 rounded-full bg-warm-100 px-1.5 py-0.5 text-[10px] font-semibold text-warm-500 ring-1 ring-inset ring-warm-300/60">
      <BadgeCheck className="h-2.5 w-2.5" strokeWidth={2.5} />
      מאומת
    </span>
  ) : (
    <span className="inline-flex items-center gap-0.5 rounded-full bg-mist-100 px-1.5 py-0.5 text-[10px] font-semibold text-ink/50 ring-1 ring-inset ring-mist-200">
      <CircleAlert className="h-2.5 w-2.5" strokeWidth={2.5} />
      דורש אימות
    </span>
  );
}

/**
 * כרטיס מכווץ ליחידה — עכשיו מודע ל-routes: כשנבחרה קופה שיש לה route
 * תואם ביחידה, הוא מוצג בראש (מחיר ההסדר + שורת זכאות "בכפוף ל..." כנה —
 * לעולם לא "מגיע לך X ₪"), עם מחיר תשלום-עצמי כשורה משנית עדינה מתחתיו.
 * אם אין route תואם, מוצג תשלום עצמי כברירת מחדל + באדג'ים לכל קופה שיש
 * לה הסדר כלשהו ביחידה — היחידה לעולם לא מוסתרת (§4).
 */
export default function CareUnitCard({
  unit,
  selectedFund,
  isSelected,
  isCompared,
  canAddToComparison,
  onOpenDetail,
  onToggleCompare,
}: CareUnitCardProps) {
  const matchedRoute = selectedFund ? routesForFund(unit, selectedFund)[0] : undefined;
  const selfPay = selfPayRoute(unit);
  const otherFunds = fundsWithArrangement(unit).filter((f) => f !== selectedFund);

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
        {(unit.city || unit.region) && (
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" strokeWidth={2} />
            {[unit.city, unit.region].filter(Boolean).join(" · ")}
          </span>
        )}
        <span className="inline-flex items-center rounded-full bg-mist-100 px-2 py-0.5 font-semibold text-ink/60">
          {unit.setting === "public" ? "בית חולים ציבורי" : "מרכז פרטי"}
        </span>
      </div>

      {matchedRoute ? (
        <div className="mt-3 rounded-xl border-2 border-teal-200 bg-teal-50/60 p-3">
          <span className="inline-flex items-center rounded-full bg-teal-600 px-2 py-0.5 text-[11px] font-semibold text-white">
            דרך {matchedRoute.requiredPlan ?? matchedRoute.healthFund}
          </span>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <span className="text-base font-bold text-ink">
              {matchedRoute.pricePerCycle ?? "מחיר לא פורסם"}
            </span>
            <VerificationChip verified={matchedRoute.verificationStatus === "verified"} />
          </div>
          {matchedRoute.eligibilityNote && (
            <p className="mt-1 text-xs leading-relaxed text-ink/60">{matchedRoute.eligibilityNote}</p>
          )}
          <p className="mt-1 text-xs leading-relaxed text-ink/60">
            תרופות: {matchedRoute.medicationsIncluded ? "כלולות" : matchedRoute.medicationNotes ?? "בנפרד"}
          </p>
          {selfPay?.pricePerCycle && (
            <p className="mt-1.5 text-xs text-ink/45">ללא הסדר: {selfPay.pricePerCycle} לסבב</p>
          )}
        </div>
      ) : (
        <div className="mt-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-ink/45">עלות בתשלום עצמי:</span>
            {selfPay?.pricePerCycle ? (
              <>
                <span className="text-sm text-ink/80">{selfPay.pricePerCycle}</span>
                <VerificationChip verified={selfPay.verificationStatus === "verified"} />
              </>
            ) : (
              <span className="text-sm text-ink/45">יש לברר מול היחידה</span>
            )}
          </div>
          {otherFunds.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {otherFunds.map((f) => (
                <span
                  key={f}
                  className="inline-flex items-center rounded-full bg-teal-50 px-2 py-0.5 text-[11px] font-semibold text-teal-700 ring-1 ring-inset ring-teal-100"
                >
                  הסדר {f}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

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
