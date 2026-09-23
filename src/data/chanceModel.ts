// מודל סטטיסטי להערכת הסיכוי ללידת חי לפי גיל בזמן הקפאת הביציות ומספר
// הביציות הבשלות שהוקפאו.
//
// מקור: Goldman RH, Racowsky C, Farland LV, Munné S, Ribustello L, Fox JH.
// "Predicting the likelihood of live birth for elective oocyte cryopreservation:
// a counseling tool for physicians and patients."
// Human Reproduction, 2017. https://academic.oup.com/humrep/article/32/4/853/2968357
//
// הרחבה/הקשר: ASRM Practice Committee, "Evidence-based outcomes after oocyte
// cryopreservation", 2021.
// https://www.asrm.org/practice-guidance/practice-committee-documents/evidence-based-outcomes-after-oocyte-cryopreservation-for-donor-oocyte-in-vitro-fertilization-and-planned-oocyte-cryopreservation-a-guideline-2021/
//
// כל החישוב מתבצע מקומית בדפדפן — שום נתון שהמשתמשת מזינה לא נשלח או נשמר.

export const MIN_AGE = 25;
export const MAX_AGE = 44;
export const MIN_EGGS = 1;
export const MAX_EGGS = 70;

// שיעור עוברים תקינים כרומוזומלית (אאופלואידיים) לפי גיל, מתוך המודל של גולדמן ואחרים.
// לגילים 35 ומטה משתמשים בערך של גיל 35 (המודל לא מבחין ביניהם).
const euploidByAge: Record<number, number> = {
  35: 0.574,
  36: 0.564,
  37: 0.486,
  38: 0.466,
  39: 0.44,
  40: 0.359,
  41: 0.327,
  42: 0.285,
  43: 0.206,
  44: 0.127,
};

function getEuploidProbability(age: number): number {
  if (age <= 35) return euploidByAge[35];
  return euploidByAge[age] ?? euploidByAge[44];
}

/** הסיכוי שביצית בשלה בודדת, בגיל נתון, תוביל בסופו של דבר ללידת חי.
 *
 *  תיקון-שורש (בדיקת התאמה למאמר גולדמן, ר' MyChancesSection — בדיקת פער
 *  93%/90%): המאמר עצמו מקבץ באופן מפורש את כל הנשים בגיל ≤35 לקבוצה
 *  אחת ("all patients ≤35.0 y were categorized together into one group"),
 *  ונותן דוגמה מפורשת ל-20 ביציות בשלות: "women age 34, 37 or 42 y ...
 *  would be expected to have a 90, 75 and 37% likelihood [of] at least
 *  one live birth". לפני התיקון הזה, euploidByAge כבר היה שטוח לכל
 *  הגילאים ≤35 (0.574, נכון), אבל pBlast המשיך להשתמש בגיל הכרונולוגי
 *  המדויק בתוך המעריך (Math.exp(2.8043 - 0.1112*age)) — כך שגיל 34 יצא
 *  שונה מגיל 35, בניגוד לקיבוץ המפורש של המאמר. בפועל זה נתן 93% במקום
 *  90% לגיל 34 עם 20 ביציות. modelAge כאן מיישם את אותו קיבוץ בשני חלקי
 *  הנוסחה גם יחד (לא רק באאופלואידיה) — בדיוק כמו במאמר עצמו: כל גיל
 *  25–35 מחושב כאילו הוא גיל 35. גילאים 36 ומעלה לא מושפעים כלל (modelAge
 *  שווה לגיל האמיתי). ר' גם בדיקת ההתאמה ל-3 הדוגמאות המפורשות של המאמר
 *  ב-IllustrativeAgeTable.tsx (34/37/42, 20 ביציות → 90/75/37% בדיוק). */
export function getSingleEggProbability(age: number): number {
  const modelAge = Math.max(age, 35);
  const thawSurvival = modelAge < 36 ? 0.95 : 0.85;
  const pBlast = thawSurvival * Math.exp(2.8043 - 0.1112 * modelAge);
  const pEuploid = getEuploidProbability(modelAge);
  return 0.6 * pEuploid * pBlast;
}

/** הסיכוי המצטבר ללידת חי אחת לפחות, בהינתן גיל ומספר ביציות בשלות. */
export function probabilityAtLeastOne(age: number, numberOfEggs: number): number {
  const q = getSingleEggProbability(age);
  return 1 - Math.pow(1 - q, numberOfEggs);
}

function binomialCoefficient(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;

  let result = 1;
  for (let i = 1; i <= k; i++) {
    result = (result * (n - i + 1)) / i;
  }
  return result;
}

/** הסיכוי המצטבר ל-k לידות חי לפחות, בהינתן גיל ומספר ביציות בשלות. */
export function probabilityAtLeastK(
  age: number,
  numberOfEggs: number,
  targetBirths: number,
): number {
  const q = getSingleEggProbability(age);
  let probabilityBelowTarget = 0;

  for (let i = 0; i < targetBirths; i++) {
    probabilityBelowTarget +=
      binomialCoefficient(numberOfEggs, i) * Math.pow(q, i) * Math.pow(1 - q, numberOfEggs - i);
  }

  return 1 - probabilityBelowTarget;
}

/** מספר הביציות המשוער הדרוש כדי להגיע ליעד סיכוי נתון (0–1), לפי אותו מודל. */
export function eggsNeededForTarget(
  age: number,
  targetBirths: number,
  targetProbability: number,
  maxEggs: number = 300,
): number | null {
  for (let n = targetBirths; n <= maxEggs; n++) {
    if (probabilityAtLeastK(age, n, targetBirths) >= targetProbability) return n;
  }
  return null;
}

/** מעגל אחוז להצגה. תוחם למעלה ("מעל 99%") כדי לא להציג הבטחה מוחלטת של
 *  100% — הנוסחה אסימפטוטית ולמעשה אף פעם לא מגיעה בפועל ל-1 (ר' ChanceChart.tsx).
 *  למטה, "פחות מ-1%" מוצג רק כשהערך המחושב באמת חיובי-אך-זעיר (היה נעגל
 *  ל-"0%" ומטעה כאילו אין שום סיכוי) — לא כשהתוצאה 0 מדויק ואמיתי (למשל
 *  יעד של 3 לידות עם פחות מ-3 ביציות, שבאמת בלתי אפשרי מתמטית; שם "0%"
 *  עצמו הוא התיאור הכן). אין יותר "רצפה" מלאכותית שמעגלת כל תוצאה זעירה
 *  כלפי מעלה ל-1% — זו הייתה מטעה באותה מידה בדיוק כמו הצגת 100%. */
export function formatChancePercent(probability: number): string {
  const percent = probability * 100;
  if (percent >= 99.5) return "מעל 99%";
  if (percent > 0 && percent < 0.5) return "פחות מ-1%";
  return `${Math.round(percent)}%`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
