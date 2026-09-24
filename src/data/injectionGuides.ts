/**
 * ספריית "איך מזריקים?" בדף "תקופת הזריקות".
 *
 * מטרת הכרטיסיות: לעזור לזהות את התכשיר המדויק ולהגיע להוראות הרשמיות —
 * לא להחליף אותן. לכן אין כאן שום הוראת הכנה, אחסון, הזרקה, מינון או
 * טיפול במנה שנשכחה. כל קישור נבדק ב-24.9.2026:
 *  - עלון לצרכן: קובץ ממאגר התרופות של משרד הבריאות (mohpublic…/IsraelDrugs),
 *    אחרי שנבדק בו שם התכשיר, החוזק וצורת התכשיר. העלון העדכני ביותר תמיד
 *    זמין גם בחיפוש במאגר עצמו (MOH_DRUG_INDEX_URL).
 *  - EMA: דף ה-EPAR הרשמי, כמידע נוסף באנגלית (לתכשירים שאושרו באיחוד).
 *  - סרטון: רק כשנמצא סרטון רשמי של היצרן בישראל לאותו תכשיר בדיוק.
 *    לתכשירים אחרים לא נמצא סרטון שאפשר היה לאמת את התאמתו — ולכן אין.
 */

export const MOH_DRUG_INDEX_URL = "https://israeldrugs.health.gov.il/#!/byDrug";
export const GUIDES_CHECKED_AT = "24.9.2026";

export interface GuideLink {
  label: string;
  url: string;
  /** פרטים קצרים על המסמך: שפה, תאריך עריכה */
  detail?: string;
}

export interface InjectionGuide {
  id: string;
  /** השם שמוצג בכרטיס */
  name: string;
  /** שם באנגלית כפי שמופיע על האריזה */
  latinName: string;
  /** כל הכתיבים שבהם המשתמשת עשויה להקליד את השם — להתאמה אוטומטית */
  aliases: string[];
  activeIngredient: string;
  /** צורת התכשיר המדויקת לפי העלון */
  form: string;
  /** חוזקים שמופיעים בעלון (לזיהוי בלבד — לא המלצת מינון) */
  strengths?: string;
  leaflet: GuideLink;
  extraSources: GuideLink[];
  /** סרטוני הדרכה רשמיים שאומתו לאותו תכשיר בדיוק. ריק = אין כפתור סרטון */
  videos: GuideLink[];
  /** מה עוד לא נמצא/אומת לתכשיר הזה */
  missing?: string;
}

