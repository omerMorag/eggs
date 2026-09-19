"use client";

import { useCallback, useRef } from "react";
import { ArrowLeft, PartyPopper, Zap } from "lucide-react";
import type { JourneyProgress } from "@/lib/useJourneyProgress";
import StepList from "@/components/dashboard/StepList";
import PrintButton from "@/components/dashboard/PrintButton";
import ResetButton from "@/components/dashboard/ResetButton";
import HenIllustration from "@/components/hens/HenIllustration";
import CompletionCelebration from "@/components/completion/CompletionCelebration";
import ScrollToCompletionHint from "@/components/completion/ScrollToCompletionHint";

/** הודעה ל-aria-live="polite" כשכל 7 השלבים הושלמו — לא נשמרה מילה במילה
 *  בעקבות דחיסת השיחה; נוסחה כאן בהתאמה לדרישה (הכרזה נגישה על מסך הסיום
 *  שנוסף בהמשך העמוד), קל לעדכן אם צריך ניסוח אחר. */
const JOURNEY_COMPLETE_ANNOUNCEMENT =
  "כל הכבוד! השלמת את כל שלבי המסלול. מסך סיום מיוחד ממתין לך בהמשך העמוד.";

interface RoadmapSectionProps {
  progress: JourneyProgress;
  openStepId: number | null;
  onOpenStep: (id: number | null) => void;
}

/**
 * "המסלול שלי" — האזור שנפתח מיד אחרי המעבר ממסך הפתיחה (IntroScreen, ראו
 * AppShell.tsx). סדר התוכן: כרטיס קומפקטי "השלב הבא שלך" -> כותרת הצ'קליסט
 * (הכותרת/הכפתורים שהיו בעבר בראש העמוד) ורשימת השלבים. כרטיס ההיכרות
 * שהיה כאן בעבר (IntroCard) הוצא מהזרימה: ההיכרות עם האתר עברה במלואה
 * למסך הפתיחה הנפרד, כך שאין כפילות בין שני המסכים; קובץ IntroCard.tsx
 * עצמו נשאר בקוד בלי שימוש (בהתאם לתקדים הקיים בפרויקט של לא למחוק
 * רכיבים שהוחלפו). קבוצת השלבים המקבילים הראשונה (שלבים 1-2) כבר מסומנת
 * ע"י הקו המחבר + התגית "אפשר להתקדם במקביל" בתוך StepList עצמו, כך שאין
 * כרטיס הסבר נפרד אחריה. מקור התוכן: src/data/steps.ts.
 */
