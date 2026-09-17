"use client";

import OptionCard from "../OptionCard";
import type { StepProps } from "./StepProps";

const TOGGLE_OPTIONS = [
  { key: "consultations", label: "פגישות ייעוץ" },
  { key: "tests", label: "בדיקות" },
  { key: "storageAnnual", label: "אחסון שנתי" },
  { key: "travel", label: "נסיעות וחניה" },
] as const;

export default function Step7AdditionalCosts({ answers, updateAnswer }: StepProps) {
  const additional = answers.additionalCosts;

  const toggle = (key: (typeof TOGGLE_OPTIONS)[number]["key"]) => {
    updateAnswer("additionalCosts", { ...additional, [key]: !additional[key] });
  };

  return (
    <div>
      <h3 className="text-lg font-bold text-ink sm:text-xl">עלויות נוספות</h3>
      <p className="mt-1 text-sm text-ink/60">ניתן לבחור כמה שרוצים.</p>
      <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
        {TOGGLE_OPTIONS.map((opt) => (
          <OptionCard key={opt.key} label={opt.label} active={additional[opt.key]} onClick={() => toggle(opt.key)} />
        ))}
        <OptionCard
          label="עלות נוספת בהתאמה אישית"
          active={additional.customEnabled}
          onClick={() => updateAnswer("additionalCosts", { ...additional, customEnabled: !additional.customEnabled })}
        />
      </div>

      {additional.customEnabled && (
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="mb-1 block text-xs font-semibold text-ink/55">תיאור העלות</label>
            <input
              type="text"
              value={additional.customLabel ?? ""}
              onChange={(e) => updateAnswer("additionalCosts", { ...additional, customLabel: e.target.value })}
              placeholder="למשל: טיפול משלים"
              className="w-full rounded-lg border border-mist-200 bg-white px-3 py-2 text-sm text-ink/80 transition-colors focus:border-teal-400"
            />
          </div>
          <div className="max-w-[160px]" dir="ltr">
            <label className="mb-1 block text-xs font-semibold text-ink/55">סכום (₪)</label>
            <input
              type="number"
              min={0}
              value={additional.customAmount ?? ""}
              onChange={(e) =>
                updateAnswer("additionalCosts", {
                  ...additional,
                  customAmount: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              className="w-full rounded-lg border border-mist-200 bg-white px-3 py-2 text-sm text-ink/80 transition-colors focus:border-teal-400"
            />
          </div>
        </div>
      )}
    </div>
  );
}
