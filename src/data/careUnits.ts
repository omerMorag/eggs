import type { SourceLink } from "./types";

/**
 * מודל הנתונים של "איפה כדאי לעשות?" (WHERE TO DO — תיקון שורש, 22.9.2026).
 *
 * העיקרון: בית חולים/מרכז הוא ישות אחת (CareUnit) עם תכונה פיזית קבועה
 * (setting: ציבורי/פרטי), ובתוכו אפשר לעבור את התהליך בכמה "מסלולים"
 * (routes) — תשלום עצמי, ו/או הסדר עם קופה זו או אחרת — בו-זמנית.
 * "ציבורי/פרטי" ו"תשלום עצמי/הסדר קופה" הם שני ממדים נפרדים לגמרי: אסור
 * לטפל בהם כשלוש קטגוריות מקבילות ("ציבורי" / "פרטי" / "מסובסד"), וזו
 * בדיוק הטעות שתוקנה כאן — ראו CareUnitType/FundingOptionTag הישנים
 * שהוסרו. לדוגמה שיבא הוא בית חולים ציבורי, אבל יש בו גם תשלום עצמי וגם
 * שלושה הסדרי קופה נפרדים (מכבי/כללית/מאוחדת) — כל אלה routes נפרדים על
 * אותה ישות אחת, לא ישויות/קטגוריות שונות.
 *
 * מקור הנתונים: המפרט המלא שהמשתמשת סיפקה ב-22.9.2026 ("נכון ל-22.9.2026"),
 * שמחליף/מעדכן חלק מהנתונים הישנים. כללי המקור:
 *  1. חוזרי/כללי משרד הבריאות (eligibility.ts) — לא נגעו, כבר תואמים.
 *  2. תקנוני/עמודי הקופות הרשמיים העדכניים (healthFunds.ts) — לזכאות/מחיר ה-route.
 *  3. עמוד המחיר הרשמי של בית החולים עצמו — לתשלום עצמי.
 *  4. מקור משני עדכני (סיקור תקשורתי) — רק כשאין 1-3.
 *  5. מאמר ישן — לעולם לא דורס 1-4 (למשל: אין להשתמש בנתון הישן של 4,000 ₪
 *     עבור מאוחדת שמופיע עדיין בעמוד שמיר–אסף הרופא — תנאי מאוחדת שיא
 *     העדכניים הם 3,500 ₪, ולכן הנתון הישן פשוט לא נכלל כאן).
 *
 * שדה שאין לו מקור אמין — undefined, וה-UI מציג "יש לברר מול היחידה"/"מחיר
 * לא אומת" במקומו. אף מספר/זכאות לא מומצא. eligibilityNote תמיד מנוסח
 * "בכפוף ל..." — האתר לעולם לא קובע שהמשתמשת בהכרח זכאית (תלוי בגיל, ותק
 * וסטטוס ביטוח בפועל שהאתר לא יכול לדעת).
 */

export type Region = "מרכז" | "ירושלים" | "צפון" | "דרום";
export type Setting = "public" | "private";
export type HealthFund = "כללית" | "מכבי" | "מאוחדת" | "לאומית";
export type FundingType = "selfPay" | "healthFundArrangement";
export type VerificationStatus = "verified" | "needsVerification" | "outdatedDoNotUse";

/** מסלול מימון יחיד בתוך יחידה — ראו הסבר המודל למעלה */
export interface CareRoute {
  id: string;
  fundingType: FundingType;
  /** רק כש-fundingType === "healthFundArrangement" */
  healthFund?: HealthFund;
  /** שם התוכנית הספציפית הנדרשת, למשל "מכבי שלי" */
  requiredPlan?: string;
  ageMin?: number;
  ageMax?: number;
  /** true כש"עד לפני גיל X" (לא כולל את הגיל עצמו) */
  ageMaxExclusive?: boolean;
  waitingPeriodMonths?: number;
  /** מחרוזת מוצגת, למשל "3,500 ₪" — undefined = לא פורסם מחיר */
  pricePerCycle?: string;
  numberOfCycles?: string;
  eggLimit?: string;
  storageYears?: number;
  medicationsIncluded?: boolean;
  medicationNotes?: string;
  doctorChoice?: "yes" | "no" | "depends";
  included?: string;
  notIncluded?: string;
  /** תמיד ניסוח "בכפוף ל..." — לעולם לא טענת זכאות ודאית */
  eligibilityNote?: string;
  source?: SourceLink;
  /** רק תאריך מפורש שידוע בפועל — לא מומצא */
  verifiedAt?: string;
  verificationStatus: VerificationStatus;
  /** הערת אי-התאמה בין מקורות, או הבהרה חשובה למסלול הזה בלבד */
  caveat?: string;
}

