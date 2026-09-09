import type { PrivateCostComponent } from "@/data/types";

interface PrivateCostTableProps {
  rows: PrivateCostComponent[];
}

export default function PrivateCostTable({ rows }: PrivateCostTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border-2 border-mist-200 bg-white shadow-card">
      <table className="w-full min-w-[480px] border-collapse text-right text-sm">
        <thead>
          <tr className="border-b border-mist-200 bg-mist-50/80">
            <th className="whitespace-nowrap px-4 py-3 font-semibold text-ink sm:px-5">רכיב</th>
            <th className="px-4 py-3 font-semibold text-ink sm:px-5">כיצד הוא מחושב</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={row.label} className={idx % 2 === 1 ? "bg-mist-50/40" : undefined}>
              <td className="whitespace-nowrap px-4 py-3 align-top font-semibold text-ink sm:px-5">
                {row.label}
              </td>
              <td className="px-4 py-3 align-top leading-relaxed text-ink/70 sm:px-5">{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
