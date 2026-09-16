import type { JourneyProgress } from "@/lib/useJourneyProgress";

interface ProgressCardProps {
  progress: JourneyProgress;
}

/**
 * כרטיס התקדמות קומפקטי לראש ה-Sidebar / ה-Drawer — אחוז השלבים שהושלמו
 * (מתוך 7 השלבים בלבד, לא כולל בדיקות, לפי הדרישה של „X מתוך 7 שלבים").
 */
export default function ProgressCard({ progress }: ProgressCardProps) {
  const { doneStepsCount, totalSteps } = progress;
  const stepsPercent = totalSteps === 0 ? 0 : Math.round((doneStepsCount / totalSteps) * 100);

  return (
    <div className="rounded-2xl border-2 border-mist-200 bg-white p-4 shadow-card">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-ink/50">ההתקדמות שלך</span>
        <span className="font-sans text-lg font-extrabold text-ink" dir="ltr">
          {stepsPercent}
          <span className="text-xs font-semibold text-ink/40">%</span>
        </span>
      </div>
      <div
        className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-mist-200"
        role="progressbar"
        aria-valuenow={stepsPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="אחוז שלבים שהושלמו"
      >
        <div
          className="h-full rounded-full bg-gradient-to-l from-teal-500 to-teal-400 transition-all duration-500"
          style={{ width: `${stepsPercent}%` }}
        />
      </div>
      <p className="mt-2 text-xs font-medium text-ink/60">
        {doneStepsCount} מתוך {totalSteps} שלבים הושלמו
      </p>
    </div>
  );
}
