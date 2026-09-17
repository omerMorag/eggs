import { test, expect } from "@playwright/test";

/**
 * "סיפורים מהמקפיא" — קריאה ציבורית בלבד (בלי התחברות). שליחת סיפור
 * ומודרציה דורשות Google OAuth אמיתי ואינן נבדקות כאן אוטומטית.
 */
test.describe("סיפורים מהמקפיא — מצב אורחת", () => {
  test("העמוד נטען, כפתור השיתוף לא פותח את הטופס כאורחת", async ({ page }) => {
    await page.goto("/#stories");
    await expect(page.getByRole("heading", { name: "סיפורים מהמקפיא" })).toBeVisible();

    // לחיצה על שיתוף כאורחת אמורה לנסות להתחבר (redirect ל-Google) — בשום
    // מקרה לא לפתוח את טופס השליחה בלי התחברות.
    await page.getByRole("button", { name: "רוצה לשתף את הסיפור שלך?" }).click();
    await page.waitForTimeout(1000);
    await expect(page.getByRole("heading", { name: "שיתוף הסיפור שלך" })).not.toBeVisible();
  });

  test("חיפוש וסינון פועלים בצד שרת ולא קורסים", async ({ page }) => {
    await page.goto("/#stories");
    const searchInput = page.getByPlaceholder("חפשי לפי מילה, מקום או חוויה...");
    await expect(searchInput).toBeVisible();

    await searchInput.fill("מחרוזת חיפוש שכמעט בוודאות לא קיימת בשום סיפור");
    // מצפים למצב ריק כלשהו (מסונן) — לא לשגיאה
    await expect(page.getByText(/אין סיפורים שמתאימים לסינון הזה|עדיין אין כאן סיפורים/)).toBeVisible({
      timeout: 5000,
    });
  });
});
