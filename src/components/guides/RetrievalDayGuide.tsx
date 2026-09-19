"use client";

import type { RefObject } from "react";
import { AlertTriangle, Info, X } from "lucide-react";
import {
  retrievalDayAfterCare,
  retrievalDayDrivingNote,
  retrievalDayFull,
  retrievalDayPackingClearLabel,
  retrievalDayPackingItems,
  retrievalDayTimeline,
  retrievalDayTips,
  retrievalDayTipsHeading,
} from "@/data/retrievalDayGuide";
import { useRetrievalDayChecklist } from "@/lib/useRetrievalDayChecklist";

interface RetrievalDayGuideProps {
  panelId: string;
  onClose: () => void;
  /** לגלילה עדינה לתחילת המדריך רק אם הוא אינו נראה בפועל (ראו GuidesSection.tsx) */
  titleRef: RefObject<HTMLHeadingElement>;
}

const CLOSE_BUTTON_CLASSES =
  "inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-bold text-teal-700 shadow-sm ring-1 ring-inset ring-mist-200 transition-colors hover:bg-teal-50";

/**
 * המדריך המלא "יום השאיבה" — נפתח כחלק רגיל מהעמוד מתחת לכרטיסייה
 * (RetrievalDayCard), לא כחלון/מודאל. בלי scroll hijacking ובלי גלילה
 * פנימית משלו: זו גלילת העמוד הרגילה, גם במובייל.
 */
