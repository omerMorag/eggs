/**
 * מודל הנתונים של יומן "תקופת הזריקות" + פונקציות טהורות לעבודה איתו.
 *
 * עקרונות:
 *  - היומן נפרד לגמרי מהתקדמות המסלול (useJourneyProgress). מילוי היומן לא
 *    מסמן משימות במסלול ולא מפעיל את רגע הסיום.
 *  - כל סבב (cycle) שמור בנפרד, עם תאריך התחלה משלו.
 *  - כל תרופה ביום היא רשומה עצמאית. הוספה "לימים הבאים" יוצרת רשומה נפרדת
 *    לכל יום (עם seriesId משותף), כך ששינוי מינון בהמשך נוגע רק ברשומות
 *    עתידיות שלא סומנו כהוזרקו — מה שכבר תועד לא נמחק ולא משתנה.
 *  - אין שום השלמה אוטומטית של מינון או שעה, ואין פרשנות לתוצאות.
 */

export const JOURNAL_VERSION = 1 as const;
/** מגבלת גודל כדי שנתוני היומן לא יתנפחו (גם בצד השרת) */
export const MAX_JOURNAL_BYTES = 200_000;

export type MedKind = "daily" | "oneTime";

export interface MedEntry {
  id: string;
  /** מזהה משותף לרשומות שנוצרו יחד ל"ימים הבאים" */
  seriesId?: string;
  name: string;
  /** מזהה מדריך ב-injectionGuides, אם זוהה */
  guideId?: string;
  /** סוג התכשיר / העט כפי שידוע למשתמשת */
  form?: string;
  /** המינון כפי שנמסר — טקסט חופשי, לא מחושב */
  dose?: string;
  unit?: string;
  kind: MedKind;
  /** "HH:MM" — שעה מתוכננת / השעה המדויקת שנמסרה לזריקה חד-פעמית */
  plannedTime?: string;
  done: boolean;
  /** "HH:MM" — שעת ביצוע בפועל, ניתנת לעריכה */
  doneTime?: string;
  note?: string;
}

export interface BloodValue {
  id: string;
  name: string;
  value: string;
  unit: string;
}

export interface MonitoringResult {
  bloodValues: BloodValue[];
  ultrasound?: string;
  nextInstructions?: string;
}

export interface JournalDay {
  meds: MedEntry[];
  /** האם היה מעקב (בדיקת דם / אולטרסאונד) ביום הזה */
  hadCheckup?: boolean;
  monitoring?: MonitoringResult;
  note?: string;
}

export interface JournalCycle {
  id: string;
  label: string;
  /** "YYYY-MM-DD" — יום הזריקות הראשון */
  startDate: string;
  days: Record<string, JournalDay>;
  createdAt: string;
}

export interface InjectionJournal {
  version: typeof JOURNAL_VERSION;
  activeCycleId: string | null;
  cycles: JournalCycle[];
  updatedAt: string;
}

export function emptyJournal(): InjectionJournal {
  return { version: JOURNAL_VERSION, activeCycleId: null, cycles: [], updatedAt: new Date(0).toISOString() };
}

export function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/* ---------------------------- תאריכים ---------------------------- */

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

/** תאריך מקומי (לא UTC) בפורמט YYYY-MM-DD */
export function toISODate(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function todayISO(): string {
  return toISODate(new Date());
}

export function nowHHMM(): string {
  const d = new Date();
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function parseISO(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1, 12); // צהריים — חסין למעברי שעון קיץ
}

export function addDays(iso: string, n: number): string {
  const d = parseISO(iso);
  d.setDate(d.getDate() + n);
  return toISODate(d);
}

export function diffDays(fromISO: string, toISO: string): number {
  return Math.round((parseISO(toISO).getTime() - parseISO(fromISO).getTime()) / 86_400_000);
}

/** יום הזריקות (1 = יום ההתחלה). 0 ומטה = לפני תחילת הסבב */
export function dayNumber(cycle: JournalCycle, iso: string): number {
  return diffDays(cycle.startDate, iso) + 1;
}

const WEEKDAYS = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];

