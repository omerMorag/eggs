"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

export type AppScreen = "intro" | "journey";

/** משך האנימציה בפועל (בטווח 800–900ms שהתבקש) + חיץ קטן לפני שחרור הנעילה */
const TRANSITION_MS = 880;
const LOCK_BUFFER_MS = 60;
/** משך מקוצר משמעותית כש-prefers-reduced-motion מבקש פחות תנועה */
const REDUCED_MOTION_MS = 1;
const REDUCED_MOTION_LOCK_MS = 50;

/** סף תזוזה (פיקסלים) לפני שגלגלת עכבר/משטח מגע נחשבת "מחווה מכוונת" ולא רעד קטן */
const WHEEL_THRESHOLD = 35;
const SWIPE_THRESHOLD = 50;

function isFocusInFormOrButton(): boolean {
  const el = document.activeElement as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    tag === "BUTTON" ||
    tag === "A" ||
    el.isContentEditable
  );
}

/**
 * מנגנון המעבר בין "מסך הפתיחה" (intro) ל"מסך המסלול" (journey) — שני
 * מסכים מלאים שנעים כיחידה אחת (translateY על עטיפת מסך הפתיחה, ראו
 * AppShell.tsx), לא scrollIntoView/גלילה חלקה לאזור בהמשך העמוד.
 *
 * החלטת ארכיטקטורה מרכזית: רק מסך הפתיחה (IntroScreen) מקבל
 * transform/position:fixed — תוכן המסלול עצמו (Sidebar, כותרת מובייל,
 * האזור הראשי) נשאר תמיד בזרימת המסמך הרגילה, בלי שום עטיפה עם transform.
 * הסיבה: ל-Sidebar יש position:fixed שחייב להישאר יחסי ל-viewport האמיתי —
 * אם היינו עוטפים אותו באב עם transform, הוא היה הופך ל-containing block
 * חדש ל-fixed/absolute וכל המיקום היה נשבר. כך גם ה-scroll הרגיל של
 * המסלול (אחרי הכניסה) נשאר scroll מסמך רגיל לגמרי — בלי container
 * מלאכותי עם overflow פנימי, בלי סיכון רגרסיה בשום מנגנון קיים.
 *
 * "הכניסה" למסלול מרגישה כמו push (שני המסכים נעים יחד) כי מסך הפתיחה
 * הוא overlay אטום שמכסה את כל המסך; ברגע שהוא מחליק ונעלם, תוכן המסלול —
 * שכבר יושב במקומו האמיתי מתחת אליו, נעול בראש הדף — נחשף במלואו במכה
 * חדה אחת. התוצאה הוויזואלית זהה למעבר "אמיתי" בין שני מסכים, בלי הסיכון
 * הטכני של transform על עץ שמכיל fixed.
 */
