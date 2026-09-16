"use client";

import { useEffect } from "react";

interface HashRedirectProps {
  /** ה-hash שאליו יש להפנות, כולל # (למשל "#roadmap") */
  hash: string;
}

/**
 * מפנה נתיב ישן (כמו /dashboard) אל האזור המתאים בתוך ה-App Shell היחיד
 * שבעמוד הבית, בלי לשכפל את הלוגיקה שלו. נשאר ריק/שקוף — ההפניה קורית
 * מיד עם ה-mount, לפני שיש משהו משמעותי לצייר על המסך.
 */
export default function HashRedirect({ hash }: HashRedirectProps) {
  useEffect(() => {
    window.location.replace(`/${hash}`);
  }, [hash]);

  return null;
}
