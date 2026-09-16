"use client";

import { useState } from "react";
import { AlertCircle, Check, ChevronDown, Download } from "lucide-react";
import { testItems } from "@/data/tests";

interface TestChecklistProps {
  completedTests: Set<number>;
  onToggle: (id: number) => void;
}

/**
 * צ'קליסט הבדיקות. כל בדיקה מוצגת ככרטיס Accordion בפני עצמו: במצב סגור
 * רואים כותרת + סטטוס (הושלם / לא הושלם); בפתיחה מתגלה טקסט ההנחיה המלא
 * (detail) בלי שינוי. מבנה הנתונים הקיים (tests.ts) הוא רשימה שטוחה בלי
 * תתי-בדיקות, ולכן כל בדיקה מתפקדת כ"קבוצה" נפרדת משלה — לא הומצא מבנה
 * תתי-בדיקות חדש כדי לא לסטות מהתוכן הרפואי המקורי.
 */
export default function TestChecklist({ completedTests, onToggle }: TestChecklistProps) {
  const [openTestId, setOpenTestId] = useState<number | null>(null);

  const toggleOpen = (id: number) => {
    setOpenTestId((prev) => (prev === id ? null : id));
  };

  return (
    <div>
      <p className="mb-4 text-sm leading-relaxed text-ink/60">
        סמני מה כבר עשית, ואז השווי לרשימה הרשמית של היחידה שבחרת.
      </p>

      <ul className="flex flex-col gap-2.5 sm:gap-3">
        {testItems.map((test) => {
          const Icon = test.icon;
          const isDone = completedTests.has(test.id);
          const isOpen = openTestId === test.id;
          const checkboxId = `test-checkbox-${test.id}`;
          const panelId = `test-detail-${test.id}`;
          return (
            <li
              key={test.id}
              className={`overflow-hidden rounded-2xl border-2 bg-white shadow-card transition-colors duration-300 ${
                isDone ? "border-teal-200 bg-teal-50/30" : "border-mist-200"
              }`}
            >
              <div className="flex items-start gap-3 p-4 sm:p-5">
                <input
                  id={checkboxId}
                  type="checkbox"
                  checked={isDone}
                  onChange={() => onToggle(test.id)}
                  className="mt-1 h-5 w-5 shrink-0 cursor-pointer accent-teal-600"
                />
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                    isDone ? "bg-teal-100 text-teal-700" : "bg-mist-100 text-deep"
                  }`}
                  aria-hidden="true"
                >
                  <Icon className="h-4 w-4" strokeWidth={2} />
                </span>

                <label htmlFor={checkboxId} className="min-w-0 flex-1 cursor-pointer">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-ink sm:text-base">{test.title}</span>
                    {isDone && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-2 py-0.5 text-[11px] font-bold text-teal-700 ring-1 ring-inset ring-teal-200/60">
                        <Check className="h-3 w-3" strokeWidth={3} />
                        הושלם
                      </span>
                    )}
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() => toggleOpen(test.id)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  aria-label={isOpen ? "סגירת פרטי הבדיקה" : "פתיחת פרטי הבדיקה"}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink/50 transition-colors hover:bg-mist-100"
                >
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    strokeWidth={2.25}
                  />
                </button>
              </div>

              <div
                id={panelId}
                role="region"
                aria-hidden={!isOpen}
                className={`grid transition-all duration-300 ease-in-out ${
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="min-h-0 overflow-hidden">
                  <p className="px-4 pb-4 text-xs leading-relaxed text-ink/60 sm:px-5 sm:pb-5 sm:text-sm">
                    {test.detail}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-5 flex items-start gap-2.5 rounded-xl bg-mist-50 p-3.5 text-xs leading-relaxed text-ink/60 sm:text-sm">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-deep/50" strokeWidth={2} />
        <p>
          חשוב לדעת: זו רשימה כללית בלבד. סוג הבדיקות, התזמון והתוקף משתנים בין רופאים
          ויחידות.
        </p>
      </div>

      <a
        href="/tests-checklist.pdf"
        download="רשימת-בדיקות-הקפאת-ביציות.pdf"
        className="mt-5 flex w-full items-center justify-center gap-2.5 rounded-full bg-teal-600 px-6 py-3.5 text-sm font-bold tracking-[0.01em] text-white shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-700 hover:shadow-cardHover active:translate-y-0 sm:w-auto"
      >
        <Download className="h-4 w-4" strokeWidth={2.25} />
        הורדת קובץ הבדיקות (PDF)
      </a>
    </div>
  );
}
