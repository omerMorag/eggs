"use client";

import { Sparkles } from "lucide-react";

interface AboutLinkProps {
  onClick: () => void;
  focusable?: boolean;
}

/**
 * קישור קטן וצנוע בתפריט — "להכיר את מקפיאות" — שמחזיר בכל עת למסך
 * הפתיחה ולמקטע ההיכרות האישי (בדיוק אותה התנהגות כמו לחיצה על הלוגו,
 * ר' AppShell.tsx: handleGoHome). מחוץ ל-navSections/NavList בכוונה
 * (כמו AdminNavLink) — זו לא "קפיצה לאזור באתר" אלא הזמנה חוזרת למסך
 * הפתיחה עצמו, ולכן עיצובה עדין ומשני, לא כמו שאר פריטי הניווט.
 */
export default function AboutLink({ onClick, focusable = true }: AboutLinkProps) {
  return (
    <button
      type="button"
      tabIndex={focusable ? undefined : -1}
      onClick={onClick}
      className="flex items-center gap-2.5 rounded-xl px-3.5 py-2 text-xs font-semibold text-ink/45 transition-colors duration-200 hover:bg-mist-100 hover:text-ink/75"
    >
      <Sparkles className="h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden="true" />
      להכיר את מקפיאות
    </button>
  );
}
