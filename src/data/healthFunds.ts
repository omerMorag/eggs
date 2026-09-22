import type { HealthFundRow } from "./types";

/**
 * הקפאת ביציות מבחירה דרך הביטוח המשלים של קופות החולים — לא זכאות רפואית בסל.
 * נכון לעדכון ספטמבר 2026. תמיד לבדוק תנאים מדויקים ועדכניים באתר הקופה לפני קביעת תור.
 */
export const healthFunds: HealthFundRow[] = [
  {
    fund: "כללית",
    plan: "מושלם פלטינום",
    ageEligibility: "30–35",
    whatYouGet: "עד 2 מחזורי שאיבה ועד 25 ביציות",
    copay: "3,500 ₪ למחזור",
    note:
      "נדרש בדרך כלל ותק של 12 חודשים במושלם פלטינום, והשירות כולל הקפאה לחמש שנים. השירות ניתן בבתי החולים של כללית עצמה: סורוקה, בילינסון, מאיר, כרמל, קפלן והעמק — לפי דיווחי תקשורת מיוני–יולי 2025 (לא אותרה רשימה רשמית מפורשת באתר כללית מושלם עצמו); מומלץ לאשר את הרשימה העדכנית ישירות מול הקופה.",
    source: {
      label: "תנאי כללית מושלם",
      url: "https://mushlam.clalit.co.il/he/content_worlds/pregnancy-and-childbirth/Pages/Fertility-preservation.aspx",
    },
  },
  {
    fund: "כללית",
    plan: "מושלם פלטינום",
    ageEligibility: "36–37",
    whatYouGet: "עד 3 מחזורי שאיבה ועד 35 ביציות",
    copay: "3,500 ₪ למחזור",
    source: {
      label: "תנאי כללית מושלם",
      url: "https://mushlam.clalit.co.il/he/content_worlds/pregnancy-and-childbirth/Pages/Fertility-preservation.aspx",
    },
  },
  {
    fund: "מכבי",
    plan: "מכבי שלי",
    ageEligibility: "31–38 כולל",
    whatYouGet: "עד 3 טיפולים או 25 ביציות, לפי המוקדם",
    copay: "3,500 ₪ למחזור",
    note:
      "נדרש ותק של 12 חודשים במכבי שלי. נכון לעדכון 16 בספטמבר 2026, בתי החולים שבהסכם הם שיבא תל השומר, מדיקה אלישע ואסותא רמת החייל. התרופות אינן כלולות בהשתתפות העצמית, אך עשויה להיות זכאות להנחה ברכישתן.",
    source: {
      label: "תנאי מכבי שלי",
      url: "https://www.maccabi4u.co.il/eligibilites/117173/",
    },
  },
  {
    fund: "מאוחדת",
    plan: "שיא",
    ageEligibility: "30–40",
    whatYouGet: "עד 6 סבבים, בכפוף לתנאי התוכנית ולמגבלות משרד הבריאות",
    copay: "כ־3,500 ₪ למחזור",
  },
  {
    fund: "לאומית",
    plan: "זהב",
    ageEligibility: "30–37 כולל",
    whatYouGet: "עד 4 מחזורי טיפול",
    copay: "3,500 ₪ למחזור",
    note:
      "השירות נכנס לתוקף ביולי 2026, עם תקופת המתנה של 12 חודשים. טרם אותר עמוד תנאים רשמי של לאומית לשירות הזה — ההרחבה כאן מבוססת על סיקור תקשורתי, ומומלץ לאשר את הפרטים המדויקים ישירות מול הקופה.",
    source: {
      label: "עדכון לאומית (Ynet, יוני 2026)",
      url: "https://www.ynet.co.il/health/article/skzmnuamgg",
    },
  },
];
