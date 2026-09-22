"use client";

import { ChevronDown } from "lucide-react";
import type { CareRoute } from "@/data/careUnits";

/**
 * אקורדיון קטן "מה כלול?" (§8) — עכשיו מקבל route בודד (לא unit) ומציג את
 * included/notIncluded החופשיים שלו, בדיוק כפי שהוזנו במקור — בלי קטגוריות
 * בדויות.
 */
export default function WhatsIncludedDetails({ route }: { route: CareRoute }) {
  return (
    <details className="group rounded-xl border-2 border-mist-200 bg-mist-50/60 p-3.5">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-sm font-semibold text-ink">
        מה כלול?
        <ChevronDown className="h-4 w-4 text-ink/40 transition-transform duration-300 group-open:rotate-180" strokeWidth={2.5} />
      </summary>
      <div className="mt-2 space-y-1.5 text-sm leading-relaxed text-ink/70">
        <p>
          <span className="font-semibold text-ink/50">כלול: </span>
          {route.included ?? "לא פורסם — יש לברר מול היחידה"}
        </p>
        {route.notIncluded && (
          <p>
            <span className="font-semibold text-ink/50">לא כלול: </span>
            {route.notIncluded}
          </p>
        )}
      </div>
    </details>
  );
}
