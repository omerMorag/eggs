import { z } from "zod";

export const reportReasonSchema = z.enum([
  "misleading_info",
  "personal_info_exposed",
  "spam",
  "inappropriate",
  "other",
]);

export const REPORT_REASON_LABELS: Record<z.infer<typeof reportReasonSchema>, string> = {
  misleading_info: "מידע מטעה",
  personal_info_exposed: "חשיפת פרטים מזהים",
  spam: "ספאם",
  inappropriate: "תוכן לא הולם",
  other: "אחר",
};

export const createReportSchema = z
  .object({
    storyId: z.string().uuid(),
    reason: reportReasonSchema,
    details: z.string().trim().max(500).optional(),
  })
  .strict();
export type CreateReportInput = z.infer<typeof createReportSchema>;

export const reviewReportSchema = z
  .object({
    status: z.enum(["reviewed", "dismissed"]),
  })
  .strict();
export type ReviewReportInput = z.infer<typeof reviewReportSchema>;
