import { z } from "zod";

/**
 * צורת תשובות אשף מחשבון העלות — 7 השלבים בדיוק כפי שהוגדרו. נשמר מקומית
 * (localStorage) תמיד, ונשלח לשרת רק בפעולת "שמרי את ההערכה" (מחייב Google).
 */
export const treatmentRouteAnswerSchema = z.enum(["public", "private", "undecided"]);
export const hmoAnswerSchema = z.enum(["clalit", "maccabi", "meuhedet", "leumit", "none_other"]);
export const cyclesModeSchema = z.enum(["1", "2", "3", "custom"]);
export const doctorAccompanimentSchema = z.enum(["no", "default_estimate", "known_cost"]);
export const clinicModeSchema = z.enum(["site_choice", "not_chosen", "manual"]);
export const medicationModeSchema = z.enum(["hmo_subsidized", "no_subsidy", "unknown", "known_cost"]);

/** סכום כספי ידני שמשתמשת מזינה — שקלים שלמים, לא שלילי, תקרה סבירה */
const manualAmountSchema = z.number().int().min(0).max(500000);

export const wizardAnswersSchema = z
  .object({
    treatmentRoute: treatmentRouteAnswerSchema,
    hmo: hmoAnswerSchema,
    cyclesMode: cyclesModeSchema,
    cyclesCustomCount: z.number().int().min(1).max(20).optional(),
    doctorAccompaniment: doctorAccompanimentSchema,
    doctorKnownCost: manualAmountSchema.optional(),
    clinicMode: clinicModeSchema,
    clinicChoiceName: z.string().max(200).optional(),
    clinicManualAmount: manualAmountSchema.optional(),
    medicationMode: medicationModeSchema,
    medicationKnownCost: manualAmountSchema.optional(),
    additionalCosts: z.object({
      consultations: z.boolean(),
      tests: z.boolean(),
      storageAnnual: z.boolean(),
      travel: z.boolean(),
      customEnabled: z.boolean(),
      customLabel: z.string().max(120).optional(),
      customAmount: manualAmountSchema.optional(),
    }),
  })
  .strict();

export type WizardAnswers = z.infer<typeof wizardAnswersSchema>;

export const DEFAULT_WIZARD_ANSWERS: WizardAnswers = {
  treatmentRoute: "undecided",
  hmo: "none_other",
  cyclesMode: "1",
  doctorAccompaniment: "no",
  clinicMode: "not_chosen",
  medicationMode: "unknown",
  additionalCosts: {
    consultations: false,
    tests: false,
    storageAnnual: false,
    travel: false,
    customEnabled: false,
  },
};

/** גוף הבקשה לשמירת הערכת עלות בענן — userId תמיד מה-session, לא מכאן */
export const saveEstimateSchema = z.object({
  label: z.string().max(120).optional(),
  inputData: wizardAnswersSchema,
  minTotal: z.number().int().min(0),
  maxTotal: z.number().int().min(0),
});

export type SaveEstimateInput = z.infer<typeof saveEstimateSchema>;
