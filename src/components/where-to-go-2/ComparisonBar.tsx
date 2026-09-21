"use client";

import { ArrowLeft } from "lucide-react";

interface ComparisonBarProps {
  count: number;
  onCompare: () => void;
}

/**
 * §10: CTA דביק שמופיע רק כש-2+ יחידות מסומנות להשוואה. במובייל צמוד
 * לתחתית המסך (עם ריפוד ל-safe-area) כדי לא לחפוף תוכן/ניווט.
 */
export default function ComparisonBar({ count, onCompare }: ComparisonBarProps) {
  if (count < 2) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <button
        type="button"
        onClick={onCompare}
        className="flex min-h-[48px] items-center gap-2 rounded-full bg-ink px-5 text-sm font-bold text-white shadow-cardHover transition-transform duration-200 hover:-translate-y-0.5"
      >
        {count} מקומות להשוואה — השווי ביניהם
        <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
      </button>
    </div>
  );
}
