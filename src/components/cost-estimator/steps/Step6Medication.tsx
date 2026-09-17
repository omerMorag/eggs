"use client";

import OptionCard from "../OptionCard";
import type { StepProps } from "./StepProps";

const OPTIONS = [
  { value: "hmo_subsidized", label: "יש לי השתתפות של קופת החולים" },
  { value: "no_subsidy", label: "ללא השתתפות" },
  { value: "unknown", label: "אני עדיין לא יודעת" },
  { value: "known_cost", label: "אני יודעת את העלות המשוערת ורוצה להזין אותה בעצמי" },
] as const;

export default function Step6Medication({ answers, updateAnswer }: StepProps) {
  return (
    <div>
      <h3 className="text-lg font-bold text-ink sm:text-xl">תרופות</h3>
      <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
        {OPTIONS.map((opt) => (
          <OptionCard
            key={opt.value}
            label={opt.label}
            active={answers.medicationMode === opt.value}
            onClick={() => updateAnswer("medicationMode", opt.value)}
          />
        ))}
      </div>
      {answers.medicationMode === "known_cost" && (
        <div className="mt-4 max-w-[220px]" dir="ltr">
          <label className="mb-1 block text-xs font-semibold text-ink/55">עלות משוערת (₪ לסבב)</label>
          <input
            type="number"
            min={0}
            value={answers.medicationKnownCost ?? ""}
            onChange={(e) => updateAnswer("medicationKnownCost", e.target.value ? Number(e.target.value) : undefined)}
            className="w-full rounded-lg border border-mist-200 bg-white px-3 py-2 text-sm text-ink/80 transition-colors focus:border-teal-400"
          />
        </div>
      )}
    </div>
  );
}
