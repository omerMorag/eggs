import { Lightbulb } from "lucide-react";

interface ParallelInfoCalloutProps {
  title?: string;
  text: string;
}

export default function ParallelInfoCallout({
  title = "קטע חשוב שחוסך זמן:",
  text,
}: ParallelInfoCalloutProps) {
  return (
    <div className="animate-fadeUp rounded-2xl border-2 border-teal-200 bg-teal-50/70 p-5 shadow-card sm:p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-teal-600 shadow-sm ring-1 ring-teal-100">
          <Lightbulb className="h-5 w-5" strokeWidth={2} />
        </span>
        <p className="text-sm leading-relaxed text-teal-900 sm:text-[15px]">
          <span className="font-semibold">{title}</span> {text}
        </p>
      </div>
    </div>
  );
}
