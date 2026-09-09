"use client";

import { useState } from "react";
import { ChevronDown, RotateCcw } from "lucide-react";
import ChanceSliderField from "@/components/chances/ChanceSliderField";
import ChanceResult from "@/components/chances/ChanceResult";
import ScenarioComparison from "@/components/chances/ScenarioComparison";
import ChanceChart from "@/components/chances/ChanceChart";
import LowReserveCard from "@/components/chances/LowReserveCard";
import InfoTooltip from "@/components/shared/InfoTooltip";
import { MIN_AGE, MAX_AGE, MIN_EGGS, MAX_EGGS } from "@/data/chanceModel";
import { ageInfoText, familyGoalOptions, miiTooltipText } from "@/data/chanceContent";

const DEFAULT_AGE = 32;
const DEFAULT_EGGS = 15;

function pillClass(active: boolean) {
  return `rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
    active ? "bg-teal-600 text-white shadow-sm" : "bg-mist-100 text-ink/60 hover:bg-mist-200"
  }`;
}

export default function ChanceCalculator() {
  const [age, setAge] = useState(DEFAULT_AGE);
  const [eggs, setEggs] = useState(DEFAULT_EGGS);
  const [familyGoalValue, setFamilyGoalValue] = useState<1 | 2 | 3>(1);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [showAgeInfo, setShowAgeInfo] = useState(false);

  const familyGoal = familyGoalOptions.find((opt) => opt.value === familyGoalValue) ?? familyGoalOptions[0];

  const handleReset = () => {
    setAge(DEFAULT_AGE);
    setEggs(DEFAULT_EGGS);
    setFamilyGoalValue(1);
    setHasCalculated(false);
  };

  return (
    <div id="calculator" className="scroll-mt-24 rounded-2xl border-2 border-mist-200 bg-white p-5 shadow-card sm:p-7">
      <h2 className="text-center font-sans text-xl font-bold tracking-tight text-ink sm:text-2xl">
        בואי נחשב את ההערכה שלך
      </h2>
      <p className="mx-auto mt-2 max-w-md text-center text-sm leading-relaxed text-ink/60">
        הזיני את הנתונים כפי שהם מופיעים בסיכום השאיבה שקיבלת מבית החולים או מהמרפאה.
      </p>

      <div className="mt-6 flex flex-col gap-6">
        <div>
          <ChanceSliderField
            id="chance-age"
            label="בת כמה היית כשהביציות הוקפאו?"
            value={age}
            min={MIN_AGE}
            max={MAX_AGE}
            onChange={setAge}
          />
          <button
            type="button"
            onClick={() => setShowAgeInfo((v) => !v)}
            aria-expanded={showAgeInfo}
            aria-controls="age-info-panel"
            className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-teal-700 transition-colors hover:text-teal-800"
          >
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform duration-300 ${showAgeInfo ? "rotate-180" : ""}`}
              strokeWidth={2.5}
            />
            למה מחשבים לפי הגיל בזמן ההקפאה?
          </button>
          <div
            id="age-info-panel"
            className={`grid overflow-hidden transition-all duration-300 ease-in-out ${
              showAgeInfo ? "mt-2 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="min-h-0">
              <p className="rounded-xl bg-mist-50 p-3 text-xs leading-relaxed text-ink/65">
                {ageInfoText}
              </p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-1.5">
            <ChanceSliderField
              id="chance-eggs"
              label="כמה ביציות בשלות הוקפאו?"
              value={eggs}
              min={MIN_EGGS}
              max={MAX_EGGS}
              onChange={setEggs}
              helperText="חפשי בסיכום השאיבה את מספר הביציות הבשלות או את הסימון MII."
            />
          </div>
          <div className="mt-1.5 flex items-center gap-1.5 text-xs text-ink/50">
            <span>מה זה MII?</span>
            <InfoTooltip label="הסבר על המונח MII" text={miiTooltipText} />
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-ink">לכמה ילדים תרצי לבדוק את הסיכוי?</p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {familyGoalOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setFamilyGoalValue(opt.value)}
                className={pillClass(familyGoalValue === opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => setHasCalculated(true)}
            className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-8 py-3.5 text-sm font-bold tracking-wide text-white shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-700 hover:shadow-cardHover active:translate-y-0"
          >
            הציגי לי את ההערכה
          </button>
          {hasCalculated && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-ink/50 transition-colors hover:text-teal-700"
            >
              <RotateCcw className="h-3.5 w-3.5" strokeWidth={2.5} />
              איפוס החישוב
            </button>
          )}
        </div>
      </div>

      {hasCalculated && (
        <div className="mt-8 border-t border-mist-100 pt-6">
          <ChanceResult age={age} eggs={eggs} familyGoal={familyGoal} />

          <LowReserveCard />

          <ScenarioComparison age={age} eggs={eggs} familyGoal={familyGoal} />

          <div className="mt-8">
            <h3 className="text-center font-sans text-base font-bold tracking-tight text-ink sm:text-lg">
              איך מספר הביציות משפיע על ההערכה?
            </h3>
            <p className="mx-auto mt-1.5 max-w-md text-center text-sm leading-relaxed text-ink/60">
              ככל שמוקפאות יותר ביציות בשלות, הסיכוי המצטבר עשוי לעלות – אך הוא לעולם אינו
              הופך להבטחה.
            </p>
            <div className="mt-4">
              <ChanceChart age={age} eggs={eggs} familyGoal={familyGoal} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
