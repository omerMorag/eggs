"use client";

import { AlertCircle } from "lucide-react";
import { preCalculatorInfo } from "@/data/chanceContent";

/**
 * כרטיס מידע קצר וקבוע מעל שדות המחשבון — חלק רגיל מזרימת העמוד, לא
 * חלונית/פופ-אפ ולא דורש "אישור" כלשהו. הקישור בתחתית **לא** hash אמיתי
 * (href="#chance-sources") בכוונה: מזהי ה-hash באתר הזה משמשים את מנגנון
 * הניווט הראשי בין האזורים (#roadmap, #my-chances וכו', ר' navSections.ts/
 * useHashSection.ts) — hash לא-מוכר היה "נופל" ל-DEFAULT_SECTION ומנווט
 * בטעות חזרה ל"המסלול שלי". במקום זה, גלילה פנימית רגילה עם scrollIntoView
 * אל האלמנט עם id="chance-sources" בתחתית העמוד (ר' MyChancesSection.tsx).
 */
export default function PreCalculatorInfoCard() {
  const handleScrollToSources = () => {
    document.getElementById("chance-sources")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="mb-6 flex gap-3 rounded-2xl border-2 border-teal-100 bg-teal-50/60 p-4 sm:p-5">
      <span
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700"
        aria-hidden="true"
      >
        <AlertCircle className="h-4 w-4" strokeWidth={2.25} />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-bold text-ink sm:text-[15px]">{preCalculatorInfo.heading}</p>
        <p className="mt-1 text-xs leading-relaxed text-ink/70 sm:text-sm">{preCalculatorInfo.body}</p>
        <button
          type="button"
          onClick={handleScrollToSources}
          className="mt-2 text-xs font-semibold text-teal-700 underline decoration-dotted underline-offset-2 transition-colors hover:text-teal-800 sm:text-[13px]"
        >
          {preCalculatorInfo.linkLabel}
        </button>
      </div>
    </div>
  );
}
