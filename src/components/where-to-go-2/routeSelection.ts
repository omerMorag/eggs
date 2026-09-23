import {
  medicationSummary,
  routeName,
  routesForFund,
  selfPayRoute,
  storageSummary,
  type CareRoute,
  type CareUnit,
  type HealthFund,
} from "@/data/careUnits";

/** איך המשתמשת מתכננת לממן — הבחירה הראשונה במחשבון */
export type PaymentPath = "fund" | "selfPay" | "medical" | "undecided";
/** האם יש לה את הרובד שבו קיימת ההטבה (למשל מכבי שלי) */
export type PlanAnswer = "yes" | "no" | "unsure";

export interface RouteSelection {
  path: PaymentPath;
  fund: HealthFund | null;
  plan: PlanAnswer;
}

/** האם צריך להציג את מסלול הקופה (ולא תשלום עצמי) בכרטיסים */
export function usesFundRoute(sel: RouteSelection): sel is RouteSelection & { fund: HealthFund } {
  return sel.path === "fund" && sel.fund != null && sel.plan !== "no";
}

/**
 * המסלול שמוצג בכרטיס של יחידה לפי הבחירה במחשבון: מסלול הקופה שנבחרה אם
 * קיים ביחידה, אחרת תשלום עצמי. כל כרטיס מציג מסלול אחד בכל רגע, כדי שמחיר
 * דרך הקופה ומחיר בתשלום עצמי לא יתערבבו.
 */
export function displayedRoute(unit: CareUnit, sel: RouteSelection): CareRoute | undefined {
  if (usesFundRoute(sel)) {
    const fundRoute = routesForFund(unit, sel.fund)[0];
    if (fundRoute) return fundRoute;
  }
  return selfPayRoute(unit) ?? unit.routes[0];
}

export interface CalcLine {
  key: string;
  label: string;
  /** סכום ידוע (כבר כפול מספר הסבבים), או null כשלא ידוע */
  amount: number | null;
  /** טקסט כשאין סכום — "מחיר בבירור", "לא אומת" וכו' */
  text?: string;
  note?: string;
}

export interface CalcResult {
  lines: CalcLine[];
  knownTotal: number;
  hasUnknown: boolean;
  /** true כשאין אף סכום ידוע */
  nothingKnown: boolean;
}

/**
 * חישוב עלות ידועה בלבד. כלל: רכיב שאין לו מחיר ממקור רשמי לעולם לא נספר
 * כ-0 ולא מוצג כחלק מ"סכום כולל" — הוא מוצג כשורה נפרדת "לא אומת", והסיכום
 * מנוסח "עלות ידועה: X ₪, בתוספת רכיבים שטרם אומתו".
 */
export function calculate(
  route: CareRoute,
  cycles: number,
  doctor: { wanted: boolean; amount?: number }
): CalcResult {
  const lines: CalcLine[] = [];
  const isFund = route.fundingType === "healthFundArrangement";

  lines.push({
    key: "main",
    label: isFund ? `השתתפות עצמית דרך ${routeName(route)}` : "תשלום ליחידה (תשלום עצמי)",
    amount: route.priceAmount != null ? route.priceAmount * cycles : null,
    text: route.priceAmount != null ? undefined : "מחיר בבירור",
    note:
      route.priceAmount != null
        ? `${route.priceApprox ? "כ־" : ""}${route.priceAmount.toLocaleString("he-IL")} ₪ ${route.priceBasis ?? "לסבב"} × ${cycles}`
        : route.pricePerCycle
          ? `פורסם בעבר / ממקור לא רשמי: ${route.pricePerCycle}. לא נכלל בחישוב.`
          : "לא אותר מחיר במקור רשמי. לא נכלל בחישוב.",
  });

  if (doctor.wanted) {
    lines.push({
      key: "doctor",
      label: "ליווי רופא/ה פרטי/ת",
      amount: doctor.amount != null && doctor.amount > 0 ? doctor.amount * cycles : null,
      text: "לא ידוע — יש לברר",
      note:
        doctor.amount != null && doctor.amount > 0
          ? `${doctor.amount.toLocaleString("he-IL")} ₪ לסבב (לפי הסכום שהזנת) × ${cycles}`
          : "אפשר להזין סכום שקיבלת מהרופא/ה.",
    });
  }

  lines.push({
    key: "meds",
    label: "תרופות",
    amount: null,
    text: route.medicationsIncluded ? "כלולות במחיר" : "לא נכללות בחישוב",
    note: medicationSummary(route),
  });

  lines.push({
    key: "storage",
    label: "אחסון",
    amount: null,
    text: route.storageYears ? `${route.storageYears} שנים כלולות` : "לא אומת",
    note: route.storageYears ? "עלות האחסון אחרי התקופה הכלולה — יש לברר." : storageSummary(route),
  });

  const knownTotal = lines.reduce((acc, l) => acc + (l.amount ?? 0), 0);
  const hasUnknown =
    lines.some((l) => l.amount == null && l.key !== "storage" && !(l.key === "meds" && route.medicationsIncluded)) ||
    !route.storageYears;

  return { lines, knownTotal, hasUnknown, nothingKnown: knownTotal === 0 };
}
