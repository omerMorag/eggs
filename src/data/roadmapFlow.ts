import { Pill } from "lucide-react";
import { journeySteps } from "./steps";
import type { FlowStep } from "./types";

/**
 * שני המסלולים (יודעת / עוד לא בטוחה) מתכנסים ישר לאותם שלושה שלבים משותפים
 * שאפשר להתקדם בהם במקביל (sharedPreliminary) — כולל ביצוע הבדיקות הכלליות,
 * שרלוונטי גם למי שעוד לא בחרה יחידה. לכן אין כרגע שלבים ייחודיים לאף מסלול.
 */
export const branchUnknown: FlowStep[] = [];

export const branchKnown: FlowStep[] = [];

/**
 * שלושת השלבים המשותפים לשני המסלולים, מיד אחרי ההסתעפות (אם הייתה) — אפשר להתקדם בהם במקביל.
 */
export const sharedPreliminary: FlowStep[] = [
  {
    icon: journeySteps[0].icon,
    title: "קובעת תור לרופא/ת פוריות או משפחה",
    description:
      "כדי לקבל הפניות לבדיקות דם. אפשר לקחת לרופא/ה את הרשימה הכללית מהצ׳קליסט בלוח הבקרה.",
    parallel: true,
  },
  {
    icon: journeySteps[1].icon,
    title: "מבצעת את כל הבדיקות הרלוונטיות",
    description: "יש הרבה בדיקות וזה יכול לקחת זמן — שווה להתחיל כבר עכשיו, לפני התור הבא.",
    parallel: true,
  },
  {
    icon: journeySteps[2].icon,
    title: "מחליטה איפה לעבור את השאיבה — ציבורי או פרטי",
    description:
      "מתקשרת לקבוע תור ומבקשת את דף הבדיקות הרלוונטיות מהמקום, ומשווה מה חסר לך ממה שכבר עשית.",
    parallel: true,
    readMoreHref: "/where-to-go",
    readMoreLabel: "קרא עוד - איפה כדאי לעשות את זה?",
  },
];

/**
 * יתר השלבים — זהים לגמרי לשני המסלולים.
 */
export const sharedSteps: FlowStep[] = [
  {
    icon: journeySteps[5].icon,
    title: "מגיעה לפגישה ומקבלת פרוטוקול אישי",
    description:
      "עוברים יחד על כל הבדיקות במקום שבחרת, ומחליטים איזה פרוטוקול הכי מתאים לך.",
  },
  {
    icon: Pill,
    title: "קונה את התרופות לפי הפרוטוקול",
    description: "רוכשת את התרופות הנדרשות בהתאם למה שהרופא/ה קבעו.",
  },
  {
    icon: journeySteps[6].icon,
    title: "מתחילה את הפרוטוקול",
    description:
      "בתחילת המחזור הבא, או המחזור שהחלטת עליו, מתחילה זריקות ומעקבים בקשר רציף עם המקום שבחרת — ובסוף, השאיבה וההקפאה.",
  },
];
