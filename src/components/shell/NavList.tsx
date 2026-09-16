"use client";

import { navSections, type SectionId } from "@/data/navSections";

interface NavListProps {
  activeSection: SectionId;
  onNavigate: (id: SectionId) => void;
  /** false כשהרשימה מוסתרת חזותית (למשל ה-Drawer סגור) — מוציא את הקישורים מסדר ה-Tab */
  focusable?: boolean;
}

/**
 * רשימת פריטי הניווט המשותפת ל-Sidebar (דסקטופ) ול-Drawer (מובייל).
 * כל פריט הוא <a href="#..."> אמיתי — כך שכפתורי Back/Forward של הדפדפן
 * וגם לחיצה ימנית/פתיחה בטאב חדש ממשיכים לעבוד כרגיל.
 */
export default function NavList({ activeSection, onNavigate, focusable = true }: NavListProps) {
  return (
    <nav aria-label="ניווט ראשי" className="flex flex-col gap-1">
      {navSections.map((item) => {
        const Icon = item.icon;
        const isActive = item.id === activeSection;
        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            aria-current={isActive ? "page" : undefined}
            tabIndex={focusable ? undefined : -1}
            onClick={() => onNavigate(item.id)}
            className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors duration-200 ${
              isActive
                ? "bg-teal-50 text-teal-800 ring-1 ring-inset ring-teal-100"
                : "text-ink/65 hover:bg-mist-100 hover:text-ink"
            }`}
          >
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors duration-200 ${
                isActive ? "bg-teal-600 text-white" : "bg-mist-100 text-deep"
              }`}
              aria-hidden="true"
            >
              <Icon className="h-4 w-4" strokeWidth={2} />
            </span>
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}
