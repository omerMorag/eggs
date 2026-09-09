import type { HospitalPriceRow, SourceLink } from "./types";

/**
 * מחירון בתשלום עצמי (הקפאה מבחירה) בבתי חולים ציבוריים, לפי מה שפורסם.
 * המחירים עשויים להשתנות — יש לאמת מול היחידה לפני קביעת תור או תשלום.
 *
 * verification: "verified" = אומת בפרסום הרשמי של בית החולים עצמו.
 *               "needs-verification" = מבוסס על מדריכי השוואה ברשת, לא על מחירון רשמי עדכני.
 */

export const comparisonGuideSource: SourceLink = {
  label: "מחירון השוואה — הקונטיינר",
  url: "https://www.container.org.il/כמה-עולה-הקפאת-ביציות/",
};

export const hospitalPrices: HospitalPriceRow[] = [
  {
    name: "שמיר – אסף הרופא",
    region: "מרכז",
    cycle1Price: "6,500 ₪",
    cycle2Price: "12,000 ₪ לפי המחירון שפורסם",
    whatsIncluded: "שאיבה והקפאה; יש לבדוק אחסון ופגישת ייעוץ",
    verification: "verified",
    caveat:
      "עמוד אחר של היחידה מציין שהמחזור הראשון עולה 6,500 ₪ וללא התחייבות לתשלום עבור מחזור שני — כלומר ייתכן שהמחזור השני כלול ולא בתוספת תשלום. מומלץ לאשר את הפרט הזה ישירות מול היחידה.",
    source: { label: "שמיר — הקפאת ביציות", url: "https://vitrofertilization.shamir.org/oocyte-freezing/" },
  },
  {
    name: "שיבא תל השומר",
    region: "מרכז",
    cycle1Price: "7,500 ₪",
    cycle2Price: "14,000 ₪",
    whatsIncluded: "טיפול ומעקב, שאיבה, הקפאה ואחסון לחמש שנים",
    verification: "verified",
    fundArrangements: ["מכבי שלי"],
    source: { label: "שיבא — הקפאת ביציות מבחירה", url: "https://maternity.sheba.co.il/הקפאת-ביציות" },
  },
  {
    name: "וולפסון",
    region: "מרכז",
    cycle1Price: "7,000 ₪",
    cycle2Price: "14,000 ₪ אם אין חבילת הנחה",
    whatsIncluded: "שאיבה לשימור; יש לבדוק אחסון וייעוץ",
    verification: "verified",
    source: { label: "וולפסון — שימור פוריות", url: "https://wolfsonhealth.com/הקפאת-ביציות/" },
  },
  {
    name: "הדסה",
    region: "ירושלים",
    cycle1Price: "7,500 ₪",
    cycle2Price: "12,000 ₪ לשני סבבים",
    needsVerify: "אחסון, תרופות ומדיניות החזר",
    verification: "needs-verification",
  },
  {
    name: "שערי צדק",
    region: "ירושלים",
    cycle1Price: "6,500 ₪",
    cycle2Price: "12,000 ₪ לשניים; פורסמו גם חבילות ל־3–4 סבבים",
    needsVerify: "מחיר עדכני ותנאי החזר",
    verification: "needs-verification",
  },
  {
    name: "המרכז הרפואי לגליל – נהריה",
    region: "צפון",
    cycle1Price: "6,700 ₪",
    cycle2Price: "5,300 ₪ לסבב שני; 12,000 ₪ יחד",
    needsVerify: "מה כלול ומספר שנות אחסון",
    verification: "needs-verification",
  },
  {
    name: "פוריה",
    region: "צפון",
    cycle1Price: "6,500 ₪",
    cycle2Price: "כ־5,500 ₪ מסבב שני",
    needsVerify: "מחיר עדכני ואחסון",
    verification: "needs-verification",
  },
  {
    name: "רמב״ם",
    region: "צפון",
    cycle1Price: "כ־6,000 ₪",
    needsVerify: "פורסמה בעבר גם אגרת ייעוץ",
    verification: "needs-verification",
  },
  {
    name: "בני ציון",
    region: "צפון",
    cycle1Price: "כ־6,500 ₪",
    needsVerify: "מחיר מלא ואחסון",
    verification: "needs-verification",
  },
  {
    name: "כרמל",
    region: "צפון",
    cycle1Price: "כ־8,500 ₪",
    needsVerify: "מחיר עדכני והסדרי קופה",
    verification: "needs-verification",
  },
  {
    name: "מאיר",
    region: "מרכז",
    cycle1Price: "כ־7,000 ₪",
    needsVerify: "זמינות, אחסון ותרופות",
    verification: "needs-verification",
  },
  {
    name: "בילינסון",
    region: "מרכז",
    cycle1Price: "כ־7,000 ₪",
    needsVerify: "מחיר וזמן המתנה",
    verification: "needs-verification",
  },
  {
    name: "קפלן",
    region: "מרכז",
    cycle1Price: "כ־6,200 ₪",
    needsVerify: "מחיר עדכני ומה כלול",
    verification: "needs-verification",
  },
  {
    name: "איכילוב",
    region: "מרכז",
    cycle1Price: "כ־9,245 ₪",
    needsVerify: "מחיר עדכני ומספר שנות אחסון",
    verification: "needs-verification",
  },
  {
    name: "ברזילי",
    region: "דרום",
    cycle1Price: "כ־6,500 ₪",
    cycle2Price: "כ־12,000 ₪ לשני סבבים",
    needsVerify: "תנאי החבילה והחזר",
    verification: "needs-verification",
  },
  {
    name: "סורוקה",
    region: "דרום",
    cycle1Price: "פורסם מחיר של כ־14,000 ₪ לשני סבבים",
    cycle2Price: "14,000 ₪",
    needsVerify: "מחיר לסבב יחיד ומה כלול",
    verification: "needs-verification",
  },
];
