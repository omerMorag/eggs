"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { chanceFaq } from "@/data/chanceContent";

export default function ChanceFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-2.5">
      {chanceFaq.map((item, idx) => {
        const isOpen = openIndex === idx;
        const panelId = `chance-faq-${idx}`;
        return (
          <div
            key={item.question}
            className="overflow-hidden rounded-2xl border-2 border-mist-200 bg-white shadow-card"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              aria-expanded={isOpen}
              aria-controls={panelId}
              className="flex w-full items-center justify-between gap-3 p-4 text-right sm:p-5"
            >
              <span className="text-sm font-bold text-ink sm:text-base">{item.question}</span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-teal-700 transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
                strokeWidth={2.5}
              />
            </button>
            <div
              id={panelId}
              className={`grid overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="min-h-0">
                <p className="px-4 pb-4 text-sm leading-relaxed text-ink/70 sm:px-5 sm:pb-5">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
