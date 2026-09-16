"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { journeySteps } from "@/data/steps";
import { testItems } from "@/data/tests";

const STORAGE_KEY = "egg-freezing-journey:progress:v1";

interface StoredProgress {
  steps: number[];
  /** נשמר לצורכי תאימות לאחור בלבד — נגזר כעת מ-testSubItems, ראו migration ב-load */
  tests: number[];
  /** מפתחות בפורמט "testId:subIndex" — כל רכיב במיני-הצ'קליסט של כל בדיקה */
  testSubItems: string[];
  /** מפתח: testId, ערך: תאריך ביצוע (YYYY-MM-DD) שהוזן ידנית לכל בדיקה */
  testDates: Record<number, string>;
}

function readStorage(): StoredProgress {
  if (typeof window === "undefined") {
    return { steps: [], tests: [], testSubItems: [], testDates: {} };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { steps: [], tests: [], testSubItems: [], testDates: {} };
    const parsed = JSON.parse(raw) as Partial<StoredProgress> & {
      // תאימות לאחור: גרסה קודמת שמרה כאן { date, instructions } לכל בדיקה
      testNotes?: Record<number, { date?: string }>;
    };
    const testDates: Record<number, string> = {};
    if (parsed.testDates && typeof parsed.testDates === "object") {
      Object.assign(testDates, parsed.testDates);
    } else if (parsed.testNotes && typeof parsed.testNotes === "object") {
      // מיגרציה מהמבנה הקודם (testNotes.date) לפני שהוסר שדה ההנחיות החופשי
      Object.entries(parsed.testNotes).forEach(([testId, note]) => {
        if (note?.date) testDates[Number(testId)] = note.date;
      });
    }
    return {
      steps: Array.isArray(parsed.steps) ? parsed.steps : [],
      tests: Array.isArray(parsed.tests) ? parsed.tests : [],
      testSubItems: Array.isArray(parsed.testSubItems) ? parsed.testSubItems : [],
      testDates,
    };
  } catch {
    return { steps: [], tests: [], testSubItems: [], testDates: {} };
  }
}

function writeStorage(data: StoredProgress) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage may be unavailable (private mode / quota) — fail silently
  }
}

/** מספר הרכיבים הניתנים לסימון בתוך בדיקה נתונה — לפחות 1 (fallback לבדיקה בלי subItems מוגדרים) */
function subItemCount(testId: number): number {
  const test = testItems.find((t) => t.id === testId);
  return test?.subItems && test.subItems.length > 0 ? test.subItems.length : 1;
}

export function useJourneyProgress() {
  const [hydrated, setHydrated] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  // מפתח כל איבר: `${testId}:${subIndex}` — מקור האמת היחיד להתקדמות בבדיקות
  const [completedTestSubItems, setCompletedTestSubItems] = useState<Set<string>>(new Set());
  // מפתח: testId, ערך: תאריך ביצוע שהוזן ידנית לכל בדיקה
  const [testDates, setTestDates] = useState<Record<number, string>>({});

  // טעינה חד-פעמית מה-localStorage בצד הלקוח
  useEffect(() => {
    const stored = readStorage();
    setCompletedSteps(new Set(stored.steps));
    setTestDates(stored.testDates);

    // מיגרציה: נתוני התקדמות ישנים (מלפני המיני-צ'קליסט) שמרו רק אילו בדיקות
    // "הושלמו" כמקשה אחת ב-tests. כדי לא לאבד את זה, כל בדיקה שהייתה מסומנת
    // כהושלמה הופכת כעת לבדיקה שכל הרכיבים שלה מסומנים.
    const subItemSet = new Set(stored.testSubItems);
    stored.tests.forEach((testId) => {
      const count = subItemCount(testId);
      for (let i = 0; i < count; i += 1) subItemSet.add(`${testId}:${i}`);
    });
    setCompletedTestSubItems(subItemSet);

    setHydrated(true);
  }, []);

  const completedTests = useMemo(() => {
    const done = new Set<number>();
    testItems.forEach((test) => {
      const count = subItemCount(test.id);
      let allChecked = true;
      for (let i = 0; i < count; i += 1) {
        if (!completedTestSubItems.has(`${test.id}:${i}`)) {
          allChecked = false;
          break;
        }
      }
      if (allChecked) done.add(test.id);
    });
    return done;
  }, [completedTestSubItems]);

  // שמירה בכל שינוי, רק אחרי שהושלמה הטעינה הראשונית
  useEffect(() => {
    if (!hydrated) return;
    writeStorage({
      steps: Array.from(completedSteps),
      tests: Array.from(completedTests),
      testSubItems: Array.from(completedTestSubItems),
      testDates,
    });
  }, [completedSteps, completedTests, completedTestSubItems, testDates, hydrated]);

  const toggleStep = useCallback((id: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  /** מסמנת/מבטלת רכיב בודד במיני-הצ'קליסט של בדיקה (למשל AMH בתוך "פרופיל הורמונלי") */
  const toggleTestSubItem = useCallback((testId: number, subIndex: number) => {
    setCompletedTestSubItems((prev) => {
      const next = new Set(prev);
      const key = `${testId}:${subIndex}`;
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  /** קיצור דרך על כל הבדיקה: אם לא הכול מסומן — מסמנת הכול; אם הכול כבר מסומן — מבטלת הכול */
  const toggleTest = useCallback((testId: number) => {
    const count = subItemCount(testId);
    setCompletedTestSubItems((prev) => {
      const next = new Set(prev);
      let allChecked = true;
      for (let i = 0; i < count; i += 1) {
        if (!next.has(`${testId}:${i}`)) {
          allChecked = false;
          break;
        }
      }
      for (let i = 0; i < count; i += 1) {
        const key = `${testId}:${i}`;
        if (allChecked) next.delete(key);
        else next.add(key);
      }
      return next;
    });
  }, []);

  /** מעדכנת את תאריך הביצוע שהוזן ידנית לבדיקה נתונה (מחרוזת ריקה = ניקוי) */
  const updateTestDate = useCallback((testId: number, date: string) => {
    setTestDates((prev) => {
      if (!date) {
        const next = { ...prev };
        delete next[testId];
        return next;
      }
      return { ...prev, [testId]: date };
    });
  }, []);

  const reset = useCallback(() => {
    setCompletedSteps(new Set());
    setCompletedTestSubItems(new Set());
    setTestDates({});
  }, []);

  const totalSteps = journeySteps.length;
  const totalTests = testItems.length;

  const doneStepsCount = completedSteps.size;
  const doneTestsCount = completedTests.size;

  const nextStep = useMemo(
    () => journeySteps.find((step) => !completedSteps.has(step.id)) ?? null,
    [completedSteps]
  );

  const progressPercent = useMemo(() => {
    const total = totalSteps + totalTests;
    if (total === 0) return 0;
    return Math.round(((doneStepsCount + doneTestsCount) / total) * 100);
  }, [doneStepsCount, doneTestsCount, totalSteps, totalTests]);

  const allStepsCompleted = doneStepsCount === totalSteps;
  const hasAnyProgress = doneStepsCount > 0 || doneTestsCount > 0;

  return {
    hydrated,
    completedSteps,
    completedTests,
    completedTestSubItems,
    testDates,
    toggleStep,
    toggleTest,
    toggleTestSubItem,
    updateTestDate,
    reset,
    totalSteps,
    totalTests,
    doneStepsCount,
    doneTestsCount,
    nextStep,
    progressPercent,
    allStepsCompleted,
    hasAnyProgress,
  };
}

export type JourneyProgress = ReturnType<typeof useJourneyProgress>;
