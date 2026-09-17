"use client";

import OptionCard from "../OptionCard";
import type { StepProps } from "./StepProps";

const OPTIONS = [
  { value: "no", label: "לא" },
  { value: "default_estimate", label: "כן, לפי הערכת ברירת מחדל" },
  { value: "known_cost", label: "כן, ואני יודעת מה העלות" },
] as const;

export default function Step4DoctorAccompaniment({ answers, updateAnswer }: StepProps) {
  return (
    <div>
      <h3 className="text-lg font-bold text-ink sm:text-xl">האם את מתכננת ליווי של רופא/ה פרטי/ת?</h3>
      <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
        {OPTIONS.map((opt) => (
          <OptionCard
            key={opt.value}
            label={opt.label}
            active={answers.doctorAccompaniment === opt.value}
            onClick={() => updateAnswer("doctorAccompaniment", opt.value)}
          />
        ))}
      </div>
      {answers.doctorAccompaniment === "known_cost" && (
        <div className="mt-4 max-w-[220px]" dir="ltr">
          <label className="mb-1 block text-xs font-semibold text-ink/55">עלות משוערת (₪ לסבב)</label>
          <input
            type="number"
            min={0}
            value={answers.doctorKnownCost ?? ""}
            onChange={(e) => updateAnswer("doctorKnownCost", e.target.value ? Number(e.target.value) : undefined)}
            className="w-full rounded-lg border border-mist-200 bg-white px-3 py-2 text-sm text-ink/80 transition-colors focus:border-teal-400"
          />
        </div>
      )}
    </div>
  );
}
