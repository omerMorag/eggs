"use client";

import { fundingPaths } from "@/data/fundingPaths";

interface FundingPathSelectorProps {
  activeIndex: number;
  onSelect: (index: number) => void;
}

/**
 * בורר ארבעת מסלולי המימון ("שימור פוריות מסיבה רפואית" / "הביטוח המשלים" /
 * "תשלום עצמי בבית חולים ציבורי" / "מסלול פרטי"). לחיצה על אפשרות מציגה
 * למטה רק את המידע הרלוונטי לאותו מסלול (ראו WhereToGoSection).
 */
export default function FundingPathSelector({ activeIndex, onSelect }: FundingPathSelectorProps) {
  return (
    <div role="tablist" aria-label="מסלולי מימון" className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
      {fundingPaths.map((path, index) => {
        const Icon = path.icon;
        const isActive = index === activeIndex;
        return (
          <button
            key={path.title}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={`funding-path-panel-${index}`}
            onClick={() => onSelect(index)}
            className={`flex min-h-[44px] flex-col items-start gap-2 rounded-2xl border-2 p-4 text-right shadow-card transition-all duration-300 ${
              isActive
                ? "border-teal-300 bg-teal-50/70 ring-2 ring-teal-200"
                : "border-mist-200 bg-white hover:border-teal-200 hover:bg-teal-50/30"
            }`}
          >
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                isActive ? "bg-teal-600 text-white" : "bg-mist-100 text-deep"
              }`}
              aria-hidden="true"
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
            </span>
            <span className="text-sm font-bold leading-snug text-ink">{path.title}</span>
          </button>
        );
      })}
    </div>
  );
}
