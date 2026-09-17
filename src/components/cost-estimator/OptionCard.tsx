"use client";

interface OptionCardProps {
  label: string;
  description?: string;
  active: boolean;
  onClick: () => void;
}

/** כרטיס בחירה יחיד — אותו סגנון בדיוק כמו FundingPathSelector.tsx */
export default function OptionCard({ label, description, active, onClick }: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex min-h-[44px] flex-col items-start gap-1 rounded-2xl border-2 p-4 text-right shadow-card transition-all duration-300 ${
        active
          ? "border-teal-300 bg-teal-50/70 ring-2 ring-teal-200"
          : "border-mist-200 bg-white hover:border-teal-200 hover:bg-teal-50/30"
      }`}
    >
      <span className="text-sm font-bold leading-snug text-ink">{label}</span>
      {description && <span className="text-xs leading-snug text-ink/60">{description}</span>}
    </button>
  );
}
