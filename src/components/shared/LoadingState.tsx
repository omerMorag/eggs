"use client";

import { Loader2 } from "lucide-react";

/** מצב טעינה כללי — עקבי בכל האתר (סיפורים, הערכות עלות שמורות וכו') */
export default function LoadingState({ label = "טוענת..." }: { label?: string }) {
  return (
    <p className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-mist-200 p-6 text-center text-sm text-ink/50">
      <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.25} />
      {label}
    </p>
  );
}
