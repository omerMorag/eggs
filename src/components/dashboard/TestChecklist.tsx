"use client";

import { AlertCircle, Download } from "lucide-react";
import { testItems } from "@/data/tests";

interface TestChecklistProps {
  completedTests: Set<number>;
  onToggle: (id: number) => void;
}

export default function TestChecklist({ completedTests, onToggle }: TestChecklistProps) {
  return (
    <div>
      <p className="mb-4 text-sm leading-relaxed text-ink/60">
        סמני מה כבר עשית, ואז השווי לרשימה הרשמית של היחידה שבחרת.
      </p>

      <ul className="flex flex-col gap-3">
        {testItems.map((test) => {
          const Icon = test.icon;
          const isDone = completedTests.has(test.id);
          const checkboxId = `test-checkbox-${test.id}`;
          return (
            <li
              key={test.id}
              className={`flex items-start gap-3 rounded-2xl border-2 bg-white p-4 shadow-card transition-all duration-300 sm:p-5 ${
                isDone ? "border-teal-200 bg-teal-50/30" : "border-mist-200"
              }`}
            >
              <input
                id={checkboxId}
                type="checkbox"
                checked={isDone}
                onChange={() => onToggle(test.id)}
                className="mt-1 h-5 w-5 shrink-0 cursor-pointer accent-teal-600"
              />
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                  isDone ? "bg-teal-100 text-teal-700" : "bg-mist-100 text-deep"
                }`}
                aria-hidden="true"
              >
                <Icon className="h-4 w-4" strokeWidth={2} />
              </span>
              <label htmlFor={checkboxId} className="min-w-0 flex-1 cursor-pointer">
                <span
                  className={`block text-sm font-semibold sm:text-base ${
                    isDone ? "text-teal-800 line-through decoration-teal-300" : "text-ink"
                  }`}
                >
                  {test.title}
                </span>
                <span className="mt-0.5 block text-xs leading-relaxed text-ink/55 sm:text-sm">
                  {test.detail}
                </span>
              </label>
            </li>
          );
        })}
      </ul>

      <div className="mt-5 flex items-start gap-2.5 rounded-xl bg-mist-50 p-3.5 text-xs leading-relaxed text-ink/60 sm:text-sm">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-deep/50" strokeWidth={2} />
        <p>
          חשוב לדעת: זו רשימה כללית בלבד. סוג הבדיקות, התזמון והתוקף משתנים בין רופאים
          ויחידות.
        </p>
      </div>

      <a
        href="/tests-checklist.pdf"
        download="רשימת-בדיקות-הקפאת-ביציות.pdf"
        className="mt-5 flex w-full items-center justify-center gap-2.5 rounded-full bg-teal-600 px-6 py-3.5 text-sm font-bold tracking-[0.01em] text-white shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-700 hover:shadow-cardHover active:translate-y-0 sm:w-auto"
      >
        <Download className="h-4 w-4" strokeWidth={2.25} />
        הורדת קובץ הבדיקות (PDF)
      </a>
    </div>
  );
}
