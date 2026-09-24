"use client";

import { ChevronDown, ExternalLink, FileText, PlayCircle } from "lucide-react";
import { GUIDES_CHECKED_AT, MOH_DRUG_INDEX_URL, injectionGuides, type InjectionGuide } from "@/data/injectionGuides";

interface GuidesLibraryProps {
  /** מדריכים של תרופות שהוזנו ביומן — מוצגים ראשונים */
  myGuideIds: string[];
  openGuideId: string | null;
  onToggleGuide: (id: string) => void;
  showAll: boolean;
  onToggleShowAll: () => void;
}

/**
 * "איך מזריקים?" — ספריית מדריכים שמטרתה לזהות את התכשיר ולהגיע להוראות
 * הרשמיות. אין כאן הוראות הכנה, הזרקה, אחסון או מינון. כפתור סרטון מוצג רק
 * כשנמצא סרטון רשמי שמתאים לאותו תכשיר (ר' injectionGuides.ts).
 */
export default function GuidesLibrary({ myGuideIds, openGuideId, onToggleGuide, showAll, onToggleShowAll }: GuidesLibraryProps) {
  const mine = myGuideIds
    .map((id) => injectionGuides.find((g) => g.id === id))
    .filter((g): g is InjectionGuide => !!g);
  const rest = injectionGuides.filter((g) => !myGuideIds.includes(g.id));

  return (
    <section id="injection-guides" aria-labelledby="guides-title" className="scroll-mt-24 lg:scroll-mt-8" data-testid="guides-library">
      <h2 id="guides-title" className="font-sans text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
        איך מזריקים?
      </h2>
      <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-ink/65">
        כאן אפשר לזהות את התכשיר שקיבלת ולהגיע לעלון הרשמי שלו. את ההכנה, ההזרקה והאחסון עושים לפי העלון ולפי
        ההדרכה ביחידה. שאלה על שינוי בהנחיות או על זריקה שלא בוצעה בזמן — פני ליחידה המטפלת.
      </p>

      {mine.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-bold text-teal-700">התרופות שלך</h3>
          <div className="mt-2 space-y-2.5">
            {mine.map((g) => (
              <GuideCard key={g.id} guide={g} open={openGuideId === g.id} onToggle={() => onToggleGuide(g.id)} />
            ))}
          </div>
        </div>
      )}

      <div className="mt-4">
        {mine.length > 0 ? (
          <button
            type="button"
            onClick={onToggleShowAll}
            aria-expanded={showAll}
            aria-controls="all-guides"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-ink/70 hover:text-ink"
          >
            <ChevronDown className={`h-4 w-4 transition-transform ${showAll ? "rotate-180" : ""}`} strokeWidth={2.5} />
            כל המדריכים
          </button>
        ) : (
          <h3 className="text-sm font-bold text-ink/70">כל המדריכים</h3>
        )}
        <div id="all-guides" hidden={mine.length > 0 && !showAll} className="mt-2 space-y-2.5">
          {rest.map((g) => (
            <GuideCard key={g.id} guide={g} open={openGuideId === g.id} onToggle={() => onToggleGuide(g.id)} />
          ))}
        </div>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-ink/55">
        קישורי העלונים נבדקו ב־{GUIDES_CHECKED_AT} מול מאגר התרופות של משרד הבריאות. עלון עדכני יותר, או עלון לתכשיר
        שלא מופיע כאן, אפשר למצוא ב
        <a href={MOH_DRUG_INDEX_URL} target="_blank" rel="noreferrer" className="font-semibold text-teal-700 hover:underline">
          מאגר התרופות של משרד הבריאות
        </a>
        .
      </p>
    </section>
  );
}

function GuideCard({ guide, open, onToggle }: { guide: InjectionGuide; open: boolean; onToggle: () => void }) {
  const panelId = `guide-panel-${guide.id}`;
  return (
    <div id={`guide-${guide.id}`} className="scroll-mt-24 rounded-2xl border-2 border-mist-200 bg-white lg:scroll-mt-8" data-testid="guide-card" data-guide={guide.id}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-right"
      >
        <span className="min-w-0">
          <span className="block font-bold text-ink">
            {guide.name} <span className="font-semibold text-ink/55">({guide.latinName})</span>
          </span>
          <span className="block text-xs text-ink/60">{guide.form}</span>
        </span>
        <ChevronDown className={`h-5 w-5 shrink-0 text-ink/50 transition-transform ${open ? "rotate-180" : ""}`} strokeWidth={2.25} />
      </button>
      <div id={panelId} hidden={!open} className="space-y-3 border-t border-mist-100 px-4 pb-4 pt-3 text-sm text-ink/75">
        <dl className="grid gap-1.5 sm:grid-cols-[8rem_1fr]">
          <dt className="font-semibold text-ink/55">חומר פעיל</dt>
          <dd>{guide.activeIngredient}</dd>
          <dt className="font-semibold text-ink/55">צורת התכשיר</dt>
          <dd>{guide.form}</dd>
          {guide.strengths && (
            <>
              <dt className="font-semibold text-ink/55">חוזקים לפי העלון</dt>
              <dd>
                <bdi dir="ltr">{guide.strengths}</bdi> (לזיהוי האריזה בלבד — המינון שלך נקבע ביחידה)
              </dd>
            </>
          )}
        </dl>

        <div className="flex flex-col gap-2">
          <a
            href={guide.leaflet.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-start gap-2 rounded-xl bg-teal-50 px-3 py-2 font-semibold text-teal-700 hover:bg-teal-100"
          >
            <FileText className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />
            <span>
              {guide.leaflet.label}
              {guide.leaflet.detail && <span className="block text-xs font-normal text-ink/60">{guide.leaflet.detail}</span>}
            </span>
          </a>
          {guide.videos.map((v) => (
            <a
              key={v.url}
              href={v.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-start gap-2 rounded-xl bg-mist-50 px-3 py-2 font-semibold text-ink hover:bg-mist-100"
            >
              <PlayCircle className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" strokeWidth={2} aria-hidden="true" />
              <span>
                {v.label}
                {v.detail && <span className="block text-xs font-normal text-ink/60">{v.detail}</span>}
              </span>
            </a>
          ))}
          {guide.extraSources.map((s) => (
            <a key={s.url} href={s.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:underline">
              {s.label}
              {s.detail ? ` (${s.detail})` : ""}
              <ExternalLink className="h-3 w-3" strokeWidth={2.5} aria-hidden="true" />
            </a>
          ))}
        </div>

        <p className="text-xs leading-relaxed text-ink/55">
          מקור: מאגר התרופות של משרד הבריאות{guide.extraSources.length ? " ו-EMA" : ""}
          {guide.videos.length ? "; סרטון: אתר היצרן בישראל" : ""}. נבדק ב־{GUIDES_CHECKED_AT}.
          {guide.missing ? ` ${guide.missing}` : ""}
        </p>
      </div>
    </div>
  );
}
