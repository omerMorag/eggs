import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { costItems } from "@/db/schema";

/**
 * מחירי בסיס למחשבון העלות — ציבורי, קריאה בלבד. מחזיר רק שורות פעילות
 * (is_active=true). min_price/max_price יכולים להיות null ("המחיר טרם
 * עודכן") — הלקוח אחראי להציג את זה נכון, לא הראוט.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const treatmentRoute = searchParams.get("treatmentRoute");
  const hmo = searchParams.get("hmo");
  const clinic = searchParams.get("clinic");

  try {
    const conditions = [eq(costItems.isActive, true)];
    if (category) conditions.push(eq(costItems.category, category as (typeof costItems.category.enumValues)[number]));
    if (treatmentRoute)
      conditions.push(eq(costItems.treatmentRoute, treatmentRoute as (typeof costItems.treatmentRoute.enumValues)[number]));
    if (hmo) conditions.push(eq(costItems.hmo, hmo as (typeof costItems.hmo.enumValues)[number]));
    if (clinic) conditions.push(eq(costItems.clinic, clinic));

    const rows = await db
      .select()
      .from(costItems)
      .where(and(...conditions));

    const lastUpdatedAt = rows.reduce<string | null>((latest, row) => {
      if (!row.lastVerifiedAt) return latest;
      const iso = row.lastVerifiedAt.toISOString();
      return !latest || iso > latest ? iso : latest;
    }, null);

    return NextResponse.json({ items: rows, lastUpdatedAt });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
