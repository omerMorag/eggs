import { test, expect } from "@playwright/test";

/**
 * מחשבון העלות — מצב אורחת בלבד (בלי התחברות). מכסה את הזרימה המלאה של
 * שבעת השלבים ואת "שני את הבחירות" שחוזר לשלב 1.
 */
test.describe("מחשבון עלות", () => {
  test("זרימת אשף מלאה מובילה לתוצאה עם דיסקליימר", async ({ page }) => {
    await page.goto("/#cost-estimator");

    await expect(page.getByRole("heading", { name: "כמה התהליך עשוי לעלות לי?" })).toBeVisible();

    // שלב 1
    await page.getByRole("button", { name: "פרטי" }).click();
    await page.getByRole("button", { name: "המשך" }).click();
    // שלב 2
    await page.getByRole("button", { name: "כללית" }).click();
    await page.getByRole("button", { name: "המשך" }).click();
    // שלב 3
    await page.getByRole("button", { name: "סבב אחד" }).click();
    await page.getByRole("button", { name: "המשך" }).click();
    // שלב 4
    await page.getByRole("button", { name: "לא" }).click();
    await page.getByRole("button", { name: "המשך" }).click();
    // שלב 5
    await page.getByRole("button", { name: "עדיין לא בחרתי" }).click();
    await page.getByRole("button", { name: "המשך" }).click();
    // שלב 6
    await page.getByRole("button", { name: "אני עדיין לא יודעת" }).click();
    await page.getByRole("button", { name: "המשך" }).click();
    // שלב 7
    await page.getByRole("button", { name: "חשבי את העלות" }).click();

    await expect(page.getByText("הערכת העלות שלך")).toBeVisible();
    await expect(page.getByText("המחירים הם הערכה בלבד ועשויים להשתנות")).toBeVisible();

    // חזרה לעריכת בחירות
    await page.getByRole("button", { name: "שני את הבחירות" }).click();
    await expect(page.getByText(/שלב.*מתוך/)).toBeVisible();
  });

  test("שמירת הערכה בענן דורשת התחברות", async ({ page }) => {
    await page.goto("/#cost-estimator");
    for (const label of ["עדיין לא החלטתי", "המשך"]) {
      await page.getByRole("button", { name: label }).click();
    }
    // ממשיכים דרך שאר השלבים (2-7) בברירת המחדל
    for (let i = 0; i < 6; i++) {
      await page.getByRole("button", { name: /^(המשך|חשבי את העלות)$/ }).click();
    }
    await expect(page.getByRole("button", { name: /התחברי כדי לשמור/ })).toBeVisible();
  });
});
