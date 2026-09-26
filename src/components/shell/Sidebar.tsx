import type { JourneyProgress } from "@/lib/useJourneyProgress";
import type { SectionId } from "@/data/navSections";
import Logo from "@/components/brand/Logo";
import ProgressCard from "./ProgressCard";
import NavList from "./NavList";
import AuthControl from "./AuthControl";
import AdminNavLink from "./AdminNavLink";
import AboutLink from "./AboutLink";

interface SidebarProps {
  section: SectionId;
  progress: JourneyProgress;
  onNavigate: (id: SectionId) => void;
  /** לחיצה על הלוגו — גוללת לכותרת "המסלול האישי שלך", בלי לאפס את מסך
   *  הפתיחה/ההתקדמות (ר' AppShell.tsx: handleLogoClick) */
  onLogoClick: () => void;
  /** לחיצה על "להכיר את מקפיאות" (AboutLink) — מחזירה למסך הפתיחה */
  onGoHome: () => void;
}

/** ה-Sidebar הקבוע בצד שמאל, גלוי רק מ-lg ומעלה. נשאר צמוד למסך בזמן גלילה. */
export default function Sidebar({ section, progress, onNavigate, onLogoClick, onGoHome }: SidebarProps) {
  return (
    <aside
      className="no-print fixed inset-y-0 left-0 z-20 hidden w-[252px] flex-col gap-5 overflow-y-auto border-l border-mist-200 bg-white/95 px-4 py-5 backdrop-blur-sm lg:flex"
      aria-label="ניווט צדדי"
    >
      <div className="px-1 pb-1 pt-1">
        <Logo variant="full" onClick={onLogoClick} />
      </div>

      <div className="mt-1 border-t border-mist-200" />

      <AuthControl />

      <ProgressCard progress={progress} />

      <NavList activeSection={section} onNavigate={onNavigate} />

      <AdminNavLink activeSection={section} onNavigate={onNavigate} />

      <div className="mt-auto border-t border-mist-200 pt-2">
        <AboutLink onClick={onGoHome} />
      </div>
    </aside>
  );
}
