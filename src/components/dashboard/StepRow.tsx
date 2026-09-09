"use client";

import { ChevronDown, Info } from "lucide-react";
import type { JourneyStep } from "@/data/types";
import { formatRichText } from "@/lib/richText";

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

  return (
    <li
      ref={(el) => setRowRef(step.id, el)}
      className={`scroll-mt-28 rounded-2xl border-2 bg-white p-4 shadow-card transition-all duration-300 sm:p-5 ${
        isDone ? "border-teal-200 bg-teal-50/30" : "border-mist-200"
      }`}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <input
          id={checkboxId}
          type="checkbox"
          checked={isDone}
          onChange={() => onToggleDone(step.id)}
          className="mt-1 h-5 w-5 shrink-0 cursor-pointer accent-teal-600"
          aria-describedby={`${checkboxId}-label`}
        />

        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors duration-300 sm:h-11 sm:w-11 ${
            isDone ? "bg-teal-100 text-teal-700" : "bg-mist-100 text-deep"
          }`}
          aria-hidden="true"
        >
          <Icon className="h-5 w-5" strokeWidth={2} />
        </span>

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
                isDone ? "text-teal-800 line-through decoration-teal-300" : "text-ink"
              }`}
            >
              {step.title}
            </span>
            {step.parallel && !hideParallelBadge && (
              <span className="inline-flex items-center rounded-full bg-warm-100 px-2.5 py-0.5 text-xs font-medium text-warm-500 ring-1 ring-inset ring-warm-300/60">
                אפשר במקביל
              </span>
            )}
          </label>
          <p className="mt-1.5 text-sm leading-relaxed text-ink/60">{step.shortDescription}</p>

          <button
            type="button"
            onClick={() => onToggleExpand(step.id)}
            aria-expanded={isExpanded}
            aria-controls={panelId}
            className="mt-2.5 inline-flex items-center gap-1 text-sm font-medium text-teal-700 transition-colors hover:text-teal-800"
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
            className={`grid overflow-hidden transition-all duration-300 ease-in-out print:mt-3 print:grid-rows-[1fr] print:opacity-100 ${
              isExpanded
                ? "mt-3 grid-rows-[1fr] opacity-100"
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
