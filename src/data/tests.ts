import {
  Activity,
  Beaker,
  Biohazard,
  Droplets,
  Microscope,
  ShieldCheck,
  Stethoscope,
  TestTubes,
  Waves,
} from "lucide-react";
import type { TestItem } from "./types";

export const testItems: TestItem[] = [
  {
    id: 1,
    icon: Activity,
    title: "פרופיל הורמונלי",
    detail:
      "FSH, LH, אסטרדיול, AMH, פרולקטין, פרוגסטרון ו־TSH — נדרש ביום 2–4 למחזור, ובתוקף כ־3 שבועות מהבדיקה",
    subItems: ["FSH", "LH", "אסטרדיול", "AMH", "פרולקטין", "פרוגסטרון", "TSH"],
    prepNote: "יש לבצע ביום 2–4 למחזור",
    validityDays: 21,
  },
  {
    id: 2,
    icon: Beaker,
    title: "פרופיל הורמונלי משלים",
    detail: "17-OH, אנדרוסטנדיון, טסטוסטרון ו־DHEAS — לרוב נלקח באותה בדיקת דם כמו הפרופיל ההורמונלי",
    subItems: ["17-OH", "אנדרוסטנדיון", "טסטוסטרון", "DHEAS"],
    prepNote: "לרוב נלקח באותה בדיקת דם כמו הפרופיל ההורמונלי",
    validityDays: 21,
  },
  {
    id: 3,
    icon: Droplets,
    title: "בדיקות דם כלליות",
    detail: "ספירת דם (בתוקף שנה), כימיה (יש לבצע בצום) ותפקודי קרישה — PT, PTT, INR",
    subItems: ["ספירת דם", "כימיה (בצום)", "תפקודי קרישה — PT, PTT, INR"],
    prepNote: "כימיה יש לבצע בצום; ספירת הדם בתוקף כשנה, שאר הרכיבים לרוב נדרשים טריים",
    // אין ערך אחיד לכל הרכיבים בבדיקה זו (לספירת הדם תוקף שונה משאר הרכיבים)
  },
  {
    id: 4,
    icon: ShieldCheck,
    title: "סרולוגיה ובדיקות זיהומיות",
    detail: "TPHA/VDRL, HCV Ab, HBs Ag, HIV — ולפי הרשימה המדויקת של היחידה",
    subItems: ["TPHA/VDRL", "HCV Ab", "HBs Ag", "HIV"],
    prepNote: "הרשימה המדויקת והתוקף משתנים בין יחידות — יש לוודא מול היחידה שבחרת",
  },
  {
    id: 5,
    icon: Biohazard,
    title: "CMV וטוקסופלזמה",
    detail: "בדיקות סרולוגיה נוספות שנדרשות לרוב לפני תחילת הטיפול",
    subItems: ["CMV", "טוקסופלזמה"],
    prepNote: "נדרש לרוב לפני תחילת הטיפול — תוקף משתנה בין יחידות",
  },
  {
    id: 6,
    icon: TestTubes,
    title: "סוג דם וסקר נוגדנים",
    detail: "בהתאם לדרישות המקום",
    subItems: ["סוג דם", "סקר נוגדנים"],
    prepNote: "סוג הדם קבוע וללא תוקף; סקר הנוגדנים עשוי לדרוש חידוש בהתאם ליחידה",
  },
  {
    id: 7,
    icon: Waves,
    title: "אולטרסאונד גינקולוגי",
    detail:
      "ספירת זקיקים אנטרליים (AFC), מבוצע ע״י טכנאית US ביום 2–5 למחזור — ניתן לקבל הפניה מרופא/ת משפחה",
    subItems: ["ספירת זקיקים אנטרליים (AFC)"],
    prepNote: "מבוצע ביום 2–5 למחזור — רלוונטי בעיקר למחזור שבו בוצע",
  },
  {
    id: 8,
    icon: Microscope,
    title: "בדיקת פאפ",
    detail: "משטח צוואר הרחם, מבוצע ע״י רופא/ת נשים — בתוקף 3 שנים",
    subItems: ["משטח צוואר הרחם (Pap smear)"],
    prepNote: "מבוצע ע״י רופא/ת נשים",
    validityDays: 1095,
  },
  {
    id: 9,
    icon: Stethoscope,
    title: "בדיקת/ייעוץ כירורג/ית שד",
    detail:
      "בדיקה גופנית ע״י כירורג/ית שד. אם נשלחת ל-US/ממוגרפיה, יש להביא איתך את הסיכום מהכירורג/ית",
    subItems: ["בדיקה גופנית ע״י כירורג/ית שד"],
    prepNote: "אם נשלחת ל-US/ממוגרפיה — יש להביא את הסיכום מהכירורג/ית",
  },
];
