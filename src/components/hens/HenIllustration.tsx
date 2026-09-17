/**
 * מיפוי מרכזי לאיורי "התרנגולת" (המסקוט) שנוצרו לאזורים ספציפיים באתר —
 * שונים מהתרנגולת המלאה שבלוגו (public/brand/hen-full.png, המשמשת ב-Logo.tsx
 * וב-IntroCard). כל קובץ כאן חתוך (trim) לשוליים השקופים סביב האיור ושומר על
 * יחס-הממדים המקורי שלו; לעולם אין למתוח, לחתוך, לצבוע מחדש או להוסיף טקסט
 * לתוך האיורים עצמם.
 *
 * בניגוד לסמל הלוגו (שהוא דקורטיבי גרידא, aria-hidden), לאיורים האלה יש טקסט
 * חלופי משמעותי משלהם לפי בקשת המשתמשת, כי כל איור מציג פעולה קונקרטית
 * שרלוונטית לתוכן שלצידו.
 */
export type HenName =
  | "learning"
  | "consultation"
  | "costs"
  | "statistics"
  | "choose-clinic"
  | "tests"
  | "roadmap";

interface HenConfig {
  file: string;
  alt: string;
  /** גודל מומלץ (רוחב, ה-CSS מכתיב את הגובה לפי יחס הממדים המקורי) — נגזר מהמפרט שהתקבל */
  defaultSizeClassName: string;
}

const HENS: Record<HenName, HenConfig> = {
  learning: {
    file: "hen-learning.png",
    alt: "תרנגולת קוראת מידע על תהליך הקפאת ביציות",
    defaultSizeClassName: "w-44 sm:w-56 lg:w-[300px]",
  },
  consultation: {
    file: "hen-consultation.png",
    alt: "תרנגולת מתכוננת לפגישה עם מחברת ושאלות",
    defaultSizeClassName: "w-36 sm:w-40 lg:w-56",
  },
  costs: {
    file: "hen-costs.png",
    alt: "תרנגולת מחשבת את עלויות הקפאת הביציות",
    defaultSizeClassName: "w-36 sm:w-40 lg:w-52",
  },
  statistics: {
    file: "hen-statistics.png",
    alt: "תרנגולת מציגה נתונים על גיל ומספר ביציות",
    defaultSizeClassName: "w-40 sm:w-44 lg:w-64",
  },
  "choose-clinic": {
    file: "hen-choose-clinic.png",
    alt: "תרנגולת מחפשת יחידה להקפאת ביציות",
    defaultSizeClassName: "w-36 sm:w-40 lg:w-56",
  },
  tests: {
    file: "hen-tests.png",
    alt: "תרנגולת מחזיקה מבחנת דם ורשימת בדיקות",
    defaultSizeClassName: "w-36 sm:w-40 lg:w-56",
  },
  roadmap: {
    file: "hen-roadmap.png",
    alt: "תרנגולת מלווה את מסלול הקפאת הביציות",
    defaultSizeClassName: "w-40 sm:w-44 lg:w-64",
  },
};

interface HenIllustrationProps {
  name: HenName;
  /** גוון כתם הרקע העדין מאחורי האיור; "none" מדלג על הכתם */
  blob?: "cream" | "pink" | "mint" | "none";
  /** מחליף את מחלקות הגודל המומלצות כשצריך להתאים לפריסה ספציפית */
  sizeClassName?: string;
  className?: string;
}

const BLOB_CLASSES: Record<Exclude<HenIllustrationProps["blob"], undefined | "none">, string> = {
  cream: "bg-mist-200/70",
  pink: "bg-teal-100/70",
  mint: "bg-warm-100/80",
};

/**
 * איור תרנגולת ממוקם, עם כתם צבע עדין אופציונלי ברקע וצל רך בלבד — בלי מסגרת
 * כבדה ובלי אנימציה קופצנית (fade-in עדין תואם לשאר האתר, animate-fadeUp).
 * שקיפות הרקע ויחס הממדים המקוריים נשמרים תמיד (object-contain בפועל, כי
 * ה-img הוא PNG חתוך-שוליים בלי stretch).
 */
export default function HenIllustration({ name, blob = "none", sizeClassName, className }: HenIllustrationProps) {
  const hen = HENS[name];

  return (
    <div className={`relative flex shrink-0 items-center justify-center ${className ?? ""}`}>
      {blob !== "none" && (
        <span
          className={`absolute inset-[8%] -z-10 rounded-full blur-xl ${BLOB_CLASSES[blob]}`}
          aria-hidden="true"
        />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/images/hens/${hen.file}`}
        alt={hen.alt}
        className={`relative h-auto max-w-full animate-fadeUp object-contain ${sizeClassName ?? hen.defaultSizeClassName}`}
        style={{ filter: "drop-shadow(0 10px 18px rgba(36, 22, 25, 0.12))" }}
      />
    </div>
  );
}
