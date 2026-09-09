import type { FundingPath } from "@/data/types";

interface FundingPathCardProps extends FundingPath {
  number: number;
}

export default function FundingPathCard({ icon: Icon, title, description, number }: FundingPathCardProps) {
  return (
    <div className="rounded-2xl border-2 border-mist-200 bg-white p-5 shadow-card sm:p-6">
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-700 ring-1 ring-inset ring-teal-100">
          <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
        </span>
        <h3 className="font-sans text-base font-bold tracking-tight text-ink sm:text-lg">
          <span className="ml-1.5 text-teal-600">{number}.</span>
          {title}
        </h3>
      </div>
      <p className="mt-2.5 text-sm leading-relaxed text-ink/70">{description}</p>
    </div>
  );
}
