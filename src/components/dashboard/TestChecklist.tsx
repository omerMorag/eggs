"use client";

import { useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  Download,
  HelpCircle,
  NotebookPen,
} from "lucide-react";
import { testItems } from "@/data/tests";
import type { TestItem } from "@/data/types";

interface TestChecklistProps {
  completedTests: Set<number>;
  onToggle: (id: number) => void;
  /** מפתחות "testId:subIndex" — אילו רכיבים במיני-הצ'קליסט של כל בדיקה כבר סומנו */
  completedTestSubItems: Set<string>;
  onToggleSubItem: (testId: number, subIndex: number) => void;
  /** מפתח: testId, ערך: תאריך ביצוע (YYYY-MM-DD) שהוזן ידנית לכל בדיקה */
  testDates: Record<number, string>;
  onUpdateDate: (testId: number, date: string) => void;
}

type ValidityTone = "valid" | "expired" | "unknown" | "empty";

interface ValidityStatus {
  label: string;
  tone: ValidityTone;
}

/**
 * מחשבת האם בדיקה עדיין בתוקף לפי תאריך הביצוע שהוזן ותוקף הבדיקה הידוע
 * (test.validityDays — נתון קבוע של האתר, לא הזנה של המשתמשת). כשאין תאריך
 * או כשאין ערך תוקף אחיד לבדיקה (למשל כי הוא משתנה בין יחידות), מוצג מצב
 * ניטרלי במקום לנחש.
 */
function getValidityStatus(test: TestItem, dateStr: string | undefined): ValidityStatus {
  if (!dateStr) {
    return { label: "הזיני תאריך ביצוע כדי לראות אם בתוקף", tone: "empty" };
  }
  if (!test.validityDays) {
    return { label: "התוקף משתנה בין יחידות — יש לוודא מול היחידה שבחרת", tone: "unknown" };
  }
  const performedDate = new Date(dateStr);
  if (Number.isNaN(performedDate.getTime())) {
    return { label: "תאריך לא תקין", tone: "empty" };
  }
  const expiryDate = new Date(performedDate);
  expiryDate.setDate(expiryDate.getDate() + test.validityDays);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const formattedExpiry = expiryDate.toLocaleDateString("he-IL");
  if (expiryDate >= today) {
    return { label: `בתוקף עד ${formattedExpiry}`, tone: "valid" };
  }
  return { label: `פג תוקף (מ-${formattedExpiry})`, tone: "expired" };
}

const VALIDITY_STYLES: Record<ValidityTone, string> = {
  valid: "bg-teal-50 text-teal-700 ring-teal-200/60",
  expired: "bg-red-50 text-red-700 ring-red-200/60",
  unknown: "bg-warm-100 text-deep ring-warm-300/60",
  empty: "bg-mist-50 text-ink/45 ring-mist-200/60",
};

const VALIDITY_ICONS: Record<ValidityTone, typeof CheckCircle2> = {
  valid: CheckCircle2,
  expired: AlertTriangle,
  unknown: HelpCircle,
  empty: Calendar,
};

/**
 * צ'קליסט הבדיקות. כל בדיקה מוצגת ככרטיס Accordion בפני עצמו: במצב סגור
 * רואים כותרת + סטטוס (הושלם / לא הושלם) + מיני-צ'קליסט של הרכיבים בתוך
 * הבדיקה עצמה (למשל AMH בתוך "פרופיל הורמונלי") שניתן לסמן אחד-אחד; בפתיחה
 * מתגלה גם טקסט ההנחיה המלא (detail — תזמון/תוקף וכו') בלי שינוי. הבדיקה
 * כולה מסומנת כ"הושלמה" אוטומטית רק כשכל הרכיבים שלה מסומנים — הסימון
 * ה"ראשי" בראש הכרטיס נשאר קיים כקיצור דרך שמסמן/מבטל את כל הרכיבים יחד.
 *
 * הטבלה הקטנה שבתוך כל כרטיס: "תאריך ביצוע" הוא השדה היחיד שהמשתמשת מזינה;
 * "הנחיות מיוחדות" הוא תוכן קבוע של האתר (test.prepNote). משילוב השניים
 * מחושב אוטומטית סטטוס "בתוקף / פג תוקף" (getValidityStatus).
 */
