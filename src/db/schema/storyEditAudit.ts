import { pgTable, uuid, text, jsonb, timestamp, index } from "drizzle-orm/pg-core";
import { stories } from "./stories";

/**
 * Audit בסיסי על עריכות אדמין לסיפור (בעיקר redact — הסרת פרטים מזהים).
 * fieldChanges הוא { [field]: { old, new } } — diff שנכתב לפני העדכון עצמו.
 */
export const storyEditAudit = pgTable(
  "story_edit_audit",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    storyId: uuid("story_id")
      .notNull()
      .references(() => stories.id, { onDelete: "cascade" }),
    adminUserId: text("admin_user_id").notNull(),
    fieldChanges: jsonb("field_changes").notNull(),
    editedAt: timestamp("edited_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    storyIdx: index("story_edit_audit_story_idx").on(t.storyId),
  })
);
