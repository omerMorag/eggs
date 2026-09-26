import type { LucideIcon } from "lucide-react";

/**
 * שלב יחיד במסע — תוכן אחיד המשמש גם את מפת הדרך (עמוד הבית) וגם את
 * המסלול האישי בדשבורד, כדי שלא יהיו שני מקורות תוכן נפרדים שעלולים
 * להתבדר זה מזה.
 */
export interface JourneyStep {
  id: number;
  icon: LucideIcon;
  /** האם ניתן להתקדם בשלב זה במקביל לשלבים אחרים */
  parallel: boolean;
  title: string;
  /** תיאור קצר המוצג תמיד */
  shortDescription: string;
  /** שורת "מתי?" — תזמון קצר של השלב בתוך המסלול (למשל "בתחילת הדרך") */
  whenLabel: string;
  /** רשימת תתי-המשימות של השלב, כל אחת עם checkbox נפרד (Roadmap 2.0).
   *  השלב עצמו מסומן כ"הושלם" אוטומטית רק כשכל המשימות כאן מסומנות —
   *  ראו stepTaskCount/completedSteps ב-useJourneyProgress.ts. הסדר כאן
   *  קובע גם את מפתח האחסון של כל משימה ("stepId:taskIndex"), ולכן אין
   *  לשנות את סדר הפריטים הקיימים בעתיד בלי מיגרציה (מותר להוסיף בסוף). */
  tasks: string[];
  /** ניסוח ממוקד-פעולה, אינפיניטיבי ("לקבוע את הבדיקות") לכל משימה — מערך
   *  מקביל ל-tasks (אותו אינדקס בדיוק), לשימוש אך ורק באזור "הדבר הבא שלך"
   *  (NextActionCard.tsx / useJourneyProgress.ts nextAction). הצ'קליסט
   *  עצמו (StepRow.tsx) ממשיך להציג את tasks כפי שהם (ניסוח גוף ראשון,
   *  "ביקשתי הפניות לבדיקות") — שני הניסוחים משרתים הקשרים שונים בכוונה. */
  taskActions: string[];
  /** כינוי קצר לשלב (2–5 מילים), לשימוש רק בשורת ההקשר הקומפקטית של "הדבר
   *  הבא שלך" (למשל "שלב 1 · בדיקות ראשוניות · 1 מתוך 4 הושלמו"), כש-title
   *  המלא ארוך מדי לשורה כזו. אינו מחליף את title בשום מקום אחר באתר. */
  shortLabel: string;
  /** מידע נוסף — עדיין קיים כנתון (לא נמחק, לפי הנחיית Roadmap 2.0), אבל
   *  מאז Roadmap 2.0 כבר לא מוצג בתוך "המסלול שלי" (StepRow.tsx); ה-Roadmap
   *  הראשי מציג רק טקסט קצר + משימות + קישור למדריך. עדיין מוצג במלואו
   *  במפת המסלול שבמסך הפתיחה (FlowStepCard.tsx) — שני הרכיבים חולקים
   *  בכוונה את אותו מקור תוכן (journeySteps) כדי שלא יתבדרו זה מזה. */
  moreInfo: string;
  /** קישור אופציונלי לעמוד/מדריך קיים שרלוונטי לשלב. מכוון תמיד למדריך
   *  שכבר קיים באתר בפועל — לא נוצרים מדריכים חדשים רק בשביל שלב שאין לו
   *  עדיין יעד מתאים (ולכן חלק מהשלבים נשארים בלי readMoreHref בכוונה). */
  readMoreHref?: string;
  readMoreLabel?: string;
  /** שורת הקדמה קצרה ואופציונלית מעל כפתור ה-CTA (למשל "לא בטוחה איפה
   *  לעשות?" בשלב 2), שמטרתה להנגיש את הקישור למדריך גם בלי לפתוח את
   *  השלב. מוצגת רק ב-StepRow.tsx (המסלול האישי) — FlowStepCard.tsx
   *  שבמסך הפתיחה לא קורא שדה זה כלל. */
  ctaPrompt?: string;
}

/** שורת מחיר בודדת בחלונית המידע של רכיב (ר' TestSubItemPriceInfo).
 *  price מוצג רק כש-verification === "verified" — כשהיא "needs-verification"
 *  אין להציג מספר בכלל (גם לא הישן), אלא רק את ה-note שמסביר שלא אומת. */
export interface TestSubItemPriceRow {
  name: string;
  price?: string;
  sourceLabel: string;
  sourceUrl: string;
  /** תאריך (YYYY-MM-DD) שבו אומת בפועל שהמחיר עדיין מופיע במקור */
  checkedDate: string;
  verification: "verified" | "needs-verification";
  note?: string;
}

/** תוכן חלונית מידע "איפה אפשר לבצע וכמה זה עולה?" לרכיב ספציפי (כרגע רק AMH) */
export interface TestSubItemPriceInfo {
  /** גם הטקסט של הקישור הקטן וגם כותרת החלונית */
  linkLabel: string;
  intro: string;
  rows: TestSubItemPriceRow[];
  /** קישורי בדיקת זכאות נפרדים לכל קופה — לעולם לא טבלה אחת "לכולן" */
  fundLinks: SourceLink[];
}

