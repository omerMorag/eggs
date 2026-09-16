"use client";

import { useCallback, useEffect, useState } from "react";
import { DEFAULT_SECTION, isSectionId, type SectionId } from "@/data/navSections";

function parseHash(): SectionId {
  if (typeof window === "undefined") return DEFAULT_SECTION;
  const raw = window.location.hash.replace(/^#/, "");
  return isSectionId(raw) ? raw : DEFAULT_SECTION;
}

/**
 * מנגנון הניווט הפנימי של ה-Single Page: האזור הפעיל נקבע לפי
 * window.location.hash (#roadmap, #tests וכו'). מעברים בין אזורים הם
 * שינויי hash רגילים (קישורי <a href="#..."> רגילים) — כך שכפתורי
 * Back/Forward של הדפדפן ממשיכים לעבוד בלי שום קוד נוסף, כי כל שינוי hash
 * נכנס להיסטוריית הדפדפן ומפעיל אירוע hashchange באופן טבעי.
 */
export function useHashSection() {
  const [section, setSection] = useState<SectionId>(DEFAULT_SECTION);

  useEffect(() => {
    setSection(parseHash());
    function handleHashChange() {
      setSection(parseHash());
    }
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigate = useCallback((next: SectionId) => {
    if (typeof window === "undefined") return;
    window.location.hash = next;
  }, []);

  return { section, navigate };
}