export interface CareUnit {
  id: string;
  name: string;
  city?: string;
  region?: Region;
  /** תכונה פיזית קבועה של המוסד — לא של המסלול */
  setting: Setting;
  routes: CareRoute[];
  isActive: boolean;
}

function slug(name: string): string {
  return name.replace(/[^֐-׿\w]+/g, "-");
}

/* ---------------------------------------------------------------------- */
/* מקורות משותפים                                                          */
/* ---------------------------------------------------------------------- */

const MACCABI_SHELI_SOURCE: SourceLink = {
  label: "תנאי מכבי שלי",
  url: "https://www.maccabi4u.co.il/eligibilites/117173/",
};

const CLALIT_MUSHLAM_SOURCE: SourceLink = {
  label: "תנאי כללית מושלם",
  url: "https://mushlam.clalit.co.il/he/content_worlds/pregnancy-and-childbirth/Pages/Fertility-preservation.aspx",
};

const SHEBA_SOURCE: SourceLink = {
  label: "שיבא — הקפאת ביציות מבחירה",
  url: "https://maternity.sheba.co.il/הקפאת-ביציות",
};

/** הערה משותפת לכל route של כללית מושלם — הרשימה טרם אומתה מול עמוד רשמי מפורש */
const CLALIT_CAVEAT =
  "רשימת בתי החולים בהסכם מבוססת על המידע העדכני שסופק ולא אומתה מול עמוד רשמי מפורש של כללית מושלם — מומלץ לאשר מול הקופה לפני קביעת תור.";

/* ---------------------------------------------------------------------- */
/* factory-ים למסלולי קופה חוזרים (אותם תנאי זכאות/מחיר על כמה בתי חולים) */
/* ---------------------------------------------------------------------- */

function maccabiSheliRoute(unitSlug: string): CareRoute {
  return {
    id: `${unitSlug}-maccabi`,
    fundingType: "healthFundArrangement",
    healthFund: "מכבי",
    requiredPlan: "מכבי שלי",
    ageMin: 31,
    ageMax: 38,
    waitingPeriodMonths: 12,
    pricePerCycle: "3,500 ₪",
    numberOfCycles: "עד 3 טיפולים או 25 ביציות, לפי המוקדם",
    storageYears: 5,
    medicationsIncluded: false,
    medicationNotes:
      "תרופות הפריון אינן כלולות ב-3,500 ₪; ייתכנו הנחות ברכישתן במסגרת מסלול התרופות של מכבי זהב.",
    eligibilityNote: "בכפוף לגיל 31–38, ותק של 12 חודשים במכבי שלי, וזכאות בפועל.",
    source: MACCABI_SHELI_SOURCE,
    verifiedAt: "16.9.2026",
    verificationStatus: "verified",
  };
}

function clalitMushlamRoute(unitSlug: string, caveat = CLALIT_CAVEAT): CareRoute {
  return {
    id: `${unitSlug}-clalit`,
    fundingType: "healthFundArrangement",
    healthFund: "כללית",
    requiredPlan: "מושלם פלטינום",
    ageMin: 30,
    ageMax: 37,
    waitingPeriodMonths: 12,
    pricePerCycle: "3,500 ₪",
    numberOfCycles: "גיל 30–35: עד 2 מחזורים/25 ביציות; גיל 36–37: עד 3 מחזורים/35 ביציות",
    storageYears: 5,
    medicationsIncluded: false,
    medicationNotes: "התרופות אינן כלולות ב-3,500 ₪.",
    eligibilityNote: "בכפוף לגיל 30–37, ותק של 12 חודשים במושלם פלטינום, וזכאות בפועל.",
    source: CLALIT_MUSHLAM_SOURCE,
    verificationStatus: "needsVerification",
    caveat,
  };
}

/** מאוחדת שיא — לפי המפרט אין רשימת בתי חולים מאומתת בשום מקום, חוץ
 * משיבא שמפרסמת זאת בעצמה באתרה. לכן ה-route הזה משמש *רק* עבור שיבא. */
