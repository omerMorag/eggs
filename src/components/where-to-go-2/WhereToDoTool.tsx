"use client";

import { useMemo, useState } from "react";
import { ListFilter, TableProperties } from "lucide-react";
import type { JourneyProgress } from "@/lib/useJourneyProgress";
import { careUnits, routesForFund, type CareUnit, type HealthFund, type Setting } from "@/data/careUnits";
import RegionStep, { type RegionFilter } from "./RegionStep";
import HealthFundStep, { type HealthFundFilter } from "./HealthFundStep";
import CareUnitCard from "./CareUnitCard";
import CareUnitDetail from "./CareUnitDetail";
import ComparisonBar from "./ComparisonBar";
import ComparisonTable from "./ComparisonTable";
import SummaryTableModal from "./SummaryTableModal";

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

/**
 * אשף חדש בן 2 שלבים בלבד (תיקון-שורש WHERE TO DO, 22.9.2026): קופה ← אזור.
 * אין יותר שאלת ציבורי/פרטי/מסובסד באשף עצמו — זו הייתה טעות מודל (ר'
 * ההסבר הארוך בראש careUnits.ts) והוסרה כליל יחד עם TrackTypeStep.tsx.
 * מיד אחרי שני השלבים מוצגות התוצאות, בלי שאלות נוספות. "מסגרת"
 * (ציבורי/פרטי) זמינה רק כפילטר משני, אופציונלי, מעל התוצאות.
 */
export default function WhereToDoTool({ progress }: WhereToDoToolProps) {
  const [fund, setFund] = useState<HealthFundFilter>("all");
  const [region, setRegion] = useState<RegionFilter>("all");
  const [setting, setSetting] = useState<SettingFilter>("all");
  const [openUnitId, setOpenUnitId] = useState<string | null>(null);
  const [comparisonIds, setComparisonIds] = useState<string[]>([]);
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);

  const selectedFund: HealthFund | null = fund === "all" ? null : fund;

  const base = useMemo(() => {
    return careUnits.filter((u) => {
      if (!u.isActive) return false;
      if (region !== "all" && u.region !== region) return false;
      if (setting !== "all" && u.setting !== setting) return false;
      return true;
    });
  }, [region, setting]);

  const { matched, others } = useMemo(() => {
    if (!selectedFund) return { matched: [] as CareUnit[], others: base };
    const m = base.filter((u) => routesForFund(u, selectedFund).length > 0);
    const o = base.filter((u) => routesForFund(u, selectedFund).length === 0);
    return { matched: m, others: o };
  }, [base, selectedFund]);

  // §4: כשנבחרה קופה — מתאימים קודם, אבל שום יחידה לא מוסתרת (others נשאר ברשימה)
  const orderedResults = selectedFund ? [...matched, ...others] : base;

  const openUnit = openUnitId ? (careUnits.find((u) => u.id === openUnitId) ?? null) : null;
  const comparisonUnits = comparisonIds
    .map((id) => careUnits.find((u) => u.id === id))
    .filter((u): u is CareUnit => Boolean(u));

  const toggleComparison = (id: string) => {
    setComparisonIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_COMPARISON) return prev;
      return [...prev, id];
    });
  };

  const renderCard = (unit: CareUnit) => (
    <CareUnitCard
      key={unit.id}
      unit={unit}
      selectedFund={selectedFund}
      isSelected={progress.selectedCareUnit?.id === unit.id}
      isCompared={comparisonIds.includes(unit.id)}
      canAddToComparison={comparisonIds.length < MAX_COMPARISON}
      onOpenDetail={() => setOpenUnitId(unit.id)}
      onToggleCompare={() => toggleComparison(unit.id)}
    />
  );

  return (
    <div>
      <div className="space-y-5">
        <HealthFundStep value={fund} onChange={setFund} />
        <RegionStep value={region} onChange={setRegion} />
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-bold text-ink">האפשרויות הרלוונטיות לך</h3>
        <p className="mt-0.5 text-xs leading-relaxed text-ink/45">
          ריכזנו את המקומות והמסלולים הרלוונטיים לפי הקופה והאזור שבחרת.
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-ink/45">
            <ListFilter className="h-3.5 w-3.5" strokeWidth={2.5} />
            מסגרת:
          </span>
          {SETTING_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setSetting(opt.value)}
              className={`min-h-[32px] rounded-full px-3 text-xs font-semibold transition-colors duration-200 ${
                setting === opt.value ? "bg-teal-600 text-ink shadow-sm" : "bg-mist-100 text-ink/60 hover:bg-mist-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setSummaryOpen(true)}
            className="mr-auto inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 underline-offset-4 hover:underline"
          >
            <TableProperties className="h-3.5 w-3.5" strokeWidth={2.5} />
            לראות את כל המקומות והמחירים ←
          </button>
        </div>

        {orderedResults.length === 0 ? (
          <div className="mt-4 rounded-2xl border-2 border-dashed border-mist-200 p-6 text-center text-sm text-ink/50">
            אין כרגע יחידות שמתאימות לסינון הזה. אפשר להרחיב את הסינון (למשל לבחור &quot;לא משנה לי&quot;).
          </div>
        ) : selectedFund ? (
          <div className="mt-4 space-y-6">
            {matched.length > 0 ? (
              <div>
                <h4 className="text-xs font-bold text-teal-700">מתאים לקופה שלך</h4>
                <div className="mt-2 grid gap-3 sm:grid-cols-2">{matched.map(renderCard)}</div>
              </div>
            ) : (
              <div className="rounded-2xl border-2 border-warm-200 bg-warm-50/60 p-4 text-sm leading-relaxed text-ink/70">
                עדיין לא מצאנו הסדר מאומת של {selectedFund} עם בית חולים ספציפי באזור הזה — מומלץ לבדוק ישירות מול
                הקופה אם קיים מסלול כזה. בינתיים, הנה אפשרויות בתשלום עצמי באזור שבחרת.
              </div>
            )}
            {others.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-ink/50">אפשרויות נוספות באזור</h4>
                <div className="mt-2 grid gap-3 sm:grid-cols-2">{others.map(renderCard)}</div>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">{orderedResults.map(renderCard)}</div>
        )}
      </div>

      <CareUnitDetail
        unit={openUnit}
        selectedFund={selectedFund}
        isSelected={openUnit != null && progress.selectedCareUnit?.id === openUnit.id}
        onClose={() => setOpenUnitId(null)}
        onSelect={() => openUnit && progress.selectCareUnit(openUnit.id, openUnit.name)}
        onClearSelection={progress.clearCareUnitSelection}
      />

      <ComparisonBar count={comparisonIds.length} onCompare={() => setComparisonOpen(true)} />
      <ComparisonTable
        units={comparisonOpen ? comparisonUnits : []}
        selectedFund={selectedFund}
        onClose={() => setComparisonOpen(false)}
        onRemove={(id) => setComparisonIds((prev) => prev.filter((x) => x !== id))}
      />

      <SummaryTableModal open={summaryOpen} units={orderedResults} onClose={() => setSummaryOpen(false)} />
    </div>
  );
}
