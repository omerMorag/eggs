"use client";

import { useEffect, useRef, useState } from "react";

/** סף הנראות שמפעיל את הרצף — כ-35% מגובה הרכיב גלוי במסך */
const VISIBILITY_THRESHOLD = 0.35;

/**
 * הגורם המפעיל את רצף האנימציה של מסך הסיום (CompletionCelebration) —
 * לא state חדש של התקדמות, רק state מקומי-חזותי לרכיב עצמו:
 *
 * - `reducedMotion`: אותו דפוס זיהוי בדיוק כמו ב-useIntroJourneyTransition.ts
 *   הקיים (matchMedia + מאזין לשינוי), כדי לשמור על עקביות בפרויקט.
 * - `started`: כש-reducedMotion פעיל, מוצג מיד מצב הסיום הסופי בלי אנימציה —
 *   אין טעם/צורך ב-IntersectionObserver במקרה הזה (אין מה "להתחיל").
 *   אחרת, `started` נדלק פעם אחת בלבד ברגע שהקונטיינר חוצה כ-35% נראות
 *   (IntersectionObserver), ואז ה-observer מתנתק מיד — גם כדי לא להריץ
 *   שוב באותה טעינת עמוד (unmount/remount מלא של הרכיב, למשל אחרי סימון/ביטול
 *   שלב, כן יריץ את הרצף מחדש — זו התנהגות מכוונת, לא "replay" על רעד גלילה).
 */
export function useCelebrationTrigger() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    function handleChange(e: MediaQueryListEvent) {
      setReducedMotion(e.matches);
    }
    mq.addEventListener?.("change", handleChange);
    return () => mq.removeEventListener?.("change", handleChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setStarted(true);
      return;
    }
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      // גיבוי לסביבה בלי IntersectionObserver — עדיף להציג את מצב הסיום
      // מאשר להשאיר את המסך "תקוע" במצב הפתיחה החורפי לנצח.
      setStarted(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= VISIBILITY_THRESHOLD) {
            setStarted(true);
            observer.disconnect();
          }
        }
      },
      { threshold: [0, VISIBILITY_THRESHOLD, 1] }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return { containerRef, started, reducedMotion };
}
