"use client";

import { useState } from "react";
import { BookOpen, Clock, Pencil, Plus, Stethoscope, Trash2 } from "lucide-react";
import { injectionGuides } from "@/data/injectionGuides";
import {
  addMed,
  dayNumber,
  deleteMed,
  formatDateLong,
  getDay,
  nowHHMM,
  setMedDone,
  setMedDoneTime,
  updateMed,
  withDay,
  type JournalCycle,
  type MedEntry,
} from "@/lib/injectionJournal";
import MedForm from "./MedForm";
import MonitoringForm, { MonitoringView } from "./MonitoringForm";
import { VideoButton } from "./GuidesLibrary";

interface DayPanelProps {
  cycle: JournalCycle;
  date: string;
  today: string;
  onUpdateCycle: (update: (c: JournalCycle) => JournalCycle) => void;
  onOpenGuide: (guideId: string | null) => void;
  /** "today" = האזור המרכזי "היום שלי"; "journal" = כרטיס יום ביומן */
  variant: "today" | "journal";
}

export function dayLabel(cycle: JournalCycle, date: string): string {
  const n = dayNumber(cycle, date);
  if (n >= 1) return `יום ${n} לזריקות`;
  const until = 1 - n;
  return until === 1 ? "הסבב מתחיל מחר" : `הסבב מתחיל בעוד ${until} ימים`;
}

/**
 * יום אחד ביומן: התרופות שתוכננו, מה בוצע בפועל, הערות, ותוצאות מעקב — רק
 * אם סומן שהיה מעקב ביום הזה. יום בלי בדיקה לא מוצג כ"חסר מידע".
 */
export default function DayPanel({ cycle, date, today, onUpdateCycle, onOpenGuide, variant }: DayPanelProps) {
  const day = getDay(cycle, date);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingMonitoring, setEditingMonitoring] = useState(false);
  const isToday = date === today;
  const sortedMeds = [...day.meds].sort((a, b) => (a.plannedTime ?? "99").localeCompare(b.plannedTime ?? "99"));

  return (
    <div data-testid={variant === "today" ? "today-panel" : "day-card"} data-date={date}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <div>
          <p className="text-lg font-extrabold text-ink sm:text-xl">
            {dayLabel(cycle, date)}
            {isToday && variant === "journal" && (
              <span className="mr-2 rounded-full bg-teal-100 px-2 py-0.5 align-middle text-[11px] font-bold text-teal-700">היום</span>
            )}
          </p>
          <p className="text-sm text-ink/60">{formatDateLong(date)}</p>
        </div>
      </div>

      {/* תרופות */}
      <div className="mt-3 space-y-2.5">
        {sortedMeds.length === 0 && !adding && (
          <p className="rounded-xl bg-mist-50 px-3.5 py-3 text-sm text-ink/60">
            עוד לא הוזנו זריקות ליום הזה. אפשר להוסיף לפי ההנחיות שקיבלת.
          </p>
        )}
        {sortedMeds.map((med) =>
          editingId === med.id ? (
            <MedForm
              key={med.id}
              initial={med}
              onCancel={() => setEditingId(null)}
              onSave={(draft, { applyToFuture }) => {
                onUpdateCycle((c) => updateMed(c, date, med.id, draft, applyToFuture));
                setEditingId(null);
              }}
            />
          ) : (
            <MedRow
              key={med.id}
              med={med}
              onToggleDone={(done) => onUpdateCycle((c) => setMedDone(c, date, med.id, done, done ? nowHHMM() : undefined))}
              onDoneTime={(t) => onUpdateCycle((c) => setMedDoneTime(c, date, med.id, t))}
              onEdit={() => setEditingId(med.id)}
              onDelete={() => onUpdateCycle((c) => deleteMed(c, date, med.id))}
              onOpenGuide={() => onOpenGuide(med.guideId ?? null)}
            />
          )
        )}
        {adding ? (
          <MedForm
            onCancel={() => setAdding(false)}
            onSave={(draft, { extraDays }) => {
              onUpdateCycle((c) => addMed(c, date, draft, extraDays));
              setAdding(false);
            }}
          />
        ) : (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full bg-white px-4 text-sm font-semibold text-teal-700 ring-1 ring-inset ring-teal-200 hover:bg-teal-50"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            הוספת תרופה ליום הזה
          </button>
        )}
      </div>

      {/* מעקב */}
      <div className="mt-4 rounded-xl bg-mist-50/80 p-3.5">
        <label className="flex items-start gap-2 text-sm text-ink/80">
          <input
            type="checkbox"
            checked={!!day.hadCheckup}
            disabled={!!day.monitoring}
            onChange={(e) => onUpdateCycle((c) => withDay(c, date, (d) => ({ ...d, hadCheckup: e.target.checked || undefined })))}
            className="mt-0.5 h-4 w-4 accent-teal-600 disabled:opacity-50"
          />
          <span>
            <Stethoscope className="ml-1 inline h-4 w-4 text-teal-700" strokeWidth={2} aria-hidden="true" />
            היה לי מעקב ביום הזה (בדיקת דם / אולטרסאונד)
          </span>
        </label>
        {day.hadCheckup && (
          <div className="mt-3">
            {editingMonitoring ? (
              <MonitoringForm
                initial={day.monitoring}
                onCancel={() => setEditingMonitoring(false)}
                onSave={(result) => {
                  onUpdateCycle((c) => withDay(c, date, (d) => ({ ...d, monitoring: result })));
                  setEditingMonitoring(false);
                }}
              />
            ) : day.monitoring ? (
              <div>
                <MonitoringView result={day.monitoring} />
                <div className="mt-2 flex flex-wrap gap-3">
                  <button type="button" onClick={() => setEditingMonitoring(true)} className="text-xs font-semibold text-teal-700 hover:underline">
                    עריכת תוצאות המעקב
                  </button>
                  <ConfirmButton
                    label="מחיקת תוצאות המעקב"
                    onConfirm={() => onUpdateCycle((c) => withDay(c, date, (d) => ({ ...d, monitoring: undefined })))}
                  />
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setEditingMonitoring(true)}
                className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full bg-teal-600 px-4 text-sm font-bold text-ink hover:bg-teal-500"
              >
                <Plus className="h-4 w-4" strokeWidth={2.5} />
                הוסיפי תוצאות מעקב
              </button>
            )}
          </div>
        )}
      </div>

      <DayNote
        value={day.note ?? ""}
        onSave={(note) => onUpdateCycle((c) => withDay(c, date, (d) => ({ ...d, note: note.trim() || undefined })))}
      />
    </div>
  );
}

