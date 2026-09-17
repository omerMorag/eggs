import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

/**
 * חיבור יחיד (singleton) ל-Postgres, לשימוש בזמן ריצה של האתר (API routes).
 * נשתמש ב-DATABASE_URL (pooled connection string — ב-Neon זהו החיבור דרך
 * ה-pgbouncer, מתאים לריצה ב-Vercel serverless functions). מיגרציות רצות
 * בנפרד מול DATABASE_URL_UNPOOLED (ראו drizzle.config.ts).
 *
 * ה-Pool נשמר ב-globalThis כדי לא ליצור חיבור חדש בכל hot-reload בפיתוח
 * מקומי (Next.js dev server) — תבנית סטנדרטית למניעת דליפת חיבורים.
 */
declare global {
  // eslint-disable-next-line no-var
  var __pgPool: Pool | undefined;
}

const pool =
  globalThis.__pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 5,
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__pgPool = pool;
}

export const db = drizzle(pool, { schema });