export default function RoadmapSection({ progress, openStepId, onOpenStep }: RoadmapSectionProps) {
  const rowRefs = useRef<Map<number, HTMLLIElement>>(new Map());

  const setRowRef = useCallback((id: number, el: HTMLLIElement | null) => {
    if (el) rowRefs.current.set(id, el);
    else rowRefs.current.delete(id);
  }, []);

  const toggleExpand = useCallback(
    (id: number) => {
      onOpenStep(openStepId === id ? null : id);
    },
    [openStepId, onOpenStep]
  );

  const openStepAndScroll = useCallback(
    (id: number) => {
      onOpenStep(id);
      requestAnimationFrame(() => {
        rowRefs.current.get(id)?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    },
    [onOpenStep]
  );

  const { nextStep, allStepsCompleted, hasAnyProgress, doneStepsCount, totalSteps } = progress;

  // מקור האמת היחיד לסיום המסלול: אותו allStepsCompleted קיים מ-useJourneyProgress
  // (doneStepsCount === totalSteps, 7 השלבים הראשיים בלבד — לא כולל בדיקות).
  // כינוי שם בלבד לצורך קריאות, בלי state/מנגנון התקדמות חדש.
  const isJourneyComplete = allStepsCompleted;

  return (
    <div className="print-stack">
      {/* הכרזה נגישה — אלמנט קבוע תמיד ב-DOM (לא מותנה-קיום), רק תוכנו
          מתחלף; אמין יותר לקוראי מסך מאשר להרכיב אזור aria-live שממלא
          תוכן כבר במעמד ההצגה הראשונה שלו */}
      <p className="sr-only" aria-live="polite">
        {isJourneyComplete ? JOURNEY_COMPLETE_ANNOUNCEMENT : ""}
      </p>
      {/* כרטיס "השלב הבא שלך" — קומפקטי בכוונה: זהו כעת האלמנט הראשון באזור
          המסלול (נכנסים אליו ישירות ממסך הפתיחה), ולכן לא מיועד "לדחוף" את
          הצ'קליסט רחוק מדי מטה */}
      <section className="relative animate-fadeUp overflow-hidden rounded-2xl border-2 border-warm-300/60 bg-warm-100/50 p-4 shadow-card sm:p-5">
        <div className="relative z-10 flex items-center gap-4">
          {allStepsCompleted ? (
            <div className="flex flex-1 items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-warm-500 shadow-sm ring-1 ring-warm-300/50">
                <PartyPopper className="h-4 w-4" strokeWidth={2} />
              </span>
              <div className="min-w-0">
                <h2 className="font-sans text-sm font-bold tracking-tight text-ink sm:text-base">
                  עשית את זה! סיימת את מסע הקפאת הביציות שלך 💛
                </h2>
                <p className="mt-0.5 text-xs leading-relaxed text-ink/60 sm:text-sm">
                  כל הכבוד — אפשר לעקוב אחרי הבדיקות והמידע הנוסף בתפריט הצד.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-1 flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-warm-500 shadow-sm ring-1 ring-warm-300/50">
                  {nextStep ? <nextStep.icon className="h-4 w-4" strokeWidth={2} /> : null}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-ink/50">השלב הבא שלך</p>
                  <h2 className="mt-0.5 truncate font-sans text-sm font-bold tracking-tight text-ink sm:text-base">
                    {nextStep?.title}
                  </h2>
                </div>
              </div>
              <button
                type="button"
                onClick={() => nextStep && openStepAndScroll(nextStep.id)}
                className="group inline-flex shrink-0 items-center gap-1.5 self-start rounded-full bg-white px-3.5 py-2 text-sm font-bold text-teal-700 shadow-sm ring-1 ring-warm-300/50 transition-colors hover:bg-teal-50 sm:self-center"
              >
                פתחי את השלב
                <ArrowLeft
                  className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
                  strokeWidth={2.5}
                />
              </button>
            </div>
          )}

          {/* התרנגולת עם מפת המסלול — קטנה ומוצמדת לצד בכרטיס הקומפקטי הזה */}
          <div className="hidden shrink-0 sm:block">
            <HenIllustration
              name={allStepsCompleted ? "step-trophy" : "roadmap"}
              sizeClassName="w-16 lg:w-20"
            />
          </div>
        </div>
      </section>

      {/* כותרת הצ'קליסט — הכותרת, תגית ההתקדמות וכפתורי ההדפסה/האיפוס שהיו
          בעבר בראש העמוד; עברו לכאן כדי לשמש ככותרת האזור של הצ'קליסט עצמו */}
      <section className="mt-6 animate-fadeUp flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2
            id="roadmap-title"
            className="font-sans text-xl font-extrabold tracking-tight text-ink sm:text-2xl"
          >
            המסלול האישי שלך
          </h2>
          <p className="mt-1.5 max-w-lg text-sm leading-relaxed text-ink/60 sm:text-base">
            כל מה שצריך לעשות, בסדר הנכון ובקצב שלך.
          </p>
        </div>
        <div className="no-print flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-teal-50 px-3.5 py-1.5 text-sm font-bold text-teal-700 ring-1 ring-inset ring-teal-100">
            {doneStepsCount} מתוך {totalSteps} שלבים הושלמו
          </span>
          <PrintButton />
          {hasAnyProgress && <ResetButton onReset={progress.reset} />}
        </div>
      </section>

      {/* צ'קליסט השלבים */}
      <section className="mt-4 sm:mt-5" aria-label="צ׳קליסט תהליך הקפאת הביציות">
        <div className="mb-3 flex items-center gap-2 sm:mb-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-warm-500 shadow-sm ring-1 ring-warm-300/50">
            <Zap className="h-4 w-4" strokeWidth={2} />
          </span>
          <h3 className="font-sans text-lg font-bold tracking-tight text-ink sm:text-xl">
            צ׳קליסט תהליך הקפאת הביציות
          </h3>
        </div>
        <StepList
          completedSteps={progress.completedSteps}
          openStepId={openStepId}
          onToggleDone={progress.toggleStep}
          onToggleExpand={toggleExpand}
          setRowRef={setRowRef}
        />
      </section>

      {/* מסך הסיום החגיגי — רק כשכל 7 השלבים הושלמו. mount/unmount מותנה
          (לא רק הסתרה ב-CSS) בכוונה: אם משתמשת מבטלת סימון שלב אחרי
          שסיימה, המסך והרמז נעלמים; אם היא משלימה שוב, ה-unmount/mount
          המלא מאפס גם את מצב האנימציה הפנימי (useCelebrationTrigger),
          כך שהרצף החגיגי יתנגן מחדש מההתחלה — נשקל כרצוי, לא כתקלה. */}
      {isJourneyComplete && <ScrollToCompletionHint />}
      {isJourneyComplete && <CompletionCelebration />}
    </div>
  );
}
