"use client";

import { useLayoutEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface HeroIntroProps {
  /** true כש-prefers-reduced-motion פעיל — מבוטל pin/scrub לגמרי, הכול נשאר סקשן רגיל וסטטי */
  reducedMotion: boolean;
  /** נקרא פעם אחת כשהמעבר הסתיים (שחרור ה-pin), או מיד ב-mount כש-reducedMotion */
  onComplete: () => void;
}

/**
 * מסך הכניסה החדש ("Hero"): כרזה עריכתית מינימלית — התרנגולת הראשית
 * הקיימת של המותג (אותה תמונה מ-Logo.tsx, public/brand/hen-full.png),
 * הוורדמארק "מקפיאות" בגודל גדול ובמשקל עדין, משפט אחד, ושורת פיצ'רים
 * עדינה. אין כאן cards/gradients/כפתור ענק — רק טיפוגרפיה, קומפוזיציה
 * ומרווח, לפי הבקשה המפורשת.
 *
 * מנגנון הגלילה: האלמנט הפנימי (pinRef) הוא גם ה-trigger וגם היעד
 * ל-pin — טכניקת GSAP הסטנדרטית ("pin: true" על אותו אלמנט, עם end
 * יחסי כמו "+=180%"). GSAP בעצמו יוצר spacer בגובה הנכון, כך שאין צורך
 * במעטפת עם height מלאכותי — מרחק הגלילה נגזר ישירות מה-end.
 *
 * ב-reducedMotion: אין pin/scrub בכלל — Hero מוצג כסקשן רגיל וסטטי מעל
 * ה-Roadmap, ו-onComplete נקרא מיד ב-mount (Sidebar/Header גלויים
 * מההתחלה, בדיוק "Hero רגיל ↓ Roadmap רגיל" שהתבקש).
 */
export default function HeroIntro({ reducedMotion, onComplete }: HeroIntroProps) {
  const pinRef = useRef<HTMLDivElement | null>(null);
  const henRef = useRef<HTMLImageElement | null>(null);
  const wordmarkRef = useRef<HTMLHeadingElement | null>(null);
  const taglineRef = useRef<HTMLParagraphElement | null>(null);
  const featureLineRef = useRef<HTMLParagraphElement | null>(null);
  const ctaRef = useRef<HTMLButtonElement | null>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  // onComplete עלול להגיע כ-closure חדש בכל render (הוא נוצר מחדש ב-hook
  // ההורה); שומרים אותו ב-ref כדי שה-callbacks של GSAP (שנוצרים פעם אחת
  // בתוך ה-context) תמיד יקראו לגרסה העדכנית בלי לגרום ל-effect לרוץ מחדש.
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useLayoutEffect(() => {
    if (reducedMotion) {
      onCompleteRef.current();
      return;
    }
    if (!pinRef.current) return;

    // כש-HeroIntro מתחבר מחדש (למשל אחרי resetHero מלחיצה על הלוגו),
    // ה-spacer הגדול של ה-pin נוסף מעל RoadmapSection ב-DOM; scroll
    // anchoring טבעי של הדפדפן עלול "לפצות" על הגובה החדש שנוסף מעל
    // הגלילה הנוכחית ולדחוף את scrollY למטה בעצמו. לכן מוודאים במפורש
    // שהדף באמת נמצא ב-0 *אחרי* שה-DOM כבר השתנה, ולפני יצירת ה-ScrollTrigger.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinRef.current,
          start: "top top",
          end: "+=180%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          onLeave: () => onCompleteRef.current(),
        },
      });
      scrollTriggerRef.current = tl.scrollTrigger ?? null;

      // ~0.15–0.35: המילה "מקפיאות" מתחילה לעלות מעט, המשפט והפיצ'רים נעלמים בעדינות
      tl.to(wordmarkRef.current, { y: -36, duration: 0.2, ease: "none" }, 0.15)
        .to(
          [taglineRef.current, featureLineRef.current],
          { opacity: 0, y: -12, duration: 0.15, ease: "none" },
          0.15
        )
        .to(ctaRef.current, { opacity: 0, duration: 0.08, ease: "none" }, 0.1)
        // ~0.35–0.6: התרנגולת מקטינה ונעה בעדינות
        .to(henRef.current, { scale: 0.82, y: -44, duration: 0.25, ease: "none" }, 0.35)
        // ~0.55–0.8: המשך דעיכת התרנגולת והוורדמארק — זה מה שחושף ויזואלית את ה-Roadmap שמתחת
        .to(henRef.current, { opacity: 0, duration: 0.2, ease: "none" }, 0.58)
        .to(wordmarkRef.current, { opacity: 0, duration: 0.2, ease: "none" }, 0.78);
    });

    return () => {
      scrollTriggerRef.current = null;
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  const handleCtaClick = () => {
    const end = scrollTriggerRef.current?.end;
    if (typeof end === "number") {
      window.scrollTo({ top: end, behavior: "smooth" });
    }
  };

  return (
    <section aria-label="מקפיאות — מסך פתיחה">
      <div
        ref={pinRef}
        className={
          reducedMotion
            ? "flex flex-col items-center justify-center gap-6 px-4 py-16 text-center sm:gap-7 sm:py-24"
            : "flex h-screen-safe flex-col items-center justify-center gap-6 px-4 text-center sm:gap-7"
        }
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={henRef}
          src="/brand/hen-full.png"
          alt="מקפיאות — תרנגולת המותג"
          className="h-auto w-40 max-w-full object-contain sm:w-56 lg:w-[340px]"
          style={{ filter: "drop-shadow(0 16px 28px rgba(36, 22, 25, 0.14))" }}
        />

        <h1
          ref={wordmarkRef}
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

        <p ref={taglineRef} className="max-w-md text-lg text-ink/70 sm:text-xl">
          עושות סדר בדרך להקפאת ביציות.
        </p>

        <p ref={featureLineRef} className="max-w-sm text-xs text-ink/45 sm:max-w-none sm:text-sm">
          המסלול שלי · איפה לעשות · עלויות · סיכויים · מדריכים
        </p>

        {!reducedMotion && (
          <button
            ref={ctaRef}
            type="button"
            onClick={handleCtaClick}
            className="group mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-ink/60 transition-colors hover:text-teal-600"
          >
            מתחילה
            <ChevronDown
              className="h-4 w-4 transition-transform group-hover:translate-y-0.5"
              strokeWidth={2.25}
            />
          </button>
        )}
      </div>
    </section>
  );
}