export function formatDateLong(iso: string): string {
  const d = parseISO(iso);
  return `יום ${WEEKDAYS[d.getDay()]}, ${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
}

export function formatDateShort(iso: string): string {
  const d = parseISO(iso);
  return `${d.getDate()}.${d.getMonth() + 1}`;
}

export function isValidISODate(s: unknown): s is string {
  return typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(parseISO(s).getTime());
}

/* ---------------------------- טווח ימים ---------------------------- */

/**
 * כל התאריכים שמוצגים ביומן: מיום ההתחלה ועד המאוחר מבין — היום האחרון
 * שיש בו רשומה, היום הנוכחי (אם הסבב כבר התחיל), או 10 ימים מההתחלה.
 */
export function cycleDates(cycle: JournalCycle, today: string): string[] {
  const keys = Object.keys(cycle.days).filter(isValidISODate);
  let last = addDays(cycle.startDate, 9);
  for (const k of keys) if (k > last) last = k;
  if (today > last && diffDays(cycle.startDate, today) <= 60) last = today;
  const out: string[] = [];
  for (let d = cycle.startDate; d <= last && out.length < 120; d = addDays(d, 1)) out.push(d);
  return out;
}

/* ---------------------------- עדכונים (immutable) ---------------------------- */

export function getDay(cycle: JournalCycle, iso: string): JournalDay {
  return cycle.days[iso] ?? { meds: [] };
}

function isEmptyDay(day: JournalDay): boolean {
  return day.meds.length === 0 && !day.hadCheckup && !day.monitoring && !day.note;
}

export function withDay(cycle: JournalCycle, iso: string, update: (day: JournalDay) => JournalDay): JournalCycle {
  const next = update(getDay(cycle, iso));
  const days = { ...cycle.days };
  if (isEmptyDay(next)) delete days[iso];
  else days[iso] = next;
  return { ...cycle, days };
}

export interface MedDraft {
  name: string;
  guideId?: string;
  form?: string;
  dose?: string;
  unit?: string;
  kind: MedKind;
  plannedTime?: string;
  note?: string;
}

/** הוספת תרופה ליום אחד, ואופציונלית גם ל-(extraDays) הימים שאחריו — רשומה נפרדת לכל יום */
export function addMed(cycle: JournalCycle, iso: string, draft: MedDraft, extraDays: number): JournalCycle {
  const repeat = draft.kind === "daily" ? Math.max(0, Math.min(30, extraDays)) : 0;
  const seriesId = repeat > 0 ? newId() : undefined;
  let next = cycle;
  for (let i = 0; i <= repeat; i += 1) {
    const date = addDays(iso, i);
    const entry: MedEntry = { ...draft, id: newId(), seriesId, done: false };
    next = withDay(next, date, (day) => ({ ...day, meds: [...day.meds, entry] }));
  }
  return next;
}

/**
 * עריכת רשומה. אם applyToFuture — אותו שינוי (שם/תכשיר/מינון/יחידה/שעה)
 * חל גם על רשומות מאותה סדרה בימים מאוחרים יותר שעוד לא סומנו "הזרקתי".
 * רשומות שכבר בוצעו לא משתנות לעולם.
 */
export function updateMed(
  cycle: JournalCycle,
  iso: string,
  medId: string,
  patch: Partial<MedDraft>,
  applyToFuture: boolean
): JournalCycle {
  const source = getDay(cycle, iso).meds.find((m) => m.id === medId);
  if (!source) return cycle;
  let next = withDay(cycle, iso, (day) => ({
    ...day,
    meds: day.meds.map((m) => (m.id === medId ? { ...m, ...patch } : m)),
  }));
  if (applyToFuture && source.seriesId) {
    const { note: _note, ...seriesPatch } = patch;
    void _note;
    for (const date of Object.keys(next.days)) {
      if (date <= iso) continue;
      next = withDay(next, date, (day) => ({
        ...day,
        meds: day.meds.map((m) => (m.seriesId === source.seriesId && !m.done ? { ...m, ...seriesPatch } : m)),
      }));
    }
  }
  return next;
}

export function setMedDone(cycle: JournalCycle, iso: string, medId: string, done: boolean, doneTime?: string): JournalCycle {
  return withDay(cycle, iso, (day) => ({
    ...day,
    meds: day.meds.map((m) =>
      m.id === medId ? { ...m, done, doneTime: done ? (doneTime ?? m.doneTime ?? nowHHMM()) : undefined } : m
    ),
  }));
}

export function setMedDoneTime(cycle: JournalCycle, iso: string, medId: string, doneTime: string): JournalCycle {
  return withDay(cycle, iso, (day) => ({
    ...day,
    meds: day.meds.map((m) => (m.id === medId ? { ...m, doneTime } : m)),
  }));
}

export function deleteMed(cycle: JournalCycle, iso: string, medId: string): JournalCycle {
  return withDay(cycle, iso, (day) => ({ ...day, meds: day.meds.filter((m) => m.id !== medId) }));
}

/** שמות התרופות שהוזנו בסבב (לסידור ספריית המדריכים) */
export function cycleMedGuideIds(cycle: JournalCycle | undefined): string[] {
  if (!cycle) return [];
  const ids = new Set<string>();
  for (const day of Object.values(cycle.days)) for (const m of day.meds) if (m.guideId) ids.add(m.guideId);
  return [...ids];
}

/* ---------------------------- ולידציה ---------------------------- */

function isStr(v: unknown, max = 2000): v is string {
  return typeof v === "string" && v.length <= max;
}
function optStr(v: unknown, max = 2000): boolean {
  return v === undefined || isStr(v, max);
}

function isValidMed(v: unknown): v is MedEntry {
  if (!v || typeof v !== "object") return false;
  const m = v as Record<string, unknown>;
  return (
    isStr(m.id, 100) &&
    optStr(m.seriesId, 100) &&
    isStr(m.name, 200) &&
    optStr(m.guideId, 100) &&
    optStr(m.form, 200) &&
    optStr(m.dose, 100) &&
    optStr(m.unit, 50) &&
    (m.kind === "daily" || m.kind === "oneTime") &&
    optStr(m.plannedTime, 10) &&
    typeof m.done === "boolean" &&
    optStr(m.doneTime, 10) &&
    optStr(m.note, 1000)
  );
}

function isValidDay(v: unknown): v is JournalDay {
  if (!v || typeof v !== "object") return false;
  const d = v as Record<string, unknown>;
  if (!Array.isArray(d.meds) || d.meds.length > 30 || !d.meds.every(isValidMed)) return false;
  if (d.hadCheckup !== undefined && typeof d.hadCheckup !== "boolean") return false;
  if (!optStr(d.note, 2000)) return false;
  if (d.monitoring !== undefined) {
    const mon = d.monitoring as Record<string, unknown>;
    if (!mon || typeof mon !== "object" || !Array.isArray(mon.bloodValues) || mon.bloodValues.length > 30) return false;
    const valuesOk = mon.bloodValues.every((b: unknown) => {
      const r = b as Record<string, unknown>;
      return !!r && isStr(r.id, 100) && isStr(r.name, 100) && isStr(r.value, 50) && isStr(r.unit, 50);
    });
    if (!valuesOk || !optStr(mon.ultrasound, 3000) || !optStr(mon.nextInstructions, 3000)) return false;
  }
  return true;
}

export function isValidJournal(v: unknown): v is InjectionJournal {
  if (!v || typeof v !== "object") return false;
  const j = v as Record<string, unknown>;
  if (j.version !== JOURNAL_VERSION || !Array.isArray(j.cycles) || j.cycles.length > 20) return false;
  if (j.activeCycleId !== null && !isStr(j.activeCycleId, 100)) return false;
  if (!isStr(j.updatedAt, 40)) return false;
  return j.cycles.every((c: unknown) => {
    const cy = c as Record<string, unknown>;
    if (!cy || typeof cy !== "object") return false;
    if (!isStr(cy.id, 100) || !isStr(cy.label, 100) || !isValidISODate(cy.startDate) || !isStr(cy.createdAt, 40)) return false;
    if (!cy.days || typeof cy.days !== "object") return false;
    const entries = Object.entries(cy.days as Record<string, unknown>);
    return entries.length <= 120 && entries.every(([k, d]) => isValidISODate(k) && isValidDay(d));
  });
}

/* ---------------------------- יומן פשוט (כרטיס יום) ---------------------------- */

/** שלוש הבדיקות המוכנות מראש במעקב. נשמרות כ-bloodValues רגילים (תאימות לאחור) */
export const PRESET_TESTS = [
  { id: "e2", name: "אסטרדיול (E2)", aliases: ["e2", "אסטרדיול", "estradiol"], units: ["pg/mL", "pmol/L"] },
  { id: "p4", name: "פרוגסטרון", aliases: ["p4", "פרוגסטרון", "progesterone"], units: ["ng/mL", "nmol/L"] },
  { id: "lh", name: "LH", aliases: ["lh"], units: ["IU/L", "mIU/mL"] },
] as const;

export type PresetTestId = (typeof PRESET_TESTS)[number]["id"];

/** מאתר ערך קיים של בדיקה מוכנה מראש — לפי מזהה, או לפי שם ברשומות ישנות */
export function findPresetValue(values: BloodValue[], preset: (typeof PRESET_TESTS)[number]): BloodValue | undefined {
  return (
    values.find((v) => v.id === preset.id) ??
    values.find((v) => preset.aliases.some((a) => v.name.trim().toLowerCase().includes(a.toLowerCase())))
  );
}

/** מינון + יחידה כטקסט אחד לתצוגה/עריכה ("150 IU") */
export function doseText(m: Pick<MedEntry, "dose" | "unit">): string {
  return [m.dose, m.unit].filter((x) => x && x.trim()).join(" ");
}

/** היום הקרוב ביותר לפני date שיש בו זריקות — ל"העתקה מהיום הקודם" */
export function previousMedsDay(cycle: JournalCycle, date: string): string | undefined {
  let best: string | undefined;
  for (const [d, day] of Object.entries(cycle.days)) {
    if (d < date && day.meds.length > 0 && (!best || d > best)) best = d;
  }
  return best;
}

/** כל התאריכים שיש בהם תיעוד, מהחדש לישן */
export function recordedDates(cycle: JournalCycle): string[] {
  return Object.keys(cycle.days).filter(isValidISODate).sort((a, b) => b.localeCompare(a));
}

/** מחליף את רשימת הזריקות של יום (שמירת כרטיס) */
export function setDayMeds(cycle: JournalCycle, iso: string, meds: MedEntry[]): JournalCycle {
  return withDay(cycle, iso, (day) => ({ ...day, meds }));
}

/** שומר/מוחק מעקב ליום */
export function setDayMonitoring(cycle: JournalCycle, iso: string, monitoring: MonitoringResult | undefined): JournalCycle {
  return withDay(cycle, iso, (day) => ({ ...day, monitoring, hadCheckup: monitoring ? true : undefined }));
}
