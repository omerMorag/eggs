"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Zap } from "lucide-react";
import { missingStepTaskKeys, type JourneyProgress } from "@/lib/useJourneyProgress";
import StepList from "@/components/dashboard/StepList";
import NextActionCard from "@/components/dashboard/NextActionCard";
import PrintButton from "@/components/dashboard/PrintButton";
import ResetButton from "@/components/dashboard/ResetButton";
import JourneyFinale from "@/components/completion/JourneyFinale";

/** כמה זמן ההדגשה העדינה של המשימה נשארת דלוקה אחרי לחיצה על CTA "להמשך"
 *  ב-NextActionCard, לפני שהיא נעלמת מעצמה. */
const TASK_HIGHLIGHT_MS = 1800;
/** ההשהיה בין פתיחת/גלילה לכרטיס השלב לבין הגלילה המדויקת + ההדגשה של
 *  תת-המשימה עצמה בתוכו — צריכה להיות ארוכה מספיק כדי שאנימציית הפתיחה
 *  (StepRow: transition-all duration-300) תספיק להתקדם ולתת לתא של
 *  המשימה מיקום יציב על המסך לפני שגוללים אליו בפעם השנייה. */
const SCROLL_TO_TASK_DELAY_MS = 340;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    !!window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

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
  // מפתח "stepId:taskIndex" של המשימה שמודגשת רגעית אחרי לחיצה על ה-CTA
  // הראשי ב-NextActionCard, או null כשאין הדגשה פעילה כרגע. state נפרד
  // מ-progress בכוונה: זו הדגשה ויזואלית זמנית גרידא, לא חלק מהתקדמות
  // המשתמשת ולא צריכה להישמר/להסתנכרן.
  const [highlightedTaskKey, setHighlightedTaskKey] = useState<string | null>(null);
  const highlightTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (highlightTimeoutRef.current) clearTimeout(highlightTimeoutRef.current);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

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

  /** CTA הראשי של NextActionCard ("להמשך" / "מתחילה כאן"): גוללת+פותחת את
   *  כרטיס השלב מיד, ואז — אחרי שאנימציית הפתיחה מספיקה להתקדם — גוללת
   *  שוב במדויק לשורת תת-המשימה הרלוונטית בתוכו ומדגישה אותה רגעית. לא
   *  אנימציה חזקה: highlight עדין (background+ring, ראו StepRow.tsx) שדועך
   *  לבד; מכבד prefers-reduced-motion גם בסוג הגלילה (auto במקום smooth)
   *  וגם ב-transition של ההדגשה עצמה (motion-reduce:transition-none). */
  const goToNextAction = useCallback(
    (stepId: number, taskIndex: number) => {
      const behavior: ScrollBehavior = prefersReducedMotion() ? "auto" : "smooth";
      onOpenStep(stepId);

      requestAnimationFrame(() => {
        rowRefs.current.get(stepId)?.scrollIntoView({ behavior, block: "center" });
      });

      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      if (highlightTimeoutRef.current) clearTimeout(highlightTimeoutRef.current);

      scrollTimeoutRef.current = setTimeout(() => {
        const taskRow = document.getElementById(`step-task-row-${stepId}-${taskIndex}`);
        taskRow?.scrollIntoView({ behavior, block: "center" });
        setHighlightedTaskKey(`${stepId}:${taskIndex}`);
        highlightTimeoutRef.current = setTimeout(() => {
          setHighlightedTaskKey(null);
        }, TASK_HIGHLIGHT_MS);
      }, SCROLL_TO_TASK_DELAY_MS);
    },
    [onOpenStep]
  );

  const { allStepsCompleted, hasAnyProgress, doneStepTasksCount, totalStepTasksCount } = progress;

  // רגע הסיום מתנגן רק בעקבות סימון ידני של המשימה האחרונה שחסרה במסלול —
  // לא בטעינת העמוד, לא בסנכרון מהענן ולא מבחירת יחידה ב"איפה כדאי לעשות?".
  // לא נשמר בשום מקום: בביקור חוזר המקטע מוצג עם תמונת הסיום בלבד.
  // finaleRun משמש גם כ-key, כך שסימון-מחדש אחרי ביטול מתחיל רצף חדש.
  const [finaleRun, setFinaleRun] = useState(0);
  const { completedStepTasks, toggleStepTask } = progress;
  const handleToggleTask = useCallback(
    (stepId: number, taskIndex: number) => {
      const key = `${stepId}:${taskIndex}`;
      if (!completedStepTasks.has(key)) {
        const missing = missingStepTaskKeys(completedStepTasks);
        if (missing.length === 1 && missing[0] === key) setFinaleRun((n) => n + 1);
      }
      toggleStepTask(stepId, taskIndex);
    },
    [completedStepTasks, toggleStepTask]
  );

  // מקור האמת היחיד לסיום המסלול: אותו allStepsCompleted קיים מ-useJourneyProgress
  // (doneStepsCount === totalSteps, 7 השלבים הראשיים בלבד — לא כולל בדיקות).
  // כינוי שם בלבד לצורך קריאות, בלי state/מנגנון התקדמות חדש.
  const isJourneyComplete = allStepsCompleted;

  // מסלול שכבר אינו מושלם (ביטול סימון) — מאפסים, כדי שהשלמה בדרך אחרת
  // (סנכרון, בחירת יחידה) לא "תירש" רצף חגיגי ישן
  useEffect(() => {
    if (!isJourneyComplete) setFinaleRun(0);
  }, [isJourneyComplete]);

  return (
    <div className="print-stack">
      {/* הכרזה נגישה — אלמנט קבוע תמיד ב-DOM (לא מותנה-קיום), רק תוכנו
          מתחלף; אמין יותר לקוראי מסך מאשר להרכיב אזור aria-live שממלא
          תוכן כבר במעמד ההצגה הראשונה שלו */}
      <p className="sr-only" aria-live="polite">
        {isJourneyComplete ? JOURNEY_COMPLETE_ANNOUNCEMENT : ""}
      </p>
      {/* כרטיס "הדבר הבא שלך" (NextActionCard) — Next Action דינמי, נגזר
          מ-progress.nextAction בלבד (ראו useJourneyProgress.ts). קומפקטי
          בכוונה: זהו כעת האלמנט הראשון באזור המסלול (נכנסים אליו ישירות
          ממסך הפתיחה), ולכן לא מיועד "לדחוף" את הצ'קליסט רחוק מדי מטה. */}
      <NextActionCard progress={progress} onGoToAction={goToNextAction} />

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
          {/* progress הכללי של המסלול מבוסס על סך המשימות שסומנו בכל השלבים
              (Roadmap 2.0), לא רק על מספר השלבים שהושלמו במלואם — כך
              "3 מתוך 6 הושלמו" בתוך כל שלב מצטבר לתמונה אמיתית של כמה
              עשית מתוך המסלול כולו, גם כשאף שלב עדיין לא סומן כהושלם. */}
          <span className="inline-flex items-center rounded-full bg-teal-50 px-3.5 py-1.5 text-sm font-bold text-teal-700 ring-1 ring-inset ring-teal-100">
            {doneStepTasksCount} מתוך {totalStepTasksCount} משימות הושלמו
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
          openStepId={openStepId}
          completedStepTasks={progress.completedStepTasks}
          onToggleTask={handleToggleTask}
          onToggleExpand={toggleExpand}
          setRowRef={setRowRef}
          highlightedTaskKey={highlightedTaskKey}
        />
      </section>

      {/* רגע הסיום — רק כשכל משימות המסלול מסומנות (mount/unmount מותנה:
          ביטול סימון מסתיר אותו מיד). celebrate רק אחרי סימון ידני של המשימה
          האחרונה בביקור הנוכחי; אחרת — תמונת הסיום בלבד, בלי גלילה וסרטון.
          (CompletionCelebration/ScrollToCompletionHint הקודמים נשארו בקוד
          בלי שימוש.) */}
      {isJourneyComplete && <JourneyFinale key={finaleRun} celebrate={finaleRun > 0} />}
    </div>
  );
}
