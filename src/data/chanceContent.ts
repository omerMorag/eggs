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
      "הגיל הרלוונטי לחישוב הוא הגיל שבו הביציות הוקפאו, ולא הגיל שבו תרצי להשתמש בהן.",
  },
  {
    icon: Egg,
    title: "מספר הביציות הבשלות",
    description: "החישוב מתייחס לביציות בשלות מסוג MII, ולא בהכרח לכל הביציות שנשאבו.",
  },
  {
    icon: Scale3d,
    title: "הערכה, לא הבטחה",
    description:
      "המספר מבוסס על נתונים סטטיסטיים. תוצאה גבוהה אינה מבטיחה לידה, ותוצאה נמוכה אינה אומרת שאין סיכוי.",
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

// לפי בקשת המשתמשת: בדיוק שלוש שאלות, כל אחת קצרה וללא חזרה על תוכן שכבר
// מוצג במחשבון, בטבלה או בכרטיסים שמעליה בעמוד.
export const chanceFaq: FaqItem[] = [
  {
    question: "האם אפשר לחבר ביציות מכמה סבבים?",
    answer:
      "מספר הביציות המצטבר עשוי להיות רלוונטי, אבל צריך להביא בחשבון את הגיל שבו כל קבוצת ביציות הוקפאה — ולא רק את הסכום הכולל.",
  },
  {
    question: "מה קורה אם הקפאתי ביציות בגילים שונים?",
    answer:
      "הגיל בזמן כל סבב חשוב, ולכן אין להתייחס לכל הביציות כאילו הוקפאו באותו גיל. המודל הנוכחי אינו כולל חישוב משולב אוטומטי לביציות שהוקפאו בגילים שונים.",
  },
  {
    question: "אילו גורמים המחשבון לא כולל?",
    answer:
      "ההערכה אינה כוללת את כל המשתנים האישיים — למשל איכות המעבדה, נתונים רפואיים אישיים, איכות הזרע בעתיד, תגובת הביציות להפשרה והשונות בין מטופלות.",
  },
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
  {
    label:
      "Maslow BL et al., Likelihood of achieving a 50%, 60%, or 70% estimated live birth rate threshold with 1 or 2 cycles of planned oocyte cryopreservation, Journal of Assisted Reproduction and Genetics, 2020",
    url: "https://link.springer.com/article/10.1007/s10815-020-01791-w",
  },
  {
    label:
      "ASRM Ethics Committee, Planned oocyte cryopreservation to preserve future reproductive potential, Fertility and Sterility, 2024",
    url: "https://www.asrm.org/practice-guidance/ethics-opinions/planned-oocyte-cryopreservation/",
  },
];
