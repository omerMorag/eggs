"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import type { JourneyProgress } from "@/lib/useJourneyProgress";
import type { SectionId } from "@/data/navSections";
import FloatingPortal from "@/components/shared/FloatingPortal";
import Logo from "@/components/brand/Logo";
import ProgressCard from "./ProgressCard";
import NavList from "./NavList";
import AuthControl from "./AuthControl";
import AdminNavLink from "./AdminNavLink";
import AboutLink from "./AboutLink";

interface MobileDrawerProps {
  open: boolean;
  section: SectionId;
  progress: JourneyProgress;
  onNavigate: (id: SectionId) => void;
  onClose: () => void;
  /** לחיצה על הלוגו מחזירה למסך הפתיחה (לא רק לאזור "המסלול שלי") */
  onGoHome: () => void;
}

/**
 * תפריט הצד הנשלף למובייל — נפתח מצד שמאל, מציג את אותו Progress ואותם
 * קישורי ניווט של ה-Sidebar בדסקטופ. מרונדר תמיד ל-document.body דרך
 * FloatingPortal הקיים באתר (ראו התיעוד שם על stacking context / באג
 * תזמון ה-mount) — לכן ה-<FloatingPortal> עצמו נשאר מורכב תמיד, ורק
 * ה-classes (opacity / translate-x) משתנים לפי open.
 */
export default function MobileDrawer({
  open,
  section,
  progress,
  onNavigate,
  onClose,
  onGoHome,
}: MobileDrawerProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  return (
    <FloatingPortal>
      <div
        className={`no-print fixed inset-0 z-50 lg:hidden ${open ? "" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        {/* רקע כהה */}
        <div
          onClick={onClose}
          aria-hidden="true"
          className={`absolute inset-0 bg-ink/40 transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* הפאנל עצמו */}
        <div
          role="dialog"
          aria-modal="true"
          aria-label="תפריט ניווט"
          className={`absolute inset-y-0 left-0 flex w-[280px] max-w-[85vw] flex-col gap-5 overflow-y-auto bg-white px-4 py-5 shadow-cardHover transition-transform duration-300 ease-out ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between gap-2 px-1">
            <Logo
              variant="compact"
              tabIndex={open ? 0 : -1}
              onClick={() => {
                onGoHome();
                onClose();
              }}
            />
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              tabIndex={open ? 0 : -1}
              aria-label="סגירת תפריט"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink/60 transition-colors hover:bg-mist-100"
            >
              <X className="h-5 w-5" strokeWidth={2.25} />
            </button>
          </div>

          <AuthControl />

          <ProgressCard progress={progress} />

          <NavList
            activeSection={section}
            focusable={open}
            onNavigate={(id) => {
              onNavigate(id);
              onClose();
            }}
          />

          <AdminNavLink
            activeSection={section}
            focusable={open}
            onNavigate={(id) => {
              onNavigate(id);
              onClose();
            }}
          />

          <div className="mt-auto border-t border-mist-200 pt-2">
            <AboutLink
              focusable={open}
              onClick={() => {
                onGoHome();
                onClose();
              }}
            />
          </div>
        </div>
      </div>
    </FloatingPortal>
  );
}
