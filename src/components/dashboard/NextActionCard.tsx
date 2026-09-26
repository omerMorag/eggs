"use client";

import { ArrowLeft } from "lucide-react";
import type { JourneyProgress } from "@/lib/useJourneyProgress";

interface NextActionCardProps {
  progress: JourneyProgress;
  /** לוחצים על הקישור "למשימה" -> גוללים לשלב, פותחים אותו ומדגישים את
   *  המשימה הרלוונטית, בלי לסמן אותה (מומש ב-RoadmapSection.tsx: goToNextAction). */
  onGoToAction: (stepId: number, taskIndex: number) => void;
}

/**
 * "הדבר הבא שלך" — שורה קטנה ושקטה מתחת לכותרת "המסלול האישי שלך"
 * (RoadmapSection.tsx), לא כרטיס גדול/בולט כמו קודם: תווית, שם המשימה,
 * שיוך לשלב, וקישור טקסט "למשימה" (לא כפתור CTA מלא). נגזרת אך ורק מ-
 * progress.nextAction (derived מ-completedStepTasks ב-useJourneyProgress.ts
 * — אין כאן שום state ידני משלה, ולכן היא מתעדכנת אוטומטית אחרי כל
 * סימון/ביטול סימון של משימה, בלי לוגיקה נוספת).
 *
 * בכוונה בלי שום חלונית/הודעה שקופצת אוטומטית עם כל התקדמות — המשתמשת
 * ממשיכה במסלול ברצף, והשורה הזו רק "מחכה" בשקט מתחת לכותרת.
 *
 * כש-nextAction הוא null (allStepsCompleted — כל תתי-המשימות בכל השלבים
 * מסומנות) הרכיב לא מרנדר כלום: מסך הסיום החגיגי + רמז הגלילה אליו
 * (CompletionCelebration/ScrollToCompletionHint, בהמשך RoadmapSection.tsx)
 * כבר מכסים את המצב הזה, כדי לא להציג שתי הודעות סיום כפולות.
 */
export default function NextActionCard({ progress, onGoToAction }: NextActionCardProps) {
  const { nextAction } = progress;

  if (!nextAction) return null;

  return (
    <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm sm:mt-4">
      <span className="font-semibold text-ink/45">הדבר הבא שלך:</span>
      <span className="font-bold text-ink">{nextAction.actionLabel}</span>
      <span className="text-xs text-ink/40 sm:text-sm">
        שלב {nextAction.stepId} · {nextAction.shortLabel}
      </span>
      <button
        type="button"
        onClick={() => onGoToAction(nextAction.stepId, nextAction.taskIndex)}
        className="group inline-flex items-center gap-1 font-semibold text-teal-700 transition-colors hover:text-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
      >
        למשימה
        <ArrowLeft
          className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1"
          strokeWidth={2.5}
        />
      </button>
    </div>
  );
}
