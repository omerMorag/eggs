import type { StoredProgress } from "./useJourneyProgress";

/**
 * עטיפה דקה סביב /api/progress — סנכרון עם השרת הוא best-effort בלבד:
 * כל כשלון רשת (offline, timeout, 401 כשההתחברות פגה) נבלע בשקט ומחזיר null,
 * כדי שהעריכה המקומית (localStorage) לעולם לא תיחסם או תציג שגיאה למשתמשת.
 */

export async function fetchServerProgress(): Promise<StoredProgress | null> {
  try {
    const res = await fetch("/api/progress", { method: "GET", cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data || typeof data !== "object") return null;
    return data as StoredProgress;
  } catch {
    return null;
  }
}

export async function pushServerProgress(data: StoredProgress): Promise<boolean> {
  try {
    const res = await fetch("/api/progress", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch {
    return false;
  }
}
