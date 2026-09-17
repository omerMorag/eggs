"use client";

import type { ReactNode } from "react";

interface EmptyStateProps {
  message: string;
  /** "filtered" — תוצאה ריקה בגלל סינון/חיפוש (dashed, ניטרלי, כמו HospitalPriceTable).
   *  "genuine" — אין עדיין תוכן בכלל (חם, לא dashed — למשל "אין עדיין סיפורים"). */
  variant?: "filtered" | "genuine";
  action?: ReactNode;
}

/** מצב ריק — שני וריאנטים לפי הסיבה לריקנות, כדי לא לבלבל "אין תוצאות לסינון" עם "אין תוכן בכלל" */
export default function EmptyState({ message, variant = "filtered", action }: EmptyStateProps) {
  if (variant === "genuine") {
    return (
      <div className="rounded-2xl border-2 border-warm-300 bg-warm-100/40 p-6 text-center">
        <p className="text-sm text-ink/70">{message}</p>
        {action && <div className="mt-3">{action}</div>}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border-2 border-dashed border-mist-200 p-6 text-center">
      <p className="text-sm text-ink/50">{message}</p>
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
