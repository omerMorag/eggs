"use client";

import { useMemo, useState } from "react";
import type { JourneyProgress } from "@/lib/useJourneyProgress";
import { careUnits, type CareUnit } from "@/data/careUnits";
import RegionStep, { type RegionFilter } from "./RegionStep";
import TrackTypeStep, { type TrackFilter } from "./TrackTypeStep";
import HealthFundStep, { type HealthFundFilter } from "./HealthFundStep";
import CareUnitCard from "./CareUnitCard";
import CareUnitDetail from "./CareUnitDetail";
import ComparisonBar from "./ComparisonBar";
import ComparisonTable from "./ComparisonTable";

const MAX_COMPARISON = 3;

function matchesTrack(unit: CareUnit, track: TrackFilter): boolean {
  if (track === "all") return true;
  if (track === "subsidized") return unit.fundingOptions.includes("hmoArrangement");
  return unit.type === track;
}

interface WhereToDoToolProps {
  progress: JourneyProgress;
}

/**
 * State machine ל-§2-§11: אזור → סוג מסלול → (קופה, אם רלוונטי) → תוצאות
 * → השוואה → בחירה. הכול על אותו עמוד, בלי מסכים נפרדים (§2).
 */
export default function WhereToDoTool({ progress }: WhereToDoToolProps) {
  const [region, setRegion] = useState<RegionFilter>("all");
  const [track, setTrack] = useState<TrackFilter>("all");
  const [healthFund, setHealthFund] = useState<HealthFundFilter>("all");
  const [openUnitId, setOpenUnitId] = useState<string | null>(null);
  const [comparisonIds, setComparisonIds] = useState<string[]>([]);
  const [comparisonOpen, setComparisonOpen] = useState(false);

  const showHealthFundStep = track === "subsidized" || track === "all";

  const filtered = useMemo(() => {
    const base = careUnits.filter((u) => {
      if (!u.isActive) return false;
      if (region !== "all" && u.region !== region) return false;
      return matchesTrack(u, track);
    });

    if (!showHealthFundStep || healthFund === "all") return base;

    // §4: הדגשה — ממיינת את היחידות שיש להן הסדר עם הקופה שקודם, לא מסתירה את השאר
    const matching = base.filter((u) => u.healthFunds?.includes(healthFund));
    const rest = base.filter((u) => !u.healthFunds?.includes(healthFund));
    return [...matching, ...rest];
  }, [region, track, healthFund, showHealthFundStep]);

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

  return (
    <div>
      <RegionStep value={region} onChange={setRegion} />
      <TrackTypeStep value={track} onChange={setTrack} />
      {showHealthFundStep && <HealthFundStep value={healthFund} onChange={setHealthFund} />}

      <div className="mt-6">
        <h3 className="text-sm font-bold text-ink">האפשרויות שכדאי לך לבדוק</h3>
        <p className="mt-0.5 text-xs text-ink/45">מציגה {filtered.length} מתוך {careUnits.length} יחידות</p>

        {filtered.length === 0 ? (
          <div className="mt-3 rounded-2xl border-2 border-dashed border-mist-200 p-6 text-center text-sm text-ink/50">
            אין כרגע יחידות שמתאימות לסינון הזה. אפשר להרחיב את הסינון (למשל לבחור &quot;לא משנה לי&quot;).
          </div>
        ) : (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {filtered.map((unit) => (
              <CareUnitCard
                key={unit.id}
                unit={unit}
                isSelected={progress.selectedCareUnit?.id === unit.id}
                isCompared={comparisonIds.includes(unit.id)}
                canAddToComparison={comparisonIds.length < MAX_COMPARISON}
                onOpenDetail={() => setOpenUnitId(unit.id)}
                onToggleCompare={() => toggleComparison(unit.id)}
              />
            ))}
          </div>
        )}
      </div>

      <CareUnitDetail
        unit={openUnit}
        isSelected={openUnit != null && progress.selectedCareUnit?.id === openUnit.id}
        onClose={() => setOpenUnitId(null)}
        onSelect={() => openUnit && progress.selectCareUnit(openUnit.id, openUnit.name)}
        onClearSelection={progress.clearCareUnitSelection}
      />

      <ComparisonBar count={comparisonIds.length} onCompare={() => setComparisonOpen(true)} />
      <ComparisonTable
        units={comparisonOpen ? comparisonUnits : []}
        onClose={() => setComparisonOpen(false)}
        onRemove={(id) => setComparisonIds((prev) => prev.filter((x) => x !== id))}
      />
    </div>
  );
}
