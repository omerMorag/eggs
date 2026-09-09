"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { journeySteps } from "@/data/steps";
import { testItems } from "@/data/tests";

const STORAGE_KEY = "egg-freezing-journey:progress:v1";

interface StoredProgress {
  steps: number[];
  tests: number[];
}

function readStorage(): StoredProgress {
  if (typeof window === "undefined") {
    return { steps: [], tests: [] };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { steps: [], tests: [] };
    const parsed = JSON.parse(raw) as Partial<StoredProgress>;
    return {
      steps: Array.isArray(parsed.steps) ? parsed.steps : [],
      tests: Array.isArray(parsed.tests) ? parsed.tests : [],
    };
  } catch {
    return { steps: [], tests: [] };
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

export function useJourneyProgress() {
  const [hydrated, setHydrated] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [completedTests, setCompletedTests] = useState<Set<number>>(new Set());

  // טעינה חד-פעמית מה-localStorage בצד הלקוח
  useEffect(() => {
    const stored = readStorage();
    setCompletedSteps(new Set(stored.steps));
    setCompletedTests(new Set(stored.tests));
    setHydrated(true);
  }, []);

  // שמירה בכל שינוי, רק אחרי שהושלמה הטעינה הראשונית
  useEffect(() => {
    if (!hydrated) return;
    writeStorage({
      steps: Array.from(completedSteps),
      tests: Array.from(completedTests),
    });
  }, [completedSteps, completedTests, hydrated]);

  const toggleStep = useCallback((id: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleTest = useCallback((id: number) => {
    setCompletedTests((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setCompletedSteps(new Set());
    setCompletedTests(new Set());
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
    toggleStep,
    toggleTest,
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
