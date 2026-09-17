import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { and, eq } from "drizzle-orm";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/db";
import { stories, storyReports } from "@/db/schema";
import { createReportSchema } from "@/lib/validation/reportSchemas";
import { storyReportLimiter } from "@/lib/rateLimit";

async function getUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  const id = (session?.user as { id?: string } | undefined)?.id;
  return typeof id === "string" && id.length > 0 ? id : null;
}

/**
 * דיווח על תוכן — דורש התחברות (לא אנונימי, כדי שה-rate limit וההגנה
 * מפני דיווח כפול יוכלו להיצמד לזהות יציבה). דיווח כפול על אותו סיפור
 * ע"י אותה משתמשת מטופל כהצלחה שקטה, לא כשגיאה.
 */
export async function POST(request: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { success: allowed } = await storyReportLimiter.limit(userId);
  if (!allowed) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const parsed = createReportSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_shape", issues: parsed.error.issues }, { status: 400 });
  }

  try {
    const [story] = await db
      .select({ id: stories.id })
      .from(stories)
      .where(and(eq(stories.id, parsed.data.storyId), eq(stories.status, "published")))
      .limit(1);

    if (!story) return NextResponse.json({ error: "not_found" }, { status: 404 });

    await db.insert(storyReports).values({
      storyId: parsed.data.storyId,
      reporterUserId: userId,
      reason: parsed.data.reason,
      details: parsed.data.details,
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    // 23505 = unique_violation (story_reports_unique_reporter) — כבר דיווחה, מטופל כהצלחה
    if (typeof err === "object" && err !== null && "code" in err && (err as { code?: string }).code === "23505") {
      return NextResponse.json({ ok: true, alreadyReported: true });
    }
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
