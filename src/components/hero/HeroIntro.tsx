"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

interface HeroIntroProps {
  /** true כש-prefers-reduced-motion פעיל — מבטל את אנימציית הכניסה העדינה
   *  בלבד (התוכן פשוט מופיע ישר, בלי fade/rise). שום שינוי מבני אחר. */
  reducedMotion: boolean;
  /** נקראת בלחיצה על כפתור ה-CTA — האחריות המלאה על "מה קורה אז" (חשיפת
   *  ה-Chrome, סימון hasSeenIntro, וגלילה מדויקת לראש המסלול) נמצאת אצל
   *  AppShell.tsx; הרכיב הזה לא יודע עליה כלום. */
  onCtaClick: () => void;
  /** true כשיש למשתמשת התקדמות שמורה (מקומית/מסונכרנת) או שהיא מחוברת
   *  לגוגל — קובע רק את ניסוח כפתור ה-CTA ("המשיכי במסלול" לעומת
   *  "התחילי במסלול"). שום שינוי אחר בעיצוב/במנגנון. */
  isReturningVisitor: boolean;
}

/**
 * מסך הכניסה ("Hero"): כרזה עריכתית מינימלית — התרנגולת הראשית הקיימת של
 * המותג (public/brand/hen-full.png), הוורדמארק "מקפיאות" בגודל גדול
 * ובמשקל עדין, משפט אחד, ושורת פיצ'רים עדינה. אין כאן cards/gradients/
 * כפתור ענק — רק טיפוגרפיה, קומפוזיציה ומרווח.
 *
 * תוכן זרימה רגיל לגמרי — לא pinned ולא scroll-scrubbed. גלילה (גלגלת/
 * מגע) תמיד מגיבה מיד ומעבירה טבעית למקטע הבא (<PersonalIntroSection/>,
 * ואז המסלול); שום דבר כאן לא "תופס" את הגלילה. האנימציה היחידה היא כניסה
 * עדינה חד-פעמית ב-mount (fade+rise קצר, ~200ms) — לא קשורה לסקרול בכלל.
 */
export default function HeroIntro({ reducedMotion, onCtaClick, isReturningVisitor }: HeroIntroProps) {
  const [visible, setVisible] = useState(reducedMotion);

  useEffect(() => {
    if (reducedMotion) {
      setVisible(true);
      return;
    }
    // פריים אחד אחרי ה-mount, כדי שהדפדפן יספיק לצייר את המצב ההתחלתי
    // (opacity:0) לפני שה-transition מתחיל — אחרת אין מה להנפיש.
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, [reducedMotion]);

  return (
    <section aria-label="מקפיאות — מסך פתיחה" className="h-screen-safe flex flex-col items-center justify-center px-4 text-center">
      <div
        className="flex flex-col items-center gap-6 transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none sm:gap-7"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(14px)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/hen-full.png"
          alt="מקפיאות — תרנגולת המותג"
          className="h-auto w-40 max-w-full object-contain sm:w-56 lg:w-[340px]"
          style={{ filter: "drop-shadow(0 16px 28px rgba(36, 22, 25, 0.14))" }}
        />

        <h1
          className="text-ink"
          style={{
            fontSize: "clamp(3rem, 11vw, 9rem)",
            fontWeight: 300,
            letterSpacing: "-0.01em",
            lineHeight: 1,
          }}
        >
          מקפיאות
        </h1>

        <p className="max-w-md text-lg text-ink/70 sm:text-xl">עושות סדר בדרך להקפאת ביציות.</p>

        <p className="max-w-sm text-xs text-ink/45 sm:max-w-none sm:text-sm">
          המסלול שלי · איפה לעשות · עלויות · סיכויים · מדריכים
        </p>

        <button
          type="button"
          onClick={onCtaClick}
          className="group mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-ink/60 transition-colors hover:text-teal-600"
        >
          {isReturningVisitor ? "המשיכי במסלול" : "התחילי במסלול"}
          <ChevronDown
            className="h-4 w-4 transition-transform group-hover:translate-y-0.5"
            strokeWidth={2.25}
          />
        </button>
      </div>
    </section>
  );
}
