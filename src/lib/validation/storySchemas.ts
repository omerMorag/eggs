import { z } from "zod";

export const ageRangeSchema = z.enum(["<30", "30-34", "35-37", "38-40", "41+"]);
export const hmoSchema = z.enum(["clalit", "maccabi", "meuhedet", "leumit", "none", "other"]);
export const regionSchema = z.enum(["מרכז", "ירושלים", "צפון", "דרום", "other"]);
export const treatmentRouteSchema = z.enum(["public", "private", "not_specified"]);

/** גרסת נוסח ההסכמה הנוכחית — משמשת גם לוולידציה וגם נשמרת ב-consent_version */
export const CURRENT_CONSENT_VERSION = "2026-09-v1";
export const CONSENT_TEXT = "אני מאשרת לפרסם את התוכן שמסרתי באתר.";

/**
 * סכימת יצירת/עריכת סיפור — שדה יחיד, משותף ללקוח (ShareStoryForm) ולשרת
 * (POST /api/stories). status אינו קיים בסכימה הזו בכלל — כך שאין דרך קוד
 * שבה משתמשת רגילה יכולה לקבוע סטטוס לסיפור שלה.
 */
export const storyInputSchema = z
  .object({
    isAnonymous: z.boolean(),
    displayName: z.string().trim().max(60).optional(),
    title: z.string().trim().min(2, "כותרת קצרה מדי").max(150),
    storyText: z.string().trim().min(20, "הסיפור קצר מדי").max(8000),
    personalTip: z.string().trim().max(1000).optional(),
    ageRange: ageRangeSchema.optional(),
    hmo: hmoSchema.optional(),
    clinic: z.string().trim().max(200).optional(),
    region: regionSchema.optional(),
    treatmentRoute: treatmentRouteSchema.optional(),
    cyclesCount: z.number().int().min(0).max(50).optional(),
    retrievedCount: z.number().int().min(0).max(200).optional(),
    frozenCount: z.number().int().min(0).max(200).optional(),
    consent: z.literal(true, { errorMap: () => ({ message: "יש לאשר את הסכמת הפרסום" }) }),
  })
  .strict();

export type StoryInput = z.infer<typeof storyInputSchema>;

/** עריכת סיפור קיים ע"י בעליו — אותם שדות תוכן, בלי consent מחדש */
export const storyEditSchema = storyInputSchema.omit({ consent: true }).partial().extend({
  title: z.string().trim().min(2).max(150),
  storyText: z.string().trim().min(20).max(8000),
  isAnonymous: z.boolean(),
});
export type StoryEditInput = z.infer<typeof storyEditSchema>;

/** עריכת redact ע"י אדמין — כל שדה אופציונלי, רק שדות מזהים ניתנים לעריכה */
export const adminRedactSchema = z
  .object({
    displayName: z.string().trim().max(60).nullable().optional(),
    isAnonymous: z.boolean().optional(),
    clinic: z.string().trim().max(200).nullable().optional(),
    storyText: z.string().trim().min(20).max(8000).optional(),
    personalTip: z.string().trim().max(1000).nullable().optional(),
    title: z.string().trim().min(2).max(150).optional(),
  })
  .strict();
export type AdminRedactInput = z.infer<typeof adminRedactSchema>;

export const storiesQuerySchema = z.object({
  q: z.string().trim().max(200).optional(),
  ageRange: ageRangeSchema.optional(),
  cyclesCount: z.coerce.number().int().min(0).max(50).optional(),
  treatmentRoute: treatmentRouteSchema.optional(),
  hmo: hmoSchema.optional(),
  region: regionSchema.optional(),
  page: z.coerce.number().int().min(1).max(1000).default(1),
  pageSize: z.coerce.number().int().min(1).max(20).default(10),
});
export type StoriesQuery = z.infer<typeof storiesQuerySchema>;
