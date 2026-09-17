"use client";

import OptionCard from "../OptionCard";
import { hospitalPrices } from "@/data/hospitalPrices";
import type { StepProps } from "./StepProps";

const MODE_OPTIONS = [
  { value: "site_choice", label: "בחירה מתוך מקומות שמופיעים באתר" },
  { value: "not_chosen", label: "עדיין לא בחרתי" },
  { value: "manual", label: "הזנת סכום ידני" },
] as const;

/**
 * שימוש בשמות המרפאות/בתי החולים הקיימים ב-hospitalPrices.ts בלבד (ללא
 * שינוי לקובץ) — המחיר בפועל תמיד מגיע מ-cost_items (ראו costEstimatorModel),
 * לעולם לא מהמחרוזת החופשית שם.
 */
export default function Step5ClinicCost({ answers, updateAnswer }: StepProps) {
  return (
    <div>
      <h3 className="text-lg font-bold text-ink sm:text-xl">עלות המרפאה או בית החולים</h3>
      <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
        {MODE_OPTIONS.map((opt) => (
          <OptionCard
            key={opt.value}
            label={opt.label}
            active={answers.clinicMode === opt.value}
            onClick={() => updateAnswer("clinicMode", opt.value)}
          />
        ))}
      </div>

      {answers.clinicMode === "site_choice" && (
        <div className="mt-4 max-w-sm">
          <select
            value={answers.clinicChoiceName ?? ""}
            onChange={(e) => updateAnswer("clinicChoiceName", e.target.value || undefined)}
            aria-label="בחירת מרפאה/בית חולים"
            className="w-full rounded-lg border border-mist-200 bg-white px-3 py-2 text-sm text-ink/80 transition-colors focus:border-teal-400"
          >
            <option value="">בחרי מהרשימה...</option>
            {hospitalPrices.map((h) => (
              <option key={h.name} value={h.name}>
                {h.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {answers.clinicMode === "manual" && (
        <div className="mt-4 max-w-[220px]" dir="ltr">
          <label className="mb-1 block text-xs font-semibold text-ink/55">עלות משוערת (₪ לסבב)</label>
          <input
            type="number"
            min={0}
            value={answers.clinicManualAmount ?? ""}
            onChange={(e) => updateAnswer("clinicManualAmount", e.target.value ? Number(e.target.value) : undefined)}
            className="w-full rounded-lg border border-mist-200 bg-white px-3 py-2 text-sm text-ink/80 transition-colors focus:border-teal-400"
          />
        </div>
      )}
    </div>
  );
}
