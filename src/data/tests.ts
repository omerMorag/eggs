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
  },
  {
    id: 2,
    icon: Beaker,
    title: "פרופיל הורמונלי משלים",
    detail: "17-OH, אנדרוסטנדיון, טסטוסטרון ו־DHEAS — לרוב נלקח באותה בדיקת דם כמו הפרופיל ההורמונלי",
  },
  {
    id: 3,
    icon: Droplets,
    title: "בדיקות דם כלליות",
    detail: "ספירת דם (בתוקף שנה), כימיה (יש לבצע בצום) ותפקודי קרישה — PT, PTT, INR",
  },
  {
    id: 4,
    icon: ShieldCheck,
    title: "סרולוגיה ובדיקות זיהומיות",
    detail: "TPHA/VDRL, HCV Ab, HBs Ag, HIV — ולפי הרשימה המדויקת של היחידה",
  },
  {
    id: 5,
    icon: Biohazard,
    title: "CMV וטוקסופלזמה",
    detail: "בדיקות סרולוגיה נוספות שנדרשות לרוב לפני תחילת הטיפול",
  },
  {
    id: 6,
    icon: TestTubes,
    title: "סוג דם וסקר נוגדנים",
    detail: "בהתאם לדרישות המקום",
  },
  {
    id: 7,
    icon: Waves,
    title: "אולטרסאונד גינקולוגי",
    detail:
      "ספירת זקיקים אנטרליים (AFC), מבוצע ע״י טכנאית US ביום 2–5 למחזור — ניתן לקבל הפניה מרופא/ת משפחה",
  },
  {
    id: 8,
    icon: Microscope,
    title: "בדיקת פאפ",
    detail: "משטח צוואר הרחם, מבוצע ע״י רופא/ת נשים — בתוקף 3 שנים",
  },
  {
    id: 9,
    icon: Stethoscope,
    title: "בדיקת/ייעוץ כירורג/ית שד",
    detail:
      "בדיקה גופנית ע״י כירורג/ית שד. אם נשלחת ל-US/ממוגרפיה, יש להביא איתך את הסיכום מהכירורג/ית",
  },
];
