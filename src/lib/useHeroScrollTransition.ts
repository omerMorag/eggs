"use client";

import { useCallback, useLayoutEffect, useState } from "react";
import { hasSeenIntroInStorage } from "./useJourneyProgress";

export interface HeroScrollTransition {
  /** האם לרנדר <HeroIntro/> + <PersonalIntroSection/> כלל */
  showHero: boolean;
  /** האם Sidebar/MobileHeader גלויים */
  chromeVisible: boolean;
  /** prefers-reduced-motion, נבדק ב-mount ומעודכן אם המשתמשת משנה את ההעדפה */
  reducedMotion: boolean;
  /** נקראת כשהמסלול "הושג" בפועל — גם בלחיצה על אחד מכפתורי ה-CTA וגם
   *  בהגעה בפועל לראש המסלול בגלילה טבעית (ר' AppShell.tsx). לא מסתירה את
   *  ה-Hero/מקטע ההיכרות עצמם (הם נשארים mounted מעל המסלול בטעינת העמוד
   *  הנוכחית — אין יותר spacer מלאכותי שצריך "לפנות", ר' תיעוד showHero
   *  למטה) — רק חושפת את ה-Chrome. */
  revealChrome: () => void;
  /** מדלגת מיידית על כל חוויית הפתיחה — למשל כשמתברר, אחרי סנכרון מהשרת
   *  שהושלם רק אחרי ה-mount (מכשיר חדש למשתמשת מחוברת), שהיא כבר ראתה
   *  אותה במכשיר אחר. */
  skipHero: () => void;
  /** ללחיצה על הלוגו / קישור "להכיר את מקפיאות" — "חוזרת" למסך הפתיחה, גם
   *  אם hasSeenIntro כבר true (זו רק תצוגה חוזרת מודעת, לא "שוכחת" שהיא כבר ראתה). */
  resetHero: () => void;
}

/**
 * שולט רק ב"מתי" — מתי מוצגים ה-Hero + מקטע ההיכרות האישי (כתוכן זרימה
 * רגיל, לא pin/scrub) ומתי חוזרים לראות את ה-Sidebar/Header. אנימציות
 * הכניסה העדינות (fade/rise קצר) חיות בתוך HeroIntro.tsx/PersonalIntroSection.tsx
 * עצמם; ה-hook הזה לא יודע כלום על GSAP או על scroll-trigger כלשהו —
 * הגלילה עצמה תמיד נשארת גלילה טבעית רגילה של הדפדפן.
 *
 * showHero מוכרעת **פעם אחת** ב-mount (hash מפורש בכתובת, או hasSeenIntro
 * שמור מביקור קודם — נקרא סינכרונית מ-localStorage לפני הציור הראשון, כדי
 * שלא תהיה הבהוב של מסך הפתיחה שנעלם מיד). אחרי זה היא נשארת true לכל
 * אורך הביקור הנוכחי — כשה-Hero+מקטע ההיכרות הם תוכן זרימה רגיל (לא
 * pinned), אין סיבה "להסיר" אותם אחרי שהמשתמשת עברה אותם; הם פשוט נשארים
 * למעלה כמו כל תוכן אחר שגוללים מעליו.
 */
export function useHeroScrollTransition(): HeroScrollTransition {
  const [showHero, setShowHero] = useState(true);
  const [chromeVisible, setChromeVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // בדיקה ראשונית — גם hash מפורש בכתובת (כניסה ישירה ל-#tests וכו') וגם
  // hasSeenIntro שמור (ביקור חוזר) מדלגים על ה-Hero לגמרי. useLayoutEffect
  // כדי שהתיקון יקרה לפני הציור הראשון של הדפדפן, ובלי לחכות ל-hydration
  // של useJourneyProgress (ר' hasSeenIntroInStorage — קריאה סינכרונית נפרדת
  // ומכוונת מאותו מפתח localStorage, כדי לא לצמד את שני ה-hooks זה לזה).
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash || hasSeenIntroInStorage()) {
      setShowHero(false);
      setChromeVisible(true);
    }
  }, []);

  useLayoutEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    function handleChange(e: MediaQueryListEvent) {
      setReducedMotion(e.matches);
    }
    mq.addEventListener?.("change", handleChange);
    return () => mq.removeEventListener?.("change", handleChange);
  }, []);

  const revealChrome = useCallback(() => {
    setChromeVisible(true);
  }, []);

  const skipHero = useCallback(() => {
    setShowHero(false);
    setChromeVisible(true);
  }, []);

  const resetHero = useCallback(() => {
    setShowHero(true);
    setChromeVisible(false);
    if (typeof window !== "undefined") {
      // behavior: "instant" בכוונה, לא ברירת המחדל — globals.css מגדיר
      // `html { scroll-behavior: smooth }` גלובלית, וגלילה "רכה" כאן הייתה
      // מתנגשת עם החזרה המיידית לראש המסך שמצופה מלחיצה על הלוגו/הקישור.
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, []);

  return { showHero, chromeVisible, reducedMotion, revealChrome, skipHero, resetHero };
}
