"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

/**
 * UX בלבד — קובע רק אם קישור הניווט לאזור האדמין מוצג. שום הרשאה אמיתית
 * לא תלויה בזה; כל route תחת /api/admin/** אוכף requireAdmin() בעצמו,
 * ללא שום תלות בתשובה הזו.
 */
export function useIsAdmin(): boolean {
  const { status } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (status !== "authenticated") {
      setIsAdmin(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/whoami", { cache: "no-store" });
        if (!res.ok || cancelled) return;
        const data = await res.json();
        if (!cancelled) setIsAdmin(Boolean(data.isAdmin));
      } catch {
        // best-effort — בכשל פשוט לא מציגים קישור אדמין
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [status]);

  return isAdmin;
}
