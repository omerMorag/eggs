import type { LucideIcon } from "lucide-react";
import { CalendarHeart, Egg, Scale3d } from "lucide-react";

export interface KeyFactCard {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const keyFacts: KeyFactCard[] = [
  {
    icon: CalendarHeart,
    title: "הגיל בזמן ההקפאה",
    description:
      "החישוב מתייחס לגיל שבו הביציות נשאבו והוקפאו – ולא לגיל שבו תשתמשי בהן בעתיד.",
  },
  {
    icon: Egg,
    title: "מספר הביציות הבשלות",
    description:
      "הנתון הרלוונטי הוא מספר הביציות הבשלות שהוקפאו בפועל, ולא מספר הזקיקים או המספר הכולל של הביציות שנשאבו.",
  },
  {
    icon: Scale3d,
    title: "הערכה, לא הבטחה",
    description:
      "גם כאשר מוקפא מספר גדול של ביציות, אי אפשר להבטיח היריון או לידת חי. הנתונים עוזרים להבין סיכויים – לא לנבא את העתיד.",
  },
];

export interface FamilyGoalOption {
  value: 1 | 2 | 3;
  label: string;
  resultLabel: string;
}

export const familyGoalOptions: FamilyGoalOption[] = [
  { value: 1, label: "ילד אחד", resultLabel: "סיכוי משוער ללידת חי אחת לפחות" },
  { value: 2, label: "שני ילדים", resultLabel: "סיכוי משוער לשתי לידות חי לפחות" },
  { value: 3, label: "שלושה ילדים", resultLabel: "סיכוי משוער לשלוש לידות חי לפחות" },
];

export const ageInfoText =
  "הביציות שומרות על המאפיינים הקשורים לגיל שבו הוקפאו. אם הקפאת ביציות בגיל 34 והשתמשת בהן בגיל 40, החישוב מתייחס בעיקר לגיל 34. עם זאת, הגיל בזמן ההיריון עדיין עשוי להשפיע על ההיריון ועל הבריאות הכללית.";

export const miiTooltipText =
  "MII הוא השלב שבו הביצית נחשבת בשלה ומתאימה בדרך כלל להקפאה ולהפריה עתידית.";

export interface ResultTier {
  max: number; // exclusive upper bound, 1 = 100%
  text: string;
}

export const resultTiers: ResultTier[] = [
  {
    max: 0.4,
    text: "המודל מציג סיכוי מוגבל יחסית. זה לא אומר שאין אפשרות להגיע ללידת חי. ייתכן שכדאי לשוחח עם רופא או רופאת הפריון על הנתונים האישיים ועל האפשרויות העומדות בפנייך.",
  },
  {
    max: 0.7,
    text: "המודל מציג סיכוי בינוני. התוצאה בפועל תלויה גם בהפשרת הביציות, בהפריה, בהתפתחות העוברים ובגורמים רפואיים נוספים.",
  },
  {
    max: 1.01,
    text: "המודל מציג סיכוי סטטיסטי גבוה יחסית. חשוב לזכור שגם הערכה גבוהה אינה מבטיחה היריון או לידת חי.",
  },
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const chanceFaq: FaqItem[] = [
  {
    question: "האם החישוב מתייחס לגיל שלי היום?",
    answer: "לא. הנתון המרכזי הוא הגיל שבו הביציות נשאבו והוקפאו.",
  },
  {
    question: "האם להזין את מספר הביציות שנשאבו?",
    answer:
      "יש להזין את מספר הביציות הבשלות שהוקפאו בפועל. לא כל ביצית שנשאבה בהכרח הייתה בשלה ומתאימה להקפאה.",
  },
  {
    question: "ה-AMH שלי נמוך. האם זה אומר שהביציות שלי אינן איכותיות?",
    answer:
      "לא בהכרח. AMH משמש בעיקר להערכת הרזרבה השחלתית והתגובה הצפויה לטיפול. הוא אינו מדד ישיר לאיכות של כל ביצית ואינו מנבא לבדו לידת חי. הגיל בזמן השאיבה נשאר גורם מרכזי.",
  },
  {
    question: "קיבלתי מעט ביציות. האם השאיבה הייתה לחינם?",
    answer:
      "לא. גם מספר קטן של ביציות בשלות עשוי להיות בעל משמעות. המחשבון מציג הסתברות מצטברת, אבל הוא אינו יכול לקבוע מה יקרה עם ביצית מסוימת.",
  },
  {
    question: "האם אחוז גבוה מבטיח שיהיה לי ילד?",
    answer:
      "לא. גם אחוז גבוה הוא הערכה סטטיסטית בלבד. התוצאה תלויה בהפשרה, בהפריה, בהתפתחות העוברים, באיכות הזרע, במצב הרחם, באיכות המעבדה ובגורמים נוספים.",
  },
  {
    question: "האם אחוז נמוך אומר שאין לי סיכוי?",
    answer: "לא. מדובר בהערכה המבוססת על קבוצות אוכלוסייה והנחות סטטיסטיות, ולא בתחזית אישית.",
  },
  {
    question: "האם אפשר לחבר ביציות מכמה סבבים?",
    answer:
      "אם כל הביציות הוקפאו באותו גיל, אפשר להזין את המספר הכולל. אם הן הוקפאו בגילים שונים, יש לחשב כל קבוצה בנפרד ולשלב את ההסתברויות בצורה מתמטית מתאימה.",
  },
];

export interface EggsNeededRow {
  ageRange: string;
  eggsNeeded: string;
}

// טווח גילים ומספר ביציות בשלות שהוערך במחקר כדרוש לסיכוי של כ-70% ללידת חי אחת לפחות.
// מקור: Goldman et al., 2017 (ראו chanceModel.ts).
export const eggsNeededByAgeRange: EggsNeededRow[] = [
  { ageRange: "30–34", eggsNeeded: "כ-14" },
  { ageRange: "35–37", eggsNeeded: "כ-15" },
  { ageRange: "38–40", eggsNeeded: "כ-26" },
];

export const processStages: string[] = [
  "ביציות בשלות שהוקפאו",
  "הפשרה",
  "הפריה",
  "התפתחות לעובר",
  "עובר המתאים להחזרה",
  "השרשה והיריון",
  "לידת חי",
];

export interface ChanceSource {
  label: string;
  url: string;
}

export const chanceSources: ChanceSource[] = [
  {
    label: "Goldman RH et al., Predicting the likelihood of live birth for elective oocyte cryopreservation, Human Reproduction, 2017",
    url: "https://academic.oup.com/humrep/article/32/4/853/2968357",
  },
  {
    label: "ASRM, Evidence-based outcomes after oocyte cryopreservation, 2021",
    url: "https://www.asrm.org/practice-guidance/practice-committee-documents/evidence-based-outcomes-after-oocyte-cryopreservation-for-donor-oocyte-in-vitro-fertilization-and-planned-oocyte-cryopreservation-a-guideline-2021/",
  },
];
