import type { LucideIcon } from "lucide-react";

interface SectionHeadingProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
}

export default function SectionHeading({ icon: Icon, title, subtitle }: SectionHeadingProps) {
  return (
    <div className="mb-4 flex items-center gap-2.5 sm:mb-5">
      <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-teal-100 bg-teal-50 text-deep">
        <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
      </span>
      <div>
        <h2 className="font-sans text-lg font-bold tracking-tight text-ink sm:text-xl">{title}</h2>
        {subtitle && <p className="text-sm text-ink/50">{subtitle}</p>}
      </div>
    </div>
  );
}
