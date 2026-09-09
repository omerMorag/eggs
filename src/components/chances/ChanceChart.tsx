"use client";

import { useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { probabilityAtLeastK } from "@/data/chanceModel";
import type { FamilyGoalOption } from "@/data/chanceContent";

interface ChanceChartProps {
  age: number;
  eggs: number;
  familyGoal: FamilyGoalOption;
}

const WIDTH = 640;
const HEIGHT = 280;
const PADDING_LEFT = 40;
const PADDING_RIGHT = 12;
const PADDING_TOP = 16;
const PADDING_BOTTOM = 32;
const MAX_X = 70;

const plotWidth = WIDTH - PADDING_LEFT - PADDING_RIGHT;
const plotHeight = HEIGHT - PADDING_TOP - PADDING_BOTTOM;

function xForEggs(eggs: number) {
  return PADDING_LEFT + (eggs / MAX_X) * plotWidth;
}
function yForPercent(percent: number) {
  return PADDING_TOP + (1 - percent / 100) * plotHeight;
}

export default function ChanceChart({ age, eggs, familyGoal }: ChanceChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoverEggs, setHoverEggs] = useState<number | null>(null);

  const points = useMemo(() => {
    const pts: { eggs: number; percent: number }[] = [];
    for (let n = 1; n <= MAX_X; n++) {
      pts.push({ eggs: n, percent: probabilityAtLeastK(age, n, familyGoal.value) * 100 });
    }
    return pts;
  }, [age, familyGoal]);

  const path = useMemo(
    () =>
      points
        .map((p, i) => `${i === 0 ? "M" : "L"}${xForEggs(p.eggs).toFixed(1)},${yForPercent(p.percent).toFixed(1)}`)
        .join(" "),
    [points],
  );

  const currentPercent = probabilityAtLeastK(age, eggs, familyGoal.value) * 100;

  const activeEggs = hoverEggs ?? eggs;
  const activePercent = probabilityAtLeastK(age, activeEggs, familyGoal.value) * 100;

  const handlePointerMove = (event: ReactPointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const scale = WIDTH / rect.width;
    const localX = (event.clientX - rect.left) * scale;
    const ratio = (localX - PADDING_LEFT) / plotWidth;
    const n = Math.round(ratio * MAX_X);
    setHoverEggs(Math.min(Math.max(n, 1), MAX_X));
  };

  const yTicks = [0, 25, 50, 75, 100];
  const xTicks = [0, 10, 20, 30, 40, 50, 60, 70];

  return (
    <div>
      <div dir="ltr" className="relative w-full select-none" style={{ touchAction: "pan-y" }}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-auto w-full"
          onPointerMove={handlePointerMove}
          onPointerLeave={() => setHoverEggs(null)}
          role="img"
          aria-label={`גרף: הסיכוי המשוער עולה בהדרגה עם מספר הביציות הבשלות, בגיל ${age}. עבור ${eggs} ביציות, הסיכוי המשוער הוא כ-${Math.round(currentPercent)}%.`}
        >
          {/* קווי רשת אופקיים */}
          {yTicks.map((t) => (
            <g key={t}>
              <line
                x1={PADDING_LEFT}
                x2={WIDTH - PADDING_RIGHT}
                y1={yForPercent(t)}
                y2={yForPercent(t)}
                stroke="#EFE1D7"
                strokeWidth={1}
              />
              <text x={PADDING_LEFT - 8} y={yForPercent(t) + 4} textAnchor="end" fontSize="11" fill="#433632" opacity={0.5}>
                {t}%
              </text>
            </g>
          ))}

          {xTicks.map((t) => (
            <text
              key={t}
              x={xForEggs(t)}
              y={HEIGHT - PADDING_BOTTOM + 20}
              textAnchor="middle"
              fontSize="11"
              fill="#433632"
              opacity={0.5}
            >
              {t}
            </text>
          ))}
          <text
            x={WIDTH / 2}
            y={HEIGHT - 4}
            textAnchor="middle"
            fontSize="11"
            fill="#433632"
            opacity={0.4}
          >
            מספר ביציות בשלות
          </text>

          {/* קו ההערכה */}
          <path d={path} fill="none" stroke="#E25068" strokeWidth={2.5} strokeLinecap="round" />

          {/* קו אנכי + נקודה בהתאם למספר שהוזן/שמעוקבים אחריו */}
          <line
            x1={xForEggs(activeEggs)}
            x2={xForEggs(activeEggs)}
            y1={PADDING_TOP}
            y2={HEIGHT - PADDING_BOTTOM}
            stroke="#CC334D"
            strokeWidth={1}
            strokeDasharray="4 4"
            opacity={0.5}
          />
          <circle
            cx={xForEggs(activeEggs)}
            cy={yForPercent(activePercent)}
            r={6}
            fill="#E25068"
            stroke="white"
            strokeWidth={2}
          />
        </svg>

        {/* תיבת מידע צפה, מוגבלת לרוחב האזור של הגרף עצמו */}
        <div
          className="pointer-events-none absolute rounded-lg border border-mist-200 bg-white px-2.5 py-1.5 text-xs leading-tight text-ink shadow-cardHover"
          style={{
            top: `${(yForPercent(activePercent) / HEIGHT) * 100}%`,
            left: `${Math.min(Math.max((xForEggs(activeEggs) / WIDTH) * 100, 8), 82)}%`,
            transform: "translate(-50%, -130%)",
            whiteSpace: "nowrap",
          }}
        >
          <span className="font-bold">{activeEggs} ביציות</span> · גיל {age} ·{" "}
          <span className="font-bold text-teal-700">כ-{Math.round(activePercent)}%</span>
        </div>
      </div>

      <p className="mt-2 text-center text-xs text-ink/45">
        הקו מציג את הגיל שבחרת; ניתן להעביר אצבע או עכבר מעל הגרף כדי לראות ערכים נוספים.
      </p>
    </div>
  );
}
