"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print inline-flex items-center gap-2 rounded-full border-2 border-mist-300 bg-white px-4 py-2 text-sm font-semibold text-ink/70 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-300 hover:text-teal-700 hover:shadow-card"
    >
      <Printer className="h-4 w-4" strokeWidth={2} />
      הדפסה / שמירה כ-PDF
    </button>
  );
}