export default function TestChecklist({
  completedTests,
  onToggle,
  completedTestSubItems,
  onToggleSubItem,
  testDates,
  onUpdateDate,
}: TestChecklistProps) {
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

              {test.subItems && test.subItems.length > 0 && (
                <ul className="flex flex-col gap-1.5 border-t border-mist-100 px-4 py-3 sm:px-5">
                  {test.subItems.map((label, index) => {
                    const subKey = `${test.id}:${index}`;
                    const isSubDone = completedTestSubItems.has(subKey);
                    const subCheckboxId = `test-subitem-${test.id}-${index}`;
                    return (
                      <li key={subKey} className="flex items-center gap-2.5">
                        <input
                          id={subCheckboxId}
                          type="checkbox"
                          checked={isSubDone}
                          onChange={() => onToggleSubItem(test.id, index)}
                          className="h-4 w-4 shrink-0 cursor-pointer accent-teal-600"
                        />
                        <label
                          htmlFor={subCheckboxId}
                          className={`cursor-pointer text-xs sm:text-sm ${
                            isSubDone ? "text-ink/40 line-through" : "text-ink/75"
                          }`}
                        >
                          {label}
                        </label>
                      </li>
                    );
                  })}
                </ul>
              )}

              {(() => {
                const dateValue = testDates[test.id] ?? "";
                const status = getValidityStatus(test, dateValue || undefined);
                const StatusIcon = VALIDITY_ICONS[status.tone];
                return (
                  <div className="border-t border-mist-100 px-4 py-3 sm:px-5">
                    <table className="w-full border-separate border-spacing-0 overflow-hidden rounded-xl border border-mist-100">
                      <thead>
                        <tr>
                          <th className="w-1/2 border-b border-l border-mist-100 bg-mist-50/60 px-3 py-1.5 text-right text-[11px] font-bold text-ink/55 sm:text-xs">
                            <span className="inline-flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5" strokeWidth={2} />
                              תאריך ביצוע
                            </span>
                          </th>
                          <th className="w-1/2 border-b border-mist-100 bg-mist-50/60 px-3 py-1.5 text-right text-[11px] font-bold text-ink/55 sm:text-xs">
                            <span className="inline-flex items-center gap-1.5">
                              <NotebookPen className="h-3.5 w-3.5" strokeWidth={2} />
                              הנחיות מיוחדות
                            </span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border-l border-mist-100 p-2 align-top">
                            <input
                              type="date"
                              value={dateValue}
                              onChange={(e) => onUpdateDate(test.id, e.target.value)}
                              aria-label={`תאריך ביצוע — ${test.title}`}
                              className="w-full rounded-lg border border-mist-200 bg-white px-2 py-1.5 text-xs text-ink/80 transition-colors focus:border-teal-400 sm:text-sm"
                            />
                          </td>
                          <td className="p-2 align-top">
                            <p className="px-1 py-1.5 text-xs leading-snug text-ink/65 sm:text-sm">
                              {test.prepNote ?? "אין הנחיה מיוחדת"}
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <p
                      className={`mt-2 flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold ring-1 ring-inset sm:text-xs ${VALIDITY_STYLES[status.tone]}`}
                    >
                      <StatusIcon className="h-3.5 w-3.5 shrink-0" strokeWidth={2.25} />
                      {status.label}
                    </p>
                  </div>
                );
              })()}

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
        className="mt-5 flex w-full items-center justify-center gap-2.5 rounded-full bg-teal-600 px-6 py-3.5 text-sm font-bold tracking-[0.01em] text-ink shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-500 hover:shadow-cardHover active:translate-y-0 sm:w-auto"
      >
        <Download className="h-4 w-4" strokeWidth={2.25} />
        הורדת קובץ הבדיקות (PDF)
      </a>
    </div>
  );
}
