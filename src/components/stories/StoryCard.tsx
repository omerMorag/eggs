"use client";

import { Calendar, MapPin, Repeat, User } from "lucide-react";
import type { PublicStoryListItem } from "./storyTypes";
import { TREATMENT_ROUTE_LABELS } from "./storyTypes";

function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("he-IL");
}

/**
 * כרטיס סיפור בפיד — אך ורק שדות ה-allow-list הציבורי (ר' storyTypes.ts):
 * כותרת, שם תצוגה/בעילום שם, טווח גיל, מספר סבבים, מסלול, מרפאה/אזור,
 * תקציר, תאריך פרסום, כפתור לקריאה. שום מזהה פנימי לא מגיע לרכיב הזה בכלל.
 */
export default function StoryCard({ story, onOpen }: { story: PublicStoryListItem; onOpen: () => void }) {
  const publishedLabel = formatDate(story.publishedAt);
  const routeLabel = story.treatmentRoute ? TREATMENT_ROUTE_LABELS[story.treatmentRoute] : null;

  return (
    <div className="flex flex-col rounded-2xl border-2 border-mist-200 bg-white p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-cardHover sm:p-6">
      <h3 className="text-base font-bold leading-snug text-ink sm:text-lg">{story.title}</h3>

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-ink/50">
        <span className="inline-flex items-center gap-1">
          <User className="h-3.5 w-3.5" strokeWidth={2.25} />
          {story.isAnonymous || !story.displayName ? "בעילום שם" : story.displayName}
        </span>
        {story.ageRange && <span>גיל {story.ageRange}</span>}
        {story.cyclesCount != null && (
          <span className="inline-flex items-center gap-1">
            <Repeat className="h-3.5 w-3.5" strokeWidth={2.25} />
            {story.cyclesCount} סבבים
          </span>
        )}
        {routeLabel && <span>{routeLabel}</span>}
        {(story.clinic || story.region) && (
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" strokeWidth={2.25} />
            {story.clinic || story.region}
          </span>
        )}
      </div>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/70">{story.summary}</p>

      <div className="mt-4 flex items-center justify-between gap-2">
        {publishedLabel && (
          <span className="inline-flex items-center gap-1 text-[11px] text-ink/40">
            <Calendar className="h-3 w-3" strokeWidth={2.25} />
            {publishedLabel}
          </span>
        )}
        <button
          type="button"
          onClick={onOpen}
          className="mr-auto rounded-full bg-teal-600 px-4 py-2 text-xs font-bold text-ink shadow-sm transition-colors hover:bg-teal-500"
        >
          לקריאת הסיפור
        </button>
      </div>
    </div>
  );
}
