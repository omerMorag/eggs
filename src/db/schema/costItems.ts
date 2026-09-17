import { pgTable, serial, text, integer, boolean, timestamp, index } from "drizzle-orm/pg-core";
import { costItemCategoryEnum, treatmentRouteEnum, hmoFundEnum, billingTypeEnum } from "./enums";

/**
 * פריטי עלות עבור מחשבון "כמה יעלה לי?". min_price/max_price הם NULL כאשר
 * אין עדיין מחיר מאומת — לעולם לא נכתב מספר מומצא; ה-UI מציג "המחיר טרם
 * עודכן" ומאפשרת הזנה ידנית במקום. שורות נזרעות/מתעדכנות ידנית (db:studio)
 * בשלב הזה — אין עדיין ממשק ניהול ייעודי.
 */
export const costItems = pgTable(
  "cost_items",
  {
    id: serial("id").primaryKey(),
    category: costItemCategoryEnum("category").notNull(),
    label: text("label").notNull(),
    treatmentRoute: treatmentRouteEnum("treatment_route").notNull().default("not_specified"),
    hmo: hmoFundEnum("hmo"),
    /** שם מרפאה/בית חולים — מתואם ידנית מול השמות הקיימים ב-src/data/hospitalPrices.ts */
    clinic: text("clinic"),
    minPrice: integer("min_price"),
    maxPrice: integer("max_price"),
    billingType: billingTypeEnum("billing_type").notNull(),
    sourceUrl: text("source_url"),
    lastVerifiedAt: timestamp("last_verified_at", { withTimezone: true }),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    categoryIdx: index("cost_items_category_idx").on(t.category),
    activeIdx: index("cost_items_active_idx").on(t.isActive),
    lookupIdx: index("cost_items_lookup_idx").on(t.category, t.treatmentRoute, t.hmo, t.clinic),
  })
);
