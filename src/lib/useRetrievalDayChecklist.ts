"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * צ'קליסט "מה לקחת איתי" בתוך מדריך "יום השאיבה" — נשמר תחת מפתח נפרד
 * ומכוון לגמרי (retrievalDayPackingChecklist), לא בתוך STORAGE_KEY של
 * useJourneyProgress. זה מכוון: הסימונים כאן הם רשימת אריזה אישית, לא חלק
 * משבעת שלבי המסלול, ואסור להם להשפיע על אחוז ההתקדמות המוצג באתר.
 */
const STORAGE_KEY = "retrievalDayPackingChecklist";

function readStorage(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((value): value is number => typeof value === "number");
  } catch {
    return [];
  }
}

function writeStorage(indices: number[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(indices));
  } catch {
    // localStorage may be unavailable (private mode / quota) — fail silently
  }
}

export function useRetrievalDayChecklist() {
  // מתחילים ריק תמיד (גם בשרת וגם בלקוח לפני ה-hydration) כדי שלא ייווצר
  // אי-התאמה בין render ראשון בשרת לזה שבדפדפן; הערכים האמיתיים מ-localStorage
  // נטענים ב-effect שרץ רק בלקוח, מיד אחרי ה-mount הראשון.
  const [checked, setChecked] = useState<Set<number>>(() => new Set());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setChecked(new Set(readStorage()));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeStorage(Array.from(checked));
  }, [checked, hydrated]);

  const toggle = useCallback((index: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }, []);

  const clear = useCallback(() => setChecked(new Set()), []);

  return { checked, toggle, clear };
}
