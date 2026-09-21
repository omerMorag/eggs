"use client";

import { X } from "lucide-react";
import FloatingPortal from "@/components/shared/FloatingPortal";
import type { CareUnit } from "@/data/careUnits";
import { findPriceRow } from "@/data/careUnits";
import WhatsIncludedDetails from "./WhatsIncludedDetails";

const FUNDING_LABELS: Record<string, string> = {
  regular: "תשלום רגיל",
  subsidized: "סבסוד/הטבה",
  hmoArrangement: "הסדר דרך קופה",
  private: "מסלול פרטי",
  other: "אפשרות נוספת",
};

interface CareUnitDetailProps {
  /** null = סגור. ה-FloatingPortal נשאר mounted תמיד — הנראות נשלטת ב-CSS בלבד, כמו StoryDetailView.tsx */
  unit: CareUnit | null;
  isSelected: boolean;
  onClose: () => void;
  onSelect: () => void;
  onClearSelection: () => void;
}

/** תצוגת פרטים מלאה ליחידה (§9) — נפתחת מ"לכל הפרטים" בכרטיס המכווץ */
export default function CareUnitDetail({ unit, isSelected, onClose, onSelect, onClearSelection }: CareUnitDetailProps) {
  const open = unit !== null;
  const priceRow = unit?.hasPriceRef ? findPriceRow(unit.name) : undefined;

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
              {unit?.region && <p className="mt-0.5 text-sm text-ink/50">{unit.region}</p>}
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
                  {unit.type === "public" ? "מסגרת ציבורית" : "מסגרת פרטית"}
                </span>
                {unit.fundingOptions.map((opt) => (
                  <span
                    key={opt}
                    className="inline-flex items-center rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700 ring-1 ring-inset ring-teal-100"
                  >
                    {FUNDING_LABELS[opt]}
                  </span>
                ))}
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-ink">עלויות</h3>
                  {priceRow ? (
                    <dl className="mt-1.5 grid gap-2 text-sm leading-relaxed text-ink/70 sm:grid-cols-2">
                      <div>
                        <dt className="text-xs font-semibold text-ink/45">סבב ראשון</dt>
                        <dd className="mt-0.5">{priceRow.cycle1Price}</dd>
                      </div>
                      {priceRow.cycle2Price && (
                        <div>
                          <dt className="text-xs font-semibold text-ink/45">שני סבבים</dt>
                          <dd className="mt-0.5">{priceRow.cycle2Price}</dd>
                        </div>
                      )}
                    </dl>
                  ) : (
                    <p className="mt-1.5 text-sm text-ink/60">
                      אין מחיר קבוע שפורסם — לקבלת הצעת מחיר יש לפנות ישירות ליחידה.
                    </p>
                  )}
                  {priceRow?.caveat && (
                    <p className="mt-2 rounded-lg bg-deep/10 p-2.5 text-xs leading-relaxed text-ink/70">
                      <span className="font-semibold text-ink">שימי לב:</span> {priceRow.caveat}
                    </p>
                  )}
                  <div className="mt-2.5">
                    <WhatsIncludedDetails unit={unit} />
                  </div>
                </div>

                <dl className="grid gap-3 text-sm leading-relaxed text-ink/70 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs font-semibold text-ink/45">מי יכולה לקבל סבסוד?</dt>
                    <dd className="mt-0.5">{unit.eligibilityNotes ?? "יש לברר מול היחידה או הקופה"}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold text-ink/45">איפה מתבצעים המעקבים?</dt>
                    <dd className="mt-0.5">{unit.monitoringLocation ?? "יש לברר מול היחידה"}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold text-ink/45">אפשר לבחור רופא/ה?</dt>
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
                    <dt className="text-xs font-semibold text-ink/45">איך מתחילים?</dt>
                    <dd className="mt-0.5">{unit.howToStart ?? "יש לברר מול היחידה"}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold text-ink/45">קופות/הסדרים</dt>
                    <dd className="mt-0.5">{unit.healthFunds?.join(", ") ?? "יש לברר מול היחידה"}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold text-ink/45">פרטי קשר</dt>
                    <dd className="mt-0.5">
                      {unit.contact?.phone || unit.contact?.url ? (
                        <>
                          {unit.contact.phone}
                          {unit.contact.url && (
                            <>
                              {" "}
                              <a href={unit.contact.url} target="_blank" rel="noreferrer" className="font-semibold text-teal-700 underline-offset-4 hover:underline">
                                אתר היחידה
                              </a>
                            </>
                          )}
                        </>
                      ) : (
                        "לא זמין באתר — יש לברר מול היחידה"
                      )}
                    </dd>
                  </div>
                </dl>

                <div className="border-t border-mist-100 pt-3 text-xs text-ink/45">
                  {unit.source ? (
                    <>
                      מקור:{" "}
                      <a href={unit.source.url} target="_blank" rel="noreferrer" className="font-semibold text-teal-700 underline-offset-4 hover:underline">
                        {unit.source.label}
                      </a>
                    </>
                  ) : (
                    "מקור: לא פורסם מקור רשמי"
                  )}
                  {unit.lastUpdated && <> · עודכן לאחרונה {unit.lastUpdated}</>}
                </div>

                <a
                  href="#cost-estimator"
                  className="block text-sm font-semibold text-teal-700 underline-offset-4 hover:underline"
                >
                  כמה זה צפוי לעלות לי כאן? ←
                </a>

                <div className="flex flex-wrap items-center gap-2.5 border-t border-mist-100 pt-4">
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
              </div>
            </>
          )}
        </div>
      </div>
    </FloatingPortal>
  );
}
