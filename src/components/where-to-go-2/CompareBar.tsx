"use client";

import { ArrowLeft, X } from "lucide-react";
import type { CareUnit } from "@/data/careUnits";
import FloatingPortal from "@/components/shared/FloatingPortal";

interface CompareBarProps {
  units: CareUnit[];
  max: number;
  onCompare: () => void;
  onRemove: (unitId: string) => void;
}

/**
 * פס השוואה דביק בתחתית המסך. בנייד הניווט נמצא למעלה, כך שהפס לא מסתיר
 * אותו; מתחת לתוכן יש ריווח כדי שהפס לא יסתיר את הכרטיס האחרון.
 */
export default function CompareBar({
  units,
  max,
  onCompare,
  onRemove,
}: CompareBarProps) {
  if (units.length < 1) return null;
  const ready = units.length >= 2;

  return (
    <FloatingPortal>
      <div
        className="no-print fixed inset-x-0 bottom-3 z-30 flex justify-center px-3 lg:mr-0 lg:ml-[252px]"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        data-testid="compare-bar"
      >
        <div className="w-full max-w-xl rounded-2xl bg-ink px-3.5 py-3 text-white shadow-cardHover">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p
              className="text-sm font-semibold"
              aria-live="polite"
              data-testid="compare-bar-text"
            >
              {ready
                ? `נבחרו ${units.length} מקומות להשוואה`
                : "נבחר מקום אחד. בחרי עוד מקום כדי להשוות"}
              {units.length >= max && (
                <span className="block text-xs font-normal text-white/65">
                  אפשר להשוות עד {max} מקומות
                </span>
              )}
            </p>
            {ready && (
              <button
                type="button"
                onClick={onCompare}
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full bg-teal-600 px-4 text-sm font-bold text-ink hover:bg-teal-500"
                data-testid="compare-open"
              >
                השוואת המקומות
                <ArrowLeft
                  className="h-4 w-4"
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
              </button>
            )}
          </div>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {units.map((u) => (
              <li
                key={u.id}
                className="inline-flex items-center gap-1 rounded-full bg-white/10 py-0.5 pl-1 pr-2.5 text-xs font-semibold"
              >
                {u.name}
                <button
                  type="button"
                  onClick={() => onRemove(u.id)}
                  aria-label={`הסרת ${u.name} מההשוואה`}
                  className="flex h-6 w-6 items-center justify-center rounded-full text-white/70 hover:bg-white/15 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" strokeWidth={2.5} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </FloatingPortal>
  );
}
