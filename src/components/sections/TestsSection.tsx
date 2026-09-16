"use client";

import type { JourneyProgress } from "@/lib/useJourneyProgress";
import TestChecklist from "@/components/dashboard/TestChecklist";

interface TestsSectionProps {
  progress: JourneyProgress;
}

/** "הבדיקות שלי" — כל צ'קליסט הבדיקות הקיים (tests.ts), ללא שינוי בתוכן. */
export default function TestsSection({ progress }: TestsSectionProps) {
  const { doneTestsCount, totalTests } = progress;

  return (
    <div className="print-stack animate-fadeUp">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-sans text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            הבדיקות שלי
          </h1>
          <p className="mt-1.5 max-w-lg text-sm leading-relaxed text-ink/60 sm:text-base">
            צ׳קליסט הבדיקות שרוב היחידות מבקשות בשלב המקדים — סמני מה כבר בוצע.
          </p>
        </div>
        <span className="no-print inline-flex shrink-0 items-center rounded-full bg-teal-50 px-3.5 py-1.5 text-sm font-bold text-teal-700 ring-1 ring-inset ring-teal-100">
          {doneTestsCount} מתוך {totalTests} בדיקות הושלמו
        </span>
      </section>

      <section className="mt-6 sm:mt-8">
        <TestChecklist
          completedTests={progress.completedTests}
          onToggle={progress.toggleTest}
          completedTestSubItems={progress.completedTestSubItems}
          onToggleSubItem={progress.toggleTestSubItem}
          testDates={progress.testDates}
          onUpdateDate={progress.updateTestDate}
        />
      </section>
    </div>
  );
}
