"use client";

import { journeySteps } from "@/data/steps";
import StepRow from "./StepRow";

interface StepListProps {
  /** מזהה השלב הפתוח כרגע, או null אם אף שלב לא פתוח — רק שלב אחד פתוח בכל רגע */
  openStepId: number | null;
  /** מפתחות "stepId:taskIndex" — אילו משימות בכל שלבי המסלול כבר סומנו */
  completedStepTasks: Set<string>;
  onToggleTask: (stepId: number, taskIndex: number) => void;
  onToggleExpand: (id: number) => void;
  setRowRef: (id: number, el: HTMLLIElement | null) => void;
  /** מפתח "stepId:taskIndex" של המשימה שיש להדגיש רגעית, או null — ראו StepRow.tsx */
  highlightedTaskKey?: string | null;
}

export default function StepList({
  openStepId,
  completedStepTasks,
  onToggleTask,
  onToggleExpand,
  setRowRef,
  highlightedTaskKey = null,
}: StepListProps) {
  // הצעד הראשון שאינו "אפשר במקביל" קובע היכן מסתיימת קבוצת השלבים
  // שאפשר להתקדם בהם זו לצד זו (כרגע שלבים 1–3).
  const firstNonParallel = journeySteps.findIndex((step) => !step.parallel);
  const groupEnd = firstNonParallel === -1 ? journeySteps.length : firstNonParallel;
  const parallelGroup = journeySteps.slice(0, groupEnd);
  const restSteps = journeySteps.slice(groupEnd);

  const renderRow = (step: (typeof journeySteps)[number], hideParallelBadge = false) => (
    <StepRow
      key={step.id}
      step={step}
      isExpanded={openStepId === step.id}
      completedStepTasks={completedStepTasks}
      onToggleTask={onToggleTask}
      onToggleExpand={onToggleExpand}
      setRowRef={setRowRef}
      hideParallelBadge={hideParallelBadge}
      highlightedTaskKey={highlightedTaskKey}
    />
  );

  return (
    <ol className="flex flex-col gap-2.5 sm:gap-3">
      {parallelGroup.length > 1 ? (
        <li>
          <div className="flex items-stretch gap-2 sm:gap-3">
            <ol className="flex min-w-0 flex-1 flex-col gap-2.5 sm:gap-3">
              {parallelGroup.map((step) => renderRow(step, true))}
            </ol>

            {/* קו שמחבר בצד שמאל בין השלבים שאפשר להתקדם בהם במקביל */}
            <div className="relative w-6 shrink-0 sm:w-7" aria-hidden="true">
              <div className="absolute inset-y-2 left-1/2 w-0.5 -translate-x-1/2 rounded-full bg-gradient-to-b from-teal-300 via-teal-400 to-teal-300" />
              <span className="absolute left-1/2 top-2 h-2 w-2 -translate-x-1/2 rounded-full bg-teal-400" />
              <span className="absolute bottom-2 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-teal-400" />
              <span className="absolute left-1/2 top-1/2 whitespace-nowrap rounded-full border border-teal-200 bg-teal-50 px-2.5 py-1 text-[11px] font-bold text-teal-700 shadow-sm [transform:translate(-50%,-50%)_rotate(-90deg)]">
                אפשר להתקדם במקביל
              </span>
            </div>
          </div>
        </li>
      ) : (
        parallelGroup.map((step) => renderRow(step))
      )}

      {restSteps.map((step) => renderRow(step))}
    </ol>
  );
}