function MedRow({
  med,
  onToggleDone,
  onDoneTime,
  onEdit,
  onDelete,
  onOpenGuide,
}: {
  med: MedEntry;
  onToggleDone: (done: boolean) => void;
  onDoneTime: (t: string) => void;
  onEdit: () => void;
  onDelete: () => void;
  onOpenGuide: () => void;
}) {
  const guide = med.guideId ? injectionGuides.find((g) => g.id === med.guideId) : undefined;
  return (
    <div
      className={`rounded-xl border-2 p-3 sm:p-3.5 ${med.done ? "border-teal-100 bg-teal-50/50" : "border-mist-200 bg-white"}`}
      data-testid="med-row"
      data-med={med.name}
    >
      <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
        <div className="min-w-0">
          <p className="font-bold text-ink">
            {med.name}
            {med.kind === "oneTime" && (
              <span className="mr-2 rounded-full bg-deep/15 px-2 py-0.5 align-middle text-[11px] font-bold text-ink/80">חד-פעמית</span>
            )}
          </p>
          {med.form && <p className="text-xs text-ink/55">{med.form}</p>}
        </div>
        <p className="text-sm font-semibold text-ink" data-testid="med-dose">
          {med.dose ? (
            <bdi dir="ltr" className="whitespace-nowrap">
              {med.dose}
              {med.unit ? ` ${med.unit}` : ""}
            </bdi>
          ) : (
            <span className="font-normal text-ink/45">מינון לא הוזן</span>
          )}
        </p>
      </div>

      <p className="mt-1.5 flex items-center gap-1 text-xs text-ink/65">
        <Clock className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
        {med.plannedTime
          ? med.kind === "oneTime"
            ? `השעה המדויקת שנמסרה: ${med.plannedTime}`
            : `שעה מתוכננת: ${med.plannedTime}`
          : "לא הוזנה שעה"}
      </p>

      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
        <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-ink">
          <input type="checkbox" checked={med.done} onChange={(e) => onToggleDone(e.target.checked)} className="h-5 w-5 accent-teal-600" />
          הזרקתי
        </label>
        {med.done && (
          <label className="inline-flex items-center gap-1.5 text-xs text-ink/65">
            בשעה
            <input
              type="time"
              value={med.doneTime ?? ""}
              onChange={(e) => onDoneTime(e.target.value)}
              className="rounded-lg border border-mist-200 bg-white px-2 py-1 text-sm"
              dir="ltr"
              aria-label={`שעת הזרקה בפועל — ${med.name}`}
            />
          </label>
        )}
      </div>

      {med.note && <p className="mt-2 whitespace-pre-line rounded-lg bg-mist-50 px-2.5 py-1.5 text-xs text-ink/70">{med.note}</p>}

      <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-mist-100 pt-2">
        {guide?.videos[0] && <VideoButton url={guide.videos[0].url} label="סרטון הזרקה" detail={guide.videos[0].detail} size="sm" />}
        <button type="button" onClick={onOpenGuide} className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:underline">
          <BookOpen className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
          {guide ? "עלון" : "איך מזריקים? (כל המדריכים)"}
        </button>
        <button type="button" onClick={onEdit} className="inline-flex items-center gap-1 text-xs font-semibold text-ink/60 hover:text-ink">
          <Pencil className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
          עריכה
        </button>
        <ConfirmButton label="מחיקה" onConfirm={onDelete} />
      </div>
    </div>
  );
}

function ConfirmButton({ label, onConfirm }: { label: string; onConfirm: () => void }) {
  const [asking, setAsking] = useState(false);
  if (asking) {
    return (
      <span className="inline-flex items-center gap-2 text-xs">
        <span className="text-ink/60">בטוחה?</span>
        <button type="button" onClick={onConfirm} className="font-bold text-teal-700 hover:underline">
          כן, למחוק
        </button>
        <button type="button" onClick={() => setAsking(false)} className="font-semibold text-ink/55 hover:underline">
          לא
        </button>
      </span>
    );
  }
  return (
    <button type="button" onClick={() => setAsking(true)} className="inline-flex items-center gap-1 text-xs font-semibold text-ink/50 hover:text-ink/80">
      <Trash2 className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
      {label}
    </button>
  );
}

function DayNote({ value, onSave }: { value: string; onSave: (v: string) => void }) {
  const [draft, setDraft] = useState(value);
  const [open, setOpen] = useState(!!value);
  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="mt-3 text-xs font-semibold text-ink/55 hover:text-ink">
        + הערה ליום הזה
      </button>
    );
  }
  return (
    <label className="mt-3 block text-xs font-semibold text-ink/70">
      הערה ליום הזה
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => draft !== value && onSave(draft)}
        className="mt-1 block min-h-[56px] w-full rounded-lg border border-mist-200 bg-white px-3 py-2 text-sm font-normal text-ink focus:border-teal-400 focus:outline-none"
      />
    </label>
  );
}
