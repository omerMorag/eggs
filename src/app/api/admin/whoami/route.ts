import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { isAdminEmail } from "@/lib/isAdmin";

/**
 * Endpoint קטן ל-UX בלבד: קובע אם קישור הניווט לאזור האדמין יוצג ללקוח.
 * שום הרשאה אמיתית לא תלויה בזה — כל route תחת /api/admin/** אוכף
 * requireAdmin() בעצמו, בעצמאות מוחלטת מהתשובה הזו.
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  return NextResponse.json({ isAdmin: isAdminEmail(session?.user?.email) });
}
