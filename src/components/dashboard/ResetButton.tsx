"use client";

import { useState } from "react";
import { RotateCcw, Check, X } from "lucide-react";

export default function ResetButton({ onReset }: { onReset: () => void }) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div className="no-print flex items-center gap-2 rounded-full border-2 border-warm-300 bg-warm-100/70 px-3 py-2 text-sm">
        <span className="text-ink/70">לאפס את כל ההתקדמות?</span>
        <button
          type="button"
          onClick={() => {
            onReset();
            setConfirming(false);
          }}
          className="inline-flex items-center gap-1 rounded-full bg-warm-500 px-2.5 py-1 font-semibold text-white transition-colors hover:bg-warm-500/90"
        >
          <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
          כן, אפסי
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-medium text-ink/60 transition-colors hover:bg-white/70"
        >
          <X className="h-3.5 w-3.5" strokeWidth={2.5} />
          ביטול
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="no-print inline-flex items-center gap-2 rounded-full border-2 border-mist-300 bg-white px-4 py-2 text-sm font-semibold text-ink/70 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-300 hover:text-teal-700 hover:shadow-card"
    >
      <RotateCcw className="h-4 w-4" strokeWidth={2} />
      איפוס התקדמות
    </button>
  );
}
