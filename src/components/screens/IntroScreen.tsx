"use client";

import type { RefObject } from "react";
import { ArrowLeft, ChevronDown, FlaskConical, MapPin, Waypoints } from "lucide-react";
import Logo from "@/components/brand/Logo";

const benefits = [
  { icon: Waypoints, label: "מסלול מסודר שלב אחר שלב" },
  { icon: FlaskConical, label: "רשימת בדיקות ומשימות" },
  { icon: MapPin, label: "מידע על מקומות, עלויות וזכויות" },
];

interface IntroScreenProps {
  /** מופעל מכפתור "למסלול שלי" ומרמז הגלילה התחתון */
  onEnter: () => void;
  /** false כל עוד מסך הפתיחה אינו הפעיל בפועל — מנטרל פוקוס/מקלדת לאלמנטים שבו */
  active: boolean;
  scrollRef: RefObject<HTMLDivElement>;
}

/**
 * מסך הפתיחה וההיכרות עם "מקפיאות" — מסך מלא (100svh/100vh, ראו
 * globals.css ל-h-screen-safe) שמוצג לפני הכניסה למסלול האישי. לא עמוד
 * "מי אני" ולא סיפור אישי — רק היכרות קצרה עם הכלי, באותה שפה עיצובית
 * (ורוד/מנטה/שמנת, פינות מעוגלות, צללים עדינים) כמו שאר האתר.
 *
 * overflow-y-auto על השורש: ברוב הרזולוציות התוכן נכנס בדיוק בגובה המסך
 * בלי שום פס גלילה; רק במסכים נמוכים במיוחד (למשל 320×568 לרוחב) שבהם
 * התוכן לא נכנס, מתאפשרת גלילה פנימית עדינה כדי שכפתור "למסלול שלי" לעולם
 * לא ייחתך — ראו useIntroJourneyTransition.ts לאופן שבו מחוות גלילה/מגע
 * מבדילות בין "גלילה פנימית של התוכן" לבין "מעבר למסך הבא".
 *
 * bg-white לפני שכבת הגרדיאנט: קריטי, לא קוסמטי בלבד — לגרדיאנט יש נקודת
 * סיום כמעט-שקופה (to-deep/5), ובלעדי בסיס אטום מתחתיו מסך הפתיחה לא היה
 * מכסה לגמרי את תוכן המסלול שמתחתיו (שנשאר mounted תמיד) בפינה
 * התחתונה-ימנית שלו — בדיוק המצב שהדרישה "לעולם לא להציג חלק ממסך
 * המסלול בזמן שמסך הפתיחה גלוי" אוסרת.
 */
export default function IntroScreen({ onEnter, active, scrollRef }: IntroScreenProps) {
  return (
    <div
      ref={scrollRef}
      className="h-screen-safe w-full overflow-y-auto bg-white bg-gradient-to-br from-teal-50 via-white to-deep/5"
    >
      <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col px-5 py-6 sm:px-8 sm:py-10 lg:py-12">
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <Logo variant="full" markSize={48} />

          <p className="mt-6 max-w-md font-sans text-base font-bold leading-snug text-deep sm:mt-7 sm:text-lg">
            גם את מרגישה שיש לך מיליון שאלות ואין לך מושג מאיפה להתחיל?
          </p>

          <h1 className="mt-2.5 max-w-lg font-sans text-xl font-extrabold leading-tight tracking-tight text-ink sm:mt-3 sm:text-3xl lg:text-4xl">
            כל הדרך להקפאת ביציות, במקום אחד
          </h1>

          <p className="mt-3 max-w-md text-sm leading-relaxed text-ink/70 sm:mt-4 sm:text-base">
            כאן תוכלי להבין מה עושים ובאיזה סדר, להכין את כל הבדיקות, להשוות בין מקומות ולעקוב
            אחרי ההתקדמות שלך.
          </p>

          <ul className="mt-4 flex flex-col items-start gap-1.5 sm:mt-5 sm:gap-2">
            {benefits.map((item) => {
              const Icon = item.icon;
              return (
                <li
                  key={item.label}
                  className="flex items-center gap-2.5 text-xs font-medium text-ink/80 sm:text-sm"
                >
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-700 ring-1 ring-inset ring-teal-100 sm:h-8 sm:w-8"
                    aria-hidden="true"
                  >
                    <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2} />
                  </span>
                  {item.label}
                </li>
              );
            })}
          </ul>

          <div className="mt-4 sm:mt-6" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/hen-full.png" alt="" className="h-28 w-auto sm:h-40 lg:h-52" />
          </div>

          <button
            type="button"
            onClick={onEnter}
            tabIndex={active ? 0 : -1}
            className="group mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-teal-600 px-8 py-3 text-sm font-bold tracking-wide text-ink shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-500 hover:shadow-cardHover active:translate-y-0 sm:mt-6 sm:py-3.5 sm:text-base"
          >
            למסלול שלי
            <ArrowLeft
              className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
              strokeWidth={2.5}
            />
          </button>
        </div>

        <button
          type="button"
          onClick={onEnter}
          tabIndex={active ? 0 : -1}
          aria-label="גללי למסלול שלך"
          className="mx-auto mt-6 flex shrink-0 flex-col items-center gap-1 pb-1 text-xs font-semibold text-ink/45 transition-colors hover:text-ink/70"
        >
          <span>גללי למסלול שלך</span>
          <ChevronDown className="h-4 w-4 animate-bounce" strokeWidth={2.5} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
