"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { newId, type BloodValue, type MonitoringResult } from "@/lib/injectionJournal";

const inputCls =
  "mt-1 block w-full rounded-lg border border-mist-200 bg-white px-3 py-2 text-sm text-ink focus:border-teal-400 focus:outline-none";
const labelCls = "block text-xs font-semibold text-ink/70";

interface MonitoringFormProps {
  initial?: MonitoringResult;
  onSave: (result: MonitoringResult | undefined) => void;
  onCancel: () => void;
}

/**
 * תוצאות מעקב ליום שבו הייתה בדיקה. כל השדות אופציונליים. היחידות נרשמות
 * כפי שמופיעות בתוצאה, ואין שום פרשנות ("תקין"/"לא תקין") לערכים.
 */
export default function MonitoringForm({ initial, onSave, onCancel }: MonitoringFormProps) {
  const [values, setValues] = useState<BloodValue[]>(
    initial?.bloodValues.length ? initial.bloodValues : [{ id: newId(), name: "", value: "", unit: "" }]
  );
  const [ultrasound, setUltrasound] = useState(initial?.ultrasound ?? "");
  const [next, setNext] = useState(initial?.nextInstructions ?? "");

  const setValue = (id: string, patch: Partial<BloodValue>) =>
    setValues((vs) => vs.map((v) => (v.id === id ? { ...v, ...patch } : v)));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const bloodValues = values
      .map((v) => ({ ...v, name: v.name.trim(), value: v.value.trim(), unit: v.unit.trim() }))
      .filter((v) => v.name || v.value);
    const result: MonitoringResult = {
      bloodValues,
      ultrasound: ultrasound.trim() || undefined,
      nextInstructions: next.trim() || undefined,
    };
    const empty = !bloodValues.length && !result.ultrasound && !result.nextInstructions;
    onSave(empty ? undefined : result);
  };

  return (
    <form onSubmit={submit} className="space-y-3 rounded-xl border-2 border-teal-100 bg-white p-3.5 sm:p-4" data-testid="monitoring-form">
      <p className="text-xs leading-relaxed text-ink/55">
        אפשר למלא רק מה שרוצים ולהשאיר שדות ריקים. היומן לא מפרש את הערכים — את המשמעות שלהם מסבירה היחידה.
      </p>
      <fieldset>
        <legend className={labelCls}>ערכי בדיקות דם שקיבלת</legend>
        <div className="mt-1 space-y-2">
          {values.map((v, i) => (
            <div key={v.id} className="grid grid-cols-[1fr_5.5rem_4.5rem_auto] items-end gap-1.5 sm:grid-cols-[1fr_7rem_6rem_auto]">
              <label className="text-[11px] text-ink/55">
                <span className={i === 0 ? "" : "sr-only"}>בדיקה</span>
                <input className={inputCls} value={v.name} onChange={(e) => setValue(v.id, { name: e.target.value })} placeholder="שם הבדיקה" />
              </label>
              <label className="text-[11px] text-ink/55">
                <span className={i === 0 ? "" : "sr-only"}>ערך</span>
                <input className={inputCls} value={v.value} onChange={(e) => setValue(v.id, { value: e.target.value })} dir="ltr" />
              </label>
              <label className="text-[11px] text-ink/55">
                <span className={i === 0 ? "" : "sr-only"}>יחידה</span>
                <input className={inputCls} value={v.unit} onChange={(e) => setValue(v.id, { unit: e.target.value })} placeholder="כמו בתוצאה" dir="ltr" />
              </label>
              <button
                type="button"
                onClick={() => setValues((vs) => (vs.length > 1 ? vs.filter((x) => x.id !== v.id) : [{ id: newId(), name: "", value: "", unit: "" }]))}
                aria-label="מחיקת השורה"
                className="mb-1 flex h-9 w-9 items-center justify-center rounded-full text-ink/40 hover:bg-mist-100 hover:text-ink/70"
              >
                <Trash2 className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setValues((vs) => [...vs, { id: newId(), name: "", value: "", unit: "" }])}
          className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:underline"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
          שורה נוספת
        </button>
      </fieldset>
      <label className={labelCls}>
        פרטי אולטרסאונד שנמסרו לך (אם תרצי לתעד)
        <textarea className={`${inputCls} min-h-[60px]`} value={ultrasound} onChange={(e) => setUltrasound(e.target.value)} />
      </label>
      <label className={labelCls}>
        הנחיות ההמשך שקיבלת מהיחידה
        <textarea className={`${inputCls} min-h-[60px]`} value={next} onChange={(e) => setNext(e.target.value)} />
      </label>
      <div className="flex flex-wrap gap-2 pt-1">
        <button type="submit" className="min-h-[40px] rounded-full bg-teal-600 px-5 text-sm font-bold text-ink hover:bg-teal-500">
          שמירה
        </button>
        <button type="button" onClick={onCancel} className="min-h-[40px] rounded-full px-4 text-sm font-semibold text-ink/60 hover:bg-mist-100">
          ביטול
        </button>
      </div>
    </form>
  );
}

export function MonitoringView({ result }: { result: MonitoringResult }) {
  return (
    <div className="space-y-2 text-sm text-ink/75" data-testid="monitoring-view">
      {result.bloodValues.length > 0 && (
        <ul className="flex flex-wrap gap-1.5">
          {result.bloodValues.map((b) => (
            <li key={b.id} className="rounded-lg bg-white px-2.5 py-1 text-xs ring-1 ring-inset ring-mist-200">
              <span className="font-semibold text-ink">{b.name || "בדיקה"}</span>{" "}
              <span dir="ltr">
                {b.value} {b.unit}
              </span>
            </li>
          ))}
        </ul>
      )}
      {result.ultrasound && (
        <p className="whitespace-pre-line">
          <span className="font-semibold text-ink">אולטרסאונד: </span>
          {result.ultrasound}
        </p>
      )}
      {result.nextInstructions && (
        <p className="whitespace-pre-line">
          <span className="font-semibold text-ink">הנחיות להמשך: </span>
          {result.nextInstructions}
        </p>
      )}
    </div>
  );
}
