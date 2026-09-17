import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/db";
import { savedCostEstimates } from "@/db/schema";
import { saveEstimateSchema } from "@/lib/validation/costEstimateSchemas";

async function getUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  const id = (session?.user as { id?: string } | undefined)?.id;
  return typeof id === "string" && id.length > 0 ? id : null;
}

export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  try {
    const rows = await db
      .select()
      .from(savedCostEstimates)
      .where(eq(savedCostEstimates.userId, userId))
      .orderBy(desc(savedCostEstimates.createdAt));
    return NextResponse.json({ items: rows });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = saveEstimateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_shape" }, { status: 400 });
  }

  try {
    const [row] = await db
      .insert(savedCostEstimates)
      .values({
        userId, // תמיד מה-session — לעולם לא מהגוף, גם אם הלקוח שולח userId
        label: parsed.data.label,
        inputData: parsed.data.inputData,
        minTotal: parsed.data.minTotal,
        maxTotal: parsed.data.maxTotal,
      })
      .returning();
    return NextResponse.json(row, { status: 201 });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
