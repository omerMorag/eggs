import type { HealthFundRow } from "@/data/types";

interface HealthFundTableProps {
  rows: HealthFundRow[];
}

export default function HealthFundTable({ rows }: HealthFundTableProps) {
  const notes = rows.filter((row) => row.note);

  return (
    <div>
      <div className="overflow-x-auto rounded-2xl border-2 border-mist-200 bg-white shadow-card">
        <table className="w-full min-w-[640px] border-collapse text-right text-sm">
          <thead>
            <tr className="border-b border-mist-200 bg-mist-50/80">
              <th className="whitespace-nowrap px-4 py-3 font-semibold text-ink sm:px-5">קופה ותוכנית</th>
              <th className="whitespace-nowrap px-4 py-3 font-semibold text-ink sm:px-5">גיל הזכאות</th>
              <th className="px-4 py-3 font-semibold text-ink sm:px-5">מה מקבלים</th>
              <th className="whitespace-nowrap px-4 py-3 font-semibold text-ink sm:px-5">
                השתתפות עצמית
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={`${row.fund}-${row.ageEligibility}`} className={idx % 2 === 1 ? "bg-mist-50/40" : undefined}>
                <td className="whitespace-nowrap px-4 py-3 align-top font-semibold text-ink sm:px-5">
                  {row.fund} {row.plan}
                </td>
                <td className="whitespace-nowrap px-4 py-3 align-top text-ink/80 sm:px-5">
                  {row.ageEligibility}
                </td>
                <td className="px-4 py-3 align-top leading-relaxed text-ink/70 sm:px-5">{row.whatYouGet}</td>
                <td className="whitespace-nowrap px-4 py-3 align-top text-ink/80 sm:px-5">{row.copay}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {notes.length > 0 && (
        <div className="mt-4 space-y-2.5 text-sm leading-relaxed text-ink/60">
          {notes.map((row) => (
            <p key={`${row.fund}-note`}>
              <span className="font-semibold text-ink/80">
                {row.fund} {row.plan}:
              </span>{" "}
              {row.note}
              {row.source && (
                <>
                  {" "}
                  <a
                    href={row.source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-teal-700 underline-offset-4 hover:text-teal-800 hover:underline"
                  >
                    {row.source.label}
                  </a>
                </>
              )}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
