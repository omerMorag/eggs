"use client";

import { Menu } from "lucide-react";
import Logo from "@/components/brand/Logo";

interface MobileHeaderProps {
  onMenuClick: () => void;
  /** לחיצה על הלוגו — גוללת לכותרת "המסלול האישי שלך", בלי לאפס את מסך
   *  הפתיחה/ההתקדמות (ר' AppShell.tsx: handleLogoClick). ל-MobileHeader
   *  אין AboutLink משלו, ולכן אין כאן צורך בפרופ נפרד עבורו כמו ב-Sidebar/MobileDrawer. */
  onLogoClick: () => void;
}

/**
 * Header קומפקט למובייל/טאבלט (מוסתר מ-lg ומעלה, שם ה-Sidebar הקבוע תופס
 * את מקומו). מציג את הלוגו (וריאציית compact: סמל + "מקפיאות") ולא את שם
 * האזור הפעיל, כדי שהמיתוג יקבל נוכחות קבועה גם במובייל; שם האזור הפעיל
 * עדיין מודגש ברשימת הניווט עצמה (NavList) בתוך המגירה.
 *
 * `fixed` (לא `sticky`) — בכוונה, באותו דפוס בדיוק כמו ה-Sidebar הקבוע
 * (`aside` ב-Sidebar.tsx). ה-header יושב בתוך wrapper div משותף עם ה-Sidebar
 * שמשמש רק לשליטה על נראות ה-Chrome (opacity/visibility) — וה-Sidebar
 * עצמו position:fixed, כך שהוא לא תורם גובה לזרימת ה-wrapper. משמעות: אם
 * ה-header היה sticky, ה"container" הזמין לו ל"הידבקות" היה מוגבל לגובה
 * ה-header עצמו בלבד (כמעט 0 תוספת גובה מה-aside), ולכן ברגע שגוללים אפילו
 * קצת מעבר לגובה הזה, ה-sticky "נגמר לו המקום" בתוך ה-container הקטן
 * שלו והוא נעלם לגמרי — במקום להישאר מוצמד לראש המסך. `fixed` פותר את זה
 * לחלוטין (לא תלוי בגובה ההורה). ה-`<main>` ב-AppShell.tsx מפצה על כך עם
 * ריפוד עליון נוסף במובייל, כדי שתוכן לא ייכנס מתחת ל-header הקבוע.
 */
export default function MobileHeader({ onMenuClick, onLogoClick }: MobileHeaderProps) {
  return (
    <header className="no-print fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b border-mist-200 bg-mist-100/90 px-3.5 backdrop-blur-md sm:h-16 sm:px-4 lg:hidden">
      <Logo variant="compact" onClick={onLogoClick} />

      <button
        type="button"
        onClick={onMenuClick}
        aria-label="פתיחת תפריט ניווט"
        aria-haspopup="true"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink/70 transition-colors hover:bg-mist-200/70"
      >
        <Menu className="h-5 w-5" strokeWidth={2.25} />
      </button>
    </header>
  );
}
