"use client";

import type { ReactNode } from "react";
import { ChevronDown, ListChecks } from "lucide-react";

/**
 * §14: כל התוכן ההסברתי שהיה קודם ראשי בעמוד (בורר מסלולי המימון + כל
 * הטבלאות/הטקסט) עדיין קיים במלואו — רק לא נמחק שורה אחת ממנו — אבל זז
 * לתחתית העמוד, תחת "לפני שאת בוחרת", מקופל כברירת מחדל (<details>) כדי
 * שהמידע יימסר בהדרגה (§20) ולא כפסקה ענקית פתוחה מיד עם הטעינה.
 */
export default function PreDecisionAccordions({ children }: { children: ReactNode }) {
  return (
    <section className="mt-12 sm:mt-16">
      <details className="group rounded-2xl border-2 border-mist-200 bg-white shadow-card">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-5 sm:p-6">
          <span className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-700 ring-1 ring-inset ring-teal-100">
              <ListChecks className="h-[18px] w-[18px]" strokeWidth={2} />
            </span>
            <span className="font-sans text-lg font-bold tracking-tight text-ink sm:text-xl">לפני שאת בוחרת</span>
          </span>
          <ChevronDown
            className="h-5 w-5 shrink-0 text-ink/40 transition-transform duration-300 group-open:rotate-180"
            strokeWidth={2.5}
          />
        </summary>
        <div className="border-t border-mist-100 p-5 sm:p-6">
          <p className="mb-5 text-sm leading-relaxed text-ink/60">
            כל ההסברים המפורטים על מסלולי המימון, מחירי בתי החולים, קופות החולים ורכיבי העלות — במקום אחד.
          </p>
          {children}
        </div>
      </details>
    </section>
  );
}
