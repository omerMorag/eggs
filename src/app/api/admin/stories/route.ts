import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/requireAdmin";
import { db } from "@/db";
import { stories } from "@/db/schema";
import { storyStatusEnum } from "@/db/schema/enums";

const VALID_STATUSES = new Set(storyStatusEnum.enumValues);

/** תור המודרציה — כל route תחת /api/admin/** נפתח ב-requireAdmin() */
export async function GET(request: Request) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  try {
    const rows =
      status && VALID_STATUSES.has(status as (typeof storyStatusEnum.enumValues)[number])
        ? await db
            .select()
            .from(stories)
            .where(eq(stories.status, status as (typeof storyStatusEnum.enumValues)[number]))
            .orderBy(desc(stories.createdAt))
        : await db.select().from(stories).orderBy(desc(stories.createdAt));

    return NextResponse.json({ stories: rows });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
