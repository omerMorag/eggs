import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/authOptions";
import { isAdminEmail } from "./isAdmin";

export type RequireAdminResult =
  | { ok: true; email: string; userId: string }
  | { ok: false; response: NextResponse };

/**
 * שער הרשאה יחיד לכל route תחת /api/admin/**. בודק session תקין (401 בלי
 * session) ואז isAdminEmail מול session.user.email בלבד (403 אם לא מנהלת).
 * לעולם לא נבדק/נסמך על כל דבר שהלקוח שולח. userId (Google sub) מוחזר
 * לשימוש ב-audit log (story_edit_audit.admin_user_id).
 */
export async function requireAdmin(): Promise<RequireAdminResult> {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email ?? null;
  const userId = (session?.user as { id?: string } | undefined)?.id ?? null;

  if (!email || !userId) {
    return { ok: false, response: NextResponse.json({ error: "unauthorized" }, { status: 401 }) };
  }
  if (!isAdminEmail(email)) {
    return { ok: false, response: NextResponse.json({ error: "forbidden" }, { status: 403 }) };
  }
  return { ok: true, email, userId };
}
