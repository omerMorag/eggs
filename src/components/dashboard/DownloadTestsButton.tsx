"use client";

import { Download } from "lucide-react";

/**
 * כפתור "הורדת קובץ הבדיקות" — לפי בקשת המשתמשת: ורוד ובסגנון הכפתור
 * המקורי (bg-teal-600, pill, הרמה קלה ב-hover), אבל צר יותר מהמקור (בלי
 * w-full, ריווח פנימי מצומצם) כדי שירגיש קומפקטי ונעים יותר. בפועל מפעיל
 * את דיאלוג ההדפסה של הדפדפן (window.print()) על הדף כפי שהוא נראה כרגע —
 * כך שהקובץ שיורד משקף את המצב האמיתי (צ'ק-בוקסים, תאריכים, סטטוס תוקף),
 * ולא קובץ PDF סטטי.
 */
export default function DownloadTestsButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print inline-flex items-center gap-2 rounded-full bg-teal-600 px-4 py-2 text-sm font-bold tracking-[0.01em] text-ink shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-500 hover:shadow-cardHover active:translate-y-0"
    >
      <Download className="h-4 w-4" strokeWidth={2.25} />
      הורדת קובץ הבדיקות
    </button>
  );
}
