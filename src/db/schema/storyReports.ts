import { pgTable, uuid, text, timestamp, index, uniqueIndex } from "drizzle-orm/pg-core";
import { stories } from "./stories";
import { reportReasonEnum, reportStatusEnum } from "./enums";

/** דיווח על תוכן סיפור — דורש התחברות (reporterUserId תמיד מה-session) */
export const storyReports = pgTable(
  "story_reports",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    storyId: uuid("story_id")
      .notNull()
      .references(() => stories.id, { onDelete: "cascade" }),
    reporterUserId: text("reporter_user_id").notNull(),
    reason: reportReasonEnum("reason").notNull(),
    details: text("details"),
    status: reportStatusEnum("status").notNull().default("open"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    storyIdx: index("story_reports_story_idx").on(t.storyId),
    statusIdx: index("story_reports_status_idx").on(t.status),
    // משתמשת אחת לא יכולה לדווח פעמיים על אותו סיפור
    oneReportPerUser: uniqueIndex("story_reports_unique_reporter").on(t.storyId, t.reporterUserId),
  })
);
