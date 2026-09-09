"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

/**
 * מרנדר את התוכן שלו ישירות ל-document.body, מחוץ לכל אב אפשרי בעמוד.
 *
 * חשוב: אלמנט אב עם backdrop-filter/filter/transform/perspective (למשל הפס
 * העליון עם backdrop-blur) יוצר "stacking context" חדש, וגם הופך להיות
 * containing block עבור צאצאים עם position: fixed. תפריט/טולטיפ צף שנשאר
 * מקונן בתוך אב כזה "נכלא" בהקשר הציור שלו: גם z-index גבוה מאוד לא יעזור,
 * כי הוא מושווה רק מול אחים בתוך אותו הקשר — אלמנט אח מאוחר יותר ב-DOM
 * (כמו כותרת הדף) יכול לצייר "מעליו" ולחסום קליקים, בלי שום שגיאה גלויה.
 * הפורטל פותר את זה לגמרי: התוכן מצורף ל-body ולכן משתתף ב-stacking
 * context השורש בלבד.
 */
export default function FloatingPortal({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return createPortal(children, document.body);
}
