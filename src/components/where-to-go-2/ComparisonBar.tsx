"use client";

import { ArrowLeft, X } from "lucide-react";

interface ComparisonBarProps {
  count: number;
  max: number;
  onCompare: () => void;
  onClear: () => void;
}

/**
 * פס השוואה דביק בתחתית המסך — מופיע מהמקום הראשון שנבחר ("נבחרו 1 מתוך 3"),
 * והכפתור "השווי בין המקומות" נהיה פעיל משני מקומות ומוביל ישירות לתוצאות.
 */
export default function ComparisonBar({ count, max, onCompare, onClear }: ComparisonBarProps) {
  if (count < 1) return null;
  const ready = count >= 2;

  return (
    <div
      className="fixed inset-x-0 bottom-3 z-40 flex justify-center px-3 lg:mr-0 lg:ml-[252px]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      data-testid="comparison-bar"
    >
      <div className="flex w-full max-w-xl flex-wrap items-center justify-between gap-2 rounded-2xl bg-ink px-4 py-2.5 text-white shadow-cardHover">
        <p className="text-sm font-semibold" aria-live="polite">
          נבחרו {count} מתוך {max} מקומות להשוואה
          {!ready && <span className="block text-xs font-normal text-white/70">בחרי עוד מקום אחד כדי להשוות</span>}
        </p>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onClear}
            aria-label="ניקוי ההשוואה"
            className="flex h-9 w-9 items-center justify-center rounded-full text-white/70 hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" strokeWidth={2.5} />
          </button>
          <button
            type="button"
            onClick={onCompare}
            disabled={!ready}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full bg-teal-600 px-4 text-sm font-bold text-ink transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
          >
            השווי בין המקומות
            <ArrowLeft className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
