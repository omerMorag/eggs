"use client";

import { useCallback, useLayoutEffect, useState } from "react";

export interface HeroScrollTransition {
  /** האם לרנדר <HeroIntro/> כלל */
  showHero: boolean;
  /** האם Sidebar/MobileHeader גלויים (מקביל ל-journeyChromeVisible הישן) */
  chromeVisible: boolean;
  /** prefers-reduced-motion, נבדק ב-mount ומעודכן אם המשתמשת משנה את ההעדפה */
  reducedMotion: boolean;
  /** HeroIntro קורא לזה פעם אחת כשהמעבר הסתיים (סוף ה-pin, או מיד ב-reducedMotion) */
  onHeroComplete: () => void;
  /** ללחיצה על הלוגו — "חוזרת" למסך הפתיחה, בדיוק כמו ההתנהגות הקיימת היום */
  resetHero: () => void;
}

/**
 * שולט רק ב"מתי" — מתי מוצג ה-Hero ומתי חוזרים לראות את ה-Sidebar/Header.
 * אנימציית הגלילה עצמה (pin/scrub) חיה לגמרי בתוך HeroIntro.tsx; ה-hook
 * הזה לא יודע כלום על GSAP.
 *
 * מחליף את useIntroJourneyTransition.ts הישן (מסך overlay דיסקרטי עם
 * translateY) — כאן אין יותר state machine "intro"/"journey" עם מחוות
 * גלילה/מגע/מקלדת ידניות; ה-Hero הוא סקשן רגיל בזרימת המסמך, וה-pin
 * האמיתי (ב-HeroIntro) הוא זה שיוצר את תחושת "מסך קבוע בזמן שגוללים".
 */
export function useHeroScrollTransition(): HeroScrollTransition {
  const [showHero, setShowHero] = useState(true);
  const [chromeVisible, setChromeVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // בדיקת hash ראשונית — כניסה ישירה לכתובת עם #tag (למשל #tests) מדלגת
  // על ה-Hero לגמרי, בדיוק כמו ההתנהגות הקיימת ב-hook הישן.
  // useLayoutEffect כדי שהתיקון יקרה לפני הציור הראשון של הדפדפן.
  useLayoutEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
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

  // ב-reducedMotion: HeroIntro קורא ל-onHeroComplete מיד ב-mount (כדי
  // ש-Sidebar/Header יהיו גלויים מההתחלה) — אבל שם showHero=false היה
  // מסיר את ה-Hero מה-DOM באותו רגע, לפני שהוא בכלל צויר על המסך. ב-
  // reducedMotion צריך את שני הדברים בו-זמנית: "מקפיאות רגיל ↓ Roadmap
  // רגיל" — כלומר Hero *נשאר* מוצג כסקשן סטטי, ו-Chrome גם גלוי מיד.
  // רק במעבר המונפש (pin אמיתי) יש טעם להסיר את ה-Hero אחרי שהושלם —
  // אחרת נשאר spacer ריק וגדול בזרימת המסמך לצמיתות.
  const onHeroComplete = useCallback(() => {
    setChromeVisible(true);
    if (!reducedMotion) {
      setShowHero(false);
    }
  }, [reducedMotion]);

  const resetHero = useCallback(() => {
    setShowHero(true);
    // ב-reducedMotion ה-Hero ממילא תמיד מוצג — אין טעם/צורך להסתיר את
    // ה-Chrome שוב (זו רק תזוזה מיותרת למשתמשת שמעדיפה כמה שפחות תנועה).
    if (!reducedMotion) {
      setChromeVisible(false);
    }
    if (typeof window !== "undefined") {
      // behavior: "instant" בכוונה, לא ברירת המחדל — globals.css מגדיר
      // `html { scroll-behavior: smooth }` גלובלית, וגלילה "רכה" כאן הייתה
      // מתנגשת עם ה-scrollTo המפורש שב-HeroIntro.tsx (שרץ מיד אחרי, ברגע
      // שהוא נטען מחדש) ומשאירה את הדף במקום לא-צפוי.
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [reducedMotion]);

  return { showHero, chromeVisible, reducedMotion, onHeroComplete, resetHero };
}
