import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { and, count, desc, eq, ilike } from "drizzle-orm";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/db";
import { stories } from "@/db/schema";
import { storiesQuerySchema, storyInputSchema, CURRENT_CONSENT_VERSION } from "@/lib/validation/storySchemas";
import { storySubmitLimiter } from "@/lib/rateLimit";

async function getUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  const id = (session?.user as { id?: string } | undefined)?.id;
  return typeof id === "string" && id.length > 0 ? id : null;
}

function summarize(storyText: string): string {
  const trimmed = storyText.trim();
  if (trimmed.length <= 160) return trimmed;
  return trimmed.slice(0, 160).trimEnd() + "…";
}

/** צורת החזרה ציבורית — allow-list מפורש בלבד, לעולם לא spread של השורה הגולמית */
function toPublicListItem(row: typeof stories.$inferSelect) {
  return {
    id: row.id,
    title: row.title,
    displayName: row.isAnonymous ? null : row.displayName,
    isAnonymous: row.isAnonymous,
    summary: summarize(row.storyText),
    ageRange: row.ageRange,
    cyclesCount: row.cyclesCount,
    treatmentRoute: row.treatmentRoute,
    clinic: row.clinic,
    region: row.region,
    publishedAt: row.publishedAt,
  };
}

/**
 * GET ציבורי — ללא auth. תמיד WHERE status='published' (קבוע בקוד, לעולם
 * לא נגזר מה-query). חיפוש בעברית דרך search_blob (עמודה מחושבת + אינדקס
 * pg_trgm, ר' drizzle/0001_search_and_constraints.sql).
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = storiesQuerySchema.safeParse(Object.fromEntries(searchParams));
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_query" }, { status: 400 });
  }
  const { q, ageRange, cyclesCount, treatmentRoute, hmo, region, page, pageSize } = parsed.data;

  const conditions = [eq(stories.status, "published")];
  if (q) conditions.push(ilike(stories.searchBlob, `%${q}%`));
  if (ageRange) conditions.push(eq(stories.ageRange, ageRange));
  if (cyclesCount !== undefined) conditions.push(eq(stories.cyclesCount, cyclesCount));
  if (treatmentRoute) conditions.push(eq(stories.treatmentRoute, treatmentRoute));
  if (hmo) conditions.push(eq(stories.hmo, hmo));
  if (region) conditions.push(eq(stories.region, region));

  const where = and(...conditions);

  try {
    const [rows, [{ total }]] = await Promise.all([
      db
        .select()
        .from(stories)
        .where(where)
        .orderBy(desc(stories.publishedAt))
        .limit(pageSize)
        .offset((page - 1) * pageSize),
      db.select({ total: count() }).from(stories).where(where),
    ]);

    return NextResponse.json({
      stories: rows.map(toPublicListItem),
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}

/**
 * POST יצירה — דורש התחברות; status/authorUserId/consentVersion נקבעים
 * תמיד בשרת, לעולם לא מהגוף. הסיפור נשמר כ-"pending" — לא נראה לאף אחת
 * (כולל לשולחת עצמה בפיד הציבורי) עד אישור אדמין.
 */
export async function POST(request: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { success: allowed } = await storySubmitLimiter.limit(userId);
  if (!allowed) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = storyInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_shape", issues: parsed.error.issues }, { status: 400 });
  }
  const { consent: _consent, ...data } = parsed.data;

  try {
    const [row] = await db
      .insert(stories)
      .values({
        ...data,
        authorUserId: userId,
        status: "pending",
        consentVersion: CURRENT_CONSENT_VERSION,
      })
      .returning({ id: stories.id });

    return NextResponse.json({ id: row.id, status: "pending" }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
