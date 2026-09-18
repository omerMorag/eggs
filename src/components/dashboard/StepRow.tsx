"use client";

import { Check, ChevronDown, Info } from "lucide-react";
import type { JourneyStep } from "@/data/types";
import { formatRichText } from "@/lib/richText";
import HenIllustration, { type HenName } from "@/components/hens/HenIllustration";

/**
 * מיפוי שלב -> איור תרנגולת בכרטיס הצ'קליסט עצמו (מחליף את אייקון ה-lucide
 * הגנרי שבחלק מהשלבים). לא לכל שלב יש כרגע תרנגולת מתאימה שסופקה — שלבים
 * שאינם ברשימה ממשיכים להציג את האייקון הגנרי הרגיל, בלי שינוי. הרשימה
 * מיועדת להתמלא בהמשך ככל שיתווספו עוד איורים לשלבים 1–4.
 */
const STEP_HEN: Partial<Record<number, HenName>> = {
  5: "step-protocol",
  6: "step-monitoring",
  7: "step-retrieval",
};

interface StepRowProps {
  step: JourneyStep;
  isDone: boolean;
  isExpanded: boolean;
  onToggleDone: (id: number) => void;
  onToggleExpand: (id: number) => void;
  setRowRef: (id: number, el: HTMLLIElement | null) => void;
  hideParallelBadge?: boolean;
}

export default function StepRow({
  step,
  isDone,
  isExpanded,
  onToggleDone,
  onToggleExpand,
  setRowRef,
  hideParallelBadge = false,
}: StepRowProps) {
  const Icon = step.icon;
  const panelId = `step-info-${step.id}`;
  const checkboxId = `step-checkbox-${step.id}`;
  const henName = STEP_HEN[step.id];

  return (
    <li
      ref={(el) => setRowRef(step.id, el)}
      className={`scroll-mt-28 rounded-2xl border-2 bg-white p-3.5 shadow-card transition-all duration-300 sm:p-4 ${
        isDone ? "border-teal-200 bg-teal-50/30" : "border-mist-200"
      }`}
    >
      <div className="flex items-start gap-2.5 sm:gap-3">
        <input
          id={checkboxId}
          type="checkbox"
          checked={isDone}
          onChange={() => onToggleDone(step.id)}
          className="mt-1 h-5 w-5 shrink-0 cursor-pointer accent-teal-600"
          aria-describedby={`${checkboxId}-label`}
        />

        {henName ? (
          <HenIllustration
            name={henName}
            blob={isDone ? "mint" : "cream"}
            activeRing={isExpanded}
            doneBadge={isDone}
            className="mt-0.5"
          />
        ) : (
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors duration-300 sm:h-10 sm:w-10 ${
              isDone ? "bg-teal-100 text-teal-700" : "bg-mist-100 text-deep"
            }`}
            aria-hidden="true"
          >
            <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
          </span>
        )}

        <div className="min-w-0 flex-1">
          <label
            htmlFor={checkboxId}
            id={`${checkboxId}-label`}
            className="flex cursor-pointer flex-wrap items-center gap-x-2.5 gap-y-1"
          >
            <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-mist-100 px-2 text-xs font-bold text-deep">
              {step.id}
            </span>
            <span
              className={`text-base font-semibold sm:text-lg ${
                isDone ? "text-ink/50" : "text-ink"
              }`}
            >
              {step.title}
            </span>
            {isDone && (
              <span className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-semibold text-teal-700 ring-1 ring-inset ring-teal-300/60">
                <Check className="h-3 w-3" strokeWidth={3} />
                הושלם
              </span>
            )}
            {step.parallel && !hideParallelBadge && (
              <span className="inline-flex items-center rounded-full bg-warm-100 px-2.5 py-0.5 text-xs font-medium text-warm-500 ring-1 ring-inset ring-warm-300/60">
                אפשר במקביל
              </span>
            )}
          </label>
          <p className="mt-1 text-sm leading-relaxed text-ink/60">{step.shortDescription}</p>

          <button
            type="button"
            onClick={() => onToggleExpand(step.id)}
            aria-expanded={isExpanded}
            aria-controls={panelId}
            className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-teal-700 transition-colors hover:text-teal-800"
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-300 ${
                isExpanded ? "rotate-180" : ""
              }`}
              strokeWidth={2.5}
            />
            {isExpanded ? "הסתרת מידע נוסף" : "מידע נוסף"}
          </button>

          <div
            id={panelId}
            role="region"
            className={`grid overflow-hidden transition-all duration-300 ease-in-out print:mt-2.5 print:grid-rows-[1fr] print:opacity-100 ${
              isExpanded
                ? "mt-2.5 grid-rows-[1fr] opacity-100"
                : "hidden grid-rows-[0fr] opacity-0 print:block"
            }`}
          >
            <div className="min-h-0">
              <div className="flex items-start gap-2 rounded-xl bg-mist-50 p-3.5 text-sm leading-relaxed text-ink/70">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-deep/60" strokeWidth={2} />
                <div className="space-y-1">
                  {formatRichText(step.moreInfo)}
                  {step.readMoreHref && (
                    <a
                      href={step.readMoreHref}
                      className="mt-2 inline-block font-semibold text-teal-700 underline-offset-4 hover:text-teal-800 hover:underline"
                    >
                      {step.readMoreLabel ?? "קרא עוד"}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}
