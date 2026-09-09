"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown } from "lucide-react";
import type { JourneyStep } from "@/data/types";
import { formatRichText } from "@/lib/richText";

interface FlowStepCardProps {
  step: JourneyStep;
  number: number;
  isLast: boolean;
}

export default function FlowStepCard({ step, number, isLast }: FlowStepCardProps) {
  const [expanded, setExpanded] = useState(false);
  const Icon = step.icon;
  const panelId = `flow-step-info-${step.id}`;

  return (
    <li className="relative flex items-stretch gap-4 sm:gap-6">
      <div className="flex flex-col items-center">
        <span
          className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-teal-700 shadow-card ring-2 ring-teal-200 transition-transform duration-300 sm:h-14 sm:w-14"
          aria-hidden="true"
        >
          <Icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2} />
        </span>
        {!isLast && (
          <span className="my-1 w-px flex-1 bg-gradient-to-b from-teal-300/70 via-teal-200/60 to-mist-200" />
        )}
      </div>

      <div className="group mb-1 flex-1 rounded-2xl border-2 border-mist-200 bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-cardHover sm:p-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-teal-50 px-2 text-xs font-bold text-teal-700 ring-1 ring-inset ring-teal-100">
            {number}
          </span>
          <h3 className="font-sans text-lg font-bold tracking-tight text-ink sm:text-xl">{step.title}</h3>
          {step.parallel && (
            <span className="inline-flex items-center rounded-full bg-warm-100 px-2.5 py-0.5 text-xs font-medium text-warm-500 ring-1 ring-inset ring-warm-300/60">
              אפשר במקביל
            </span>
          )}
        </div>
        <p className="mt-2 text-sm leading-relaxed text-ink/70 sm:text-[15px]">{step.shortDescription}</p>

        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-controls={panelId}
            className="inline-flex items-center gap-1 text-sm font-semibold text-teal-700 transition-colors hover:text-teal-800"
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
              strokeWidth={2.5}
            />
            {expanded ? "הסתרת מידע נוסף" : "קרא עוד"}
          </button>

          {step.readMoreHref && (
            <Link
              href={step.readMoreHref}
              className="group/link inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 underline-offset-4 transition-colors hover:text-teal-800 hover:underline"
            >
              {step.readMoreLabel ?? "קרא עוד"}
              <ArrowLeft
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:-translate-x-1"
                strokeWidth={2.5}
              />
            </Link>
          )}
        </div>

        {expanded && (
          <div
            id={panelId}
            className="mt-3 space-y-1 rounded-xl bg-mist-50 p-3.5 text-sm leading-relaxed text-ink/70"
          >
            {formatRichText(step.moreInfo)}
          </div>
        )}
      </div>
    </li>
  );
}
