"use client";

import { ChevronDown } from "lucide-react";
import { retrievalDayCard } from "@/data/retrievalDayGuide";
import HenIllustration from "@/components/hens/HenIllustration";

interface RetrievalDayCardProps {
  open: boolean;
  onToggle: () => void;
  /** מזהה הפאנל המורחב (RetrievalDayGuide), לצורך aria-controls */
  panelId: string;
}

/**
 * הכרטיסייה הראשית והבולטת באזור "מידע ומדריכים" — רחבה ומרווחת יותר
 * מכרטיס מידע רגיל (EpilogueCard), בשפה העיצובית הקיימת (פינות מעוגלות,
 * גבולות וצללים עדינים) אך בגוון ייעודי שמשלב מנטה/ורוד/שמנת יחד, כדי
 * שתבלוט כ"כניסה" למדריך מלא ולא רק עוד כרטיס Accordion ברשימה.
 *
 * סדר ב-DOM (טקסט ואז איור) נשמר קבוע כדי ש-RTL עם flex-row רגיל (לא
 * -reverse) יציג את הטקסט מימין ואת האיור משמאל בדסקטופ, בדיוק כמו בשאר
 * כותרות האזורים באתר (TestsSection/RoadmapSection וכו'). הסדר במובייל
 * הפוך במפורש (איור למעלה, טקסט מתחת) — לכן class-י order- הפוכים לילדים,
 * ו-lg:order-none מבטל אותם ומחזיר לסדר ה-DOM הרגיל מ-lg ומעלה.
 */
export default function RetrievalDayCard({ open, onToggle, panelId }: RetrievalDayCardProps) {
  return (
    <section className="overflow-hidden rounded-[28px] border-2 border-warm-300/50 bg-gradient-to-br from-warm-100/50 via-white to-teal-50/40 p-5 shadow-card sm:p-7 lg:p-9">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between lg:gap-10">
        <div className="order-2 min-w-0 flex-1 lg:order-none">
          <span className="eyebrow">{retrievalDayCard.eyebrow}</span>

          <h2 className="mt-2 font-sans text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            {retrievalDayCard.title}
          </h2>

          <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-ink/70 sm:text-base">
            {retrievalDayCard.description}
          </p>

          <ul className="mt-4 flex flex-col gap-1.5 sm:mt-5 sm:flex-row sm:flex-wrap sm:gap-2">
            {retrievalDayCard.tags.map((tag) => (
              <li
                key={tag}
                className="inline-flex w-fit items-center rounded-full bg-white/80 px-3 py-1.5 text-xs font-semibold text-ink/70 ring-1 ring-inset ring-mist-200 sm:text-sm"
              >
                {tag}
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={onToggle}
            aria-expanded={open}
            aria-controls={panelId}
            className="group mt-5 inline-flex items-center gap-2 rounded-full bg-teal-600 px-6 py-3 text-sm font-bold tracking-wide text-ink shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-500 hover:shadow-cardHover active:translate-y-0 sm:mt-6"
          >
            {retrievalDayCard.ctaLabel}
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-300 motion-reduce:transition-none ${
                open ? "rotate-180" : ""
              }`}
              strokeWidth={2.5}
            />
          </button>
        </div>

        <div className="order-1 mb-1 flex justify-center lg:order-none lg:mb-0 lg:shrink-0 lg:justify-end">
          <HenIllustration name="retrieval-day-bag" blob="mint" />
        </div>
      </div>
    </section>
  );
}