export default function RetrievalDayGuide({ panelId, onClose, titleRef }: RetrievalDayGuideProps) {
  const { checked, toggle, clear } = useRetrievalDayChecklist();

  return (
    <div
      id={panelId}
      role="region"
      aria-label={retrievalDayFull.title}
      className="mt-4 animate-fadeUp rounded-[28px] border-2 border-mist-200 bg-white p-5 shadow-card motion-reduce:animate-none sm:mt-5 sm:p-7 lg:p-9"
    >
      <div className="flex justify-end">
        <button type="button" onClick={onClose} className={CLOSE_BUTTON_CLASSES}>
          <X className="h-4 w-4" strokeWidth={2.5} />
          {retrievalDayFull.closeLabel}
        </button>
      </div>

      <h3
        ref={titleRef}
        tabIndex={-1}
        className="mt-3 font-sans text-xl font-extrabold tracking-tight text-ink sm:text-2xl"
      >
        {retrievalDayFull.title}
      </h3>
      <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-ink/70 sm:text-base">
        {retrievalDayFull.intro}
      </p>

      <div className="mt-4 flex items-start gap-2.5 rounded-2xl border-2 border-warm-300/60 bg-warm-100/50 p-3.5 sm:mt-5 sm:p-4">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-deep" strokeWidth={2.25} aria-hidden="true" />
        <p className="text-sm leading-relaxed text-ink/75">
          <span className="font-bold text-ink">חשוב לפני הכל: </span>
          {retrievalDayFull.beforeAllNote}
        </p>
      </div>

      {/* חלק ראשון: ציר הזמן */}
      <section className="mt-6 sm:mt-8">
        <h4 className="font-sans text-lg font-bold tracking-tight text-ink sm:text-xl">
          היום שלך, שלב אחר שלב
        </h4>

        <ol className="relative mt-4 flex flex-col gap-5 sm:gap-6">
          <div
            aria-hidden="true"
            className="absolute bottom-5 right-5 top-5 w-0.5 rounded-full bg-gradient-to-b from-teal-200 via-teal-300 to-teal-200"
          />
          {retrievalDayTimeline.map((step) => (
            <li key={step.id} className="relative flex gap-3 sm:gap-4">
              <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-600 text-sm font-bold text-white shadow-sm">
                {step.id}
              </span>
              <div className="min-w-0 flex-1 pt-1.5">
                <h5 className="font-sans text-sm font-bold text-ink sm:text-base">{step.title}</h5>
                <p className="mt-1 text-sm leading-relaxed text-ink/70">{step.text}</p>
                {step.note && (
                  <p className="mt-1.5 text-xs leading-relaxed text-ink/50 sm:text-[13px]">{step.note}</p>
                )}
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-5 flex items-start gap-2.5 rounded-2xl border-2 border-warm-300/60 bg-warm-100/50 p-3.5 sm:p-4">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-deep" strokeWidth={2.25} aria-hidden="true" />
          <p className="text-sm leading-relaxed text-ink/75">{retrievalDayDrivingNote}</p>
        </div>
      </section>

      {/* חלק שני: רשימת ציוד */}
      <section className="mt-6 sm:mt-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="font-sans text-lg font-bold tracking-tight text-ink sm:text-xl">
            מה לקחת איתי?
          </h4>
          <button
            type="button"
            onClick={clear}
            className="text-sm font-medium text-ink/50 underline-offset-2 transition-colors hover:text-ink/70 hover:underline"
          >
            {retrievalDayPackingClearLabel}
          </button>
        </div>

        <ul className="mt-3 flex flex-col gap-2 rounded-2xl border-2 border-mist-200 bg-mist-50/60 p-3.5 sm:p-4">
          {retrievalDayPackingItems.map((item, index) => {
            const itemId = `retrieval-packing-${index}`;
            const isChecked = checked.has(index);
            return (
              <li key={itemId} className="flex items-center gap-2.5">
                <input
                  id={itemId}
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggle(index)}
                  className="h-4 w-4 shrink-0 cursor-pointer accent-teal-600"
                />
                <label
                  htmlFor={itemId}
                  className={`cursor-pointer text-sm leading-snug sm:text-[15px] ${
                    isChecked ? "text-ink/40 line-through" : "text-ink/80"
                  }`}
                >
                  {item}
                </label>
              </li>
            );
          })}
        </ul>
      </section>

      {/* חלק שלישי: דברים שהיית שמחה לדעת מראש */}
      <section className="mt-6 sm:mt-8">
        <h4 className="font-sans text-lg font-bold tracking-tight text-ink sm:text-xl">
          {retrievalDayTipsHeading}
        </h4>
        <div className="mt-3 grid gap-2.5 sm:grid-cols-2 sm:gap-3">
          {retrievalDayTips.map((tip) => (
            <div
              key={tip.title}
              className="rounded-2xl border-2 border-mist-200 bg-white p-3.5 shadow-card sm:p-4"
            >
              <p className="text-sm font-bold text-ink sm:text-[15px]">{tip.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink/65">{tip.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* חלק רביעי: אחרי השאיבה */}
      <section className="mt-6 sm:mt-8">
        <h4 className="font-sans text-lg font-bold tracking-tight text-ink sm:text-xl">
          {retrievalDayAfterCare.heading}
        </h4>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border-2 border-teal-200/70 bg-teal-50/40 p-4">
            <p className="text-sm font-bold text-ink sm:text-base">
              {retrievalDayAfterCare.normal.title}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink/70">
              {retrievalDayAfterCare.normal.text}
            </p>
          </div>

          {/* כרטיסיית האזהרה — גוון ורוד-אדמדם עדין אך ברור ורציני, בלי איור/אימוג׳י */}
          <div className="rounded-2xl border-2 border-red-200 bg-red-50/70 p-4">
            <p className="text-sm font-bold text-red-800 sm:text-base">
              {retrievalDayAfterCare.whenToCall.title}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-red-800/80">
              {retrievalDayAfterCare.whenToCall.text}
            </p>
          </div>
        </div>
      </section>

      <p className="mt-6 border-t border-mist-200 pt-4 text-xs leading-relaxed text-ink/50 sm:mt-8 sm:text-sm">
        {retrievalDayFull.closingNote}
      </p>

      <div className="mt-5 flex justify-center sm:mt-6">
        <button type="button" onClick={onClose} className={CLOSE_BUTTON_CLASSES}>
          <X className="h-4 w-4" strokeWidth={2.5} />
          {retrievalDayFull.closeLabel}
        </button>
      </div>
    </div>
  );
}
