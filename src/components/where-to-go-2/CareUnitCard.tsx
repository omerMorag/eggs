"use client";

import { useId, useState } from "react";
import { BadgeCheck, Calculator, Check, ChevronDown, CircleAlert, ExternalLink, MapPin, Phone, Plus } from "lucide-react";
import {
  FUND_ELIGIBILITY_LINKS,
  formatShekel,
  medicationSummary,
  priceLabel,
  routeName,
  storageSummary,
  type CareRoute,
  type CareUnit,
} from "@/data/careUnits";

interface CareUnitCardProps {
  unit: CareUnit;
  /** המסלול שמוצג כרגע בכרטיס (נגזר מהבחירה במחשבון) */
  route: CareRoute;
  /** במסלול רפואי לא מציגים מחיר כתשובה */
  medicalMode: boolean;
  isCompared: boolean;
  compareFull: boolean;
  isInCalculator: boolean;
  isSelected: boolean;
  onToggleCompare: () => void;
  onCalculate: () => void;
  onSelect: () => void;
  onClearSelection: () => void;
}

/**
 * כרטיס מקום. החלק הגלוי מיועד לסריקה מהירה (שם, עיר, סוג, מסלולי תשלום
 * שנבדקו, מחיר למסלול שנבחר עם תווית ברורה, תרופות ואחסון, השוואה, אתר).
 * בחלק שנפתח: מה לברר, פרטי קשר, מקור המחיר ומועד הבדיקה, וקישורי זכאות
 * מדויקים לכל קופה שיש לה מסלול ביחידה.
 */
