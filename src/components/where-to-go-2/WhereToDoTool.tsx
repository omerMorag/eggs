"use client";

import { useMemo, useRef, useState } from "react";
import { ListFilter, TableProperties } from "lucide-react";
import type { JourneyProgress } from "@/lib/useJourneyProgress";
import { careUnits, FUND_PLANS, routesForFund, type CareUnit, type Setting } from "@/data/careUnits";
import BeforeChoosingCard from "./BeforeChoosingCard";
import RouteCalculator, { type RegionFilter } from "./RouteCalculator";
import CareUnitCard from "./CareUnitCard";
import ComparisonBar from "./ComparisonBar";
import ComparisonResults, { type ComparedItem } from "./ComparisonResults";
import SummaryTableModal from "./SummaryTableModal";
import { displayedRoute, usesFundRoute, type RouteSelection } from "./routeSelection";

const MAX_COMPARISON = 3;

type SettingFilter = "all" | Setting;

const SETTING_OPTIONS: { value: SettingFilter; label: string }[] = [
  { value: "all", label: "הכול" },
  { value: "public", label: "ציבורי" },
  { value: "private", label: "פרטי" },
];

interface WhereToDoToolProps {
  progress: JourneyProgress;
}

/** השוואה = מקום + מסלול מסוים (לא רק מקום), כדי שמחירים לא יתערבבו */
interface CompareKey {
  unitId: string;
  routeId: string;
}

/**
 * "איפה כדאי לעשות?" — מסלול אחד רציף: כרטיסיית הסבר ← מחשבון מסלול
 * (דרך מימון, קופה ורובד, אזור, מספר סבבים) ← כרטיסי מקומות שמציגים את
 * המסלול והמחיר לפי הבחירה ← השוואה. בחירת מקום בכרטיס מעדכנת את המחשבון.
 * הכול עובד בלי התחברות (state מקומי בלבד; "בחרתי" נשמר דרך
 * useJourneyProgress, שעובד גם כאורחת).
 */
