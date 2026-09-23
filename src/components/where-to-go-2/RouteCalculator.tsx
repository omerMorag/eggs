"use client";

import { forwardRef } from "react";
import { Calculator, ExternalLink, HeartHandshake, MapPin, Minus, Plus, Wallet } from "lucide-react";
import {
  FUND_ELIGIBILITY_LINKS,
  FUND_PLANS,
  routeName,
  type CareRoute,
  type CareUnit,
  type HealthFund,
  type Region,
} from "@/data/careUnits";
import { calculate, type PaymentPath, type PlanAnswer, type RouteSelection } from "./routeSelection";

export type RegionFilter = Region | "all";

const PATHS: { value: PaymentPath; label: string }[] = [
  { value: "fund", label: "דרך הביטוח המשלים של הקופה" },
  { value: "selfPay", label: "בתשלום עצמי" },
  { value: "medical", label: "לברר מסלול רפואי" },
  { value: "undecided", label: "עוד לא יודעת — להראות הכול" },
];

const FUNDS: HealthFund[] = ["כללית", "מכבי", "מאוחדת", "לאומית"];

const REGIONS: { value: RegionFilter; label: string }[] = [
  { value: "all", label: "כל הארץ" },
  { value: "מרכז", label: "מרכז" },
  { value: "ירושלים", label: "ירושלים" },
  { value: "צפון", label: "צפון" },
  { value: "דרום", label: "דרום" },
];

function pill(active: boolean) {
  return `min-h-[40px] rounded-full px-4 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none ${
    active ? "bg-teal-600 text-ink shadow-sm" : "bg-mist-100 text-ink/65 hover:bg-mist-200"
  }`;
}

interface RouteCalculatorProps {
  selection: RouteSelection;
  onSelectionChange: (next: RouteSelection) => void;
  region: RegionFilter;
  onRegionChange: (r: RegionFilter) => void;
  cycles: number;
  onCyclesChange: (n: number) => void;
  doctorWanted: boolean;
  onDoctorWantedChange: (v: boolean) => void;
  doctorAmount?: number;
  onDoctorAmountChange: (v: number | undefined) => void;
  /** המקום והמסלול שנבחרו לחישוב (מכרטיס מקום או מהרשימה כאן) */
  target: { unit: CareUnit; route: CareRoute } | null;
  /** המקומות שמוצגים כרגע, לבחירה מהירה בתוך המחשבון */
  units: CareUnit[];
  onPickUnit: (unitId: string) => void;
}

/**
 * מחשבון המסלול: הבחירות כאן קובעות אילו מקומות ומחירים יוצגו בכרטיסים
 * שמתחת, ובחירת מקום (כאן או מכרטיס) מעדכנת את החישוב בלי להזין שוב. אין
 * חובה למלא כלום כדי לראות מידע — ברירת המחדל מציגה את כל המקומות.
 */
