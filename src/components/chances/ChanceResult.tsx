import { formatChancePercent, probabilityAtLeastK } from "@/data/chanceModel";
import { resultTiers, type FamilyGoalOption } from "@/data/chanceContent";

interface ChanceResultProps {
  age: number;
  eggs: number;
  familyGoal: FamilyGoalOption;
}

const RADIUS = 62;
const STROKE = 12;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ChanceResult({ age, eggs, familyGoal }: ChanceResultProps) {
  const probability = probabilityAtLeastK(age, eggs, familyGoal.value);
  const percentLabel = formatChancePercent(probability);
  const dashOffset = CIRCUMFERENCE * (1 - Math.min(probability, 0.99));
  const tier = resultTiers.find((t) => probability < t.max) ?? resultTiers[resultTiers.length - 1];

  return (
    <div className="animate-fadeUp rounded-2xl border-2 border-teal-200 bg-teal-50/50 p-5 sm:p-7">
      <h3 className="text-center font-sans text-lg font-bold tracking-tight text-ink sm:text-xl">
        הערכה סטטיסטית ללידת חי
      </h3>

      <div className="mt-5 flex flex-col items-center">
        <div className="relative h-40 w-40">
          <svg viewBox="0 0 150 150" className="h-full w-full -rotate-90">
            <circle
              cx="75"
              cy="75"
              r={RADIUS}
              fill="none"
              stroke="#EEDDD6"
              strokeWidth={STROKE}
            />
            <circle
              cx="75"
              cy="75"
              r={RADIUS}
              fill="none"
              stroke="#C13655"
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              style={{ transition: "stroke-dashoffset 0.6s ease-out" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span dir="ltr" className="font-sans text-3xl font-extrabold tracking-tight text-ink">
              {percentLabel}
            </span>
          </div>
        </div>
        <p className="mt-3 text-center text-sm font-semibold text-ink/70">{familyGoal.resultLabel}</p>
        <p className="mt-1.5 text-center text-xs leading-relaxed text-ink/50">
          זו אינה הבטחה או אבחנה רפואית. התוצאה האישית עשויה להיות שונה.
        </p>
      </div>

      <p className="mx-auto mt-5 max-w-lg text-center text-sm leading-relaxed text-ink/70 sm:text-[15px]">
        לפי המודל הסטטיסטי, עבור {eggs} ביציות בשלות שהוקפאו בגיל {age}, {familyGoal.resultLabel.replace("סיכוי משוער", "הסיכוי המשוער")} הוא {percentLabel}.
      </p>

      <p className="mx-auto mt-4 max-w-lg text-center text-sm leading-relaxed text-ink/60">
        {tier.text}
      </p>
    </div>
  );
}
