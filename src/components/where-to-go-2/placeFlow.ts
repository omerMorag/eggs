import {
  FUND_PLANS,
  formatShekel,
  routesForFund,
  selfPayRoute,
  type CareRoute,
  type CareUnit,
  type HealthFund,
  type Region,
} from "@/data/careUnits";

/** ארבע האפשרויות בראש העמוד */
export type PlacePath = "private" | "fund" | "public" | "all";
/** האם יש לה את הרובד שבו קיימת ההטבה. null = עוד לא נבחר (אין ברירת מחדל) */
export type PlanAnswer = "yes" | "no" | "unsure" | null;
export type RegionFilter = Region | "all";

export interface FlowState {
  path: PlacePath | null;
  fund: HealthFund | null;
  plan: PlanAnswer;
  region: RegionFilter;
}

export const FUNDS: HealthFund[] = ["מכבי", "כללית", "מאוחדת", "לאומית"];

/** מסלול הקופה שנבחרה ביחידה (אם יש) */
export function chosenFundRoute(unit: CareUnit, s: FlowState): CareRoute | undefined {
  if (s.path !== "fund" || !s.fund) return undefined;
  return routesForFund(unit, s.fund)[0];
}

/** האם היחידה מתאימה למסלול שנבחר (בלי קשר לאזור) */
export function matchesPath(unit: CareUnit, s: FlowState): boolean {
  switch (s.path) {
    case "private":
      return unit.setting === "private";
    case "public":
      return unit.setting === "public";
    case "fund":
      // בלי קופה או כשאין לה את הרובד — אין מה לסנן לפי הקופה
      if (!s.fund || s.plan === "no") return true;
      return routesForFund(unit, s.fund).length > 0;
    default:
      return true;
  }
}

export function inRegion(unit: CareUnit, region: RegionFilter): boolean {
  return region === "all" || unit.region === region;
}

/** מקומות מתאימים + "מקומות נוספים" (באותו אזור, שלא מתאימים למסלול) */
export function splitUnits(units: CareUnit[], s: FlowState): { matched: CareUnit[]; others: CareUnit[] } {
  const active = units.filter((u) => u.isActive && inRegion(u, s.region));
  const matched = active.filter((u) => matchesPath(u, s));
  const others = s.path === "all" ? [] : active.filter((u) => !matchesPath(u, s));
  if (s.path === "fund" && s.fund) {
    // קודם הסדרים שאומתו — לפי ודאות, לא דירוג איכות או מחיר
    const rank = (u: CareUnit) => (routesForFund(u, s.fund!)[0]?.verificationStatus === "verified" ? 0 : 1);
    matched.sort((a, b) => rank(a) - rank(b));
  }
  return { matched, others };
}

/* ------------------------------------------------------------------ */
/* מחירים — מה מותר להציג בכל מצב                                      */
/* ------------------------------------------------------------------ */

export interface PriceView {
  /** verified = מחיר שפורסם במקור רשמי; conditional = מחיר הטבה בכפוף לזכאות; pending = מחיר בבירור; hidden = לא מוצג עד בחירת רובד */
  kind: "verified" | "conditional" | "pending" | "hidden" | "notRelevant";
  label: string;
  amount?: string;
  basis?: string;
}

/** מחיר בתשלום עצמי: רק מחיר שפורסם במקור רשמי ונבדק. אחרת "מחיר בבירור". */
export function selfPayPrice(route: CareRoute | undefined): PriceView {
  if (!route || route.priceAmount == null || route.verificationStatus !== "verified") {
    return { kind: "pending", label: "מחיר בבירור" };
  }
  return {
    kind: "verified",
    label: "מחיר בתשלום עצמי",
    amount: formatShekel(route.priceAmount, route.priceApprox),
    basis: route.priceBasis,
  };
}

/**
 * מחיר הטבת קופה. במסלול הקופה: מוצג כמחיר רלוונטי רק אחרי שנבחר במפורש
 * "יש לי" את הרובד; ב"לא בטוחה" — "מחיר אפשרי בכפוף לבדיקת זכאות".
 * מחוץ למסלול הקופה (כאפשרות נוספת בכרטיס) — תמיד בניסוח המותנה.
 */
export function fundPrice(route: CareRoute, plan: PlanAnswer | "context"): PriceView {
  const planName = route.requiredPlan ?? route.healthFund ?? "";
  if (plan === null) return { kind: "hidden", label: `בחרי למעלה אם יש לך ${planName} כדי לראות את מחיר ההטבה` };
  if (plan === "no") return { kind: "notRelevant", label: `ההטבה קיימת רק ב${planName}` };
  if (route.priceAmount == null) return { kind: "pending", label: "מחיר בבירור" };
  const amount = formatShekel(route.priceAmount, route.priceApprox);
  if (plan === "yes") return { kind: "verified", label: "השתתפות עצמית לסבב, אם את עומדת בתנאים", amount, basis: route.priceBasis };
  return { kind: "conditional", label: "מחיר אפשרי בכפוף לבדיקת זכאות", amount, basis: route.priceBasis };
}

/* ------------------------------------------------------------------ */
/* מה ידוע / מה צריך לברר                                               */
/* ------------------------------------------------------------------ */

export function medsText(route: CareRoute | undefined): string {
  if (!route) return "לא אומת";
  if (route.medicationsIncluded === true) return "כלולות במחיר";
  if (route.medicationNotes) return route.medicationNotes;
  if (route.medicationsIncluded === false) return "לא כלולות במחיר";
  return "לא אומת";
}

export function storageText(route: CareRoute | undefined): string {
  if (!route?.storageYears) return "לא אומת";
  return `${route.storageYears} שנות אחסון כלולות`;
}

export function includedText(route: CareRoute | undefined): string {
  return route?.included ?? "לא פורסם במקור שנבדק";
}

export function doctorText(route: CareRoute | undefined): string {
  if (route?.doctorChoice === "yes") return "אפשרית";
  if (route?.doctorChoice === "no") return "לא";
  if (route?.doctorChoice === "depends") return "תלוי במסלול";
  return "לא אומת";
}

/** רשימת הדברים שעדיין דורשים בירור — לפי הנתונים המאומתים בלבד */
export function toCheck(unit: CareUnit, main: CareRoute | undefined, s: FlowState): string[] {
  const out: string[] = [];
  if (!main) return ["מסלולי התשלום ביחידה"];
  if (main.fundingType === "healthFundArrangement" && main.verificationStatus !== "verified") {
    out.push(`שהיחידה בהסדר ${main.requiredPlan ?? main.healthFund}`);
  }
  if (main.fundingType === "healthFundArrangement") out.push("זכאות: גיל, ותק ואישור הקופה");
  if (main.priceAmount == null || (main.fundingType === "selfPay" && main.verificationStatus !== "verified")) out.push("מחיר עדכני");
  if (!main.included) out.push("מה כלול במחיר");
  if (main.medicationsIncluded == null && !main.medicationNotes?.includes("אינן כלולות")) out.push("תרופות");
  if (!main.storageYears) out.push("אחסון");
  if (!main.doctorChoice && (s.path === "private" || unit.setting === "private")) out.push("בחירת רופא/ה וליווי לאורך הסבב");
  return out;
}

/** המסלול "הראשי" של הכרטיס לפי הבחירה */
export function mainRoute(unit: CareUnit, s: FlowState): CareRoute | undefined {
  const fr = chosenFundRoute(unit, s);
  if (fr && s.plan !== "no") return fr;
  return selfPayRoute(unit) ?? unit.routes[0];
}

export function planName(fund: HealthFund): string {
  return FUND_PLANS[fund];
}
