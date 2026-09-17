"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

/**
 * ניווט עמודים — כיוון החיצים תואם RTL: "הקודם" (ChevronRight, ימינה
 * ויזואלית) מתקדם לעמוד נמוך יותר, "הבא" (ChevronLeft) לעמוד גבוה יותר —
 * כמו בכל שאר ניווט ה-RTL באתר (ר' WizardStepper).
 */
export default function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-6 flex items-center justify-center gap-3">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-ink/60 transition-colors hover:text-teal-700 disabled:pointer-events-none disabled:opacity-30"
      >
        <ChevronRight className="h-4 w-4" strokeWidth={2.25} />
        הקודם
      </button>
      <span className="text-xs font-semibold text-ink/50">
        עמוד <span dir="ltr">{page}</span> מתוך <span dir="ltr">{totalPages}</span>
      </span>
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-ink/60 transition-colors hover:text-teal-700 disabled:pointer-events-none disabled:opacity-30"
      >
        הבא
        <ChevronLeft className="h-4 w-4" strokeWidth={2.25} />
      </button>
    </div>
  );
}
