import { eggsNeededByAgeRange } from "@/data/chanceContent";

export default function EggsNeededTable() {
  return (
    <div className="overflow-x-auto rounded-2xl border-2 border-mist-200 bg-white shadow-card">
      <table className="w-full min-w-[420px] border-collapse text-right text-sm">
        <thead>
          <tr className="border-b border-mist-200 bg-mist-50/80">
            <th className="whitespace-nowrap px-4 py-3 font-semibold text-ink sm:px-5">
              גיל בזמן ההקפאה
            </th>
            <th className="px-4 py-3 font-semibold text-ink sm:px-5">
              מספר ביציות בשלות שהוערך כדרוש לסיכוי של כ-70% ללידת חי אחת
            </th>
          </tr>
        </thead>
        <tbody>
          {eggsNeededByAgeRange.map((row, idx) => (
            <tr key={row.ageRange} className={idx % 2 === 1 ? "bg-mist-50/40" : undefined}>
              <td className="whitespace-nowrap px-4 py-3 align-top font-semibold text-ink sm:px-5">
                {row.ageRange}
              </td>
              <td className="whitespace-nowrap px-4 py-3 align-top text-ink/80 sm:px-5">
                {row.eggsNeeded}
              </td>
            </tr>
          ))}
          <tr className="bg-mist-50/40">
            <td className="whitespace-nowrap px-4 py-3 align-top font-semibold text-ink sm:px-5">
              מעל 40
            </td>
            <td className="px-4 py-3 align-top leading-relaxed text-ink/70 sm:px-5">
              מעל גיל 40 ההערכות פחות ודאיות ונדרש ייעוץ אישי המבוסס על הנתונים הרפואיים.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
