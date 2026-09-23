"use client";

import { X } from "lucide-react";
import FloatingPortal from "@/components/shared/FloatingPortal";
import type { CareUnit } from "@/data/careUnits";
import { formatShekel, fundsWithArrangement, routesForFund, selfPayRoute } from "@/data/careUnits";

interface SummaryTableModalProps {
  open: boolean;
  units: CareUnit[];
  onClose: () => void;
}

interface UnitSummary {
  id: string;
  name: string;
  city: string;
  setting: string;
  arrangements: string;
  fundPrice: string;
  selfPayPrice: string;
  meds: string;
  storage: string;
  doctorChoice: string;
  updated: string;
}

function summarize(unit: CareUnit): UnitSummary {
  const funds = fundsWithArrangement(unit);
  const selfPay = selfPayRoute(unit);

  const fundPrice =
    funds.length > 0
      ? funds
          .map((fund) => {
            const route = routesForFund(unit, fund)[0];
            if (!route) return `${fund}: לא אומת`;
            const price = route.priceAmount != null ? formatShekel(route.priceAmount, route.priceApprox) : "מחיר בבירור";
            const pending = route.verificationStatus === "verified" ? "" : " (ההסדר ביחידה דורש בירור)";
            return `${route.requiredPlan ?? fund}: ${price}${pending}`;
          })
          .join(" · ")
      : "אין הסדר מאומת";

  const referenceRoute = selfPay ?? unit.routes[0];
  const meds = referenceRoute
    ? referenceRoute.medicationsIncluded
      ? "כלולות"
      : (referenceRoute.medicationNotes ?? "בנפרד")
    : "יש לברר";
  const storage = referenceRoute?.storageYears ? `${referenceRoute.storageYears} שנים` : "יש לברר";
  const doctorChoice =
    referenceRoute?.doctorChoice === "yes"
      ? "כן"
      : referenceRoute?.doctorChoice === "no"
        ? "לא"
        : referenceRoute?.doctorChoice === "depends"
          ? "תלוי במסלול"
          : "יש לברר";

  const checkedDates = unit.routes.filter((r) => r.verifiedAt).map((r) => r.verifiedAt as string);
  const updated = checkedDates.length > 0 ? checkedDates[0] : "טרם נבדק";

  return {
    id: unit.id,
    name: unit.name,
    city: unit.city ?? unit.region ?? "—",
    setting: unit.setting === "public" ? "ציבורי" : "פרטי",
    arrangements: funds.length > 0 ? funds.join(", ") : "אין",
    fundPrice,
    selfPayPrice:
      selfPay?.priceAmount != null
        ? `${formatShekel(selfPay.priceAmount, selfPay.priceApprox)}${selfPay.priceBasis ? ` ${selfPay.priceBasis}` : ""}`
        : "מחיר בבירור",
    meds,
    storage,
    doctorChoice,
    updated,
  };
}

const COLUMNS: { key: keyof UnitSummary; label: string }[] = [
  { key: "name", label: "מקום" },
  { key: "city", label: "עיר / אזור" },
  { key: "setting", label: "מסגרת" },
  { key: "arrangements", label: "הסדרים עם קופות" },
  { key: "fundPrice", label: "מחיר דרך הקופה" },
  { key: "selfPayPrice", label: "מחיר בתשלום עצמי" },
  { key: "meds", label: "תרופות" },
  { key: "storage", label: "אחסון" },
  { key: "doctorChoice", label: "בחירת רופא" },
  { key: "updated", label: "נבדק לאחרונה" },
];

/** טבלת סיכום מלאה של כל המקומות המסוננים כרגע — דסקטופ: טבלה גוללת; מובייל: כרטיסים, לא עמודות דחוסות */
export default function SummaryTableModal({ open, units, onClose }: SummaryTableModalProps) {
  const rows = units.map(summarize);

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
          className="my-8 w-full max-w-4xl rounded-2xl border-2 border-mist-200 bg-white p-5 shadow-cardHover sm:p-7"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold leading-snug text-ink sm:text-xl">כל המקומות והמחירים</h2>
              <p className="mt-0.5 text-xs text-ink/45">{rows.length} מקומות, לפי הסינון הנוכחי</p>
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

          {/* דסקטופ/טאבלט: טבלה גוללת אופקית */}
          <div className="mt-4 hidden overflow-x-auto sm:block">
            <table className="w-full min-w-[860px] border-collapse text-right text-sm">
              <thead>
                <tr className="border-b border-mist-200 bg-mist-50/80">
                  {COLUMNS.map((col) => (
                    <th key={col.key} className="whitespace-nowrap px-3 py-2.5 font-semibold text-ink/50">
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr key={row.id} className={idx % 2 === 1 ? "bg-mist-50/40" : undefined}>
                    {COLUMNS.map((col) => (
                      <td
                        key={col.key}
                        className={`px-3 py-2.5 align-top leading-relaxed text-ink/75 ${col.key === "name" ? "font-bold text-ink" : ""}`}
                      >
                        {row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* מובייל: כרטיסים — לא כל העמודות בו-זמנית */}
          <div className="mt-4 space-y-3 sm:hidden">
            {rows.map((row) => (
              <div key={row.id} className="rounded-xl border-2 border-mist-200 p-3.5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-ink">{row.name}</h3>
                  <span className="rounded-full bg-mist-100 px-2 py-0.5 text-[11px] font-semibold text-ink/60">
                    {row.setting}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-ink/45">{row.city}</p>
                <dl className="mt-2.5 grid grid-cols-2 gap-2 text-xs leading-relaxed text-ink/70">
                  <div>
                    <dt className="font-semibold text-ink/45">הסדרים</dt>
                    <dd className="mt-0.5">{row.arrangements}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-ink/45">מחיר דרך הקופה</dt>
                    <dd className="mt-0.5">{row.fundPrice}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-ink/45">ללא הסדר</dt>
                    <dd className="mt-0.5">{row.selfPayPrice}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-ink/45">תרופות</dt>
                    <dd className="mt-0.5">{row.meds}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-ink/45">אחסון</dt>
                    <dd className="mt-0.5">{row.storage}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-ink/45">בחירת רופא</dt>
                    <dd className="mt-0.5">{row.doctorChoice}</dd>
                  </div>
                </dl>
                <p className="mt-2 text-[11px] text-ink/40">נבדק לאחרונה: {row.updated}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </FloatingPortal>
  );
}