export function useIntroJourneyTransition() {
  const [screen, setScreen] = useState<AppScreen>("intro");
  const [locked, setLocked] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const lockedRef = useRef(false);
  const reducedMotionRef = useRef(false);
  const introScrollRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // בדיקת hash ראשונית — כניסה ישירה לכתובת עם #tag תדלג על מסך הפתיחה
  // לגמרי. useLayoutEffect (ולא useEffect) כדי שהתיקון יקרה לפני הציור
  // הראשון של הדפדפן ולא יבצבץ רגע של מסך הפתיחה.
  useLayoutEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      setScreen("journey");
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    reducedMotionRef.current = mq.matches;
    function handleChange(e: MediaQueryListEvent) {
      setReducedMotion(e.matches);
      reducedMotionRef.current = e.matches;
    }
    mq.addEventListener?.("change", handleChange);
    return () => mq.removeEventListener?.("change", handleChange);
  }, []);

  // נועלים גלילה בגוף המסמך כל עוד מסך הפתיחה פעיל, או כל עוד אנימציית
  // מעבר בעיצומה (לכל כיוון) — כדי שאף שבריר שנייה של המסלול לא ייחשף
  // מוקדם מדי. overscroll-behavior מונע "pull to refresh" טבעי שיתנגש
  // עם המחווה שלנו בראש מסך המסלול.
  useEffect(() => {
    document.body.style.overscrollBehaviorY = "contain";
    return () => {
      document.body.style.overscrollBehaviorY = "";
    };
  }, []);

  useEffect(() => {
    const shouldLock = screen === "intro" || locked;
    document.body.style.overflow = shouldLock ? "hidden" : "";
  }, [screen, locked]);

  const runTransition = useCallback((next: AppScreen) => {
    if (lockedRef.current) return;
    lockedRef.current = true;
    setLocked(true);
    setScreen(next);

    if (next === "journey") {
      try {
        window.history.replaceState(null, "", "#roadmap");
      } catch {
        // לא קריטי — אם זה נכשל (למשל בסביבת iframe מוגבלת) פשוט ממשיכים
      }
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    const wait = reducedMotionRef.current
      ? REDUCED_MOTION_LOCK_MS
      : TRANSITION_MS + LOCK_BUFFER_MS;
    timeoutRef.current = setTimeout(() => {
      lockedRef.current = false;
      setLocked(false);
    }, wait);
  }, []);

  const goToJourney = useCallback(() => runTransition("journey"), [runTransition]);
  const goToIntro = useCallback(() => runTransition("intro"), [runTransition]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // מאזינים ל"קדימה" (מסך הפתיחה -> המסלול): גלגלת, מגע, מקלדת, מוצמדים
  // רק כל עוד מסך הפתיחה פעיל בפועל.
  useEffect(() => {
    if (screen !== "intro") return;

    let touchStartY = 0;

    function isAtIntroBottom(): boolean {
      const el = introScrollRef.current;
      if (!el) return true;
      return el.scrollHeight - el.scrollTop - el.clientHeight < 2;
    }

    function handleWheel(e: WheelEvent) {
      if (lockedRef.current) {
        e.preventDefault();
        return;
      }
      if (e.deltaY > WHEEL_THRESHOLD && isAtIntroBottom()) {
        e.preventDefault();
        goToJourney();
      }
    }

    function handleKeydown(e: KeyboardEvent) {
      if (lockedRef.current) return;
      if (isFocusInFormOrButton()) return;
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " " || e.code === "Space") {
        e.preventDefault();
        goToJourney();
      }
    }

    function handleTouchStart(e: TouchEvent) {
      touchStartY = e.touches[0]?.clientY ?? 0;
    }

    function handleTouchEnd(e: TouchEvent) {
      if (lockedRef.current) return;
      const endY = e.changedTouches[0]?.clientY ?? touchStartY;
      const delta = touchStartY - endY;
      if (delta > SWIPE_THRESHOLD && isAtIntroBottom()) {
        goToJourney();
      }
    }

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeydown);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeydown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [screen, goToJourney]);

  // מאזינים ל"אחורה" (המסלול -> מסך הפתיחה): רק כשנמצאים ממש בראש הדף
  // (scrollY === 0) וממשיכים לגלול מעלה / להחליק מטה. בכוונה לא preventDefault
  // כאן — אין scroll hijacking גלובלי במסלול, רק תגובה נקודתית לגבול הדף.
  useEffect(() => {
    if (screen !== "journey") return;

    let touchStartY = 0;
    let trackingFromTop = false;

    function handleWheel(e: WheelEvent) {
      if (lockedRef.current) return;
      if (window.scrollY <= 0 && e.deltaY < -WHEEL_THRESHOLD) {
        goToIntro();
      }
    }

    function handleTouchStart(e: TouchEvent) {
      touchStartY = e.touches[0]?.clientY ?? 0;
      trackingFromTop = window.scrollY <= 0;
    }

    function handleTouchMove(e: TouchEvent) {
      if (lockedRef.current || !trackingFromTop) return;
      const currentY = e.touches[0]?.clientY ?? touchStartY;
      const delta = currentY - touchStartY;
      if (window.scrollY <= 0 && delta > SWIPE_THRESHOLD) {
        goToIntro();
      }
    }

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [screen, goToIntro]);

  return {
    screen,
    locked,
    reducedMotion,
    introScrollRef,
    goToJourney,
    goToIntro,
    transitionMs: reducedMotion ? REDUCED_MOTION_MS : TRANSITION_MS,
  };
}
