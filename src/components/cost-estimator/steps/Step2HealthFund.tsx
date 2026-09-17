"use client";

import OptionCard from "../OptionCard";
import type { StepProps } from "./StepProps";

const OPTIONS = [
  { value: "clalit", label: "כללית" },
  { value: "maccabi", label: "מכבי" },
  { value: "meuhedet", label: "מאוחדת" },
  { value: "leumit", label: "לאומית" },
  { value: "none_other", label: "ללא קופה / אחר" },
] as const;

export default function Step2HealthFund({ answers, updateAnswer }: StepProps) {
  return (
    <div>
      <h3 className="text-lg font-bold text-ink sm:text-xl">באיזו קופת חולים את?</h3>
      <div className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {OPTIONS.map((opt) => (
          <OptionCard
            key={opt.value}
            label={opt.label}
            active={answers.hmo === opt.value}
            onClick={() => updateAnswer("hmo", opt.value)}
          />
        ))}
      </div>
    </div>
  );
}
