"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Trash2, EyeOff } from "lucide-react";
import LoadingState from "@/components/shared/LoadingState";
import EmptyState from "@/components/shared/EmptyState";
import ShareStoryForm from "./ShareStoryForm";

interface MyStory {
  id: string;
  title: string;
  storyText: string;
  personalTip: string | null;
  isAnonymous: boolean;
  displayName: string | null;
  ageRange: string | null;
  hmo: string | null;
  clinic: string | null;
  region: string | null;
  treatmentRoute: string | null;
  cyclesCount: number | null;
  retrievedCount: number | null;
  frozenCount: number | null;
  status: "pending" | "published" | "rejected" | "unpublished" | "removed";
  createdAt: string;
}

const STATUS_STYLES: Record<MyStory["status"], string> = {
  pending: "bg-warm-100 text-deep",
  published: "bg-teal-50 text-teal-700",
  rejected: "bg-mist-100 text-ink/50",
  unpublished: "bg-mist-100 text-ink/50",
  removed: "bg-mist-100 text-ink/50",
};

const STATUS_LABELS: Record<MyStory["status"], string> = {
  pending: "ממתין לאישור",
  published: "פורסם",
  rejected: "נדחה במודרציה",
  unpublished: "הוסר על ידך",
  removed: "הוסר ע\"י מנהלת",
};

/** "הסיפורים שלי" — כל הסטטוסים, רק של המשתמשת המחוברת (GET /api/stories/mine) */
export default function MyStoriesPanel() {
  const [stories, setStories] = useState<MyStory[] | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/stories/mine", { cache: "no-store" });
      if (!res.ok) {
        setStories([]);
        return;
      }
      const data = await res.json();
      setStories(Array.isArray(data.stories) ? data.stories : []);
    } catch {
      setStories([]);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleUnpublish = async (id: string) => {
    setBusyId(id);
    try {
      await fetch(`/api/stories/mine/${id}/unpublish`, { method: "POST" });
      await load();
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setBusyId(id);
    try {
      await fetch(`/api/stories/mine/${id}`, { method: "DELETE" });
      setConfirmingDeleteId(null);
      await load();
    } finally {
      setBusyId(null);
    }
  };

  if (stories === null) return <LoadingState label="טוענת את הסיפורים שלך..." />;

  if (stories.length === 0) {
    return <EmptyState variant="genuine" message="עדיין לא שיתפת סיפור. אפשר לשתף דרך הכפתור למעלה." />;
  }

  return (
    <div className="flex flex-col gap-3">
      {stories.map((story) => {
        if (editingId === story.id) {
          return (
            <div key={story.id} className="rounded-2xl border-2 border-teal-200 bg-teal-50/30 p-4 sm:p-5">
              <ShareStoryForm
                mode="edit"
                storyId={story.id}
                initialValues={{
                  isAnonymous: story.isAnonymous,
                  displayName: story.displayName ?? "",
                  title: story.title,
                  storyText: story.storyText,
                  personalTip: story.personalTip ?? "",
                  ageRange: story.ageRange ?? "",
                  hmo: story.hmo ?? "",
                  clinic: story.clinic ?? "",
                  region: story.region ?? "",
                  treatmentRoute: story.treatmentRoute ?? "",
                  cyclesCount: story.cyclesCount != null ? String(story.cyclesCount) : "",
                  retrievedCount: story.retrievedCount != null ? String(story.retrievedCount) : "",
                  frozenCount: story.frozenCount != null ? String(story.frozenCount) : "",
                }}
                onSuccess={() => {
                  setEditingId(null);
                  load();
                }}
                onCancel={() => setEditingId(null)}
              />
            </div>
          );
        }

        return (
          <div key={story.id} className="rounded-2xl border-2 border-mist-200 bg-white p-4 shadow-card sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="truncate text-sm font-bold text-ink">{story.title}</h3>
                <p className="mt-1 text-xs text-ink/50">{new Date(story.createdAt).toLocaleDateString("he-IL")}</p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${STATUS_STYLES[story.status]}`}
              >
                {STATUS_LABELS[story.status]}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setEditingId(story.id)}
                className="inline-flex items-center gap-1.5 rounded-full border-2 border-mist-300 bg-white px-3 py-1.5 text-xs font-semibold text-ink/70 transition-colors hover:border-teal-300 hover:text-teal-700"
              >
                <Pencil className="h-3.5 w-3.5" strokeWidth={2.25} />
                עריכה
              </button>

              {story.status === "published" && (
                <button
                  type="button"
                  onClick={() => handleUnpublish(story.id)}
                  disabled={busyId === story.id}
                  className="inline-flex items-center gap-1.5 rounded-full border-2 border-mist-300 bg-white px-3 py-1.5 text-xs font-semibold text-ink/70 transition-colors hover:border-warm-300 disabled:opacity-50"
                >
                  <EyeOff className="h-3.5 w-3.5" strokeWidth={2.25} />
                  הסרת פרסום
                </button>
              )}

              {confirmingDeleteId === story.id ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-mist-100 px-3 py-1.5 text-xs">
                  <span className="text-ink/60">למחוק לצמיתות?</span>
                  <button
                    type="button"
                    onClick={() => handleDelete(story.id)}
                    disabled={busyId === story.id}
                    className="font-bold text-deep hover:underline"
                  >
                    כן, מחקי
                  </button>
                  <button type="button" onClick={() => setConfirmingDeleteId(null)} className="text-ink/50 hover:underline">
                    ביטול
                  </button>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmingDeleteId(story.id)}
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-ink/40 transition-colors hover:text-deep"
                >
                  <Trash2 className="h-3.5 w-3.5" strokeWidth={2.25} />
                  מחיקה
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
