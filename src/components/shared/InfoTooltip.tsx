"use client";

import { useEffect, useRef, useState } from "react";
import { Info } from "lucide-react";
import { useFloatingPosition } from "@/lib/useFloatingPosition";
import FloatingPortal from "@/components/shared/FloatingPortal";

interface InfoTooltipProps {
  label: string;
  text: string;
}

/** אייקון "מידע" קטן שבלחיצה עליו נפתחת בועית הסבר קצרה, ממוקמת בבטחה בתוך המסך. */
export default function InfoTooltip({ label, text }: InfoTooltipProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const style = useFloatingPosition(triggerRef, panelRef, open, "start");

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        panelRef.current &&
        !panelRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <span className="relative inline-flex">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={label}
        className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-teal-50 text-teal-700 transition-colors hover:bg-teal-100"
      >
        <Info className="h-3.5 w-3.5" strokeWidth={2.5} />
      </button>

      {/* הפאנל מורכב תמיד (לא מותנה ב-open) — ראו התיעוד ב-useFloatingPosition.ts */}
      <FloatingPortal>
        <div
          ref={panelRef}
          role="tooltip"
          aria-hidden={!open}
          style={style}
          className="fixed z-30 w-64 max-w-[calc(100vw-1.5rem)] rounded-xl border-2 border-mist-200 bg-white p-3 text-sm leading-relaxed text-ink/70 shadow-cardHover"
        >
          {text}
        </div>
      </FloatingPortal>
    </span>
  );
}
