import type { SourceLink } from "./types";
import { hospitalPrices } from "./hospitalPrices";
import { privateFacilitiesNoFixedPrice } from "./privateCost";
import { healthFunds } from "./healthFunds";

/**
 * "יחידת טיפוח" — הרכבה מעל hospitalPrices.ts / privateCost.ts / healthFunds.ts
 * הקיימים, לשימוש בכלי "איפה כדאי לעשות?" (WHERE TO DO 2.0). קובץ זה
 * *לא* מחליף את שלושת הקבצים האלה ולא משכפל מחיר — הוא רק מוסיף שכבת
 * מטא-דאטה (סוג מסגרת, אפשרויות מימון, וכו') מעליהם.
 *
 * עקרון-על: אין כאן אף מספר, תנאי-זכאות או עובדה שלא קיימת כבר במקור
 * אמין באתר. כל שדה שאין לו מקור — undefined, וה-UI מציג "יש לברר מול
 * היחידה" במקומו. `region` נשאר אופציונלי בטיפוס (ליחידה עתידית שבאמת
 * אין לה שיוך אזור אמין) — אך כל 4 היחידות הפרטיות הקיימות היום כן
 * מתויגות לאזור, לפי המחוז הרשמי של העיר שבה הן ממוקמות (ר' PRIVATE_UNIT_REGION למטה).
 */

export type Region = "מרכז" | "ירושלים" | "צפון" | "דרום";

export type CareUnitType = "public" | "private";

/** שתי המידות האורתוגונליות מ-§3: סוג המסגרת (type) לעומת אופן המימון (fundingOptions) — יחידה יכולה להיות גם ציבורית וגם בהסדר קופה בו-זמנית */
export type FundingOptionTag = "regular" | "subsidized" | "hmoArrangement" | "private" | "other";

export interface CareUnit {
  id: string;
  /** תמיד זהה לשם השורה המתאימה ב-hospitalPrices.ts (כשקיימת) — מפתח החיבור למחיר */
  name: string;
  region?: Region;
  type: CareUnitType;
  fundingOptions: FundingOptionTag[];
  /** קופות שידוע (ממקור קיים) שיש להן הסדר/מסלול ביחידה הזו */
  healthFunds?: string[];
  /** true אם יש שורה תואמת ב-hospitalPrices.ts עם מחיר מאומת/דורש-אימות — הכרטיס/ההשוואה שולפים את המחיר משם לפי name, לא משכפלים אותו כאן */
  hasPriceRef: boolean;
  monitoringLocation?: string;
  doctorChoice?: "yes" | "no" | "depends";
  howToStart?: string;
  eligibilityNotes?: string;
  contact?: { phone?: string; url?: string };
  source?: SourceLink;
  /** רק אם ידוע בפועל ממקור קיים — אין תאריך מומצא */
  lastUpdated?: string;
  isActive: boolean;
}

const maccabiSheliSource: SourceLink | undefined = healthFunds.find(
  (f) => f.fund === "מכבי" && f.plan === "מכבי שלי"
)?.source;

/** 16 בתי החולים הציבוריים מ-hospitalPrices.ts — כולם "type: public", כולם תומכים במסלול תשלום עצמי רגיל; מי שיש לו fundArrangements מתויג גם hmoArrangement */
const publicUnits: CareUnit[] = hospitalPrices.map((row) => ({
  id: row.name.replace(/[^֐-׿\w]+/g, "-"),
  name: row.name,
  region: row.region,
  type: "public",
  fundingOptions: row.fundArrangements && row.fundArrangements.length > 0 ? ["regular", "hmoArrangement"] : ["regular"],
  healthFunds: row.fundArrangements,
  hasPriceRef: true,
  source: row.source,
  isActive: true,
}));

/** אזור פיזי לכל יחידה פרטית, לפי המחוז הרשמי של העיר שבה היא ממוקמת —
 * אותה שיטת מיפוי כמו בשורות החדשות ב-hospitalPrices.ts (מחוז המרכז/תל
 * אביב -> "מרכז", מחוז חיפה -> "צפון"): אסותא רמת החייל (תל אביב) וראשון
 * לציון ממוקמות במחוז המרכז/תל אביב, כמו גם הרצליה מדיקל סנטר (הרצליה);
 * מדיקה אלישע ממוקמת בחיפה ("בית החולים הפרטי הגדול בצפון הארץ", לפי
 * אתר בית החולים עצמו). */
const PRIVATE_UNIT_REGION: Partial<Record<string, Region>> = {
  "אסותא רמת החייל": "מרכז",
  "אסותא ראשון לציון": "מרכז",
  "הרצליה מדיקל סנטר": "מרכז",
  "מדיקה אלישע": "צפון",
};

/**
 * 4 המרכזים הפרטיים ללא מחיר קבוע (privateCost.ts). "מדיקה אלישע" מסומנת
 * גם hmoArrangement/מכבי — לפי ההערה הקיימת ב-healthFunds.ts (״נכון לעדכון
 * מרץ 2026, בתי החולים שבהסכם [מכבי שלי] הם שיבא תל השומר ומדיקה אלישע״),
 * לא ניחוש חדש.
 */
const privateUnits: CareUnit[] = privateFacilitiesNoFixedPrice.map((name) => {
  const isElisha = name === "מדיקה אלישע";
  return {
    id: name.replace(/[^֐-׿\w]+/g, "-"),
    name,
    region: PRIVATE_UNIT_REGION[name],
    type: "private",
    fundingOptions: isElisha ? ["private", "hmoArrangement"] : ["private"],
    healthFunds: isElisha ? ["מכבי"] : undefined,
    hasPriceRef: false,
    source: isElisha ? maccabiSheliSource : undefined,
    isActive: true,
  } satisfies CareUnit;
});

export const careUnits: CareUnit[] = [...publicUnits, ...privateUnits];

/** שורת המחיר המאומתת/דורשת-אימות המתאימה ליחידה, לפי שם — מקור האמת היחיד למחיר (hospitalPrices.ts), אף פעם לא משוכפל כאן */
export function findPriceRow(unitName: string) {
  return hospitalPrices.find((row) => row.name === unitName);
}
