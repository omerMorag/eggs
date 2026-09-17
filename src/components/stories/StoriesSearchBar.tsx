"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";

export interface StoriesFilters {
  q: string;
  ageRange?: string;
  cyclesCount?: number;
  treatmentRoute?: string;
  hmo?: string;
  region?: string;
}

const AGE_RANGES = ["<30", "30-34", "35-37", "38-40", "41+"];
const TREATMENT_ROUTES: [string, string][] = [
  ["public", "ציבורי"],
  ["private", "פרטי"],
];
const HMOS: [string, string][] = [
  ["clalit", "כללית"],
  ["maccabi", "מכבי"],
  ["meuhedet", "מאוחדת"],
  ["leumit", "לאומית"],
  ["none", "ללא קופה"],
  ["other", "אחר"],
];
const REGIONS: [string, string][] = [
  ["מרכז", "מרכז"],
  ["ירושלים", "ירושלים"],
  ["צפון", "צפון"],
  ["דרום", "דרום"],
  ["other", "אחר"],
];

const EMPTY_FILTERS: StoriesFilters = { q: "" };

function selectClass() {
  return "w-full rounded-lg border border-mist-200 bg-white px-3 py-2 text-sm text-ink/80 transition-colors focus:border-teal-400";
}

/**
 * שורת חיפוש + פילטרים לסיפורים. החיפוש עצמו (q) מדוב-בונס ב-400ms; שאר
 * הפילטרים משפיעים מיד. כל הסינון בפועל קורה בצד שרת (GET /api/stories) —
 * הרכיב רק בונה את אובייקט הפילטרים ומעביר אותו הלאה.
 */
export default function StoriesSearchBar({ onChange }: { onChange: (filters: StoriesFilters) => void }) {
  const [q, setQ] = useState("");
  const [filters, setFilters] = useState<Omit<StoriesFilters, "q">>({});
  const [panelOpen, setPanelOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onChange({ q, ...filters });
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, filters]);

  const activeFilterCount = Object.values(filters).filter((v) => v !== undefined && v !== "").length;

  const updateFilter = <K extends keyof typeof filters>(key: K, value: (typeof filters)[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearAll = () => {
    setQ("");
    setFilters({});
  };

  return (
    <div className="no-print">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35"
            strokeWidth={2.25}
          />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="חפשי לפי מילה, מקום או חוויה..."
            aria-label="חיפוש בסיפורים"
            className="w-full rounded-full border-2 border-mist-200 bg-white py-2.5 pe-3 ps-10 text-sm text-ink/80 shadow-sm transition-colors focus:border-teal-300"
          />
        </div>
        <button
          type="button"
          onClick={() => setPanelOpen((v) => !v)}
          aria-expanded={panelOpen}
          className={`relative flex shrink-0 items-center gap-1.5 rounded-full border-2 px-3.5 py-2.5 text-sm font-semibold transition-colors ${
            panelOpen || activeFilterCount > 0
              ? "border-teal-300 bg-teal-50/70 text-teal-700"
              : "border-mist-200 bg-white text-ink/60 hover:border-teal-200"
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" strokeWidth={2.25} />
          סינון
          {activeFilterCount > 0 && (
            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-teal-600 px-1 text-[10px] font-bold text-ink">
              {activeFilterCount}
            </span>
          )}
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform ${panelOpen ? "rotate-180" : ""}`}
            strokeWidth={2.5}
          />
        </button>
      </div>

      <div
        className={`grid transition-all duration-300 ${panelOpen ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <div className="grid gap-2.5 rounded-2xl border-2 border-mist-200 bg-mist-50/50 p-3.5 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-ink/55">טווח גיל</label>
              <select
                value={filters.ageRange ?? ""}
                onChange={(e) => updateFilter("ageRange", e.target.value || undefined)}
                className={selectClass()}
              >
                <option value="">הכול</option>
                {AGE_RANGES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-ink/55">מספר סבבים</label>
              <input
                type="number"
                min={0}
                max={50}
                value={filters.cyclesCount ?? ""}
                onChange={(e) => updateFilter("cyclesCount", e.target.value ? Number(e.target.value) : undefined)}
                className={selectClass()}
                dir="ltr"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-ink/55">מסלול</label>
              <select
                value={filters.treatmentRoute ?? ""}
                onChange={(e) => updateFilter("treatmentRoute", e.target.value || undefined)}
                className={selectClass()}
              >
                <option value="">הכול</option>
                {TREATMENT_ROUTES.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-ink/55">קופת חולים</label>
              <select
                value={filters.hmo ?? ""}
                onChange={(e) => updateFilter("hmo", e.target.value || undefined)}
                className={selectClass()}
              >
                <option value="">הכול</option>
                {HMOS.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-ink/55">אזור</label>
              <select
                value={filters.region ?? ""}
                onChange={(e) => updateFilter("region", e.target.value || undefined)}
                className={selectClass()}
              >
                <option value="">הכול</option>
                {REGIONS.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {(activeFilterCount > 0 || q) && (
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={clearAll}
                  className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-xs font-semibold text-ink/50 transition-colors hover:bg-white hover:text-deep"
                >
                  <X className="h-3.5 w-3.5" strokeWidth={2.5} />
                  איפוס סינון
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export { EMPTY_FILTERS };
