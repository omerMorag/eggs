"use client";

import { journeySteps } from "@/data/steps";
import { epilogueItems } from "@/data/epilogue";
import EpilogueCard from "@/components/shared/EpilogueCard";
import FlowStepCard from "./FlowStepCard";
import ParallelInfoCallout from "./ParallelInfoCallout";

const CALLOUT_TEXT =
  "לא חייבות לעשות הכול בטור. אפשר להתחיל את הבדיקות ואת הבירור איפה תעברי את התהליך במקביל, אחת לצד השנייה.";

export default function RoadmapExperience() {
  return (
    <div className="flex flex-col gap-8 sm:gap-10">
      <ol className="relative flex flex-col gap-3 sm:gap-4">
        {journeySteps.map((step, idx) => (
          <div key={step.id} className="animate-fadeUp">
            <FlowStepCard step={step} number={idx + 1} isLast={idx === journeySteps.length - 1} />
          </div>
        ))}
      </ol>

      <ParallelInfoCallout text={CALLOUT_TEXT} />

      <div className="flex flex-col gap-4">
        {epilogueItems.map((item) => (
          <EpilogueCard key={item.title} {...item} />
        ))}
      </div>
    </div>
  );
}
