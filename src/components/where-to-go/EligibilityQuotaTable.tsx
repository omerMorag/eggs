import type { EligibilityQuotaRow } from "@/data/types";

interface EligibilityQuotaTableProps {
  rows: EligibilityQuotaRow[];
}

export default function EligibilityQuotaTable({ rows }: EligibilityQuotaTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border-2 border-mist-200 bg-white shadow-card">
      <table className="w-full min-w-[420px] border-collapse text-right text-sm">
        <thead>
          <tr className="border-b border-mist-200 bg-mist-50/80">
            <th className="whitespace-nowrap px-4 py-3 font-semibold text-ink sm:px-5">הגיל במועד השאיבה</th>
            <th className="whitespace-nowrap px-4 py-3 font-semibold text-ink sm:px-5">מספר הביציות המרבי</th>
            <th className="whitespace-nowrap px-4 py-3 font-semibold text-ink sm:px-5">
              מספר מחזורי השאיבה המרבי
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={row.ageRange} className={idx % 2 === 1 ? "bg-mist-50/40" : undefined}>
              <td className="px-4 py-3 align-top font-semibold text-ink sm:px-5">{row.ageRange}</td>
              <td className="whitespace-nowrap px-4 py-3 align-top text-ink/80 sm:px-5">{row.maxEggs}</td>
              <td className="whitespace-nowrap px-4 py-3 align-top text-ink/80 sm:px-5">{row.maxCycles}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