const RouteCalculator = forwardRef<HTMLDivElement, RouteCalculatorProps>(function RouteCalculator(
  {
    selection,
    onSelectionChange,
    region,
    onRegionChange,
    cycles,
    onCyclesChange,
    doctorWanted,
    onDoctorWantedChange,
    doctorAmount,
    onDoctorAmountChange,
    target,
    units,
    onPickUnit,
  },
  resultRef
) {
  const { path, fund, plan } = selection;
  const set = (patch: Partial<RouteSelection>) => onSelectionChange({ ...selection, ...patch });

  return (
    <section
      aria-labelledby="route-calc-title"
      className="rounded-2xl border-2 border-mist-200 bg-white p-4 shadow-card sm:p-6"
      data-testid="route-calculator"
    >
      <h2 id="route-calc-title" className="flex items-center gap-2 text-base font-bold text-ink sm:text-lg">
        <Calculator className="h-5 w-5 text-teal-700" strokeWidth={2} aria-hidden="true" />
        המסלול שלי והמחיר
      </h2>
      <p className="mt-1 text-xs leading-relaxed text-ink/55 sm:text-sm">
        לא חייבים למלא הכול. כל בחירה משנה את המקומות והמחירים שמוצגים למטה.
      </p>

      {/* 1. דרך מימון */}
      <fieldset className="mt-4">
        <legend className="flex items-center gap-1.5 text-sm font-bold text-ink">
          <Wallet className="h-4 w-4 text-teal-700" strokeWidth={2} aria-hidden="true" />
          איך את מתכננת לממן?
        </legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {PATHS.map((p) => (
            <button
              key={p.value}
              type="button"
              aria-pressed={path === p.value}
              onClick={() => set({ path: p.value })}
              className={pill(path === p.value)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </fieldset>

      {/* 1א. קופה + רובד */}
      {path === "fund" && (
        <div className="mt-4 rounded-xl bg-mist-50 p-3.5">
          <fieldset>
            <legend className="flex items-center gap-1.5 text-sm font-bold text-ink">
              <HeartHandshake className="h-4 w-4 text-teal-700" strokeWidth={2} aria-hidden="true" />
              באיזו קופה את?
            </legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {FUNDS.map((f) => (
                <button
                  key={f}
                  type="button"
                  aria-pressed={fund === f}
                  onClick={() => set({ fund: f, plan: "yes" })}
                  className={pill(fund === f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </fieldset>

          {fund && (
            <fieldset className="mt-3.5">
              <legend className="text-sm font-bold text-ink">יש לך {FUND_PLANS[fund]}?</legend>
              <p className="mt-0.5 text-xs leading-relaxed text-ink/55">
                לפי המקורות שבדקנו, ההטבה להקפאה מבחירה ב{fund} קיימת ברובד {FUND_PLANS[fund]}.
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(
                  [
                    { v: "yes", l: `כן, יש לי ${FUND_PLANS[fund]}` },
                    { v: "unsure", l: "לא בטוחה" },
                    { v: "no", l: "לא / רובד אחר" },
                  ] as { v: PlanAnswer; l: string }[]
                ).map((o) => (
                  <button
                    key={o.v}
                    type="button"
                    aria-pressed={plan === o.v}
                    onClick={() => set({ plan: o.v })}
                    className={pill(plan === o.v)}
                  >
                    {o.l}
                  </button>
                ))}
              </div>
              {plan !== "yes" && (
                <p className="mt-2.5 rounded-lg bg-white px-3 py-2 text-xs leading-relaxed text-ink/70">
                  {plan === "no"
                    ? `בלי ${FUND_PLANS[fund]} ההטבה לא חלה, ולכן מוצגים למטה מחירים בתשלום עצמי.`
                    : `מוצגים מחירי ${FUND_PLANS[fund]}, בכפוף לכך שיש לך את הרובד הזה ועברה תקופת הוותק.`}{" "}
                  <a
                    href={FUND_ELIGIBILITY_LINKS[fund].url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-teal-700 underline-offset-4 hover:underline"
                  >
                    לבדיקה באתר {fund}
                  </a>
                </p>
              )}
            </fieldset>
          )}
        </div>
      )}

      {path === "medical" && (
        <div className="mt-4 rounded-xl border-2 border-teal-100 bg-teal-50/60 p-3.5 text-sm leading-relaxed text-ink/75">
          <p className="font-bold text-ink">במסלול רפואי אין כאן חישוב מחיר</p>
          <p className="mt-1">
            הזכאות והמימון נקבעים לפי תנאי סל הבריאות ובאישור הקופה, אחרי הערכה של רופא/ת פריון. אנחנו לא
            קובעות זכאות ולא מציגות מחיר 0 ₪ לפני אישור. אם הבקשה לא תאושר, יש למטה את מחירי התשלום העצמי.
          </p>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
            <Ext href="https://www.gov.il/he/service/oocyte-cryopreservation">משרד הבריאות — שמירת ביציות</Ext>
            <Ext href="https://www.maccabi4u.co.il/eligibilites/1834/">מכבי — מסיבות רפואיות</Ext>
            <Ext href="https://www.clalit.co.il/he/myrights/fertility/Pages/fertility-preservation.aspx">
              כללית — זכויות שימור פריון
            </Ext>
          </div>
        </div>
      )}

      {/* 2. אזור */}
      <fieldset className="mt-4">
        <legend className="flex items-center gap-1.5 text-sm font-bold text-ink">
          <MapPin className="h-4 w-4 text-teal-700" strokeWidth={2} aria-hidden="true" />
          איפה נוח לך?
        </legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {REGIONS.map((r) => (
            <button
              key={r.value}
              type="button"
              aria-pressed={region === r.value}
              onClick={() => onRegionChange(r.value)}
              className={pill(region === r.value)}
            >
              {r.label}
            </button>
          ))}
        </div>
      </fieldset>

      {/* 3. החישוב */}
      {path !== "medical" && (
        <div
          ref={resultRef}
          tabIndex={-1}
          className="mt-5 scroll-mt-24 rounded-xl border-2 border-teal-100 bg-mist-50/60 p-3.5 outline-none sm:p-4"
          data-testid="calc-result"
        >
          <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
            <label className="block text-sm font-bold text-ink">
              מקום לחישוב
              <select
                value={target?.unit.id ?? ""}
                onChange={(e) => e.target.value && onPickUnit(e.target.value)}
                className="mt-1.5 block w-full rounded-lg border border-mist-200 bg-white px-3 py-2 text-sm font-normal text-ink/80 focus:border-teal-400"
              >
                <option value="">בחרי מקום מהרשימה או מכרטיס למטה</option>
                {units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </label>
            <div>
              <span className="block text-sm font-bold text-ink" id="cycles-label">
                מספר סבבים
              </span>
              <div className="mt-1.5 flex items-center gap-2" role="group" aria-labelledby="cycles-label">
                <button
                  type="button"
                  onClick={() => onCyclesChange(Math.max(1, cycles - 1))}
                  aria-label="פחות סבבים"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-ink/70 ring-1 ring-mist-200 hover:bg-mist-100"
                >
                  <Minus className="h-4 w-4" strokeWidth={2.5} />
                </button>
                <span className="w-6 text-center text-base font-bold text-ink" aria-live="polite">
                  {cycles}
                </span>
                <button
                  type="button"
                  onClick={() => onCyclesChange(Math.min(6, cycles + 1))}
                  aria-label="יותר סבבים"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-ink/70 ring-1 ring-mist-200 hover:bg-mist-100"
                >
                  <Plus className="h-4 w-4" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink/75">
            <label className="inline-flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={doctorWanted}
                onChange={(e) => onDoctorWantedChange(e.target.checked)}
                className="h-4 w-4 accent-teal-600"
              />
              מתכננת ליווי של רופא/ה פרטי/ת
            </label>
            {doctorWanted && (
              <label className="inline-flex items-center gap-2 text-xs">
                סכום לסבב (אם ידוע)
                <input
                  type="number"
                  min={0}
                  inputMode="numeric"
                  value={doctorAmount ?? ""}
                  onChange={(e) => onDoctorAmountChange(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-24 rounded-lg border border-mist-200 bg-white px-2 py-1 text-sm focus:border-teal-400"
                  dir="ltr"
                />
                ₪
              </label>
            )}
          </div>

          {target ? (
            <CalcBreakdown
              unit={target.unit}
              route={target.route}
              cycles={cycles}
              doctorWanted={doctorWanted}
              doctorAmount={doctorAmount}
            />
          ) : (
            <p className="mt-3 rounded-lg bg-white px-3 py-2.5 text-sm text-ink/60">
              בחרי מקום ונפרט מה ידוע על המחיר — ומה עוד צריך לברר.
            </p>
          )}
        </div>
      )}
    </section>
  );
});

export default RouteCalculator;

function CalcBreakdown({
  unit,
  route,
  cycles,
  doctorWanted,
  doctorAmount,
}: {
  unit: CareUnit;
  route: CareRoute;
  cycles: number;
  doctorWanted: boolean;
  doctorAmount?: number;
}) {
  const result = calculate(route, cycles, { wanted: doctorWanted, amount: doctorAmount });

  return (
    <div className="mt-3 rounded-xl bg-white p-3.5 shadow-sm" data-testid="calc-breakdown">
      <p className="text-sm font-bold text-ink">
        {unit.name} · <span className="font-semibold text-teal-700">{routeName(route)}</span>
      </p>
      <ul className="mt-2 divide-y divide-mist-100">
        {result.lines.map((l) => (
          <li key={l.key} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 py-2">
            <div className="min-w-0">
              <span className="text-sm text-ink/80">{l.label}</span>
              {l.note && <p className="text-[11px] leading-snug text-ink/50 sm:text-xs">{l.note}</p>}
            </div>
            <span className={`shrink-0 text-sm ${l.amount != null ? "font-bold text-ink" : "text-ink/55"}`}>
              {l.amount != null ? `${l.amount.toLocaleString("he-IL")} ₪` : l.text}
            </span>
          </li>
        ))}
      </ul>
      {route.priceExtra && <p className="mt-1 text-xs leading-relaxed text-ink/55">{route.priceExtra}</p>}

      <p className="mt-2.5 rounded-lg bg-teal-50 px-3 py-2 text-sm font-bold text-ink" data-testid="calc-summary">
        {result.nothingKnown
          ? "עדיין אין מחיר ידוע למסלול הזה. כדאי לבקש הצעת מחיר מהיחידה."
          : result.hasUnknown
            ? `עלות ידועה: ${result.knownTotal.toLocaleString("he-IL")} ₪, בתוספת רכיבים שטרם אומתו`
            : `עלות ידועה: ${result.knownTotal.toLocaleString("he-IL")} ₪`}
      </p>
      {route.fundingType === "healthFundArrangement" && route.numberOfCycles && (
        <p className="mt-1.5 text-[11px] leading-snug text-ink/50 sm:text-xs">מכסת הכיסוי: {route.numberOfCycles}</p>
      )}
    </div>
  );
}

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 underline-offset-4 hover:underline sm:text-sm"
    >
      {children}
      <ExternalLink className="h-3 w-3" strokeWidth={2.5} aria-hidden="true" />
    </a>
  );
}
