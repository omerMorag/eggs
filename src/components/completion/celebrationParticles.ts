/**
 * קונפיגורציית החלקיקים הדקורטיביים של מסך הסיום (CompletionCelebration) —
 * פתיתי שלג (שלב חורפי), נצנצים (רגע החשיפה הקיצי) וקונפטי (אחרי זריחת
 * השמש). כל הערכים כאן **קבועים וידניים בכוונה, בלי Math.random בשום מקום** —
 * כדי שלא יהיה שום סיכון ל-hydration mismatch בין הרינדור בשרת ללקוח (ערך
 * רנדומלי היה מייצר עץ DOM שונה בכל טעינה/רינדור-מחדש). המיקומים באחוזים
 * ביחס לקונטיינר האיור, כדי שיתאימו בכל רוחב מסך בלי חישוב נוסף.
 *
 * שני צבעים חדשים לחלוטין (אלמוג/coral ו"חמאה" צהובה) שאינם חלק מהפלטה
 * המשותפת ב-tailwind.config.ts — hex קשיח בכוונה, באותו תקדים קיים בפרויקט
 * של גוונים חד-פעמיים לגרפיקה דקורטיבית (למשל ChanceChart.tsx/ChanceResult.tsx),
 * ולא הרחבה של הפלטה הגלובלית עבור פיצ'ר בודד.
 */

/** אלמוג — אחד מצבעי הקונפטי */
export const CORAL = "#FF8B6B";
/** צהוב-חמאה רך — אחד מצבעי הקונפטי */
export const BUTTER_YELLOW = "#F6D775";
/** ורוד האקצנט הראשי של האתר (teal-600) — נעשה בו שימוש חוזר כאן כקונפטי */
export const ACCENT_PINK = "#E25068";
/** ירוק-מנטה (warm-500) — נעשה בו שימוש חוזר כאן כקונפטי */
export const MINT = "#4FC79A";
/** כתום-אפרסק (deep) — נעשה בו שימוש חוזר כאן כקונפטי */
export const PEACH = "#EA8F53";

export interface SnowflakeConfig {
  id: string;
  leftPercent: number;
  topPercent: number;
  sizePx: number;
  delayMs: number;
  durationMs: number;
}

export interface SparkleConfig {
  id: string;
  leftPercent: number;
  topPercent: number;
  sizePx: number;
  delayMs: number;
}

export interface ConfettiConfig {
  id: string;
  leftPercent: number;
  delayMs: number;
  durationMs: number;
  rotateDeg: number;
  color: string;
  sizePx: number;
}

/** פתיתי שלג סביב/בתוך ענן השלג בשלב החורפי הראשוני */
export const SNOWFLAKES: SnowflakeConfig[] = [
  { id: "flake-1", leftPercent: 18, topPercent: 12, sizePx: 9, delayMs: 0, durationMs: 1400 },
  { id: "flake-2", leftPercent: 32, topPercent: 4, sizePx: 7, delayMs: 140, durationMs: 1500 },
  { id: "flake-3", leftPercent: 46, topPercent: 16, sizePx: 11, delayMs: 260, durationMs: 1300 },
  { id: "flake-4", leftPercent: 58, topPercent: 6, sizePx: 8, delayMs: 90, durationMs: 1550 },
  { id: "flake-5", leftPercent: 70, topPercent: 20, sizePx: 10, delayMs: 320, durationMs: 1400 },
  { id: "flake-6", leftPercent: 82, topPercent: 8, sizePx: 7, delayMs: 420, durationMs: 1480 },
  { id: "flake-7", leftPercent: 50, topPercent: 24, sizePx: 9, delayMs: 500, durationMs: 1350 },
];

/** נצנצים סביב תיבת התרנגולת ברגע החשיפה הקיצית */
export const SPARKLES: SparkleConfig[] = [
  { id: "sparkle-1", leftPercent: 6, topPercent: 14, sizePx: 13, delayMs: 1900 },
  { id: "sparkle-2", leftPercent: 92, topPercent: 10, sizePx: 15, delayMs: 2000 },
  { id: "sparkle-3", leftPercent: 12, topPercent: 78, sizePx: 11, delayMs: 2100 },
  { id: "sparkle-4", leftPercent: 86, topPercent: 76, sizePx: 13, delayMs: 1950 },
  { id: "sparkle-5", leftPercent: 50, topPercent: 0, sizePx: 10, delayMs: 2200 },
  { id: "sparkle-6", leftPercent: 2, topPercent: 44, sizePx: 11, delayMs: 2050 },
  { id: "sparkle-7", leftPercent: 96, topPercent: 48, sizePx: 10, delayMs: 2150 },
  { id: "sparkle-8", leftPercent: 60, topPercent: 92, sizePx: 12, delayMs: 2250 },
];

/** קונפטי נופל, אחרי זריחת השמש — מפוזר לרוחב כל אזור האיור */
export const CONFETTI: ConfettiConfig[] = [
  { id: "confetti-1", leftPercent: 4, delayMs: 1950, durationMs: 1300, rotateDeg: 30, color: ACCENT_PINK, sizePx: 7 },
  { id: "confetti-2", leftPercent: 11, delayMs: 2080, durationMs: 1450, rotateDeg: -40, color: MINT, sizePx: 6 },
  { id: "confetti-3", leftPercent: 19, delayMs: 2000, durationMs: 1350, rotateDeg: 60, color: BUTTER_YELLOW, sizePx: 8 },
  { id: "confetti-4", leftPercent: 27, delayMs: 2150, durationMs: 1500, rotateDeg: -20, color: CORAL, sizePx: 6 },
  { id: "confetti-5", leftPercent: 35, delayMs: 2040, durationMs: 1280, rotateDeg: 45, color: PEACH, sizePx: 7 },
  { id: "confetti-6", leftPercent: 43, delayMs: 2200, durationMs: 1400, rotateDeg: -55, color: ACCENT_PINK, sizePx: 6 },
  { id: "confetti-7", leftPercent: 50, delayMs: 1980, durationMs: 1320, rotateDeg: 25, color: MINT, sizePx: 8 },
  { id: "confetti-8", leftPercent: 58, delayMs: 2120, durationMs: 1470, rotateDeg: -35, color: BUTTER_YELLOW, sizePx: 6 },
  { id: "confetti-9", leftPercent: 65, delayMs: 2060, durationMs: 1360, rotateDeg: 50, color: CORAL, sizePx: 7 },
  { id: "confetti-10", leftPercent: 73, delayMs: 2180, durationMs: 1420, rotateDeg: -15, color: PEACH, sizePx: 6 },
  { id: "confetti-11", leftPercent: 81, delayMs: 2020, durationMs: 1300, rotateDeg: 38, color: ACCENT_PINK, sizePx: 8 },
  { id: "confetti-12", leftPercent: 89, delayMs: 2160, durationMs: 1480, rotateDeg: -48, color: MINT, sizePx: 6 },
  { id: "confetti-13", leftPercent: 95, delayMs: 2100, durationMs: 1340, rotateDeg: 22, color: BUTTER_YELLOW, sizePx: 7 },
  { id: "confetti-14", leftPercent: 55, delayMs: 2240, durationMs: 1400, rotateDeg: -60, color: CORAL, sizePx: 6 },
];
