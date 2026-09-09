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
  /** מידע נוסף המוצג בהרחבה בלחיצה על "קרא עוד" / "מידע נוסף" */
  moreInfo: string;
  /** קישור אופציונלי לעמוד עם הסבר מורחב על השלב */
  readMoreHref?: string;
  readMoreLabel?: string;
}

export interface TestItem {
  id: number;
  icon: LucideIcon;
  title: string;
  detail: string;
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
