"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { returnRateQa } from "@/data/chanceContent";

/**
 * שאלה נפתחת אחת, מתחת לתוצאת המחשבון וההסבר הקצר שלה — באותו עיצוב
 * מדויק כמו ChanceFaq.tsx (אקורדיון בודד, לא חלק מרשימת השאלות הנפוצות
 * הקבועה של שלוש השאלות). נפרדת בכוונה מ-ChanceResult: שיעור הנשים
 * שחוזרות להשתמש בביציות הוא נתון שונה לגמרי מהסיכוי המחושב ללידת חי
 * (מחקרים שונים, שאלות שונות) — הפרדה חזותית מלאה מונעת ערבוב בין השניים.
 */
export default function ReturnRateAccordion() {
  const [open, setOpen] = useState(false);
  const panelId = "return-rate-panel";

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border-2 border-mist-200 bg-white shadow-card">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center justify-between gap-3 p-4 text-right sm:p-5"
      >
        <span className="text-sm font-bold text-ink sm:text-base">{returnRateQa.question}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-teal-700 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
          strokeWidth={2.5}
        />
      </button>
      <div
        id={panelId}
        className={`grid overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0">
          <div className="px-4 pb-4 sm:px-5 sm:pb-5">
            <p className="text-sm leading-relaxed text-ink/70">{returnRateQa.answer}</p>
            <ul className="mt-3 space-y-1 text-xs leading-relaxed text-ink/50">
              {returnRateQa.sources.map((source) => (
                <li key={source.url}>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="underline decoration-dotted underline-offset-2 hover:text-teal-700"
                  >
                    {source.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
