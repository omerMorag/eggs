"use client";

import { X } from "lucide-react";
import FloatingPortal from "@/components/shared/FloatingPortal";
import LoadingState from "@/components/shared/LoadingState";
import ReportContentButton from "./ReportContentButton";
import { HMO_LABELS, TREATMENT_ROUTE_LABELS, type PublicStoryDetail } from "./storyTypes";

interface StoryDetailViewProps {
  /** null = סגור. הרכיב עצמו (וה-FloatingPortal שעוטף אותו) חייב להישאר
   *  mounted תמיד — הנראות נשלטת רק ע"י CSS, לא ע"י mount/unmount מותנה
   *  (ר' התיעוד ב-useFloatingPosition.ts על הבאג הזה). */
  story: PublicStoryDetail | null;
  loading: boolean;
  onClose: () => void;
}

function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("he-IL");
}

export default function StoryDetailView({ story, loading, onClose }: StoryDetailViewProps) {
  const open = loading || story !== null;

  return (
    <FloatingPortal>
      <div
        className={`fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/40 p-4 backdrop-blur-sm transition-opacity duration-200 sm:items-center ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      >
        <div
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
          className="my-8 w-full max-w-xl rounded-2xl border-2 border-mist-200 bg-white p-5 shadow-cardHover sm:p-7"
        >
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-lg font-bold leading-snug text-ink sm:text-xl">{story?.title ?? ""}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="סגירה"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink/40 transition-colors hover:bg-mist-100 hover:text-ink/70"
            >
              <X className="h-4 w-4" strokeWidth={2.5} />
            </button>
          </div>

          {loading && !story ? (
            <div className="mt-4">
              <LoadingState label="טוענת את הסיפור..." />
            </div>
          ) : story ? (
            <>
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs font-medium text-ink/50">
                <span>{story.isAnonymous || !story.displayName ? "בעילום שם" : story.displayName}</span>
                {story.ageRange && <span>גיל {story.ageRange}</span>}
                {story.cyclesCount != null && <span>{story.cyclesCount} סבבים</span>}
                {story.treatmentRoute && <span>{TREATMENT_ROUTE_LABELS[story.treatmentRoute]}</span>}
                {story.hmo && <span>{HMO_LABELS[story.hmo]}</span>}
                {(story.clinic || story.region) && <span>{story.clinic || story.region}</span>}
                {story.retrievedCount != null && <span>{story.retrievedCount} ביציות נשאבו</span>}
                {story.frozenCount != null && <span>{story.frozenCount} ביציות הוקפאו</span>}
                {formatDate(story.publishedAt) && <span>פורסם {formatDate(story.publishedAt)}</span>}
              </div>

              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-ink/80">{story.storyText}</p>

              {story.personalTip && (
                <div className="mt-4 rounded-xl border-2 border-warm-300 bg-warm-100/40 p-4">
                  <p className="text-xs font-bold text-ink/60">הטיפ שהיא הייתה נותנת למי שמתחילה עכשיו</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink/75">{story.personalTip}</p>
                </div>
              )}

              <div className="mt-5 border-t border-mist-100 pt-3">
                <ReportContentButton storyId={story.id} />
              </div>
            </>
          ) : null}
        </div>
      </div>
    </FloatingPortal>
  );
}
