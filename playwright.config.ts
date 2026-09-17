import { defineConfig, devices } from "@playwright/test";

/**
 * חבילת בדיקות Playwright קבועה — מכסה רק זרימות שאינן דורשות התחברות
 * (מצב אורחת: מחשבון העלות, קריאת/חיפוש סיפורים). בדיקות שדורשות Google
 * OAuth אמיתי (שליחת סיפור, מודרציה) לא נכללות כאן במכוון — הן נבדקו
 * ידנית בזמן הפיתוח, אך אין דרך פשוטה ובטוחה להריץ אותן אוטומטית בלי
 * לשמור credentials אמיתיים בריפו.
 *
 * הרצה: npm run test:e2e (מריץ מול שרת dev שעולה אוטומטית, ר' webServer למטה).
 */
export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  fullyParallel: true,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3100",
    trace: "retain-on-failure",
    locale: "he-IL",
  },
  projects: [
    {
      name: "desktop-chromium",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 900 } },
    },
    {
      name: "mobile-chromium",
      use: { ...devices["Pixel 7"] },
    },
  ],
  webServer: {
    command: "npm run dev -- -p 3100",
    url: "http://localhost:3100",
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
