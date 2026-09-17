import { keyFacts } from "@/data/chanceContent";

/**
 * "שלושה דברים שחשוב לזכור" — שלושה כרטיסים קצרים (לא פסקאות ארוכות), אחד
 * לכל עובדה מרכזית על אופן החישוב. הנתונים עצמם (keyFacts) כבר היו קיימים
 * ב-chanceContent.ts; זהו הרכיב הראשון שמציג אותם בפועל בעמוד.
 */
export default function KeyFactsGrid() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {keyFacts.map((fact) => (
        <div
          key={fact.title}
          className="rounded-2xl border-2 border-mist-200 bg-white p-4 shadow-card sm:p-5"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-teal-100 bg-teal-50 text-deep">
            <fact.icon className="h-[18px] w-[18px]" strokeWidth={2} />
          </span>
          <h3 className="mt-3 font-sans text-sm font-bold tracking-tight text-ink sm:text-base">
            {fact.title}
          </h3>
          <p className="mt-1.5 text-xs leading-relaxed text-ink/65 sm:text-sm">
            {fact.description}
          </p>
        </div>
      ))}
    </div>
  );
}