/** רכיב בודד במיני-הצ'קליסט של בדיקה (TestItem.subItems) */
export interface TestSubItem {
  label: string;
  /** הנחיה ממוקדת לרכיב הספציפי הזה בלבד (למשל AMH לעומת FSH באותה קבוצה) —
   *  מוצגת רק כשיש בה תוכן ממשי; אין ברירת מחדל/נוסח גנרי כשאין הנחיה אמיתית */
  note?: string;
  /** הסבר שני, נפרד מ-note — מוצג לצידו (לא מחליף אותו). כרגע רק AMH משתמש בזה */
  secondaryNote?: string;
  /** true = רכיב שלא נדרש מכל המשתמשות (כרגע רק AMH): לא נדרש כדי שהבדיקה
   *  שאליה הוא שייך תיחשב "הושלמה" (ר' requiredSubIndexes/isTestDone ב-
   *  useJourneyProgress.ts), וקיצור הדרך "סמני/בטלי הכול" (toggleTest) לא
   *  נוגע בו כלל — כדי שאישה שלא נדרשה לבצע אותו לא תסמן אותו בטעות. */
  optional?: boolean;
  /** כשיש — מוצג קישור קטן ליד הרכיב שפותח חלונית מידע (מחיר/זכאות) */
  priceInfo?: TestSubItemPriceInfo;
}

export interface TestItem {
  id: number;
  icon: LucideIcon;
  title: string;
  detail: string;
  /** מיני-צ'קליסט של הרכיבים בתוך הבדיקה (למשל ההורמונים הנבדקים) — ניתן לסמן כל אחד בנפרד,
   *  ולתת לכל רכיב תאריך ביצוע נפרד משלו אם צריך (ר' TestChecklist.tsx) */
  subItems?: TestSubItem[];
  /** הנחיית הכנה/תזמון קצרה ואחידה לכל הקבוצה (למשל "יש לבצע בצום") — תוכן קבוע
   *  של האתר, לא הזנה של המשתמשת. מוצגת רק כשיש הנחיה ממשית; קבוצה בלי הכנה
   *  מיוחדת משאירה את השדה undefined ולא מציגה שורה ריקה/מומצאת */
  prepNote?: string;
  /** מידע על מה לוודא מול היחידה הספציפית שבחרה (אילו רכיבים היא דורשת בדיוק,
   *  איזו תוצאה קודמת היא מקבלת וכו') — לא הנחיית הכנה, ולכן שדה נפרד מ-prepNote */
  unitCheckNote?: string;
  /** מסמכים/תוצאות שכדאי להביא איתך (לא הכנה לביצוע הבדיקה עצמה) */
  whatToBring?: string;
  /** מספר הימים שבהם הבדיקה נחשבת בתוקף מרגע ביצועה — רק כשזו דרישה שאומתה
   *  בפועל מול יחידה ספציפית, לא הערכה גורפת. נכון לעכשיו אף אחת מתשע
   *  הקבוצות לא משתמשת בשדה הזה (ר' תיעוד "תוקף הבדיקות" ב-tests.ts) */
  validityDays?: number;
}

/** כרטיס מידע נוסף שאינו שלב פעיל (לדוגמה: מה קורה אחרי השאיבה) */
export interface EpilogueItem {
  icon: LucideIcon;
  title: string;
  shortDescription?: string;
  moreInfo: string;
}

/** מקור מידע חוץ (קישור חיצוני עם תווית), לשימוש בכל עמוד "איפה כדאי לעשות את זה" */
export interface SourceLink {
  label: string;
  url: string;
}

/** כרטיס "דרך תשלום" — אחת מארבע האפשרויות לשלם על התהליך */
export interface FundingPath {
  icon: LucideIcon;
  title: string;
  description: string;
}

/** שורת מכסת ביציות/מחזורים לפי גיל, במסלול הקפאה מבחירה */
export interface EligibilityQuotaRow {
  ageRange: string;
  maxEggs: string;
  maxCycles: string;
}

/** שורה בטבלת קופות החולים (ביטוח משלים) */
export interface HealthFundRow {
  fund: string;
  plan: string;
  ageEligibility: string;
  whatYouGet: string;
  copay: string;
  note?: string;
  source?: SourceLink;
}

/** סטטוס אימות המחיר של שורת בית חולים */
export type PriceVerification = "verified" | "needs-verification";

/** שורה בטבלת מחירי בתי חולים (תשלום עצמי, ציבורי) — טבלה מאוחדת אחת */
export interface HospitalPriceRow {
  name: string;
  region: "מרכז" | "ירושלים" | "צפון" | "דרום";
  cycle1Price: string;
  cycle2Price?: string;
  whatsIncluded?: string;
  needsVerify?: string;
  verification: PriceVerification;
  /** קופות שידוע שיש להן הסדר/מסלול מסובסד בבית החולים הזה */
  fundArrangements?: string[];
  source?: SourceLink;
  /** הערה מיוחדת כשנמצא אי-התאמה בין מקורות (למשל: אתר ביה"ח מציג תנאי שונה) */
  caveat?: string;
}

/** רכיב עלות במסלול הפרטי (טבלת "כמה עולה מסלול פרטי") */
export interface PrivateCostComponent {
  label: string;
  description: string;
}
