"use client";

import OptionCard from "../OptionCard";
import type { StepProps } from "./StepProps";

const OPTIONS = [
  { value: "public", label: "ציבורי" },
  { value: "private", label: "פרטי" },
  { value: "undecided", label: "עדיין לא החלטתי" },
] as const;

export default function Step1TreatmentTrack({ answers, updateAnswer }: StepProps) {
  return (
    <div>
      <h3 className="text-lg font-bold text-ink sm:text-xl">באיזה מסלול את מתכננת לעבור את התהליך?</h3>
      <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
        {OPTIONS.map((opt) => (
          <OptionCard
            key={opt.value}
            label={opt.label}
            active={answers.treatmentRoute === opt.value}
            onClick={() => updateAnswer("treatmentRoute", opt.value)}
          />
        ))}
      </div>
    </div>
  );
}
