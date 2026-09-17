"use client";

import OptionCard from "../OptionCard";
import type { StepProps } from "./StepProps";

const OPTIONS = [
  { value: "1", label: "סבב אחד" },
  { value: "2", label: "שני סבבים" },
  { value: "3", label: "שלושה" },
  { value: "custom", label: "מספר מותאם אישית" },
] as const;

export default function Step3CycleCount({ answers, updateAnswer }: StepProps) {
  return (
    <div>
      <h3 className="text-lg font-bold text-ink sm:text-xl">כמה סבבים תרצי לחשב?</h3>
      <div className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        {OPTIONS.map((opt) => (
          <OptionCard
            key={opt.value}
            label={opt.label}
            active={answers.cyclesMode === opt.value}
            onClick={() => updateAnswer("cyclesMode", opt.value)}
          />
        ))}
      </div>
      {answers.cyclesMode === "custom" && (
        <div className="mt-4 max-w-[200px]" dir="ltr">
          <input
            type="number"
            min={1}
            max={20}
            value={answers.cyclesCustomCount ?? ""}
            onChange={(e) => updateAnswer("cyclesCustomCount", e.target.value ? Number(e.target.value) : undefined)}
            placeholder="מספר סבבים"
            aria-label="מספר סבבים מותאם אישית"
            className="w-full rounded-lg border border-mist-200 bg-white px-3 py-2 text-sm text-ink/80 transition-colors focus:border-teal-400"
          />
        </div>
      )}
    </div>
  );
}
