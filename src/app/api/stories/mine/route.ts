import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { desc, eq } from "drizzle-orm";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/db";
import { stories } from "@/db/schema";

async function getUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  const id = (session?.user as { id?: string } | undefined)?.id;
  return typeof id === "string" && id.length > 0 ? id : null;
}

/** "הסיפורים שלי" — כל הסטטוסים, אך ורק של המשתמשת המחוברת (WHERE author_user_id) */
export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  try {
    const rows = await db
      .select()
      .from(stories)
      .where(eq(stories.authorUserId, userId))
      .orderBy(desc(stories.createdAt));

    return NextResponse.json({ stories: rows });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
