"use client";

import { useCallback, useRef } from "react";
import { ArrowLeft, PartyPopper, Zap } from "lucide-react";
import type { JourneyProgress } from "@/lib/useJourneyProgress";
import { journeySteps } from "@/data/steps";
import StepList from "@/components/dashboard/StepList";
import PrintButton from "@/components/dashboard/PrintButton";
import ResetButton from "@/components/dashboard/ResetButton";
import HenIllustration from "@/components/hens/HenIllustration";
import IntroCard from "./IntroCard";

interface RoadmapSectionProps {
  progress: JourneyProgress;
  openStepId: number | null;
  onOpenStep: (id: number | null) => void;
}

/**
 * "המסלול שלי" — המסך הראשון שנפתח באתר. סדר התוכן: כרטיס היכרות קצר
 * (IntroCard) -> כרטיס "השלב הבא שלך" -> כותרת הצ'קליסט (הכותרת/הכפתורים
 * שהיו בעבר בראש העמוד, שהוזזה לכאן) ורשימת השלבים. קבוצת השלבים המקבילים
 * הראשונה (שלבים 1-2) כבר מסומנת ע"י הקו המחבר + התגית "אפשר להתקדם במקביל"
 * בתוך StepList עצמו, כך שאין כרטיס הסבר נפרד אחריה (הוסר לפי בקשה — היה
 * כפול). מקור התוכן: src/data/steps.ts, זהה למה שהיה בעבר בעמוד /dashboard —
 * לא שוכפל, רק הועבר והוזז.
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

  // יעד הגלילה של כפתור ההיכרות: השלב הבא שטרם הושלם, או השלב הראשון אם
  // עדיין לא סומן כלום; אם כל השלבים כבר הושלמו (nextStep הוא null), חוזרים
  // לשלב הראשון לצפייה חוזרת, בלי ליצור מצב שבור.
  const introTargetStepId = nextStep?.id ?? journeySteps[0]?.id;
  const introCtaLabel = hasAnyProgress ? "ממשיכה מהמקום שלי" : "מתחילה מהשלב הראשון";

  return (
    <div className="print-stack">
      {/* כרטיס היכרות קצר — מסביר מהו האתר, איך הוא עוזר ומאיפה מתחילים */}
      <IntroCard
        ctaLabel={introCtaLabel}
        onCtaClick={() => introTargetStepId !== undefined && openStepAndScroll(introTargetStepId)}
      />

      {/* כרטיס "השלב הבא שלך" */}
      <section className="relative mt-5 animate-fadeUp overflow-hidden rounded-2xl border-2 border-warm-300/60 bg-warm-100/50 p-5 shadow-card sm:mt-6 sm:p-6">
        <div className="relative z-10 lg:flex lg:items-center lg:justify-between lg:gap-6">
          <div className="min-w-0 flex-1">
            {allStepsCompleted ? (
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-warm-500 shadow-sm ring-1 ring-warm-300/50">
                  <PartyPopper className="h-5 w-5" strokeWidth={2} />
                </span>
                <div>
                  <h2 className="font-sans text-base font-bold tracking-tight text-ink sm:text-lg">
                    עשית את זה! סיימת את מסע הקפאת הביציות שלך 💛
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
          </div>

          {/* התרנגולת עם מפת המסלול — מחליפה את איור הפרח העדין שהיה כאן; מלווה
              את תחושת ההתקדמות, לא מסמנת סיום (זו שמורה לתרנגולת עם הגביע,
              שתתווסף בעתיד רק אחרי שלב השאיבה) */}
          <div className="mt-4 flex justify-center lg:mt-0 lg:shrink-0 lg:justify-end">
            <HenIllustration
              name={allStepsCompleted ? "step-trophy" : "roadmap"}
              sizeClassName="w-36 sm:w-40 lg:w-56"
            />
          </div>
        </div>
      </section>

      {/* כותרת הצ'קליסט — הכותרת, תגית ההתקדמות וכפתורי ההדפסה/האיפוס שהיו
          בעבר בראש העמוד; עברו לכאן כדי לשמש ככותרת האזור של הצ'קליסט עצמו */}
      <section className="mt-6 animate-fadeUp flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-sans text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
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
          renderAfterStep={(stepId) =>
            stepId === 4 ? (
              <div className="flex items-center gap-3 rounded-2xl border-2 border-teal-200 bg-teal-50/50 p-3.5 sm:gap-4 sm:p-4">
                <HenIllustration
                  name="consultation"
                  blob="pink"
                  sizeClassName="w-20 sm:w-24 lg:w-32"
                  className="shrink-0"
                />
                <p className="text-sm leading-relaxed text-ink/70">
                  לקראת הפגישה, כדאי לרכז מראש את השאלות שחשוב לך לשאול — יש כמה דוגמאות
                  ב״מידע נוסף״ של השלב הזה.
                </p>
              </div>
            ) : null
          }
        />
      </section>
    </div>
  );
}
