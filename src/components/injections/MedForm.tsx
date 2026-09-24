"use client";

import { useId, useState } from "react";
import { findGuideForName, injectionGuides, medicationNameSuggestions } from "@/data/injectionGuides";
import type { MedDraft, MedEntry, MedKind } from "@/lib/injectionJournal";

interface MedFormProps {
  /** קיים = עריכה של רשומה */
  initial?: MedEntry;
  onSave: (draft: MedDraft, opts: { extraDays: number; applyToFuture: boolean }) => void;
  onCancel: () => void;
}

const inputCls =
  "mt-1 block w-full rounded-lg border border-mist-200 bg-white px-3 py-2 text-sm text-ink focus:border-teal-400 focus:outline-none";
const labelCls = "block text-xs font-semibold text-ink/70";

/**
 * טופס תרופה ליום. אין בו שום השלמה אוטומטית של מינון או שעה — הכול
 * כפי שנמסר מהיחידה. בהוספה של זריקה יומית אפשר ליצור רשומות גם לימים
 * הבאים (רשומה נפרדת לכל יום); בעריכה אפשר להחיל שינוי על הימים הבאים
 * שעוד לא סומנו כהוזרקו.
 */
export default function MedForm({ initial, onSave, onCancel }: MedFormProps) {
  const uid = useId();
  const [name, setName] = useState(initial?.name ?? "");
  const [form, setForm] = useState(initial?.form ?? "");
  const [dose, setDose] = useState(initial?.dose ?? "");
  const [unit, setUnit] = useState(initial?.unit ?? "");
  const [kind, setKind] = useState<MedKind>(initial?.kind ?? "daily");
  const [plannedTime, setPlannedTime] = useState(initial?.plannedTime ?? "");
  const [note, setNote] = useState(initial?.note ?? "");
  const [extraDays, setExtraDays] = useState(0);
  const [applyToFuture, setApplyToFuture] = useState(false);

  const guide = findGuideForName(name);
  const isEdit = !!initial;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave(
      {
        name: name.trim(),
        guideId: guide?.id,
        form: form.trim() || undefined,
        dose: dose.trim() || undefined,
        unit: unit.trim() || undefined,
        kind,
        plannedTime: plannedTime || undefined,
        note: note.trim() || undefined,
      },
      { extraDays: kind === "daily" ? extraDays : 0, applyToFuture }
    );
  };

  return (
    <form onSubmit={submit} className="space-y-3 rounded-xl border-2 border-teal-100 bg-white p-3.5 sm:p-4" data-testid="med-form">
      <fieldset>
        <legend className={labelCls}>סוג הזריקה</legend>
        <div className="mt-1 flex flex-wrap gap-2">
          {(
            [
              { v: "daily", l: "זריקה יומית" },
              { v: "oneTime", l: "חד-פעמית בשעה מדויקת (למשל זריקת ההבשלה)" },
            ] as { v: MedKind; l: string }[]
          ).map((o) => (
            <button
              key={o.v}
              type="button"
              aria-pressed={kind === o.v}
              onClick={() => setKind(o.v)}
              className={`min-h-[36px] rounded-full px-3.5 text-xs font-semibold transition-colors sm:text-sm ${
                kind === o.v ? "bg-teal-600 text-ink" : "bg-mist-100 text-ink/65 hover:bg-mist-200"
              }`}
            >
              {o.l}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className={labelCls}>
          שם התרופה
          <input
            className={inputCls}
            value={name}
            onChange={(e) => setName(e.target.value)}
            list={`${uid}-names`}
            required
            autoComplete="off"
            placeholder="למשל: גונאל-אף"
          />
          <datalist id={`${uid}-names`}>
            {medicationNameSuggestions.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
          {name.trim() && (
            <span className="mt-1 block text-[11px] font-normal text-ink/50">
              {guide ? `נמצא מדריך: ${guide.name} (${guide.latinName})` : "לא מצאנו מדריך לשם הזה — אפשר לחפש ב״כל המדריכים״"}
            </span>
          )}
        </label>
        <label className={labelCls}>
          סוג התכשיר / העט (אם ידוע)
          <input
            className={inputCls}
            value={form}
            onChange={(e) => setForm(e.target.value)}
            list={`${uid}-forms`}
            autoComplete="off"
            placeholder="למשל: עט מוכן לשימוש"
          />
          <datalist id={`${uid}-forms`}>
            {(guide ? [guide] : injectionGuides).map((g) => (
              <option key={g.id} value={g.form} />
            ))}
          </datalist>
        </label>
        <div className="grid grid-cols-[1fr_auto] gap-2">
          <label className={labelCls}>
            מינון כפי שנמסר לך
            <input className={inputCls} value={dose} onChange={(e) => setDose(e.target.value)} inputMode="decimal" placeholder="כפי שכתוב בהנחיות" />
          </label>
          <label className={labelCls}>
            יחידה
            <input className={`${inputCls} w-24`} value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="IU / מ״ג" />
          </label>
        </div>
        <label className={labelCls}>
          {kind === "oneTime" ? "השעה המדויקת שנמסרה לך" : "שעת הזרקה מתוכננת"}
          <input type="time" className={inputCls} value={plannedTime} onChange={(e) => setPlannedTime(e.target.value)} dir="ltr" />
          {kind === "oneTime" && (
            <span className="mt-1 block text-[11px] font-normal text-ink/50">
              היומן לא מחשב את השעה. רשמי אותה בדיוק כפי שקיבלת מהיחידה.
            </span>
          )}
        </label>
      </div>

      <label className={labelCls}>
        הערה אישית (לא חובה)
        <textarea className={`${inputCls} min-h-[60px]`} value={note} onChange={(e) => setNote(e.target.value)} />
      </label>

      {!isEdit && kind === "daily" && (
        <label className={`${labelCls} flex flex-wrap items-center gap-2`}>
          להוסיף את אותה זריקה גם ל־
          <input
            type="number"
            min={0}
            max={30}
            value={extraDays}
            onChange={(e) => setExtraDays(Math.max(0, Math.min(30, Number(e.target.value) || 0)))}
            className="w-16 rounded-lg border border-mist-200 bg-white px-2 py-1 text-sm"
            dir="ltr"
          />
          הימים הבאים (לפי ההנחיות שקיבלת)
        </label>
      )}

      {isEdit && initial?.seriesId && (
        <label className="flex items-start gap-2 text-xs text-ink/70">
          <input
            type="checkbox"
            checked={applyToFuture}
            onChange={(e) => setApplyToFuture(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-teal-600"
          />
          להחיל את השינוי גם על הימים הבאים שעוד לא סימנת בהם ״הזרקתי״ (מה שכבר תועד לא ישתנה)
        </label>
      )}

      <div className="flex flex-wrap gap-2 pt-1">
        <button type="submit" className="min-h-[40px] rounded-full bg-teal-600 px-5 text-sm font-bold text-ink hover:bg-teal-500">
          {isEdit ? "שמירת השינויים" : "הוספה ליומן"}
        </button>
        <button type="button" onClick={onCancel} className="min-h-[40px] rounded-full px-4 text-sm font-semibold text-ink/60 hover:bg-mist-100">
          ביטול
        </button>
      </div>
    </form>
  );
}
