"use client";

import type { ReactNode } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface WizardStepperProps {
  step: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
  children: ReactNode;
}

/** מעטפת שלב באשף: פס התקדמות + תוכן השלב + ניווט קודם/הבא */
export default function WizardStepper({ step, totalSteps, onBack, onNext, nextLabel, children }: WizardStepperProps) {
  const progressPercent = Math.round((step / totalSteps) * 100);

  return (
    <div className="animate-fadeUp">
      <div className="mb-5">
        <div className="flex items-center justify-between text-xs font-semibold text-ink/50">
          <span>
            שלב <span dir="ltr">{step}</span> מתוך <span dir="ltr">{totalSteps}</span>
          </span>
          <span dir="ltr">{progressPercent}%</span>
        </div>
        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-mist-200">
          <div
            className="h-full rounded-full bg-gradient-to-l from-teal-500 to-teal-400 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div>{children}</div>

      <div className="mt-7 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={step === 1}
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-ink/60 transition-colors hover:text-teal-700 disabled:pointer-events-none disabled:opacity-0"
        >
          <ChevronRight className="h-4 w-4" strokeWidth={2.25} />
          שלב קודם
        </button>
        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-6 py-3 text-sm font-bold text-ink shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-500 hover:shadow-cardHover active:translate-y-0"
        >
          {nextLabel ?? "המשך"}
          <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
