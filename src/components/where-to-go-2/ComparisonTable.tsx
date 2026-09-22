"use client";

import { X } from "lucide-react";
import FloatingPortal from "@/components/shared/FloatingPortal";
import type { CareRoute, CareUnit, HealthFund } from "@/data/careUnits";
import { routesForFund, selfPayRoute } from "@/data/careUnits";

interface ComparisonTableProps {
  /** ריק = סגור. FloatingPortal נשאר mounted תמיד, כמו CareUnitDetail/StoryDetailView */
  units: CareUnit[];
  /** הקופה הנבחרת באשף — קובעת את ה"route הממוקד" של כל יחידה בהשוואה */
  selectedFund: HealthFund | null;
  onClose: () => void;
  onRemove: (id: string) => void;
}

function doctorChoiceLabel(choice: CareRoute["doctorChoice"]): string {
  if (choice === "yes") return "כן";
  if (choice === "no") return "לא";
  if (choice === "depends") return "תלוי במסלול";
  return "יש לברר";
}

/** ה-route שמושווה בפועל: route תואם-קופה אם נבחרה קופה באשף, אחרת תשלום עצמי — אותה לוגיקה כמו בכרטיס */
function focusRoute(unit: CareUnit, selectedFund: HealthFund | null): CareRoute | undefined {
  if (selectedFund) {
    const matched = routesForFund(unit, selectedFund)[0];
    if (matched) return matched;
  }
  return selfPayRoute(unit);
}

const ROWS: { key: string; label: string; get: (u: CareUnit, route: CareRoute | undefined, selectedFund: HealthFund | null) => string }[] = [
  { key: "location", label: "מיקום", get: (u) => [u.city, u.region].filter(Boolean).join(" · ") || "יש לברר" },
  { key: "setting", label: "מסגרת", get: (u) => (u.setting === "public" ? "ציבורי" : "פרטי") },
  {
    key: "fundRoute",
    label: "מסלול קופה",
    get: (u, route, selectedFund) => {
      if (!selectedFund) return "לא נבחרה קופה";
      if (route?.fundingType === "healthFundArrangement") {
        return `${route.requiredPlan ?? route.healthFund} · ${route.pricePerCycle ?? "מחיר לא פורסם"}`;
      }
      return "אין הסדר מאומת";
    },
  },
  {
    key: "selfPay",
    label: "מחיר בתשלום עצמי",
    get: (u) => selfPayRoute(u)?.pricePerCycle ?? "יש לברר",
  },
  {
    key: "meds",
    label: "תרופות",
    get: (u, route) =>
      route ? (route.medicationsIncluded ? "כלולות" : (route.medicationNotes ?? "בנפרד")) : "יש לברר",
  },
  {
    key: "storage",
    label: "אחסון",
    get: (u, route) => (route?.storageYears ? `${route.storageYears} שנים` : "יש לברר"),
  },
  { key: "doctor", label: "בחירת רופא", get: (u, route) => doctorChoiceLabel(route?.doctorChoice) },
  {
    key: "updated",
    label: "עודכן לאחרונה",
    get: (u, route) => (route?.verificationStatus === "verified" && route.verifiedAt ? route.verifiedAt : "טרם אומת"),
  },
];

/** §11: טבלת השוואה — בלי ציון כולל, בלי "הכי מתאים". מובייל: overflow-x-auto, לא נדחסת */
export default function ComparisonTable({ units, selectedFund, onClose, onRemove }: ComparisonTableProps) {
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
                      const route = focusRoute(u, selectedFund);
                      return (
                        <td key={u.id} className="px-3 py-2.5 align-top leading-relaxed text-ink/75">
                          {row.get(u, route, selectedFund)}
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
