import { Snowflake } from "lucide-react";
import type { JourneyProgress } from "@/lib/useJourneyProgress";
import type { SectionId } from "@/data/navSections";
import ProgressCard from "./ProgressCard";
import NavList from "./NavList";

interface SidebarProps {
  section: SectionId;
  progress: JourneyProgress;
  onNavigate: (id: SectionId) => void;
}

/** ה-Sidebar הקבוע בצד שמאל, גלוי רק מ-lg ומעלה. נשאר צמוד למסך בזמן גלילה. */
export default function Sidebar({ section, progress, onNavigate }: SidebarProps) {
  return (
    <aside
      className="no-print fixed inset-y-0 left-0 z-20 hidden w-[252px] flex-col gap-5 overflow-y-auto border-l border-mist-200 bg-white/95 px-4 py-5 backdrop-blur-sm lg:flex"
      aria-label="ניווט צדדי"
    >
      <div className="flex items-center gap-2.5 px-1 text-deep">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-600 text-white">
          <Snowflake className="h-4 w-4" strokeWidth={2.5} />
        </span>
        <span className="font-sans text-base font-extrabold leading-tight tracking-tight text-ink">
          המסע להקפאת ביציות
        </span>
      </div>

      <ProgressCard progress={progress} />

      <NavList activeSection={section} onNavigate={onNavigate} />
    </aside>
  );
}
