import { config as loadEnv } from "dotenv";
import type { Config } from "drizzle-kit";

// dotenv/config טוען כברירת מחדל רק קובץ בשם ".env" — לא ".env.local".
// הפרויקט (וגם Next.js עצמו) משתמשים ב-".env.local" לסודות מקומיים,
// אז חשוב לטעון אותו כאן במפורש (וגם ".env" כ-fallback, ליתר ביטחון).
loadEnv({ path: ".env.local" });
loadEnv();

/**
 * מיגרציות רצות תמיד מול DATABASE_URL_UNPOOLED (חיבור ישיר, לא pooled) —
 * פעולות DDL (CREATE TABLE/EXTENSION/INDEX) דורשות ערבויות ברמת session
 * שלא תמיד מתקיימות מול pooler בסגנון PgBouncer transaction-mode. בזמן
 * ריצה רגיל של האתר (src/db/index.ts) נעשה שימוש ב-DATABASE_URL (pooled).
 */
export default {
  schema: "./src/db/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL!,
  },
  strict: true,
  verbose: true,
} satisfies Config;
