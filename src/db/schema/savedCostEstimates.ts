import { pgTable, uuid, text, integer, jsonb, timestamp, index } from "drizzle-orm/pg-core";

/**
 * הערכת עלות שנשמרה בענן ע"י משתמשת מחוברת. user_id מגיע תמיד מה-session
 * בצד השרת (Google sub) — לעולם לא מגוף הבקשה.
 */
export const savedCostEstimates = pgTable(
  "saved_cost_estimates",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull(),
    label: text("label"),
    inputData: jsonb("input_data").notNull(),
    minTotal: integer("min_total").notNull(),
    maxTotal: integer("max_total").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userIdx: index("saved_estimates_user_idx").on(t.userId, t.createdAt),
  })
);
