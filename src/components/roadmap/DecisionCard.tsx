"use client";

import { GitFork, RotateCcw } from "lucide-react";
import type { PathChoice } from "./RoadmapExperience";

interface DecisionCardProps {
  choice: PathChoice;
  onChoose: (choice: NonNullable<PathChoice>) => void;
  onReset: () => void;
  hasMore: boolean;
}

export default function DecisionCard({ choice, onChoose, onReset, hasMore }: DecisionCardProps) {
  return (
    <li className="relative flex items-stretch gap-4 sm:gap-6">
      <div className="flex flex-col items-center">
        <span
          className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-deep text-white shadow-card sm:h-14 sm:w-14"
          aria-hidden="true"
        >
          <GitFork className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2} />
        </span>
        {hasMore && (
          <span className="my-1 w-px flex-1 bg-gradient-to-b from-deep/30 via-teal-200/60 to-mist-200" />
        )}
      </div>

      <div className="mb-1 flex-1 rounded-2xl border-2 border-dashed border-deep/30 bg-deep/[0.04] p-5 sm:p-6">
        {choice === null ? (
          <>
            <h3 className="font-sans text-lg font-bold tracking-tight text-ink sm:text-xl">
              את יודעת כבר איפה תעברי את התהליך?
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-ink/60">
              זה יעזור לנו להראות לך את המסלול הכי מתאים בשבילך.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onChoose("known")}
                className="rounded-full bg-deep px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-deep/90 hover:shadow-card"
              >
                כן, כבר יודעת
              </button>
              <button
                type="button"
                onClick={() => onChoose("unknown")}
                className="rounded-full border-2 border-mist-300 bg-white px-6 py-3 text-sm font-semibold text-ink/70 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-300 hover:text-teal-700 hover:shadow-card"
              >
                עוד לא בטוחה
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-ink/50">בחרת:</p>
              <p className="mt-0.5 font-sans text-base font-semibold text-ink sm:text-lg">
                {choice === "known"
                  ? "כבר יודעת איפה תעברי את התהליך"
                  : "עוד לא בטוחה איפה תעברי את התהליך"}
              </p>
            </div>
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-teal-700 transition-colors hover:bg-teal-50"
            >
              <RotateCcw className="h-3.5 w-3.5" strokeWidth={2.5} />
              לבחור מחדש
            </button>
          </div>
        )}
      </div>
    </li>
  );
}
