"use client";

import { forwardRef } from "react";
import { ExternalLink, X } from "lucide-react";
import {
  formatShekel,
  medicationSummary,
  priceLabel,
  routeName,
  type CareRoute,
  type CareUnit,
} from "@/data/careUnits";

export interface ComparedItem {
  unit: CareUnit;
  route: CareRoute;
}

interface Row {
  key: string;
  label: string;
  render: (item: ComparedItem) => React.ReactNode;
}

const NOT_VERIFIED = "לא אומת";

const ROWS: Row[] = [
  {
    key: "route",
    label: "מסלול תשלום",
    render: ({ route }) =>
      route.fundingType === "healthFundArrangement"
        ? `${routeName(route)}${route.verificationStatus === "verified" ? "" : " (ההסדר ביחידה דורש בירור)"}`
        : "תשלום עצמי",
  },
  {
    key: "price",
    label: "מחיר ידוע לסבב",
    render: ({ route }) =>
      route.priceAmount != null
        ? `${formatShekel(route.priceAmount, route.priceApprox)} · ${priceLabel(route).label}${route.priceBasis ? ` (${route.priceBasis})` : ""}`
        : "מחיר בבירור",
  },
  { key: "included", label: "מה כלול", render: ({ route }) => route.included ?? NOT_VERIFIED },
  { key: "meds", label: "תרופות", render: ({ route }) => medicationSummary(route) },
  {
    key: "storage",
    label: "אחסון",
    render: ({ route }) => (route.storageYears ? `${route.storageYears} שנים כלולות` : NOT_VERIFIED),
  },
  {
    key: "doctor",
    label: "בחירת רופא/ה",
    render: ({ route }) =>
      route.doctorChoice === "yes" ? "אפשרית" : route.doctorChoice === "no" ? "לא" : route.doctorChoice === "depends" ? "תלוי במסלול" : NOT_VERIFIED,
  },
  {
    key: "source",
    label: "מקור",
    render: ({ route }) =>
      route.source ? (
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
        NOT_VERIFIED
      ),
  },
  { key: "checked", label: "תאריך בדיקה", render: ({ route }) => route.verifiedAt ?? NOT_VERIFIED },
];

interface ComparisonResultsProps {
  items: ComparedItem[];
  onRemove: (routeId: string) => void;
  onClose: () => void;
}

/**
 * תוצאות ההשוואה — חלק מהעמוד (לא חלונית), מתחת לכרטיסים. כל פריט הוא
 * מקום + מסלול מסוים, כך שמחיר דרך הקופה ומחיר בתשלום עצמי של אותה יחידה
 * לא מתערבבים. דסקטופ: טבלה; מובייל: כרטיס לכל מקום עם אותם שדות.
 */
const ComparisonResults = forwardRef<HTMLHeadingElement, ComparisonResultsProps>(function ComparisonResults(
  { items, onRemove, onClose },
  headingRef
) {
  return (
    <section
      aria-labelledby="comparison-title"
      className="mt-8 scroll-mt-24 rounded-2xl border-2 border-teal-100 bg-white p-4 shadow-card sm:p-6"
      data-testid="comparison-results"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 id="comparison-title" ref={headingRef} tabIndex={-1} className="scroll-mt-28 text-lg font-bold text-ink outline-none">
            השוואה בין המקומות
          </h2>
          <p className="mt-0.5 text-xs text-ink/55">
            כל מקום מושווה לפי המסלול שבחרת עבורו. אם נתון חסר כתוב ״לא אומת״.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold text-ink/55 hover:bg-mist-100 hover:text-ink"
        >
          סגירת ההשוואה
        </button>
      </div>

      {/* דסקטופ */}
      <div className="mt-4 hidden md:block">
        <table className="w-full table-fixed border-collapse text-right text-sm">
          <thead>
            <tr>
              <th className="w-32 px-2 py-2" />
              {items.map((it) => (
                <th key={it.route.id} scope="col" className="px-3 py-2 align-top">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-ink">{it.unit.name}</span>
                    <RemoveBtn name={it.unit.name} onClick={() => onRemove(it.route.id)} />
                  </div>
                  <span className="text-xs font-normal text-ink/50">{it.unit.city}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, i) => (
              <tr key={row.key} className={i % 2 === 0 ? "bg-mist-50/60" : undefined}>
                <th scope="row" className="px-2 py-2.5 align-top text-xs font-semibold text-ink/55">
                  {row.label}
                </th>
                {items.map((it) => (
                  <td key={it.route.id} className="px-3 py-2.5 align-top leading-relaxed text-ink/80">
                    {row.render(it)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* מובייל */}
      <div className="mt-4 space-y-3 md:hidden">
        {items.map((it) => (
          <div key={it.route.id} className="rounded-xl border-2 border-mist-200 p-3.5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-ink">{it.unit.name}</h3>
                <p className="text-xs text-ink/50">{it.unit.city}</p>
              </div>
              <RemoveBtn name={it.unit.name} onClick={() => onRemove(it.route.id)} />
            </div>
            <dl className="mt-2 divide-y divide-mist-100 text-[13px]">
              {ROWS.map((row) => (
                <div key={row.key} className="flex gap-3 py-1.5">
                  <dt className="w-24 shrink-0 font-semibold text-ink/50">{row.label}</dt>
                  <dd className="min-w-0 leading-relaxed text-ink/80">{row.render(it)}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </section>
  );
});

export default ComparisonResults;

function RemoveBtn({ name, onClick }: { name: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`הסרת ${name} מההשוואה`}
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-ink/40 hover:bg-mist-100 hover:text-ink/70"
    >
      <X className="h-3.5 w-3.5" strokeWidth={2.5} />
    </button>
  );
}