export default function WhereToDoTool({ progress }: WhereToDoToolProps) {
  const [selection, setSelection] = useState<RouteSelection>({ path: "undecided", fund: null, plan: "yes" });
  const [region, setRegion] = useState<RegionFilter>("all");
  const [setting, setSetting] = useState<SettingFilter>("all");
  const [cycles, setCycles] = useState(1);
  const [doctorWanted, setDoctorWanted] = useState(false);
  const [doctorAmount, setDoctorAmount] = useState<number | undefined>(undefined);
  const [calcUnitId, setCalcUnitId] = useState<string | null>(null);
  const [compare, setCompare] = useState<CompareKey[]>([]);
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);

  const calcRef = useRef<HTMLDivElement>(null);
  const comparisonHeadingRef = useRef<HTMLHeadingElement>(null);

  const medicalMode = selection.path === "medical";
  const fundMode = usesFundRoute(selection);

  const base = useMemo(
    () =>
      careUnits.filter((u) => {
        if (!u.isActive) return false;
        if (region !== "all" && u.region !== region) return false;
        if (setting !== "all" && u.setting !== setting) return false;
        return true;
      }),
    [region, setting]
  );

  const { matched, others } = useMemo(() => {
    if (!usesFundRoute(selection)) return { matched: [] as CareUnit[], others: base };
    const fund = selection.fund;
    return {
      matched: base.filter((u) => routesForFund(u, fund).length > 0),
      others: base.filter((u) => routesForFund(u, fund).length === 0),
    };
  }, [base, selection]);

  const scrollTo = (el: HTMLElement | null) => {
    if (!el) return;
    const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    el.focus({ preventScroll: true });
  };

  // המחשבון מחשב תמיד לפי המסלול שמוצג כרגע בכרטיס של אותו מקום
  const calcUnit = calcUnitId ? careUnits.find((u) => u.id === calcUnitId) : undefined;
  const calcRoute = calcUnit ? displayedRoute(calcUnit, selection) : undefined;
  const target = calcUnit && calcRoute ? { unit: calcUnit, route: calcRoute } : null;

  const pickForCalculator = (unitId: string, scroll: boolean) => {
    setCalcUnitId(unitId);
    if (scroll) requestAnimationFrame(() => scrollTo(calcRef.current));
  };

  const comparedItems: ComparedItem[] = compare
    .map(({ unitId, routeId }) => {
      const unit = careUnits.find((u) => u.id === unitId);
      const route = unit?.routes.find((r) => r.id === routeId);
      return unit && route ? { unit, route } : null;
    })
    .filter((x): x is ComparedItem => x != null);

  const updateCompare = (next: CompareKey[]) => {
    setCompare(next);
    if (next.length < 2) setComparisonOpen(false);
  };

  const toggleCompare = (unit: CareUnit) => {
    const route = displayedRoute(unit, selection);
    if (!route) return;
    if (compare.some((c) => c.unitId === unit.id)) {
      updateCompare(compare.filter((c) => c.unitId !== unit.id));
    } else if (compare.length < MAX_COMPARISON) {
      updateCompare([...compare, { unitId: unit.id, routeId: route.id }]);
    }
  };

  const openComparison = () => {
    setComparisonOpen(true);
    requestAnimationFrame(() => scrollTo(comparisonHeadingRef.current));
  };

  const renderCard = (unit: CareUnit) => {
    const route = displayedRoute(unit, selection);
    if (!route) return null;
    return (
      <CareUnitCard
        key={unit.id}
        unit={unit}
        route={route}
        medicalMode={medicalMode}
        isCompared={compare.some((c) => c.unitId === unit.id)}
        compareFull={compare.length >= MAX_COMPARISON}
        isInCalculator={calcUnitId === unit.id}
        isSelected={progress.selectedCareUnit?.id === unit.id}
        onToggleCompare={() => toggleCompare(unit)}
        onCalculate={() => pickForCalculator(unit.id, true)}
        onSelect={() => {
          progress.selectCareUnit(unit.id, unit.name);
          if (!medicalMode) pickForCalculator(unit.id, false);
        }}
        onClearSelection={progress.clearCareUnitSelection}
      />
    );
  };

  const resultsTitle = fundMode
    ? `מקומות עם מסלול ${FUND_PLANS[selection.fund!]}`
    : selection.path === "selfPay"
      ? "מקומות בתשלום עצמי"
      : medicalMode
        ? "המקומות — לידיעתך"
        : "כל המקומות";

  return (
    <div className="space-y-5 sm:space-y-6">
      <BeforeChoosingCard />

      <RouteCalculator
        ref={calcRef}
        selection={selection}
        onSelectionChange={setSelection}
        region={region}
        onRegionChange={setRegion}
        cycles={cycles}
        onCyclesChange={setCycles}
        doctorWanted={doctorWanted}
        onDoctorWantedChange={setDoctorWanted}
        doctorAmount={doctorAmount}
        onDoctorAmountChange={setDoctorAmount}
        target={target}
        units={fundMode ? [...matched, ...others] : base}
        onPickUnit={(id) => pickForCalculator(id, false)}
      />

      <section aria-labelledby="places-title">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 id="places-title" className="text-base font-bold text-ink sm:text-lg">
              {resultsTitle}
            </h2>
            <p className="mt-0.5 text-xs text-ink/55">
              {fundMode ? matched.length : base.length} מקומות{region !== "all" ? ` באזור ${region}` : ""}.
              מסלול עם ✓ נבדק מול מקור רשמי; ״בבירור״ — עוד לא אומת.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSummaryOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 underline-offset-4 hover:underline"
          >
            <TableProperties className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
            כל המקומות והמחירים בטבלה
          </button>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-ink/50">
            <ListFilter className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
            סוג יחידה:
          </span>
          {SETTING_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              aria-pressed={setting === opt.value}
              onClick={() => setSetting(opt.value)}
              className={`min-h-[32px] rounded-full px-3 text-xs font-semibold transition-colors ${
                setting === opt.value ? "bg-teal-600 text-ink shadow-sm" : "bg-mist-100 text-ink/60 hover:bg-mist-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {base.length === 0 ? (
          <div className="mt-4 rounded-2xl border-2 border-dashed border-mist-200 p-6 text-center text-sm text-ink/55">
            אין מקומות שמתאימים לסינון הזה. אפשר לבחור ״כל הארץ״ או סוג יחידה אחר.
          </div>
        ) : fundMode ? (
          <div className="mt-4 space-y-6">
            {matched.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">{matched.map(renderCard)}</div>
            ) : (
              <p className="rounded-2xl border-2 border-mist-200 bg-mist-50 p-4 text-sm leading-relaxed text-ink/70">
                לא מצאנו באזור הזה יחידה שמופיעה במקור רשמי כחלק מ{FUND_PLANS[selection.fund!]}. כדאי לבדוק מול{" "}
                {selection.fund} אם יש יחידה נוספת בהסדר. בינתיים, הנה המקומות באזור בתשלום עצמי.
              </p>
            )}
            {others.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-ink/60">מקומות נוספים באזור — בתשלום עצמי</h3>
                <p className="mt-0.5 text-xs text-ink/50">
                  לא מצאנו מקור שמקשר אותם ל{FUND_PLANS[selection.fund!]}. זה לא אומר שאין הסדר, אבל כדאי לברר.
                </p>
                <div className="mt-2 grid gap-3 sm:grid-cols-2">{others.map(renderCard)}</div>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">{base.map(renderCard)}</div>
        )}
      </section>

      {comparisonOpen && comparedItems.length >= 2 && (
        <ComparisonResults
          ref={comparisonHeadingRef}
          items={comparedItems}
          onRemove={(routeId) => updateCompare(compare.filter((c) => c.routeId !== routeId))}
          onClose={() => setComparisonOpen(false)}
        />
      )}

      {/* ריווח כדי שהפס הדביק לא יסתיר את התוכן האחרון */}
      {compare.length > 0 && <div className="h-20" aria-hidden="true" />}

      <ComparisonBar
        count={compare.length}
        max={MAX_COMPARISON}
        onCompare={openComparison}
        onClear={() => updateCompare([])}
      />

      <SummaryTableModal open={summaryOpen} units={base} onClose={() => setSummaryOpen(false)} />
    </div>
  );
}
