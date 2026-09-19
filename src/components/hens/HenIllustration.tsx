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
  | "roadmap"
  | "step-protocol"
  | "step-monitoring"
  | "step-injections"
  | "step-retrieval"
  | "step-trophy"
  | "step-requirements"
  | "retrieval-day-bag";

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
  // איורי צ'קליסט — סט נפרד (תרנגולת עם כובע גרב טורקיז ומשקפי סקי), שמחליף
  // את האייקונים הגנריים בכרטיסי השלבים עצמם. נשמרים בתיקיית משנה משלהם
  // (public/images/hens/checklist/) כדי לא להתערבב עם איורי כותרות האזורים
  // שמעליהם. הגודל המוגדר כברירת מחדל תואם את הטווח שהתבקש לכרטיסי השלבים:
  // כ-70–85px במובייל, כ-100–120px בדסקטופ.
  "step-protocol": {
    file: "checklist/hen-step-protocol.png",
    alt: "תרנגולת מחזיקה לוח שנה עם יום מסומן ופתית שלג, מייצגת קבלת פרוטוקול טיפול אישי",
    defaultSizeClassName: "w-[78px] sm:w-24 lg:w-[112px]",
  },
  "step-monitoring": {
    file: "checklist/hen-step-monitoring.png",
    alt: "תרנגולת עומדת ליד מכשיר אולטרסאונד ומצביעה על המסך, מייצגת מעקבי דם ואולטרסאונד",
    defaultSizeClassName: "w-[78px] sm:w-24 lg:w-[112px]",
  },
  "step-injections": {
    file: "checklist/hen-step-injections.png",
    alt: "תרנגולת מחזיקה עט הזרקה ותיק תרופות קטן, מייצגת תחילת הזריקות",
    defaultSizeClassName: "w-[78px] sm:w-24 lg:w-[112px]",
  },
  "step-retrieval": {
    file: "checklist/hen-step-retrieval.png",
    alt: "תרנגולת לובשת חלוק וכובע רפואי ומחזיקה קופסה עם ביציות, מייצגת את יום השאיבה",
    defaultSizeClassName: "w-[78px] sm:w-24 lg:w-[112px]",
  },
  "step-trophy": {
    file: "checklist/hen-step-trophy.png",
    alt: "תרנגולת מרימה גביע עם ביצה מוזהבת, לציון השלמת כל שלבי התהליך",
    defaultSizeClassName: "w-36 sm:w-40 lg:w-56",
  },
  "step-requirements": {
    file: "checklist/hen-step-requirements.png",
    alt: "תרנגולת מסמנת וי על גבי רשימת בדיקות בלוח קליפ, מייצגת השלמת דרישות היחידה",
    defaultSizeClassName: "w-[78px] sm:w-24 lg:w-[112px]",
  },
  // כרטיס "יום השאיבה" ב"מידע ומדריכים" — איור נפרד משתי הסדרות הקודמות,
  // בגודל התואם לכרטיס-תוכן ראשי (כמו learning/costs/tests), לא לגודל
  // הקומפקטי של כרטיסי הצ'קליסט. טווח הגודל המדויק שהתבקש: מובייל
  // 150–190px, דסקטופ 230–280px.
  "retrieval-day-bag": {
    file: "hen-retrieval-day-bag.png",
    alt: "תרנגולת מגיעה מוכנה ליום שאיבת הביציות עם תיק ובו ציוד שימושי",
    defaultSizeClassName: "w-[150px] sm:w-[190px] lg:w-[260px]",
  },
};

interface HenIllustrationProps {
  name: HenName;
  /** גוון כתם הרקע העדין מאחורי האיור; "none" מדלג על הכתם */
  blob?: "cream" | "pink" | "mint" | "none";
  /** מחליף את מחלקות הגודל המומלצות כשצריך להתאים לפריסה ספציפית */
  sizeClassName?: string;
  className?: string;
  /** הילה עדינה בגוון מנטה סביב האיור — לשימוש בכרטיס פעיל/פתוח בלבד */
  activeRing?: boolean;
  /** תגית וי קטנה בפינת אזור התמונה — לשימוש בכרטיס שהושלם; ממוקמת מחוץ
   * לגבולות האיור עצמו כדי שלעולם לא תכסה את התרנגולת */
  doneBadge?: boolean;
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
export default function HenIllustration({
  name,
  blob = "none",
  sizeClassName,
  className,
  activeRing = false,
  doneBadge = false,
}: HenIllustrationProps) {
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
        className={`relative h-auto max-w-full animate-fadeUp object-contain transition-shadow duration-300 ${
          sizeClassName ?? hen.defaultSizeClassName
        } ${activeRing ? "rounded-full ring-4 ring-warm-300/50" : ""}`}
        style={{ filter: "drop-shadow(0 10px 18px rgba(36, 22, 25, 0.12))" }}
      />
      {doneBadge && (
        <span
          className="absolute -bottom-1 -start-1 flex h-5 w-5 items-center justify-center rounded-full bg-teal-600 text-white shadow-sm ring-2 ring-white"
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3" strokeWidth={3.5}>
            <path
              d="M5 13l4 4L19 7"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}
    </div>
  );
}
