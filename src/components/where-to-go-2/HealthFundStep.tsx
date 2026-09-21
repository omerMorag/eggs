"use client";

export type HealthFundFilter = "כללית" | "מכבי" | "מאוחדת" | "לאומית" | "all";

const FUNDS: { value: HealthFundFilter; label: string }[] = [
  { value: "כללית", label: "כללית" },
  { value: "מכבי", label: "מכבי" },
  { value: "מאוחדת", label: "מאוחדת" },
  { value: "לאומית", label: "לאומית" },
  { value: "all", label: "לא משנה לי — רוצה לראות הכול" },
];

function pillClass(active: boolean) {
  return `min-h-[40px] rounded-full px-3.5 text-xs font-semibold transition-colors duration-200 ${
    active ? "bg-teal-600 text-ink shadow-sm" : "bg-mist-100 text-ink/60 hover:bg-mist-200"
  }`;
}

interface HealthFundStepProps {
  value: HealthFundFilter;
  onChange: (value: HealthFundFilter) => void;
}

/** §4: מוצג רק כשרלוונטי (trackType מסובסד/הכול) — משמש להדגשה, לא להסתרה מוחלטת */
export default function HealthFundStep({ value, onChange }: HealthFundStepProps) {
  return (
    <div className="mt-4 animate-fadeUp">
      <h3 className="text-sm font-bold text-ink">באיזו קופה את?</h3>
      <p className="mt-0.5 text-xs text-ink/50">כדי להדגיש יחידות שיש להן הסדר עם הקופה שלך — לא מסתיר אפשרויות אחרות.</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {FUNDS.map((f) => (
          <button key={f.value} type="button" onClick={() => onChange(f.value)} className={pillClass(value === f.value)}>
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}