function meuhedetOnSheba(): CareRoute {
  return {
    id: "sheba-tel-hashomer-meuhedet",
    fundingType: "healthFundArrangement",
    healthFund: "מאוחדת",
    requiredPlan: "מאוחדת שיא",
    ageMin: 30,
    ageMax: 41,
    ageMaxExclusive: true,
    waitingPeriodMonths: 12,
    pricePerCycle: "3,500 ₪",
    numberOfCycles: "עד 6 שאיבות ו/או עד 30 ביציות, לפי המוקדם",
    storageYears: 5,
    medicationsIncluded: false,
    medicationNotes: "השתתפות עצמית בתרופות של עד 50% מהמחיר המרבי לצרכן, בהתאם לתקנון מאוחדת שיא.",
    eligibilityNote: "בכפוף לגיל 30 עד לפני 41, ותק של 12 חודשים במאוחדת שיא, וזכאות בפועל.",
    source: SHEBA_SOURCE,
    verificationStatus: "verified",
  };
}

function selfPay(
  unitSlug: string,
  opts: {
    pricePerCycle?: string;
    numberOfCycles?: string;
    included?: string;
    notIncluded?: string;
    verificationStatus: VerificationStatus;
    caveat?: string;
    source?: SourceLink;
  }
): CareRoute {
  return {
    id: `${unitSlug}-selfpay`,
    fundingType: "selfPay",
    ...opts,
  };
}

/* ---------------------------------------------------------------------- */
/* בתי חולים ציבוריים                                                      */
/* ---------------------------------------------------------------------- */

const shamirId = slug("שמיר – אסף הרופא");
const shebaId = slug("שיבא תל השומר");
const wolfsonId = slug("וולפסון");
const hadassahEinKeremId = slug("הדסה עין כרם");
const shaareiZedekId = slug("שערי צדק");
const naharyaId = slug("המרכז הרפואי לגליל – נהריה");
const poriyaId = slug("פוריה");
const rambamId = slug("רמב״ם");
const beneiZionId = slug("בני ציון");
const carmelId = slug("כרמל");
const meirId = slug("מאיר");
const belinsonId = slug("בילינסון");
const kaplanId = slug("קפלן");
const ichilovId = slug("איכילוב");
const barzilaiId = slug("ברזילי");
const sorokaId = slug("סורוקה");
const hillelYaffeId = slug("הלל יפה");
const hadassahHarHatzofimId = slug("הדסה הר הצופים");
const haemekId = slug("העמק");
const nazarethId = slug("בית החולים האנגלי / הצרפתי / המשפחה הקדושה (נצרת)");
const assutaAshdodId = slug("אסותא אשדוד");

