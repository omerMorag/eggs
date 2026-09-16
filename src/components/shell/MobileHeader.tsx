"use client";

import { Menu, Snowflake } from "lucide-react";
import { navSections, type SectionId } from "@/data/navSections";

interface MobileHeaderProps {
  section: SectionId;
  onMenuClick: () => void;
}

/** Header קומפקט למובייל/טאבלט (מוסתר מ-lg ומעלה, שם ה-Sidebar הקבוע תופס את מקומו). */
export default function MobileHeader({ section, onMenuClick }: MobileHeaderProps) {
  const activeLabel = navSections.find((s) => s.id === section)?.label ?? "";

  return (
    <header className="no-print sticky top-0 z-30 flex h-14 items-center justify-between border-b border-mist-200 bg-mist-100/90 px-3.5 backdrop-blur-md sm:h-16 sm:px-4 lg:hidden">
      <div className="flex min-w-0 items-center gap-2 text-deep">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-600 text-white">
          <Snowflake className="h-4 w-4" strokeWidth={2.5} />
        </span>
        <span className="truncate font-sans text-sm font-bold text-ink">{activeLabel}</span>
      </div>

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