export default function CareUnitCard({
  unit,
  route,
  medicalMode,
  isCompared,
  compareFull,
  isInCalculator,
  isSelected,
  onToggleCompare,
  onCalculate,
  onSelect,
  onClearSelection,
}: CareUnitCardProps) {
  const [open, setOpen] = useState(false);
  const detailsId = useId();
  const price = priceLabel(route);
  const fundRoutes = unit.routes.filter((r) => r.fundingType === "healthFundArrangement");

  return (
    <article
      className={`flex flex-col rounded-2xl border-2 bg-white p-4 shadow-card sm:p-5 ${
        isInCalculator ? "border-teal-300" : "border-mist-200"
      }`}
      data-testid="care-unit-card"
      data-unit={unit.name}
    >
      {/* כותרת */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <h3 className="text-base font-bold text-ink sm:text-lg">{unit.name}</h3>
        {isSelected && (
          <span className="inline-flex items-center gap-1 rounded-full bg-teal-600 px-2 py-0.5 text-[11px] font-bold text-ink">
            <Check className="h-3 w-3" strokeWidth={3} />
            בחרתי
          </span>
        )}
      </div>
      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink/55">
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
          {[unit.city, unit.region].filter(Boolean).join(" · ")}
        </span>
        <span className="rounded-full bg-mist-100 px-2 py-0.5 font-semibold text-ink/65">
          {unit.setting === "public" ? "בית חולים ציבורי" : "מרכז פרטי"}
        </span>
      </div>

      {/* מסלולי תשלום */}
      <div className="mt-3">
        <p className="text-[11px] font-bold text-ink/50">מסלולי תשלום</p>
        <ul className="mt-1 flex flex-wrap gap-1.5">
          {unit.routes.map((r) => (
            <RouteChip key={r.id} route={r} active={r.id === route.id} />
          ))}
        </ul>
      </div>

      {/* מחיר למסלול שמוצג */}
      <div
        className={`mt-3 rounded-xl p-3 ${
          route.fundingType === "healthFundArrangement" ? "bg-teal-50/70 ring-1 ring-inset ring-teal-100" : "bg-mist-50"
        }`}
      >
        <p className="text-[11px] font-bold text-ink/55">
          {medicalMode && route.fundingType === "selfPay" ? "אם אין זכאות רפואית — " : ""}
          {route.fundingType === "healthFundArrangement" ? `${routeName(route)} · ${price.label}` : price.label}
        </p>
        {route.priceAmount != null ? (
          <p className="mt-0.5 text-lg font-extrabold text-ink" data-testid="card-price">
            {formatShekel(route.priceAmount, route.priceApprox)}
            {route.priceBasis && <span className="mr-1 text-xs font-semibold text-ink/55">{route.priceBasis}</span>}
          </p>
        ) : (
          <p className="mt-0.5 text-sm font-bold text-ink/70" data-testid="card-price">
            מחיר בבירור
            {route.pricePerCycle && (
              <span className="mt-0.5 block text-xs font-normal leading-snug text-ink/55">
                פורסם בעבר / ממקור לא רשמי: {route.pricePerCycle}. לא אומת.
              </span>
            )}
          </p>
        )}
        {route.fundingType === "healthFundArrangement" && route.verificationStatus !== "verified" && (
          <p className="mt-1 text-xs leading-snug text-ink/60">ההסדר עם היחידה הזו עוד לא אומת. בררי מול הקופה.</p>
        )}
        <dl className="mt-2 grid gap-1 text-xs leading-snug text-ink/65">
          <div className="flex gap-1">
            <dt className="shrink-0 font-semibold text-ink/50">תרופות:</dt>
            <dd>{medicationSummary(route)}</dd>
          </div>
          <div className="flex gap-1">
            <dt className="shrink-0 font-semibold text-ink/50">אחסון:</dt>
            <dd>{storageSummary(route)}</dd>
          </div>
        </dl>
      </div>

      {/* פעולות */}
      <div className="mt-3.5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onToggleCompare}
          disabled={!isCompared && compareFull}
          aria-pressed={isCompared}
          className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-full border-2 px-3.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
            isCompared
              ? "border-teal-300 bg-teal-50 text-teal-700"
              : "border-mist-200 bg-white text-ink/70 hover:border-teal-200 hover:text-teal-700"
          }`}
        >
          {isCompared ? <Check className="h-4 w-4" strokeWidth={2.5} /> : <Plus className="h-4 w-4" strokeWidth={2.5} />}
          {isCompared ? "נוסף להשוואה" : "הוספה להשוואה"}
        </button>
        {!medicalMode && (
          <button
            type="button"
            onClick={onCalculate}
            aria-pressed={isInCalculator}
            className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-full px-3.5 text-sm font-semibold transition-colors ${
              isInCalculator ? "bg-teal-600 text-ink" : "bg-mist-100 text-ink/70 hover:bg-mist-200"
            }`}
          >
            <Calculator className="h-4 w-4" strokeWidth={2.25} />
            {isInCalculator ? "מוצג במחשבון" : "חישוב במחשבון"}
          </button>
        )}
        {unit.website && (
          <a
            href={unit.website.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-[40px] items-center gap-1 px-1 text-sm font-semibold text-teal-700 underline-offset-4 hover:underline"
          >
            לאתר היחידה
            <ExternalLink className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
          </a>
        )}
      </div>

      {/* חלק נפתח */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={detailsId}
        className="mt-3 inline-flex items-center gap-1 self-start text-sm font-semibold text-ink/60 hover:text-ink"
      >
        <ChevronDown
          className={`h-4 w-4 transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
          strokeWidth={2.5}
          aria-hidden="true"
        />
        {open ? "פחות פרטים" : "מה לברר, מקורות וזכאות"}
      </button>

      <div id={detailsId} hidden={!open} className="mt-2 space-y-3 border-t border-mist-100 pt-3 text-xs leading-relaxed text-ink/70 sm:text-[13px]">
        {route.eligibilityNote && (
          <p>
            <span className="font-semibold text-ink">זכאות: </span>
            {route.eligibilityNote}
          </p>
        )}
        {route.approvalNote && (
          <p>
            <span className="font-semibold text-ink">אישור: </span>
            {route.approvalNote}
          </p>
        )}
        {route.numberOfCycles && (
          <p>
            <span className="font-semibold text-ink">
              {route.fundingType === "healthFundArrangement" ? "מכסת כיסוי: " : "מחיר נוסף: "}
            </span>
            {route.numberOfCycles}
          </p>
        )}
        {route.priceExtra && <p>{route.priceExtra}</p>}
        {route.included && (
          <p>
            <span className="font-semibold text-ink">כלול לפי המקור: </span>
            {route.included}
          </p>
        )}
        {route.caveat && <p className="rounded-lg bg-mist-50 px-2.5 py-1.5">{route.caveat}</p>}

        <div>
          <p className="font-semibold text-ink">מה כדאי לברר מול היחידה</p>
          <ul className="mt-0.5 list-disc pr-4">
            <li>מה בדיוק כולל המחיר, ואם התרופות וההרדמה כלולות</li>
            <li>כמה שנות אחסון כלולות ומה העלות אחריהן</li>
            <li>איפה עושים את המעקב והאם אפשר לבחור רופא/ה</li>
            <li>מה זמינות התורים</li>
          </ul>
        </div>

        <div>
          <p className="font-semibold text-ink">פרטי קשר</p>
          {unit.phone ? (
            <p className="mt-0.5 inline-flex items-center gap-1">
              <Phone className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
              <a href={`tel:${unit.phone.number}`} className="font-semibold text-teal-700" dir="ltr">
                {unit.phone.number}
              </a>
              <span className="text-ink/45">(לפי {unit.phone.sourceLabel})</span>
            </p>
          ) : (
            <p className="mt-0.5 text-ink/55">לא אומתו פרטי קשר. אפשר לפנות דרך אתר היחידה.</p>
          )}
        </div>

        <div>
          <p className="font-semibold text-ink">מקור המחיר</p>
          {route.source ? (
            <a
              href={route.source.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-teal-700 underline-offset-4 hover:underline"
            >
              {route.source.label}
              <ExternalLink className="h-3 w-3" strokeWidth={2.5} aria-hidden="true" />
            </a>
          ) : (
            <p className="text-ink/55">לא אותר מקור רשמי למחיר.</p>
          )}
          <p className="text-ink/45">נבדק לאחרונה: {route.verifiedAt ?? "לא נבדק"}</p>
        </div>

        {fundRoutes.length > 0 && (
          <div>
            <p className="font-semibold text-ink">זכאות לפי קופה</p>
            <ul className="mt-1 flex flex-col gap-1">
              {fundRoutes.map((r) =>
                r.healthFund ? (
                  <li key={r.id}>
                    <a
                      href={FUND_ELIGIBILITY_LINKS[r.healthFund].url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 font-semibold text-teal-700 underline-offset-4 hover:underline"
                    >
                      {r.verificationStatus === "verified"
                        ? `בדקי זכאות ב${r.healthFund} (${r.requiredPlan})`
                        : `ההסדר עם ${r.healthFund} דורש בירור: לתנאי ${r.requiredPlan}`}
                      <ExternalLink className="h-3 w-3" strokeWidth={2.5} aria-hidden="true" />
                    </a>
                  </li>
                ) : null
              )}
            </ul>
          </div>
        )}

        <div className="pt-1">
          {isSelected ? (
            <button
              type="button"
              onClick={onClearSelection}
              className="text-xs font-semibold text-ink/55 underline-offset-4 hover:underline"
            >
              ביטול הבחירה במקום הזה
            </button>
          ) : (
            <button
              type="button"
              onClick={onSelect}
              className="min-h-[36px] rounded-full bg-teal-600 px-4 text-sm font-bold text-ink shadow-sm hover:bg-teal-500"
            >
              בחרתי במקום הזה
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function RouteChip({ route, active }: { route: CareRoute; active: boolean }) {
  const verified = route.verificationStatus === "verified";
  return (
    <li
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${
        verified ? "bg-white text-ink/75 ring-teal-200" : "bg-white text-ink/50 ring-mist-200 [border-style:dashed]"
      } ${active ? "outline outline-2 outline-offset-1 outline-teal-300" : ""}`}
      title={verified ? "נבדק מול מקור רשמי" : "דורש בירור"}
    >
      {verified ? (
        <BadgeCheck className="h-3 w-3 text-teal-700" strokeWidth={2.5} aria-hidden="true" />
      ) : (
        <CircleAlert className="h-3 w-3" strokeWidth={2.5} aria-hidden="true" />
      )}
      {routeName(route)}
      <span className="sr-only">{verified ? "(אומת)" : "(דורש בירור)"}</span>
      {!verified && <span aria-hidden="true">· בבירור</span>}
    </li>
  );
}