export const injectionGuides: InjectionGuide[] = [
  {
    id: "gonal-f",
    name: "גונאל-אף",
    latinName: "GONAL-f",
    aliases: ["גונאל", "גונאל-אף", "גונאל אף", "גונל", "gonal", "gonal-f", "gonal f", "gonalf"],
    activeIngredient: "פוליטרופין אלפא (Follitropin alfa)",
    form: "עט מוכן לשימוש — תמיסה להזרקה תת-עורית",
    strengths: "300 IU/0.48 mL, 450 IU/0.72 mL, 900 IU/1.44 mL",
    leaflet: {
      label: "עלון לצרכן — גונאל-אף עט (משרד הבריאות)",
      url: "https://mohpublic.z6.web.core.windows.net/IsraelDrugs/Rishum01_17_297385824.pdf",
      detail: "עברית, נערך ביולי 2024",
    },
    videos: [],
    extraSources: [
      { label: "GONAL-f — מידע רשמי של סוכנות התרופות האירופית (EMA)", url: "https://www.ema.europa.eu/en/medicines/human/EPAR/gonal-f", detail: "אנגלית" },
    ],
    missing: "לא נמצא סרטון הדרכה רשמי שאפשר היה לוודא שמציג את העט המשווק בישראל.",
  },
  {
    id: "pergoveris",
    name: "פרגובריס",
    latinName: "Pergoveris",
    aliases: ["פרגובריס", "פרגובאריס", "pergoveris"],
    activeIngredient: "פוליטרופין אלפא + לוטרופין אלפא",
    form: "עט מוכן לשימוש — תמיסה להזרקה תת-עורית",
    strengths: "300+150 IU, 450+225 IU, 900+450 IU",
    leaflet: {
      label: "עלון לצרכן והוראות שימוש בעט — פרגובריס (משרד הבריאות)",
      url: "https://mohpublic.z6.web.core.windows.net/IsraelDrugs/Rishum01_9_275140423.pdf",
      detail: "עברית, אנגלית וערבית; עלון מ-2022",
    },
    videos: [],
    extraSources: [
      { label: "Pergoveris — מידע רשמי של EMA", url: "https://www.ema.europa.eu/en/medicines/human/EPAR/pergoveris", detail: "אנגלית; באיחוד קיימים גם בקבוקוני אבקה" },
    ],
    missing: "לא נמצא סרטון רשמי שאפשר היה לאמת שמתאים לעט. אם קיבלת פרגובריס בבקבוקוני אבקה — העלון כאן הוא לעט, ויש לבקש מהיחידה את העלון המתאים.",
  },
  {
    id: "menopur-multidose",
    name: "מנופור מולטידוז",
    latinName: "Menopur Multidose",
    aliases: ["מנופור מולטידוז", "מנופור 600", "מנופור 1200", "menopur multidose", "menopur 600", "menopur 1200"],
    activeIngredient: "מנוטרופין (hMG)",
    form: "אבקה וממס להכנת תמיסה להזרקה — רב-מנתי",
    strengths: "600 IU, 1200 IU",
    leaflet: {
      label: "עלון לצרכן — מנופור מולטידוז 600/1200 (משרד הבריאות)",
      url: "https://mohpublic.z6.web.core.windows.net/IsraelDrugs/Rishum_16_341741020.pdf",
      detail: "אנגלית, מאי 2020 — עלון בעברית לא אותר בבדיקה, אפשר לחפש במאגר",
    },
    extraSources: [],
    videos: [
      {
        label: "סרטון הדרכה — מנופור מולטידוז 600 (פרינג ישראל)",
        url: "https://www.ferring.co.il/our-products/menopur-600-injection-tutorial/",
        detail: "סרטון היצרן בעברית, ערבית, רוסית ואנגלית",
      },
      {
        label: "סרטון הדרכה — מנופור מולטידוז 1200 (פרינג ישראל)",
        url: "https://www.ferring.co.il/our-products/menopur-1200-injection-tutorial/",
        detail: "סרטון היצרן בעברית, ערבית ורוסית",
      },
    ],
  },
  {
    id: "menopur-75",
    name: "מנופור 75",
    latinName: "Menopur 75 IU",
    aliases: ["מנופור", "מנופור 75", "menopur", "menopur 75"],
    activeIngredient: "מנוטרופין (hMG)",
    form: "אבקה וממס להכנת תמיסה להזרקה (בקבוקון חד-מנתי)",
    strengths: "75 IU",
    leaflet: {
      label: "עלון לצרכן — מנופור 75 (משרד הבריאות)",
      url: "https://mohpublic.z6.web.core.windows.net/IsraelDrugs/Rishum_16_338405420.pdf",
      detail: "עברית, מאי 2020",
    },
    videos: [],
    extraSources: [],
    missing: "לא נמצא סרטון רשמי למנופור 75 (לסרטוני פרינג יש רק מולטידוז).",
  },
  {
    id: "orgalutran",
    name: "אורגלוטרן",
    latinName: "Orgalutran",
    aliases: ["אורגלוטרן", "אורגלוטראן", "orgalutran", "ganirelix", "גנירליקס"],
    activeIngredient: "גנירליקס (Ganirelix)",
    form: "מזרק מוכן לשימוש — תמיסה להזרקה תת-עורית",
    strengths: "0.25 mg/0.5 mL",
    leaflet: {
      label: "עלון לצרכן — אורגלוטרן (משרד הבריאות)",
      url: "https://mohpublic.z6.web.core.windows.net/IsraelDrugs/Rishum01_1_1162301221.pdf",
      detail: "אנגלית, ספטמבר 2021 — עלון בעברית לא אותר בבדיקה, אפשר לחפש במאגר",
    },
    videos: [],
    extraSources: [
      { label: "Orgalutran — מידע רשמי של EMA", url: "https://www.ema.europa.eu/en/medicines/human/EPAR/orgalutran", detail: "אנגלית" },
    ],
    missing: "לא נמצא סרטון הדרכה רשמי.",
  },
  {
    id: "cetrotide",
    name: "צטרוטייד",
    latinName: "Cetrotide",
    aliases: ["צטרוטייד", "צטרוטיד", "cetrotide", "cetrorelix"],
    activeIngredient: "צטרורליקס (Cetrorelix)",
    form: "אבקה וממס להכנת תמיסה להזרקה תת-עורית",
    strengths: "0.25 mg",
    leaflet: {
      label: "עלון לצרכן — צטרוטייד 0.25 (משרד הבריאות)",
      url: "https://mohpublic.z6.web.core.windows.net/IsraelDrugs/Rishum01_19_681239324.pdf",
      detail: "עברית, נובמבר 2024",
    },
    videos: [],
    extraSources: [
      { label: "Cetrotide — מידע רשמי של EMA", url: "https://www.ema.europa.eu/en/medicines/human/EPAR/cetrotide", detail: "אנגלית" },
    ],
    missing: "לא נמצא סרטון רשמי בישראל. הסרטון של היצרן בארה״ב לא נוסף כי לא אומת שהערכה זהה.",
  },
  {
    id: "ovitrelle",
    name: "אוביטרל",
    latinName: "Ovitrelle",
    aliases: ["אוביטרל", "אוביטרל 250", "ovitrelle", "ovidrel"],
    activeIngredient: "כוריוגונדוטרופין אלפא (Choriogonadotropin alfa)",
    form: "עט מוכן לשימוש או מזרק מוכן לשימוש — תמיסה להזרקה תת-עורית",
    strengths: "250 mcg/0.5 mL",
    leaflet: {
      label: "עלון לצרכן — אוביטרל 250 (משרד הבריאות)",
      url: "https://mohpublic.z6.web.core.windows.net/IsraelDrugs/Rishum01_7_79557723.pdf",
      detail: "עברית; העלון מ-2021, הוראות העט מ-2023",
    },
    videos: [],
    extraSources: [
      { label: "Ovitrelle — מידע רשמי של EMA", url: "https://www.ema.europa.eu/en/medicines/human/EPAR/ovitrelle", detail: "אנגלית" },
    ],
    missing: "לא נמצא סרטון רשמי שאפשר היה לאמת את התאמתו לעט/למזרק שקיבלת.",
  },
];

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[״"׳'\-–_.]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * מאתר מדריך לפי שם שהמשתמשת הקלידה. בודק את הכינוי הארוך ביותר שמתאים,
 * כדי ש"מנופור מולטידוז 600" יתאים למולטידוז ולא ל"מנופור" הכללי.
 */
export function findGuideForName(name: string): InjectionGuide | undefined {
  const n = normalize(name);
  if (!n) return undefined;
  let best: { guide: InjectionGuide; len: number } | undefined;
  for (const guide of injectionGuides) {
    for (const alias of guide.aliases) {
      const a = normalize(alias);
      if (a && n.includes(a) && (!best || a.length > best.len)) best = { guide, len: a.length };
    }
  }
  return best?.guide;
}

/** הצעות להשלמה בשדה שם התרופה */
export const medicationNameSuggestions: string[] = injectionGuides.flatMap((g) => [g.name, g.latinName]);
