"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { journeySteps } from "@/data/steps";
import type { JourneyProgress } from "@/lib/useJourneyProgress";
import HenIllustration, { STEP_HEN } from "@/components/hens/HenIllustration";

/** אותם שני קבצים בדיוק כמו ב-CompletionCelebration.tsx (לא נוצר איור חדש):
 *  התרנגולת הקיצית (בגד ים, משקפי שמש, גביע) עם גיבוי לתרנגולת החורפית
 *  הקיימת אם הקובץ הקיצי עוד לא הועלה בפועל. */
const WINTER_HEN_SRC = "/brand/hen-full.png";
const SUMMER_HEN_SRC = "/images/hens/hen-completion-summer.png";
const SUMMER_HEN_ALT = "תרנגולת חוגגת את סיום מסלול הקפאת הביציות עם בגד ים וגביע";

interface NextActionCardProps {
  progress: JourneyProgress;
  /** לוחצים על ה-CTA הראשי -> גוללים לשלב, פותחים אותו ומדגישים את המשימה
   *  הרלוונטית (מומש ב-RoadmapSection.tsx, כדי שגם rowRefs וגם ה-state של
   *  ה-highlight יישארו שם, ליד שאר הלוגיקה של רשימת השלבים). */
  onGoToAction: (stepId: number, taskIndex: number) => void;
}

/**
 * "הדבר הבא שלך" — כרטיס ה-Next Action הדינמי בראש "המסלול שלי". מציג בכל
 * רגע את הפעולה הספציפית הבאה (לא רק "באיזה שלב"), נגזרת אך ורק מ-
 * progress.nextAction (derived מ-completedStepTasks ב-useJourneyProgress.ts
 * — אין כאן שום state ידני משלה). כשה-Next Action null (כל תתי-המשימות
 * בכל השלבים מסומנות) מוצג מצב סיום קומפקטי עם אותה תרנגולת קיצית
 * שמשמשת גם את מסך הסיום המלא (CompletionCelebration.tsx) — לא הועתק/שוכפל
 * הטקסט/האנימציה של אותו מסך, רק אותו איור, כדי שהכרטיס הקומפקטי הזה
 * והחוויה החגיגית המלאה בהמשך העמוד ירגישו כמו חלק מאותה שפה חזותית.
 */
export default function NextActionCard({ progress, onGoToAction }: NextActionCardProps) {
  const { nextAction, allStepsCompleted, doneStepTasksCount } = progress;
  const [summerSrc, setSummerSrc] = useState(SUMMER_HEN_SRC);

  // "מתחילה כאן" מוצג רק כשלא סומן שום דבר בכל המסלול (משתמשת חדשה
  // לגמרי) — גם משנה את נוסח ה-CTA הראשי וגם משמיט את ה-CTA המשני (למדריך),
  // כדי שהרגע הראשון יישאר כפתור בודד ופשוט אחד, לא עמוס.
  const isFreshStart = doneStepTasksCount === 0;
  const stepIcon = nextAction
    ? journeySteps.find((step) => step.id === nextAction.stepId)?.icon
    : undefined;
  const StepIcon = stepIcon;
  // אותה תרנגולת בדיוק שמופיעה בכרטיס השלב הזה ברשימת "המסלול שלי"
  // (STEP_HEN, מיפוי מרכזי ב-HenIllustration.tsx) — כך התרנגולת כאן תמיד
  // תואמת לשלב שה-Next Action שייך אליו בפועל, ולא קבועה לאייקון אחד גנרי.
  // "roadmap" (התרנגולת המקורית שהייתה כאן) נשארת רק כגיבוי לשלב עתידי
  // שעדיין לא קיבל תרנגולת ייעודית משלו.
  const nextActionHen = (nextAction ? STEP_HEN[nextAction.stepId] : undefined) ?? "roadmap";

  return (
    <section className="relative animate-fadeUp overflow-hidden rounded-2xl border-2 border-warm-300/60 bg-warm-100/50 p-4 shadow-card sm:p-6">
      <div className="relative z-10 flex items-center gap-4">
        {allStepsCompleted ? (
          <div className="flex flex-1 items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={summerSrc}
              alt={SUMMER_HEN_ALT}
              onError={() => setSummerSrc(WINTER_HEN_SRC)}
              className="h-14 w-14 shrink-0 object-contain sm:h-16 sm:w-16"
              style={{ filter: "drop-shadow(0 8px 14px rgba(36, 22, 25, 0.12))" }}
            />
            <div className="min-w-0">
              <h2 className="font-sans text-sm font-bold tracking-tight text-ink sm:text-base">
                עשית את זה! סיימת את מסע הקפאת הביציות שלך 💛
              </h2>
              <p className="mt-0.5 text-xs leading-relaxed text-ink/60 sm:text-sm">
                כל הכבוד — אפשר לעקוב אחרי הבדיקות והמידע הנוסף בתפריט הצד.
              </p>
            </div>
          </div>
        ) : nextAction ? (
          <div className="flex flex-1 items-start gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-warm-500 shadow-sm ring-1 ring-warm-300/50">
              {StepIcon ? <StepIcon className="h-4 w-4" strokeWidth={2} /> : null}
            </span>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-ink/50">הדבר הבא שלך</p>
              <h2 className="mt-0.5 font-sans text-lg font-extrabold leading-snug tracking-tight text-ink sm:text-xl">
                {nextAction.actionLabel}
              </h2>
              <p className="mt-1.5 text-xs font-medium text-ink/55 sm:text-sm">
                שלב {nextAction.stepId} · {nextAction.shortLabel} · {nextAction.doneInStep} מתוך{" "}
                {nextAction.totalInStep} הושלמו
              </p>
              <div className="mt-2 h-1.5 w-full max-w-[200px] overflow-hidden rounded-full bg-white/70">
                <div
                  className="h-full rounded-full bg-gradient-to-l from-teal-500 to-teal-400 transition-all duration-500"
                  style={{
                    width: `${Math.round((nextAction.doneInStep / nextAction.totalInStep) * 100)}%`,
                  }}
                />
              </div>

              <div className="mt-3.5 flex flex-col gap-2 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={() => onGoToAction(nextAction.stepId, nextAction.taskIndex)}
                  className="group inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-teal-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 sm:w-auto"
                >
                  {isFreshStart ? "מתחילה כאן" : "להמשך"}
                  <ArrowLeft
                    className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
                    strokeWidth={2.5}
                  />
                </button>

                {nextAction.readMoreHref && !isFreshStart && (
                  <a
                    href={nextAction.readMoreHref}
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-teal-700 shadow-sm ring-1 ring-inset ring-warm-300/50 transition-colors hover:bg-teal-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 sm:w-auto"
                  >
                    {nextAction.readMoreLabel ?? "קרא עוד"}
                    <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </a>
                )}
              </div>
            </div>
          </div>
        ) : null}

        {!allStepsCompleted && (
          <div className="hidden shrink-0 self-center sm:block">
            <HenIllustration name={nextActionHen} sizeClassName="w-16 lg:w-20" />
          </div>
        )}
      </div>
    </section>
  );
}
