import { pgTable, uuid, text, integer, boolean, timestamp, index } from "drizzle-orm/pg-core";
import { storyStatusEnum, ageRangeEnum, hmoFundEnum, regionEnum, treatmentRouteEnum } from "./enums";

/**
 * סיפור קהילתי. status אף פעם לא נקבע ע"י המשתמשת עצמה בקוד — רק ברירת
 * המחדל "pending" בשליחה, ואישור/דחייה/הסרה רק דרך נתיבי האדמין
 * (src/lib/requireAdmin.ts). searchBlob היא עמודה מחושבת (GENERATED ALWAYS
 * AS ... STORED) שמוגדרת במיגרציה הידנית (ולא כאן בהגדרת ה-TS) כדי לא
 * להיות תלויים בתמיכת drizzle-orm בעמודות מחושבות — ראו
 * drizzle/0001_search_and_constraints.sql.
 */
export const stories = pgTable(
  "stories",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    authorUserId: text("author_user_id").notNull(),
    displayName: text("display_name"),
    isAnonymous: boolean("is_anonymous").notNull().default(false),
    title: text("title").notNull(),
    storyText: text("story_text").notNull(),
    personalTip: text("personal_tip"),
    ageRange: ageRangeEnum("age_range"),
    hmo: hmoFundEnum("hmo"),
    clinic: text("clinic"),
    region: regionEnum("region"),
    treatmentRoute: treatmentRouteEnum("treatment_route"),
    cyclesCount: integer("cycles_count"),
    retrievedCount: integer("retrieved_count"),
    frozenCount: integer("frozen_count"),
    status: storyStatusEnum("status").notNull().default("pending"),
    consentVersion: text("consent_version").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    searchBlob: text("search_blob"),
  },
  (t) => ({
    statusIdx: index("stories_status_idx").on(t.status),
    publicFeedIdx: index("stories_public_feed_idx").on(t.status, t.publishedAt),
    authorIdx: index("stories_author_idx").on(t.authorUserId),
  })
);
