import { ArrowDown, ArrowLeft } from "lucide-react";
import { processStages } from "@/data/chanceContent";

export default function ProcessDiagram() {
  return (
    <div className="rounded-2xl border-2 border-mist-200 bg-white p-5 shadow-card sm:p-6">
      <div className="flex flex-col items-stretch gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-1.5">
        {processStages.map((stage, idx) => (
          <div key={stage} className="flex flex-col items-stretch sm:flex-row sm:items-center">
            <span className="rounded-full border-2 border-teal-100 bg-teal-50 px-3.5 py-2 text-center text-xs font-semibold text-ink sm:text-sm">
              {stage}
            </span>
            {idx < processStages.length - 1 && (
              <span className="flex items-center justify-center py-1 text-teal-400 sm:px-1 sm:py-0">
                <ArrowDown className="h-4 w-4 sm:hidden" strokeWidth={2.5} />
                <ArrowLeft className="hidden h-4 w-4 sm:block" strokeWidth={2.5} />
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
