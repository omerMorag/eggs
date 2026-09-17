/** מפתח ה-Redis שבו נשמר JSON ההתקדמות של משתמש/ת נתונ/ה, לפי מזהה Google (sub) */
export function progressKey(userId: string): string {
  return `progress:${userId}`;
}
