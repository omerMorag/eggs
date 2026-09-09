"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { LayoutDashboard, ListChecks, FlaskConical, Snowflake } from "lucide-react";
import { useJourneyProgress } from "@/lib/useJourneyProgress";
import { epilogueItems } from "@/data/epilogue";
import EpilogueCard from "@/components/shared/EpilogueCard";
import DashboardNav from "@/components/dashboard/DashboardNav";
import PrintButton from "@/components/dashboard/PrintButton";
import ResetButton from "@/components/dashboard/ResetButton";
import SummaryCards from "@/components/dashboard/SummaryCards";
import TimeSaverSection from "@/components/dashboard/TimeSaverSection";
import StepList from "@/components/dashboard/StepList";
import SectionHeading from "@/components/dashboard/SectionHeading";
import TestChecklist from "@/components/dashboard/TestChecklist";
import DisclaimerFooter from "@/components/DisclaimerFooter";

export default function DashboardPage() {
  const progress = useJourneyProgress();
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set());
  const rowRefs = useRef<Map<number, HTMLLIElement>>(new Map());

  const setRowRef = useCallback((id: number, el: HTMLLIElement | null) => {
    if (el) rowRefs.current.set(id, el);
    else rowRefs.current.delete(id);
  }, []);

  const toggleExpand = useCallback((id: number) => {
    setExpandedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const openStep = useCallback((id: number) => {
    setExpandedSteps((prev) => new Set(prev).add(id));
    requestAnimationFrame(() => {
      rowRefs.current.get(id)?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }, []);

  return (
    <main className="min-h-screen">
      {/* פס עליון דביק */}
      <div className="no-print sticky top-0 z-20 border-b border-mist-200 bg-mist-100/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center justify-between gap-3 sm:justify-start">
            <div className="flex items-center gap-2.5 text-deep">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-white">
                <Snowflake className="h-4 w-4" strokeWidth={2.5} />
              </span>
              <span className="hidden font-sans text-base font-extrabold tracking-tight text-ink sm:inline">
                המסע להקפאת ביציות
              </span>
            </div>
            <DashboardNav />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <PrintButton />
            {progress.hasAnyProgress && <ResetButton onReset={progress.reset} />}
          </div>
        </div>
      </div>

      <div id="overview" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-8 sm:px-6 sm:py-10">
        {/* כותרת */}
        <section className="animate-fadeUp">
          <span className="eyebrow">הלוח האישי שלך</span>
          <h1 className="mt-2 font-sans text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            הקפאת ביציות, פשוט לדעת מה עכשיו.
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink/60 sm:text-base">
            כל השלבים, הבדיקות והדברים שאפשר לקדם במקביל — במקום אחד מסודר.
          </p>
        </section>

        {/* כרטיסי סיכום */}
        <section className="mt-6 sm:mt-8">
          <SummaryCards progress={progress} onOpenNextStep={openStep} />
        </section>

        {/* חוסכות זמן */}
        <section className="mt-6 sm:mt-8">
          <TimeSaverSection />
        </section>

        {/* המסלול האישי + צ'קליסט בדיקות, זו לצד זו */}
        <div className="print-stack mt-10 grid grid-cols-1 gap-10 sm:mt-14 lg:grid-cols-[1.7fr_1fr] lg:items-start lg:gap-8">
          {/* המסלול האישי */}
          <section id="steps" className="scroll-mt-20">
            <SectionHeading
              icon={ListChecks}
              title="המסלול האישי שלך"
              subtitle="שבעה שלבים — סמני, פתחי למידע נוסף, והתקדמי בקצב שלך"
            />
            <StepList
              completedSteps={progress.completedSteps}
              expandedSteps={expandedSteps}
              onToggleDone={progress.toggleStep}
              onToggleExpand={toggleExpand}
              setRowRef={setRowRef}
            />

            <div className="mt-6 flex flex-col gap-4 sm:mt-8">
              {epilogueItems.map((item) => (
                <EpilogueCard key={item.title} {...item} />
              ))}
            </div>
          </section>

          {/* צ'קליסט בדיקות */}
          <section id="tests" className="scroll-mt-20 lg:sticky lg:top-24">
            <SectionHeading
              icon={FlaskConical}
              title="צ׳קליסט בדיקות נפוצות"
              subtitle="בדיקות שרוב היחידות מבקשות בשלב המקדים"
            />
            <TestChecklist completedTests={progress.completedTests} onToggle={progress.toggleTest} />
          </section>
        </div>

        {/* קישור חזרה למפת הדרך */}
        <section className="no-print mt-12 flex justify-center sm:mt-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-ink/50 transition-colors hover:text-teal-700"
          >
            <LayoutDashboard className="h-4 w-4" strokeWidth={2} />
            חזרה למפת הדרך המלאה
          </Link>
        </section>
      </div>

      <DisclaimerFooter />
    </main>
  );
}