const publicUnits: CareUnit[] = [
  {
    id: shamirId,
    name: "שמיר – אסף הרופא",
    region: "מרכז",
    setting: "public",
    isActive: true,
    routes: [
      selfPay(shamirId, {
        pricePerCycle: "6,500 ₪ לסבב",
        numberOfCycles: "12,000 ₪ לשני סבבים מראש; דמי פתיחת תיק 300 ₪, מנוכים אם ממשיכים בטיפול",
        verificationStatus: "verified",
        caveat:
          "באתר היחידה מופיע גם נתון ישן של 4,000 ₪ עבור מאוחדת — זהו מחיר לא-עדכני ואינו משמש כאן; תנאי מאוחדת שיא הנוכחיים (3,500 ₪) עדכניים יותר ומופיעים בהסדרי הקופה, לא בעמוד היחידה.",
        source: { label: "שמיר — הקפאת ביציות", url: "https://vitrofertilization.shamir.org/oocyte-freezing/" },
      }),
    ],
  },
  {
    id: shebaId,
    name: "שיבא תל השומר",
    city: "רמת גן",
    region: "מרכז",
    setting: "public",
    isActive: true,
    routes: [
      selfPay(shebaId, {
        pricePerCycle: "7,500 ₪ לסבב אחד",
        numberOfCycles: "14,000 ₪ לשני סבבים",
        included: "שאיבה, הקפאת ביציות, אחסון לחמש שנים ומעקב רופא/ת פוריות",
        verificationStatus: "verified",
        source: SHEBA_SOURCE,
      }),
      maccabiSheliRoute(shebaId),
      clalitMushlamRoute(shebaId, "שיבא מפרסמת בעצמה זכאות עם עמידה בתנאי כללית מושלם — מומלץ לאשר את הפרטים המדויקים מול הקופה."),
      meuhedetOnSheba(),
    ],
  },
  {
    id: wolfsonId,
    name: "וולפסון",
    region: "מרכז",
    setting: "public",
    isActive: true,
    routes: [
      selfPay(wolfsonId, {
        pricePerCycle: "7,000 ₪ לשאיבה",
        numberOfCycles: "14,000 ₪ אם אין חבילת הנחה",
        verificationStatus: "verified",
        source: { label: "וולפסון — שימור פוריות", url: "https://wolfsonhealth.com/הקפאת-ביציות/" },
      }),
    ],
  },
  {
    id: hadassahEinKeremId,
    name: "הדסה עין כרם",
    region: "ירושלים",
    setting: "public",
    isActive: true,
    routes: [
      selfPay(hadassahEinKeremId, {
        pricePerCycle: "7,500 ₪",
        numberOfCycles: "12,000 ₪ לשני סבבים",
        verificationStatus: "needsVerification",
        caveat: "אחסון, תרופות ומדיניות החזר טרם אומתו.",
      }),
      clalitMushlamRoute(hadassahEinKeremId),
    ],
  },
  {
    id: shaareiZedekId,
    name: "שערי צדק",
    region: "ירושלים",
    setting: "public",
    isActive: true,
    routes: [
      selfPay(shaareiZedekId, {
        pricePerCycle: "6,500 ₪",
        numberOfCycles: "12,000 ₪ לשניים; פורסמו גם חבילות ל־3–4 סבבים",
        verificationStatus: "needsVerification",
        caveat: "מחיר עדכני ותנאי החזר טרם אומתו.",
      }),
      clalitMushlamRoute(shaareiZedekId),
    ],
  },
  {
    id: naharyaId,
    name: "המרכז הרפואי לגליל – נהריה",
    region: "צפון",
    setting: "public",
    isActive: true,
    routes: [
      selfPay(naharyaId, {
        pricePerCycle: "6,700 ₪",
        numberOfCycles: "5,300 ₪ לסבב שני; 12,000 ₪ יחד",
        verificationStatus: "needsVerification",
        caveat: "מה כלול ומספר שנות אחסון טרם אומתו.",
      }),
    ],
  },
  {
    id: poriyaId,
    name: "פוריה",
    region: "צפון",
    setting: "public",
    isActive: true,
    routes: [
      selfPay(poriyaId, {
        pricePerCycle: "6,500 ₪",
        numberOfCycles: "כ־5,500 ₪ מסבב שני",
        verificationStatus: "needsVerification",
        caveat: "מחיר עדכני ואחסון טרם אומתו.",
      }),
    ],
  },
  {
    id: rambamId,
    name: "רמב״ם",
    region: "צפון",
    setting: "public",
    isActive: true,
    routes: [
      selfPay(rambamId, {
        pricePerCycle: "6,500 ₪",
        verificationStatus: "verified",
      }),
    ],
  },
  {
    id: beneiZionId,
    name: "בני ציון",
    region: "צפון",
    setting: "public",
    isActive: true,
    routes: [
      selfPay(beneiZionId, {
        pricePerCycle: "כ־6,500 ₪",
        verificationStatus: "needsVerification",
        caveat: "מחיר מלא ואחסון טרם אומתו.",
      }),
    ],
  },
  {
    id: carmelId,
    name: "כרמל",
    region: "צפון",
    setting: "public",
    isActive: true,
    routes: [
      selfPay(carmelId, {
        pricePerCycle: "כ־8,500 ₪",
        verificationStatus: "needsVerification",
        caveat: "מחיר עדכני טרם אומת.",
      }),
      clalitMushlamRoute(carmelId),
    ],
  },
  {
    id: meirId,
    name: "מאיר",
    region: "מרכז",
    setting: "public",
    isActive: true,
    routes: [
      selfPay(meirId, {
        pricePerCycle: "כ־7,000 ₪",
        verificationStatus: "needsVerification",
        caveat: "זמינות, אחסון ותרופות טרם אומתו.",
      }),
      clalitMushlamRoute(meirId),
    ],
  },
  {
    id: belinsonId,
    name: "בילינסון",
    region: "מרכז",
    setting: "public",
    isActive: true,
    routes: [
      selfPay(belinsonId, {
        pricePerCycle: "כ־7,000 ₪",
        verificationStatus: "needsVerification",
        caveat: "מחיר וזמן המתנה טרם אומתו.",
      }),
      clalitMushlamRoute(belinsonId),
    ],
  },
  {
    id: kaplanId,
    name: "קפלן",
    region: "מרכז",
    setting: "public",
    isActive: true,
    routes: [
      selfPay(kaplanId, {
        pricePerCycle: "כ־6,200 ₪",
        verificationStatus: "needsVerification",
        caveat: "מחיר עדכני ומה כלול טרם אומתו.",
      }),
      clalitMushlamRoute(kaplanId),
    ],
  },
  {
    id: ichilovId,
    name: "איכילוב",
    region: "מרכז",
    setting: "public",
    isActive: true,
    routes: [
      selfPay(ichilovId, {
        pricePerCycle: "כ־9,245 ₪",
        verificationStatus: "needsVerification",
        caveat: "מחיר עדכני ומספר שנות אחסון טרם אומתו.",
      }),
    ],
  },
  {
    id: barzilaiId,
    name: "ברזילי",
    region: "דרום",
    setting: "public",
    isActive: true,
    routes: [
      selfPay(barzilaiId, {
        pricePerCycle: "כ־6,500 ₪",
        numberOfCycles: "כ־12,000 ₪ לשני סבבים",
        verificationStatus: "needsVerification",
        caveat: "תנאי החבילה והחזר טרם אומתו.",
      }),
    ],
  },
  {
    id: sorokaId,
    name: "סורוקה",
    region: "דרום",
    setting: "public",
    isActive: true,
    routes: [
      selfPay(sorokaId, {
        pricePerCycle: "פורסם מחיר של כ־14,000 ₪ לשני סבבים",
        numberOfCycles: "14,000 ₪",
        verificationStatus: "needsVerification",
        caveat: "מחיר לסבב יחיד ומה כלול טרם אומתו.",
      }),
      clalitMushlamRoute(sorokaId),
    ],
  },
  {
    id: hillelYaffeId,
    name: "הלל יפה",
    region: "צפון",
    setting: "public",
    isActive: true,
    routes: [
      selfPay(hillelYaffeId, {
        pricePerCycle: "8,000 ₪",
        included: "כל תהליך השימור (שאיבה והקפאה)",
        notIncluded: "תרופות לגירוי שחלתי",
        verificationStatus: "verified",
        caveat:
          "באתר היחידה מופיע גם הנתון 6,500 ₪ בתיאור מקוצר של העמוד, לצד 8,000 ₪ בפירוט המלא בהמשכו — מומלץ לאמת טלפונית (04-7744750) איזה מהם המחיר המעודכן.",
        source: { label: "הלל יפה — שימור הפוריות", url: "https://hymc.org.il/?CategoryID=2253&ArticleID=8603" },
      }),
    ],
  },
  {
    id: hadassahHarHatzofimId,
    name: "הדסה הר הצופים",
    region: "ירושלים",
    setting: "public",
    isActive: true,
    routes: [
      selfPay(hadassahHarHatzofimId, {
        verificationStatus: "needsVerification",
        caveat: "מחיר, מה כלול ואחסון טרם אומתו — לא פורסם מחיר תשלום עצמי באתר היחידה.",
        source: {
          label: "הדסה הר הצופים — שימור פוריות",
          url: "https://he.hadassah.org.il/women/fertility-conservation/",
        },
      }),
    ],
  },
  {
    id: haemekId,
    name: "העמק",
    region: "צפון",
    setting: "public",
    isActive: true,
    routes: [
      selfPay(haemekId, {
        pricePerCycle: "כ־6,300 ₪",
        verificationStatus: "verified",
        source: {
          label: "מרכז רפואי העמק — מעבדת IVF",
          url: "https://hospitals.clalit.co.il/emek/he/departmentsandclinics/women_birth_department/moadon_yoldot_hila/Pages/ivf_laborotory.aspx",
        },
      }),
      clalitMushlamRoute(haemekId),
    ],
  },
  {
    id: nazarethId,
    name: "בית החולים האנגלי / הצרפתי / המשפחה הקדושה (נצרת)",
    region: "צפון",
    setting: "public",
    isActive: true,
    routes: [
      selfPay(nazarethId, {
        verificationStatus: "needsVerification",
        caveat: "מחיר, מה כלול ופרטי ההליך בפועל טרם אותרו.",
        source: {
          label: "משרד הבריאות — רשימת יחידות IVF מוסמכות",
          url: "https://www.gov.il/he/pages/ivf-inst-cryopreservation",
        },
      }),
    ],
  },
  {
    id: assutaAshdodId,
    name: "אסותא אשדוד",
    region: "דרום",
    setting: "public",
    isActive: true,
    routes: [
      selfPay(assutaAshdodId, {
        verificationStatus: "needsVerification",
        caveat: "מחיר ומה כלול טרם אותרו.",
        source: {
          label: "אסותא אשדוד — היחידה לפריון ולהפריה חוץ גופית",
          url: "https://www.assutaashdod.co.il/?catid=%7B6b314f6f-f644-4645-9172-848e7b5115dc%7D",
        },
      }),
    ],
  },
];

