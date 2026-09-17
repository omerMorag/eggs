/**
 * רשימת כתובות המייל של מנהלות המערכת — אך ורק דרך ADMIN_EMAILS (פסיקים),
 * לעולם לא מקור אחר. הבדיקה תמיד מול session.user.email בצד השרת.
 */
function adminEmailSet(): Set<string> {
  const raw = process.env.ADMIN_EMAILS ?? "";
  return new Set(
    raw
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)
  );
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return adminEmailSet().has(email.trim().toLowerCase());
}
