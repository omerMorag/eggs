import { pgEnum } from "drizzle-orm/pg-core";

/** קופת חולים — כפי שמופיע גם ב-src/data/healthFunds.ts, כערך מובנה (לא טקסט חופשי) */
export const hmoFundEnum = pgEnum("hmo_fund", [
  "clalit",
  "maccabi",
  "meuhedet",
  "leumit",
  "none",
  "other",
]);

/** מסלול הטיפול */
export const treatmentRouteEnum = pgEnum("treatment_route", ["public", "private", "not_specified"]);

/** אזור בארץ */
export const regionEnum = pgEnum("region", ["מרכז", "ירושלים", "צפון", "דרום", "other"]);

/** טווח גיל בעת ההקפאה — קטגוריות רחבות, לא גיל מדויק (פרטיות) */
export const ageRangeEnum = pgEnum("age_range_bucket", ["<30", "30-34", "35-37", "38-40", "41+"]);

/** קטגוריית פריט עלות במחשבון */
export const costItemCategoryEnum = pgEnum("cost_item_category", [
  "clinic_cycle",
  "private_doctor",
  "medication",
  "consultation",
  "test",
  "storage_annual",
  "travel",
  "other",
]);

/** אופן החיוב של פריט עלות */
export const billingTypeEnum = pgEnum("billing_type", ["per_cycle", "one_time", "annual", "per_visit"]);

/**
 * סטטוס סיפור — מורחב מעבר לשלושת הסטטוסים שהתבקשו (pending/published/rejected)
 * כדי להבדיל בין "נדחה במודרציה" (rejected) לבין "המשתמשת עצמה ביטלה פרסום"
 * (unpublished) ו"מנהלת הסירה סיפור שהיה פעיל" (removed) — שלוש פעולות שונות
 * מהותית, שאסור לערבב תחת סטטוס אחד כי זה יערבב את תור המודרציה עם סיפורים
 * שכבר טופלו בעבר.
 */
export const storyStatusEnum = pgEnum("story_status", [
  "pending",
  "published",
  "rejected",
  "unpublished",
  "removed",
]);

export const reportReasonEnum = pgEnum("report_reason", [
  "misleading_info",
  "personal_info_exposed",
  "spam",
  "inappropriate",
  "other",
]);

export const reportStatusEnum = pgEnum("report_status", ["open", "reviewed", "dismissed"]);