/* ---------------------------------------------------------------------- */
/* מרכזים פרטיים — אין להם מחיר תשלום-עצמי כולל ואחיד מפורסם                */
/* ---------------------------------------------------------------------- */

const elishaId = slug("מדיקה אלישע");
const assutaRamatHachayalId = slug("אסותא רמת החייל");
const assutaRishonId = slug("אסותא ראשון לציון");
const herzliyaId = slug("הרצליה מדיקל סנטר");

const NO_PRICE_CAVEAT = "מחיר לא אומת — יש לברר מול היחידה.";

const privateUnits: CareUnit[] = [
  {
    id: elishaId,
    name: "מדיקה אלישע",
    city: "חיפה",
    region: "צפון",
    setting: "private",
    isActive: true,
    routes: [
      selfPay(elishaId, { verificationStatus: "needsVerification", caveat: NO_PRICE_CAVEAT }),
      maccabiSheliRoute(elishaId),
      clalitMushlamRoute(
        elishaId,
        'רשימת כללית מושלם מציינת מוסד בשם "אלישע" — לא אומת בוודאות שמדובר באותה יחידה (מדיקה אלישע), ולכן יש לאשר את ההתאמה מול הקופה לפני הסתמכות על route זה.'
      ),
    ],
  },
  {
    id: assutaRamatHachayalId,
    name: "אסותא רמת החייל",
    city: "תל אביב",
    region: "מרכז",
    setting: "private",
    isActive: true,
    routes: [
      selfPay(assutaRamatHachayalId, { verificationStatus: "needsVerification", caveat: NO_PRICE_CAVEAT }),
      maccabiSheliRoute(assutaRamatHachayalId),
    ],
  },
  {
    id: assutaRishonId,
    name: "אסותא ראשון לציון",
    region: "מרכז",
    setting: "private",
    isActive: true,
    routes: [selfPay(assutaRishonId, { verificationStatus: "needsVerification", caveat: NO_PRICE_CAVEAT })],
  },
  {
    id: herzliyaId,
    name: "הרצליה מדיקל סנטר",
    region: "מרכז",
    setting: "private",
    isActive: true,
    routes: [
      selfPay(herzliyaId, {
        verificationStatus: "needsVerification",
        caveat:
          "פורסם סדר גודל של כ-10,000–15,000 ₪ לסבב (לא מחירון רשמי), בתוספת עלות תרופות אפשרית משמעותית — יש לקבל הצעת מחיר מדויקת ועדכנית מהמרכז.",
      }),
    ],
  },
];

export const careUnits: CareUnit[] = [...publicUnits, ...privateUnits];

/** ה-route של תשלום עצמי ליחידה, אם קיים */
export function selfPayRoute(unit: CareUnit): CareRoute | undefined {
  return unit.routes.find((r) => r.fundingType === "selfPay");
}

/** כל ה-routes של יחידה עבור קופה נתונה */
export function routesForFund(unit: CareUnit, fund: HealthFund): CareRoute[] {
  return unit.routes.filter((r) => r.fundingType === "healthFundArrangement" && r.healthFund === fund);
}

/** רשימת הקופות שיש להן הסדר כלשהו ביחידה */
export function fundsWithArrangement(unit: CareUnit): HealthFund[] {
  const set = new Set<HealthFund>();
  for (const r of unit.routes) {
    if (r.fundingType === "healthFundArrangement" && r.healthFund) set.add(r.healthFund);
  }
  return [...set];
}
