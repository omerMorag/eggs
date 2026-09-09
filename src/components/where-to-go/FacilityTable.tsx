import type { FacilityRow } from "@/data/types";

interface FacilityTableProps {
  rows: FacilityRow[];
  regionColumnLabel: string;
  showHospitals?: boolean;
  secondCycleLabel?: string;
}

export default function FacilityTable({
  rows,
  regionColumnLabel,
  showHospitals = false,
  secondCycleLabel,
}: FacilityTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border-2 border-mist-200 bg-white shadow-card">
      <table className="w-full min-w-[560px] border-collapse text-right text-sm">
        <thead>
          <tr className="border-b border-mist-200 bg-mist-50/80">
            <th className="whitespace-nowrap px-4 py-3 font-semibold text-ink sm:px-5">
              {regionColumnLabel}
            </th>
            {showHospitals && (
              <th className="px-4 py-3 font-semibold text-ink sm:px-5">בתי חולים</th>
            )}
            <th className="whitespace-nowrap px-4 py-3 font-semibold text-ink sm:px-5">
              מחיר משוער לסבב
            </th>
            {secondCycleLabel && (
              <th className="whitespace-nowrap px-4 py-3 font-semibold text-ink sm:px-5">
                {secondCycleLabel}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr
              key={row.name}
              className={idx % 2 === 1 ? "bg-mist-50/40" : undefined}
            >
              <td className="whitespace-nowrap px-4 py-3 align-top font-semibold text-ink sm:px-5">
                {row.name}
              </td>
              {showHospitals && (
                <td className="px-4 py-3 align-top leading-relaxed text-ink/70 sm:px-5">
                  {row.hospitals?.join(" · ")}
                </td>
              )}
              <td className="whitespace-nowrap px-4 py-3 align-top text-ink/80 sm:px-5">
                {row.priceRange}
              </td>
              {secondCycleLabel && (
                <td className="whitespace-nowrap px-4 py-3 align-top text-ink/80 sm:px-5">
                  {row.secondCyclePriceRange ?? "—"}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
