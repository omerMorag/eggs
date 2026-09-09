"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { EpilogueItem } from "@/data/types";
import { formatRichText } from "@/lib/richText";

export default function EpilogueCard({ icon: Icon, title, shortDescription, moreInfo }: EpilogueItem) {
  const [expanded, setExpanded] = useState(false);
  const panelId = `epilogue-info-${title}`;

  return (
    <div className="rounded-2xl border-2 border-mist-200 bg-white p-5 shadow-card sm:p-6">
      <div className="flex items-start gap-3 sm:gap-4">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mist-100 text-deep sm:h-11 sm:w-11"
          aria-hidden="true"
        >
          <Icon className="h-5 w-5" strokeWidth={2} />
        </span>

        <div className="min-w-0 flex-1">
          <h3 className="font-sans text-base font-bold tracking-tight text-ink sm:text-lg">{title}</h3>
          {shortDescription && (
            <p className="mt-1 text-sm leading-relaxed text-ink/60">{shortDescription}</p>
          )}

          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-controls={panelId}
            className="mt-2.5 inline-flex items-center gap-1 text-sm font-medium text-teal-700 transition-colors hover:text-teal-800"
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
              strokeWidth={2.5}
            />
            {expanded ? "הסתרת מידע נוסף" : "קרא עוד"}
          </button>

          {expanded && (
            <div
              id={panelId}
              className="mt-3 space-y-1 rounded-xl bg-mist-50 p-3.5 text-sm leading-relaxed text-ink/70"
            >
              {formatRichText(moreInfo)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
