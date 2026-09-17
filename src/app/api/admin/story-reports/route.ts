import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/requireAdmin";
import { db } from "@/db";
import { storyReports, stories } from "@/db/schema";
import { reportStatusEnum } from "@/db/schema/enums";

const VALID_STATUSES = new Set(reportStatusEnum.enumValues);

/** תור הדיווחים — כולל כותרת הסיפור המדווח, לנוחות המנהלת */
export async function GET(request: Request) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const statusFilter =
    status && VALID_STATUSES.has(status as (typeof reportStatusEnum.enumValues)[number])
      ? eq(storyReports.status, status as (typeof reportStatusEnum.enumValues)[number])
      : undefined;

  try {
    const rows = await db
      .select({
        id: storyReports.id,
        storyId: storyReports.storyId,
        storyTitle: stories.title,
        storyStatus: stories.status,
        reason: storyReports.reason,
        details: storyReports.details,
        status: storyReports.status,
        createdAt: storyReports.createdAt,
      })
      .from(storyReports)
      .innerJoin(stories, eq(storyReports.storyId, stories.id))
      .where(statusFilter)
      .orderBy(desc(storyReports.createdAt));

    return NextResponse.json({ reports: rows });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
