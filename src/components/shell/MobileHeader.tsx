"use client";

import { Menu } from "lucide-react";
import type { SectionId } from "@/data/navSections";
import Logo from "@/components/brand/Logo";

interface MobileHeaderProps {
  onMenuClick: () => void;
  onNavigate: (id: SectionId) => void;
}

/**
 * Header קומפקט למובייל/טאבלט (מוסתר מ-lg ומעלה, שם ה-Sidebar הקבוע תופס
 * את מקומו). מציג את הלוגו (וריאציית compact: סמל + "מקפיאות") ולא את שם
 * האזור הפעיל, כדי שהמיתוג יקבל נוכחות קבועה גם במובייל; שם האזור הפעיל
 * עדיין מודגש ברשימת הניווט עצמה (NavList) בתוך המגירה.
 */
export default function MobileHeader({ onMenuClick, onNavigate }: MobileHeaderProps) {
  return (
    <header className="no-print sticky top-0 z-30 flex h-14 items-center justify-between border-b border-mist-200 bg-mist-100/90 px-3.5 backdrop-blur-md sm:h-16 sm:px-4 lg:hidden">
      <Logo variant="compact" onClick={() => onNavigate("roadmap")} />

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
