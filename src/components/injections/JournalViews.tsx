"use client";

import { useEffect, useRef } from "react";
import { Stethoscope } from "lucide-react";
import {
  dayNumber,
  formatDateShort,
  getDay,
  type JournalCycle,
} from "@/lib/injectionJournal";
import { MonitoringView } from "./MonitoringForm";

interface DayStripProps {
  cycle: JournalCycle;
  dates: string[];
  selected: string;
  today: string;
  onSelect: (date: string) => void;
}

/**
 * פס ימים שאפשר לדפדף בו (גלילה אופקית בתוך הפס בלבד — לא בעמוד). כל יום
 * מציג כמה זריקות בוצעו מתוך מה שתוכנן, וסימון קטן אם היה מעקב.
 */
export function DayStrip({ cycle, dates, selected, today, onSelect }: DayStripProps) {
  const listRef = useRef<HTMLDivElement>(null);

  // גלילה אופקית של הפס בלבד אל היום הנבחר — בלי להזיז את העמוד עצמו
  // (scrollIntoView היה גולל גם את העמוד אנכית בטעינה)
  useEffect(() => {
    const list = listRef.current;
    const el = list?.querySelector<HTMLElement>(`[data-date="${selected}"]`);
    if (!list || !el) return;
    const lr = list.getBoundingClientRect();
    const er = el.getBoundingClientRect();
    list.scrollBy({ left: er.left + er.width / 2 - (lr.left + lr.width / 2), behavior: "auto" });
  }, [selected]);

  return (
    <div
      ref={listRef}
      role="listbox"
      aria-label="ימי הסבב"
      className="-mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-2 pt-1 [scrollbar-width:thin]"
      data-testid="day-strip"
    >
      {dates.map((date) => {
        const day = getDay(cycle, date);
        const planned = day.meds.length;
        const done = day.meds.filter((m) => m.done).length;
        const isSel = date === selected;
        return (
          <button
            key={date}
            type="button"
            role="option"
            aria-selected={isSel}
            data-date={date}
            onClick={() => onSelect(date)}
            className={`flex min-w-[4.25rem] shrink-0 snap-start flex-col items-center rounded-2xl border-2 px-2 py-2 text-center transition-colors ${
              isSel ? "border-teal-400 bg-teal-50" : "border-mist-200 bg-white hover:border-teal-200"
            }`}
          >
            <span className="text-[11px] font-semibold text-ink/55">יום {dayNumber(cycle, date)}</span>
            <span className={`text-sm font-bold ${date === today ? "text-teal-700" : "text-ink"}`}>{formatDateShort(date)}</span>
            <span className="mt-0.5 flex h-4 items-center gap-1 text-[10px] text-ink/55">
              {planned > 0 ? `${done}/${planned}` : ""}
              {day.hadCheckup && <Stethoscope className="h-3 w-3 text-teal-700" strokeWidth={2.5} aria-label="היה מעקב" />}
            </span>
          </button>
        );
      })}
    </div>
  );
}

interface PeriodTableProps {
  cycle: JournalCycle;
  dates: string[];
  today: string;
  onSelect: (date: string) => void;
}

/** תצוגת טבלה של כל התקופה — למחשב בלבד (מוסתרת מתחת ל-md) */
export function PeriodTable({ cycle, dates, today, onSelect }: PeriodTableProps) {
  return (
    <div className="hidden md:block" data-testid="period-table">
      <table className="w-full table-fixed border-collapse text-right text-sm">
        <thead>
          <tr className="border-b-2 border-mist-200 text-xs text-ink/55">
            <th className="w-24 px-2 py-2 font-semibold">יום</th>
            <th className="px-2 py-2 font-semibold">זריקות שתוכננו</th>
            <th className="w-40 px-2 py-2 font-semibold">בוצע בפועל</th>
            <th className="px-2 py-2 font-semibold">מעקב והערות</th>
          </tr>
        </thead>
        <tbody>
          {dates.map((date) => {
            const day = getDay(cycle, date);
            return (
              <tr
                key={date}
                className={`cursor-pointer border-b border-mist-100 align-top hover:bg-mist-50 ${date === today ? "bg-teal-50/40" : ""}`}
                onClick={() => onSelect(date)}
              >
                <td className="px-2 py-2.5">
                  <button type="button" onClick={() => onSelect(date)} className="text-right font-bold text-ink hover:underline">
                    יום {dayNumber(cycle, date)}
                  </button>
                  <div className="text-xs text-ink/55">{formatDateShort(date)}</div>
                </td>
                <td className="px-2 py-2.5 text-ink/80">
                  {day.meds.length === 0 ? (
                    <span className="text-ink/35">—</span>
                  ) : (
                    <ul className="space-y-0.5">
                      {day.meds.map((m) => (
                        <li key={m.id}>
                          <span className="font-semibold text-ink">{m.name}</span>
                          {m.dose && (
                            <>
                              {" · "}
                              <bdi dir="ltr" className="whitespace-nowrap">
                                {m.dose}
                                {m.unit ? ` ${m.unit}` : ""}
                              </bdi>
                            </>
                          )}
                          {m.plannedTime && (
                            <>
                              {" · "}
                              <bdi dir="ltr">{m.plannedTime}</bdi>
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </td>
                <td className="px-2 py-2.5 text-ink/80">
                  {day.meds.length === 0 ? (
                    <span className="text-ink/35">—</span>
                  ) : (
                    <ul className="space-y-0.5">
                      {day.meds.map((m) => (
                        <li key={m.id}>{m.done ? `✓ ${m.doneTime ?? ""}` : <span className="text-ink/45">עוד לא סומן</span>}</li>
                      ))}
                    </ul>
                  )}
                </td>
                <td className="px-2 py-2.5 text-ink/80">
                  {day.monitoring ? (
                    <MonitoringView result={day.monitoring} />
                  ) : day.hadCheckup ? (
                    <span className="text-xs text-ink/55">היה מעקב</span>
                  ) : null}
                  {day.note && <p className="mt-1 whitespace-pre-line text-xs text-ink/65">{day.note}</p>}
                  {day.meds.some((m) => m.note) && (
                    <ul className="mt-1 space-y-0.5 text-xs text-ink/65">
                      {day.meds.filter((m) => m.note).map((m) => (
                        <li key={m.id}>
                          {m.name}: {m.note}
                        </li>
                      ))}
                    </ul>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
