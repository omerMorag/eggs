"use client";

import { BadgeCheck, CircleAlert, X } from "lucide-react";
import FloatingPortal from "@/components/shared/FloatingPortal";
import type { CareRoute, CareUnit, HealthFund } from "@/data/careUnits";
import WhatsIncludedDetails from "./WhatsIncludedDetails";

interface CareUnitDetailProps {
  /** null = סגור. ה-FloatingPortal נשאר mounted תמיד — הנראות נשלטת ב-CSS בלבד, כמו StoryDetailView.tsx */
  unit: CareUnit | null;
  /** הקופה הנבחרת באשף — קובעת אילו routes מוצגים ראשונים */
  selectedFund: HealthFund | null;
  isSelected: boolean;
  onClose: () => void;
  onSelect: () => void;
  onClearSelection: () => void;
}

function routeLabel(route: CareRoute): string {
  if (route.fundingType === "selfPay") return "תשלום עצמי";
  return `הסדר ${route.requiredPlan ?? route.healthFund}`;
}

function doctorChoiceLabel(choice: CareRoute["doctorChoice"]): string {
  if (choice === "yes") return "כן";
  if (choice === "no") return "לא";
  if (choice === "depends") return "תלוי במסלול";
  return "יש לברר מול היחידה";
}

function sortRoutes(routes: CareRoute[], selectedFund: HealthFund | null): CareRoute[] {
  return [...routes].sort((a, b) => {
    const score = (r: CareRoute) => {
      if (selectedFund && r.fundingType === "healthFundArrangement" && r.healthFund === selectedFund) return 0;
      if (r.fundingType === "selfPay") return 1;
      return 2;
    };
    return score(a) - score(b);
  });
}

/** כרטיס-משנה למסלול (route) בודד — כל route מוצג בנפרד, לעולם לא ממוזג לסה"כ בדוי (§ PRICE SUMMARY) */
function RouteCard({ route, highlighted }: { route: CareRoute; highlighted: boolean }) {
  const verified = route.verificationStatus === "verified";

  return (
    <div
      className={`rounded-xl border-2 p-3.5 ${highlighted ? "border-teal-200 bg-teal-50/50" : "border-mist-200 bg-mist-50/40"}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
            highlighted ? "bg-teal-600 text-white" : "bg-mist-100 text-ink/60"
          }`}
        >
          {routeLabel(route)}
        </span>
        {verified ? (
          <span className="inline-flex items-center gap-0.5 rounded-full bg-warm-100 px-1.5 py-0.5 text-[10px] font-semibold text-warm-500 ring-1 ring-inset ring-warm-300/60">
            <BadgeCheck className="h-2.5 w-2.5" strokeWidth={2.5} />
            מאומת {route.verifiedAt ? `· ${route.verifiedAt}` : ""}
          </span>
        ) : (
          <span className="inline-flex items-center gap-0.5 rounded-full bg-mist-100 px-1.5 py-0.5 text-[10px] font-semibold text-ink/50 ring-1 ring-inset ring-mist-200">
            <CircleAlert className="h-2.5 w-2.5" strokeWidth={2.5} />
            דורש אימות
          </span>
        )}
      </div>

      <dl className="mt-2.5 grid gap-2 text-sm leading-relaxed text-ink/70 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-semibold text-ink/45">הליך</dt>
          <dd className="mt-0.5">
            {route.pricePerCycle ?? "מחיר לא פורסם"}
            {route.numberOfCycles && <> · {route.numberOfCycles}</>}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold text-ink/45">תרופות</dt>
          <dd className="mt-0.5">
            {route.medicationsIncluded ? "כלולות במחיר" : (route.medicationNotes ?? "בנפרד — יש לברר עלות מדויקת")}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold text-ink/45">אחסון</dt>
          <dd className="mt-0.5">{route.storageYears ? `${route.storageYears} שנים` : "יש לברר מול היחידה"}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold text-ink/45">בחירת רופא/ה</dt>
          <dd className="mt-0.5">{doctorChoiceLabel(route.doctorChoice)}</dd>
        </div>
      </dl>

      {route.eligibilityNote && (
        <p className="mt-2 rounded-lg bg-white/70 p-2.5 text-xs leading-relaxed text-ink/70 ring-1 ring-inset ring-mist-200">
          <span className="font-semibold text-ink">זכאות:</span> {route.eligibilityNote}
        </p>
      )}

      {(route.included || route.notIncluded) && (
        <div className="mt-2.5">
          <WhatsIncludedDetails route={route} />
        </div>
      )}

      {route.caveat && (
        <p className="mt-2 rounded-lg bg-deep/10 p-2.5 text-xs leading-relaxed text-ink/70">
          <span className="font-semibold text-ink">שימי לב:</span> {route.caveat}
        </p>
      )}

      <div className="mt-2.5 border-t border-mist-200/70 pt-2 text-[11px] text-ink/40">
        {route.source ? (
          <>
            מקור:{" "}
            <a
              href={route.source.url}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-teal-700 underline-offset-4 hover:underline"
            >
              {route.source.label}
            </a>
          </>
        ) : (
          "מקור: לא פורסם מקור רשמי"
        )}
        {verified
          ? route.verifiedAt && <> · עודכן לאחרונה {route.verifiedAt}</>
          : " · מומלץ לוודא מול היחידה — הנתון טרם אומת"}
      </div>
    </div>
  );
}

