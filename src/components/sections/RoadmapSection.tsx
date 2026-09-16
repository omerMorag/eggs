"use client";

import { useCallback, useRef } from "react";
import { ArrowLeft, PartyPopper, Zap } from "lucide-react";
import type { JourneyProgress } from "@/lib/useJourneyProgress";
import StepList from "@/components/dashboard/StepList";
import PrintButton from "@/components/dashboard/PrintButton";
import ResetButton from "@/components/dashboard/ResetButton";
import TimeSaverSection from "@/components/dashboard/TimeSaverSection";

interface RoadmapSectionProps {
  progress: JourneyProgress;
  openStepId: number | null;
  onOpenStep: (id: number | null) => void;
}

/**
 * "המסלול שלי" — המסך הראשון שנפתח באתר. כרטיס "השלב הבא שלך" + הצ'קליסט
 * המלא של שבעת השלבים (מקור התוכן: src/data/steps.ts, זהה למה שהיה
 * בעבר בעמוד /dashboard — לא שוכפל, רק הועבר לכאן).
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

  const { nextStep, allStepsCompleted, doneStepsCount, totalSteps } = progress;

  return (
    <div className="print-stack">
      {/* כותרת האזור */}
      <section className="animate-fadeUp flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-sans text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            המסלול האישי שלך
          </h1>
          <p className="mt-1.5 max-w-lg text-sm leading-relaxed text-ink/60 sm:text-base">
            כל מה שצריך לעשות, בסדר הנכון ובקצב שלך.
          </p>
        </div>
        <div className="no-print flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-teal-50 px-3.5 py-1.5 text-sm font-bold text-teal-700 ring-1 ring-inset ring-teal-100">
            {doneStepsCount} מתוך {totalSteps} שלבים הושלמו
          </span>
          <PrintButton />
          {progress.hasAnyProgress && <ResetButton onReset={progress.reset} />}
        </div>
      </section>

      {/* כרטיס "השלב הבא שלך" */}
      <section className="mt-5 animate-fadeUp rounded-2xl border-2 border-warm-300/60 bg-warm-100/50 p-5 shadow-card sm:mt-6 sm:p-6">
        {allStepsCompleted ? (
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-warm-500 shadow-sm ring-1 ring-warm-300/50">
              <PartyPopper className="h-5 w-5" strokeWidth={2} />
            </span>
            <div>
              <h2 className="font-sans text-base font-bold tracking-tight text-ink sm:text-lg">
                כל השלבים סומנו כהושלמו!
              </h2>
              <p className="mt-0.5 text-sm leading-relaxed text-ink/60">
                כל הכבוד — אפשר לעקוב אחרי הבדיקות והמידע הנוסף בתפריט הצד.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-warm-500 shadow-sm ring-1 ring-warm-300/50">
                {nextStep ? <nextStep.icon className="h-5 w-5" strokeWidth={2} /> : null}
              </span>
              <div>
                <p className="text-xs font-semibold text-ink/50">השלב הבא שלך</p>
                <h2 className="mt-0.5 font-sans text-base font-bold tracking-tight text-ink sm:text-lg">
                  {nextStep?.title}
                </h2>
                <p className="mt-1 max-w-md text-sm leading-relaxed text-ink/65">
                  {nextStep?.shortDescription}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => nextStep && openStepAndScroll(nextStep.id)}
              className="group inline-flex shrink-0 items-center gap-1.5 self-start rounded-full bg-white px-4 py-2.5 text-sm font-bold text-teal-700 shadow-sm ring-1 ring-warm-300/50 transition-colors hover:bg-teal-50 sm:self-center"
            >
              פתחי את השלב
              <ArrowLeft
                className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
                strokeWidth={2.5}
              />
            </button>
          </div>
        )}
      </section>

      {/* חוסכות זמן */}
      <section className="no-print mt-5 sm:mt-6">
        <TimeSaverSection />
      </section>

      {/* צ'קליסט השלבים */}
      <section className="mt-6 sm:mt-8" aria-label="צ׳קליסט תהליך הקפאת הביציות">
        <div className="mb-3 flex items-center gap-2 sm:mb-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-warm-500 shadow-sm ring-1 ring-warm-300/50">
            <Zap className="h-4 w-4" strokeWidth={2} />
          </span>
          <h2 className="font-sans text-lg font-bold tracking-tight text-ink sm:text-xl">
            צ׳קליסט תהליך הקפאת הביציות
          </h2>
        </div>
        <StepList
          completedSteps={progress.completedSteps}
          openStepId={openStepId}
          onToggleDone={progress.toggleStep}
          onToggleExpand={toggleExpand}
          setRowRef={setRowRef}
        />
      </section>
    </div>
  );
}
