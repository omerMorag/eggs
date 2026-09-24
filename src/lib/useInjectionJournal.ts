"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import {
  emptyJournal,
  isValidJournal,
  newId,
  type InjectionJournal,
  type JournalCycle,
} from "./injectionJournal";

/**
 * שמירת יומן "תקופת הזריקות" — אותו דפוס כמו useJourneyProgress:
 *  - לא מחוברת: localStorage בלבד, במפתח "guest".
 *  - מחוברת: השרת (/api/injection-journal, Redis לפי מזהה המשתמשת) הוא
 *    מקור האמת, עם עותק מקומי במפתח נפרד לכל משתמשת — כך שמשתמשות שונות
 *    באותו מכשיר (או מצב אורחת מול מחוברת) לא רואות זו את היומן של זו.
 *  - כניסה ראשונה לחשבון שעדיין אין לו יומן: היומן של מצב האורחת עובר
 *    לחשבון, ונמחק ממפתח האורחת (כדי שלא יישאר גלוי אחרי יציאה).
 *  - שינויים נדחפים לשרת בהשהיה קצרה. כשל רשת לא חוסם עבודה מקומית.
 * שום חלק מהיומן לא נשלח לאנליטיקה ולא נכתב לכתובת העמוד.
 */

const KEY_PREFIX = "makpiot:injection-journal:v1:";
const GUEST_KEY = `${KEY_PREFIX}guest`;
const userKey = (userId: string) => `${KEY_PREFIX}user:${userId}`;

export type SyncState = "guest" | "loading" | "synced" | "saving" | "offline";

function readLocal(key: string): InjectionJournal | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return isValidJournal(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function writeLocal(key: string, data: InjectionJournal) {
  try {
    window.localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // מצב פרטי / מכסה מלאה — ממשיכות בלי שמירה מקומית
  }
}

function removeLocal(key: string) {
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

function hasContent(j: InjectionJournal | null): j is InjectionJournal {
  return !!j && j.cycles.length > 0;
}

async function fetchServer(): Promise<InjectionJournal | null | "error"> {
  try {
    const res = await fetch("/api/injection-journal", { cache: "no-store" });
    if (!res.ok) return "error";
    const data = await res.json();
    if (data === null) return null;
    return isValidJournal(data) ? data : "error";
  } catch {
    return "error";
  }
}

async function pushServer(data: InjectionJournal): Promise<boolean> {
  try {
    const res = await fetch("/api/injection-journal", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function useInjectionJournal() {
  const { data: session, status } = useSession();
  const userId =
    status === "authenticated" ? ((session?.user as { id?: string } | undefined)?.id ?? null) : null;
  const storageKey = status === "loading" ? null : userId ? userKey(userId) : GUEST_KEY;

  const [journal, setJournal] = useState<InjectionJournal>(emptyJournal);
  /** המפתח שממנו נטען ה-state הנוכחי — שומרים רק אליו, לעולם לא למפתח אחר */
  const [loadedKey, setLoadedKey] = useState<string | null>(null);
  const [syncState, setSyncState] = useState<SyncState>("loading");
  const serverReadyRef = useRef(false);
  const pushTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // טעינה בכל החלפת זהות (אורחת ↔ מחוברת, או משתמשת אחרת)
  useEffect(() => {
    if (!storageKey) return;
    let cancelled = false;
    serverReadyRef.current = false;
    setLoadedKey(null);

    const local = readLocal(storageKey);
    setJournal(local ?? emptyJournal());

    if (!userId) {
      setLoadedKey(storageKey);
      setSyncState("guest");
      return;
    }

    setSyncState("loading");
    (async () => {
      const server = await fetchServer();
      if (cancelled) return;
      if (server === "error") {
        // השרת לא זמין — עובדות על העותק המקומי של המשתמשת, בלי לדרוס את השרת
        setLoadedKey(storageKey);
        setSyncState("offline");
        return;
      }
      let result: InjectionJournal;
      let needsPush = false;
      if (server && hasContent(server)) {
        result = local && local.updatedAt > server.updatedAt ? local : server;
        needsPush = result !== server;
      } else if (hasContent(local)) {
        result = local;
        needsPush = true;
      } else {
        const guest = readLocal(GUEST_KEY);
        if (hasContent(guest)) {
          result = guest;
          needsPush = true;
          removeLocal(GUEST_KEY);
        } else {
          result = server ?? emptyJournal();
        }
      }
      writeLocal(storageKey, result);
      setJournal(result);
      setLoadedKey(storageKey);
      serverReadyRef.current = true;
      if (needsPush) {
        setSyncState("saving");
        const ok = await pushServer(result);
        if (!cancelled) setSyncState(ok ? "synced" : "offline");
      } else {
        setSyncState("synced");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [storageKey, userId]);

  /** כל שינוי עובר כאן: מעדכן updatedAt, שומר מקומית ודוחף לשרת (מחוברת) */
  const commit = useCallback(
    (update: (j: InjectionJournal) => InjectionJournal) => {
      if (!loadedKey) return;
      setJournal((prev) => {
        const next = { ...update(prev), updatedAt: new Date().toISOString() };
        writeLocal(loadedKey, next);
        return next;
      });
    },
    [loadedKey]
  );

  // דחיפה לשרת בהשהיה — רק אחרי שהטעינה מהשרת הסתיימה, כדי לא לדרוס אותו
  useEffect(() => {
    if (!userId || !loadedKey || !serverReadyRef.current) return;
    if (journal.updatedAt === new Date(0).toISOString()) return;
    if (pushTimer.current) clearTimeout(pushTimer.current);
    pushTimer.current = setTimeout(async () => {
      setSyncState("saving");
      const ok = await pushServer(journal);
      setSyncState(ok ? "synced" : "offline");
    }, 1200);
    return () => {
      if (pushTimer.current) clearTimeout(pushTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [journal.updatedAt]);

  const activeCycle: JournalCycle | undefined = useMemo(
    () => journal.cycles.find((c) => c.id === journal.activeCycleId) ?? journal.cycles[journal.cycles.length - 1],
    [journal]
  );

  const createCycle = useCallback(
    (startDate: string, label: string) => {
      const cycle: JournalCycle = { id: newId(), label, startDate, days: {}, createdAt: new Date().toISOString() };
      commit((j) => ({ ...j, cycles: [...j.cycles, cycle], activeCycleId: cycle.id }));
    },
    [commit]
  );

  const updateActiveCycle = useCallback(
    (update: (c: JournalCycle) => JournalCycle) => {
      commit((j) => {
        const id = j.activeCycleId ?? j.cycles[j.cycles.length - 1]?.id;
        return { ...j, cycles: j.cycles.map((c) => (c.id === id ? update(c) : c)) };
      });
    },
    [commit]
  );

  const setActiveCycle = useCallback((id: string) => commit((j) => ({ ...j, activeCycleId: id })), [commit]);

  const deleteCycle = useCallback(
    (id: string) =>
      commit((j) => {
        const cycles = j.cycles.filter((c) => c.id !== id);
        return { ...j, cycles, activeCycleId: cycles[cycles.length - 1]?.id ?? null };
      }),
    [commit]
  );

  return {
    ready: loadedKey !== null,
    isSignedIn: !!userId,
    syncState,
    journal,
    activeCycle,
    createCycle,
    updateActiveCycle,
    setActiveCycle,
    deleteCycle,
  };
}

export type InjectionJournalApi = ReturnType<typeof useInjectionJournal>;