/** תצוגת פרטים מלאה ליחידה — כל route מוצג כברת-משנה נפרדת, לא ממוזג (§9 + PRICE SUMMARY) */
export default function CareUnitDetail({
  unit,
  selectedFund,
  isSelected,
  onClose,
  onSelect,
  onClearSelection,
}: CareUnitDetailProps) {
  const open = unit !== null;
  const routes = unit ? sortRoutes(unit.routes, selectedFund) : [];

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
          className="my-8 w-full max-w-xl rounded-2xl border-2 border-mist-200 bg-white p-5 shadow-cardHover sm:p-7"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-lg font-bold leading-snug text-ink sm:text-xl">{unit?.name ?? ""}</h2>
              {(unit?.city || unit?.region) && (
                <p className="mt-0.5 text-sm text-ink/50">{[unit?.city, unit?.region].filter(Boolean).join(" · ")}</p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="סגירה"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink/40 transition-colors hover:bg-mist-100 hover:text-ink/70"
            >
              <X className="h-4 w-4" strokeWidth={2.5} />
            </button>
          </div>

          {unit && (
            <>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="inline-flex items-center rounded-full bg-mist-100 px-2.5 py-1 text-xs font-semibold text-ink/60">
                  {unit.setting === "public" ? "בית חולים ציבורי" : "מרכז רפואי פרטי"}
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {routes.map((route) => (
                  <RouteCard
                    key={route.id}
                    route={route}
                    highlighted={
                      selectedFund != null &&
                      route.fundingType === "healthFundArrangement" &&
                      route.healthFund === selectedFund
                    }
                  />
                ))}
              </div>

              <a
                href="#cost-estimator"
                className="mt-4 block text-sm font-semibold text-teal-700 underline-offset-4 hover:underline"
              >
                כמה זה צפוי לעלות לי כאן? ←
              </a>

              <div className="mt-4 flex flex-wrap items-center gap-2.5 border-t border-mist-100 pt-4">
                {isSelected ? (
                  <>
                    <span className="inline-flex items-center rounded-full bg-teal-600 px-3.5 py-2 text-sm font-bold text-white">
                      בחרת לעבור את התהליך כאן
                    </span>
                    <button
                      type="button"
                      onClick={onClearSelection}
                      className="text-sm font-semibold text-ink/50 underline-offset-4 hover:text-ink/70 hover:underline"
                    >
                      שינוי הבחירה
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={onSelect}
                    className="min-h-[44px] rounded-full bg-teal-600 px-5 text-sm font-bold text-ink shadow-sm transition-colors hover:bg-teal-500"
                  >
                    בחרתי לעבור את התהליך כאן
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </FloatingPortal>
  );
}
