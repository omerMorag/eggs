"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { journeySteps } from "@/data/steps";
import { testItems } from "@/data/tests";
import { fetchServerProgress, pushServerProgress } from "@/lib/syncProgress";

const STORAGE_KEY = "egg-freezing-journey:progress:v1";

export interface StoredProgress {
  /** נשמר לצורכי תאימות לאחור בלבד — נגזר כעת מ-stepTasks, ראו migration ב-load */
  steps: number[];
  /** מפתחות בפורמט "stepId:taskIndex" — כל משימה בתוך כל שלב במסלול (Roadmap 2.0) */
  stepTasks: string[];
  /** נשמר לצורכי תאימות לאחור בלבד — נגזר כעת מ-testSubItems, ראו migration ב-load */
  tests: number[];
  /** מפתחות בפורמט "testId:subIndex" — כל רכיב במיני-הצ'קליסט של כל בדיקה */
  testSubItems: string[];
  /** מפתח: testId, ערך: תאריך ביצוע (YYYY-MM-DD) שהוזן ידנית לכל בדיקה */
  testDates: Record<number, string>;
}

function emptyProgress(): StoredProgress {
  return { steps: [], stepTasks: [], tests: [], testSubItems: [], testDates: {} };
}

function readStorage(): StoredProgress {
  if (typeof window === "undefined") {
    return emptyProgress();
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyProgress();
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
      stepTasks: Array.isArray(parsed.stepTasks) ? parsed.stepTasks : [],
      tests: Array.isArray(parsed.tests) ? parsed.tests : [],
      testSubItems: Array.isArray(parsed.testSubItems) ? parsed.testSubItems : [],
      testDates,
    };
  } catch {
    return emptyProgress();
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

/** מספר המשימות בתוך שלב נתון במסלול — לפחות 1 (fallback לשלב בלי tasks מוגדרות) */
function stepTaskCount(stepId: number): number {
  const step = journeySteps.find((s) => s.id === stepId);
  return step?.tasks && step.tasks.length > 0 ? step.tasks.length : 1;
}

/** בהינתן קבוצת מפתחות "stepId:taskIndex" שסומנו — אילו מזהי שלבים שלמים (כל המשימות שלהם מסומנות) */
function deriveCompletedSteps(completedStepTasks: Set<string>): Set<number> {
  const done = new Set<number>();
  journeySteps.forEach((step) => {
    const count = stepTaskCount(step.id);
    let allChecked = true;
    for (let i = 0; i < count; i += 1) {
      if (!completedStepTasks.has(`${step.id}:${i}`)) {
        allChecked = false;
        break;
      }
    }
    if (allChecked) done.add(step.id);
  });
  return done;
}

/** מוסיפה למערך מפתחות "stepId:taskIndex" את כל המשימות של שלב נתון (migration משלב "הושלם" ישן) */
function addAllStepTasks(target: Set<string>, stepId: number) {
  const count = stepTaskCount(stepId);
  for (let i = 0; i < count; i += 1) target.add(`${stepId}:${i}`);
}

export function useJourneyProgress() {
  const [hydrated, setHydrated] = useState(false);
  // מפתח כל איבר: `${stepId}:${taskIndex}` — מקור האמת היחיד להתקדמות בשלבי המסלול
  const [completedStepTasks, setCompletedStepTasks] = useState<Set<string>>(new Set());
  // מפתח כל איבר: `${testId}:${subIndex}` — מקור האמת היחיד להתקדמות בבדיקות
  const [completedTestSubItems, setCompletedTestSubItems] = useState<Set<string>>(new Set());
  // מפתח: testId, ערך: תאריך ביצוע שהוזן ידנית לכל בדיקה
  const [testDates, setTestDates] = useState<Record<number, string>>({});

  // טעינה חד-פעמית מה-localStorage בצד הלקוח
  useEffect(() => {
    const stored = readStorage();
    setTestDates(stored.testDates);

    // מיגרציה: נתוני התקדמות ישנים (מלפני תתי-המשימות של Roadmap 2.0) שמרו
    // רק אילו שלבים "הושלמו" כמקשה אחת ב-steps, דרך checkbox ידני יחיד לכל
    // שלב. כדי לא לאבד את זה, כל שלב שהיה מסומן כהושלם הופך כעת לשלב שכל
    // המשימות שלו מסומנות.
    const stepTaskSet = new Set(stored.stepTasks);
    stored.steps.forEach((stepId) => addAllStepTasks(stepTaskSet, stepId));
    setCompletedStepTasks(stepTaskSet);

    // אותה מיגרציה בדיוק, למבנה הישן של הבדיקות (tests -> testSubItems)
    const subItemSet = new Set(stored.testSubItems);
    stored.tests.forEach((testId) => {
      const count = subItemCount(testId);
      for (let i = 0; i < count; i += 1) subItemSet.add(`${testId}:${i}`);
    });
    setCompletedTestSubItems(subItemSet);

    setHydrated(true);
  }, []);

  const completedSteps = useMemo(
    () => deriveCompletedSteps(completedStepTasks),
    [completedStepTasks]
  );

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
      stepTasks: Array.from(completedStepTasks),
      tests: Array.from(completedTests),
      testSubItems: Array.from(completedTestSubItems),
      testDates,
    });
  }, [completedSteps, completedStepTasks, completedTests, completedTestSubItems, testDates, hydrated]);

  // --- סנכרון ענן אופציונלי (Google + Upstash Redis) ---
  // מצב אורחת (לא מחוברת) ממשיך לעבוד בדיוק כמו קודם — כל הלוגיקה כאן פועלת
  // רק כש-status === "authenticated", ולעולם לא חוסמת/מעכבת את הטעינה מ-localStorage.
  const { data: session, status } = useSession();
  const userId =
    status === "authenticated"
      ? ((session?.user as { id?: string } | undefined)?.id ?? null)
      : null;

  // מזהה המשתמש/ת שעבורו/ה כבר בוצע מיזוג חד-פעמי בכניסה הנוכחית; מתאפס ביציאה
  const mergedForUserIdRef = useRef<string | null>(null);
  const pushTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // איפוס דגל המיזוג ביציאה, כדי שכניסה הבאה (גם לאותו חשבון) תמזג מחדש
  useEffect(() => {
    if (status === "unauthenticated") {
      mergedForUserIdRef.current = null;
    }
  }, [status]);

  // מיזוג חד-פעמי בכניסה: לוקח את מה שיש בשרת, מאחד עם המקומי (union), ודוחף את
  // התוצאה המאוחדת גם למקומי וגם בחזרה לשרת. פעם אחת בלבד לכל כניסה (per userId).
  useEffect(() => {
    if (!hydrated || !userId) return;
    if (mergedForUserIdRef.current === userId) return;
    mergedForUserIdRef.current = userId;

    let cancelled = false;
    (async () => {
      const serverData = await fetchServerProgress();
      if (cancelled) return;

      if (!serverData) {
        // לשרת אין נתונים עדיין — מעלים את המקומי כמות שהוא
        await pushServerProgress({
          steps: Array.from(completedSteps),
          stepTasks: Array.from(completedStepTasks),
          tests: Array.from(completedTests),
          testSubItems: Array.from(completedTestSubItems),
          testDates,
        });
        return;
      }

      // מיזוג איחוד: סימון לעולם לא "מתבטל" בטעות. גם נתוני שרת ישנים
      // (steps/tests בפורמט הישן, מלפני שהיה בהם stepTasks/testSubItems —
      // למשל התקדמות שסונכרנה ממכשיר אחר לפני שדרוג Roadmap 2.0) עוברים
      // כאן אותה מיגרציה כמו בטעינה המקומית, כדי לא לאבד אותם.
      const mergedStepTasks = new Set(completedStepTasks);
      (serverData.stepTasks ?? []).forEach((key) => mergedStepTasks.add(key));
      (serverData.steps ?? []).forEach((stepId) => addAllStepTasks(mergedStepTasks, stepId));

      const mergedSubItems = new Set(completedTestSubItems);
      (serverData.testSubItems ?? []).forEach((key) => mergedSubItems.add(key));

      const mergedDates: Record<number, string> = { ...testDates };
      Object.entries(serverData.testDates ?? {}).forEach(([testId, date]) => {
        if (date) mergedDates[Number(testId)] = date;
      });

      if (cancelled) return;
      setCompletedStepTasks(mergedStepTasks);
      setCompletedTestSubItems(mergedSubItems);
      setTestDates(mergedDates);

      const mergedSteps = Array.from(deriveCompletedSteps(mergedStepTasks));

      const mergedTests: number[] = [];
      testItems.forEach((test) => {
        const count = subItemCount(test.id);
        let allChecked = true;
        for (let i = 0; i < count; i += 1) {
          if (!mergedSubItems.has(`${test.id}:${i}`)) {
            allChecked = false;
            break;
          }
        }
        if (allChecked) mergedTests.push(test.id);
      });

      await pushServerProgress({
        steps: mergedSteps,
        stepTasks: Array.from(mergedStepTasks),
        tests: mergedTests,
        testSubItems: Array.from(mergedSubItems),
        testDates: mergedDates,
      });
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, userId]);

  // דחיפה מדוד (debounced) לשרת בכל שינוי מקומי, רק כשמחוברת וכבר בוצע המיזוג
  // הראשוני — כדי לא לדרוס את נתוני השרת לפני שהמיזוג הספיק לרוץ.
  useEffect(() => {
    if (!hydrated || !userId) return;
    if (mergedForUserIdRef.current !== userId) return;

    if (pushTimeoutRef.current) clearTimeout(pushTimeoutRef.current);
    pushTimeoutRef.current = setTimeout(() => {
      pushServerProgress({
        steps: Array.from(completedSteps),
        stepTasks: Array.from(completedStepTasks),
        tests: Array.from(completedTests),
        testSubItems: Array.from(completedTestSubItems),
        testDates,
      });
    }, 1500);

    return () => {
      if (pushTimeoutRef.current) clearTimeout(pushTimeoutRef.current);
    };
  }, [completedSteps, completedStepTasks, completedTests, completedTestSubItems, testDates, hydrated, userId]);

  /** מסמנת/מבטלת משימה בודדת בתוך שלב במסלול (Roadmap 2.0). השלב עצמו
   *  מחושב כ"הושלם" אוטומטית (derived) כשכל המשימות שלו מסומנות — אין יותר
   *  checkbox ידני נפרד לשלב כולו. */
  const toggleStepTask = useCallback((stepId: number, taskIndex: number) => {
    setCompletedStepTasks((prev) => {
      const next = new Set(prev);
      const key = `${stepId}:${taskIndex}`;
      if (next.has(key)) next.delete(key);
      else next.add(key);
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
    setCompletedStepTasks(new Set());
    setCompletedTestSubItems(new Set());
    setTestDates({});
  }, []);

  const totalSteps = journeySteps.length;
  const totalTests = testItems.length;

  const doneStepsCount = completedSteps.size;
  const doneTestsCount = completedTests.size;

  // סך כל המשימות בכל שלבי המסלול, וכמה מהן מסומנות — משמש לחישוב
  // "progress הכללי" של המסלול לפי משימות בפועל (Roadmap 2.0), לא רק לפי
  // מספר השלבים שהושלמו במלואם.
  const totalStepTasksCount = useMemo(
    () => journeySteps.reduce((sum, step) => sum + stepTaskCount(step.id), 0),
    []
  );
  const doneStepTasksCount = completedStepTasks.size;

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
    completedStepTasks,
    completedTests,
    completedTestSubItems,
    testDates,
    toggleStepTask,
    toggleTest,
    toggleTestSubItem,
    updateTestDate,
    reset,
    totalSteps,
    totalTests,
    doneStepsCount,
    doneTestsCount,
    totalStepTasksCount,
    doneStepTasksCount,
    nextStep,
    progressPercent,
    allStepsCompleted,
    hasAnyProgress,
  };
}

export type JourneyProgress = ReturnType<typeof useJourneyProgress>;
