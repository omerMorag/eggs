import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/authOptions";
import { redis } from "@/lib/redis";
import { isValidJournal, MAX_JOURNAL_BYTES, type InjectionJournal } from "@/lib/injectionJournal";

/**
 * יומן "תקופת הזריקות" של משתמשת מחוברת — באותו מנגנון כמו /api/progress
 * (Upstash Redis, מפתח לפי מזהה המשתמשת), אבל במפתח נפרד לגמרי
 * ("injection-journal:*") כדי שלא יתערבב עם התקדמות המסלול. אלה נתונים
 * רפואיים אישיים: לא נרשמים ללוג, לא נשלחים לשום שירות אחר, והתשובות
 * מסומנות no-store.
 */

export const dynamic = "force-dynamic";

function journalKey(userId: string): string {
  return `injection-journal:${userId}`;
}

async function getUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  const id = (session?.user as { id?: string } | undefined)?.id;
  return typeof id === "string" && id.length > 0 ? id : null;
}

const NO_STORE = { "Cache-Control": "no-store" };

export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401, headers: NO_STORE });
  try {
    const data = await redis.get<InjectionJournal>(journalKey(userId));
    return NextResponse.json(data ?? null, { headers: NO_STORE });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500, headers: NO_STORE });
  }
}

export async function PUT(request: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401, headers: NO_STORE });
  let text: string;
  try {
    text = await request.text();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400, headers: NO_STORE });
  }
  if (text.length > MAX_JOURNAL_BYTES) {
    return NextResponse.json({ error: "too_large" }, { status: 413, headers: NO_STORE });
  }
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400, headers: NO_STORE });
  }
  if (!isValidJournal(body)) {
    return NextResponse.json({ error: "invalid_shape" }, { status: 400, headers: NO_STORE });
  }
  try {
    await redis.set(journalKey(userId), body);
    return NextResponse.json({ ok: true }, { headers: NO_STORE });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500, headers: NO_STORE });
  }
}
