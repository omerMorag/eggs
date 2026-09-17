"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import {
  DEFAULT_WIZARD_ANSWERS,
  wizardAnswersSchema,
  type WizardAnswers,
} from "@/lib/validation/costEstimateSchemas";
import { computeEstimate, type CostItemRow, type EstimateResult } from "./costEstimatorModel";

const STORAGE_KEY = "egg-freezing-journey:cost-estimator:v1";
export const TOTAL_STEPS = 7;

interface StoredEstimatorState {
  answers: WizardAnswers;
  step: number;
  hasCalculated: boolean;
}

function readStorage(): StoredEstimatorState {
  const fallback: StoredEstimatorState = { answers: DEFAULT_WIZARD_ANSWERS, step: 1, hasCalculated: false };
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    const answersResult = wizardAnswersSchema.safeParse(parsed.answers);
    return {
      answers: answersResult.success ? answersResult.data : DEFAULT_WIZARD_ANSWERS,
      step: typeof parsed.step === "number" ? parsed.step : 1,
      hasCalculated: Boolean(parsed.hasCalculated),
    };
  } catch {
    return fallback;
  }
}

function writeStorage(data: StoredEstimatorState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage עלול להיות לא זמין (מצב פרטי/מכסה) — נכשל בשקט
  }
}

/**
 * מצב מחשבון העלות: מקומי-תחילה (localStorage), בדיוק כמו useJourneyProgress —
 * עובד במלואו במצב אורחת, בלי אף קריאת רשת מלבד GET /api/cost-items
 * הציבורי. שמירה בענן (saveToCloud) היא הפעולה היחידה שדורשת התחברות.
 */
export function useCostEstimator() {
  const { status } = useSession();
  const [hydrated, setHydrated] = useState(false);
  const [answers, setAnswers] = useState<WizardAnswers>(DEFAULT_WIZARD_ANSWERS);
  const [step, setStep] = useState(1);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [costItems, setCostItems] = useState<CostItemRow[]>([]);
  const [priceLastUpdatedAt, setPriceLastUpdatedAt] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  // טעינה חד-פעמית מ-localStorage
  useEffect(() => {
    const stored = readStorage();
    setAnswers(stored.answers);
    setStep(stored.step);
    setHasCalculated(stored.hasCalculated);
    setHydrated(true);
  }, []);

  // שמירה בכל שינוי
  useEffect(() => {
    if (!hydrated) return;
    writeStorage({ answers, step, hasCalculated });
  }, [answers, step, hasCalculated, hydrated]);

  // שליפת מחירים — ציבורי, לא תלוי בהתחברות, עובד גם במצב אורחת
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/cost-items", { cache: "no-store" });
        if (!res.ok || cancelled) return;
        const data = await res.json();
        if (cancelled) return;
        setCostItems(Array.isArray(data.items) ? data.items : []);
        setPriceLastUpdatedAt(data.lastUpdatedAt ?? null);
      } catch {
        // best-effort — במקרה כשל פשוט אין מחירים, הכל יוצג כ"טרם עודכן"
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const updateAnswer = useCallback(<K extends keyof WizardAnswers>(key: K, value: WizardAnswers[K]) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }, []);

  const goToStep = useCallback((next: number) => {
    setStep(Math.min(Math.max(next, 1), TOTAL_STEPS));
  }, []);

  const calculate = useCallback(() => setHasCalculated(true), []);

  const changeAnswers = useCallback(() => {
    setHasCalculated(false);
    setStep(1);
  }, []);

  const reset = useCallback(() => {
    setAnswers(DEFAULT_WIZARD_ANSWERS);
    setStep(1);
    setHasCalculated(false);
    setSaveStatus("idle");
  }, []);

  const result: EstimateResult = useMemo(() => computeEstimate(answers, costItems), [answers, costItems]);

  const saveToCloud = useCallback(
    async (label?: string) => {
      if (status !== "authenticated") return false;
      setSaveStatus("saving");
      try {
        const res = await fetch("/api/cost-estimates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ label, inputData: answers, minTotal: result.totalMin, maxTotal: result.totalMax }),
        });
        setSaveStatus(res.ok ? "saved" : "error");
        return res.ok;
      } catch {
        setSaveStatus("error");
        return false;
      }
    },
    [answers, result.totalMin, result.totalMax, status]
  );

  return {
    hydrated,
    answers,
    updateAnswer,
    step,
    goToStep,
    totalSteps: TOTAL_STEPS,
    hasCalculated,
    calculate,
    changeAnswers,
    reset,
    result,
    priceLastUpdatedAt,
    canSaveToCloud: status === "authenticated",
    saveStatus,
    saveToCloud,
  };
}

export type CostEstimator = ReturnType<typeof useCostEstimator>;
