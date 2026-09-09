import { eggsNeededForTarget, formatChancePercent, probabilityAtLeastK } from "@/data/chanceModel";

const ILLUSTRATIVE_AGES = [34, 37, 42];
const ILLUSTRATIVE_EGGS = 20;
const TARGET_PROBABILITY = 0.75;

export default function IllustrativeAgeTable() {
  const rows = ILLUSTRATIVE_AGES.map((age) => ({
    age,
    percent: formatChancePercent(probabilityAtLeastK(age, ILLUSTRATIVE_EGGS, 1)),
    eggsNeeded: eggsNeededForTarget(age, 1, TARGET_PROBABILITY),
  }));

  return (
    <div>
      <div className="overflow-x-auto rounded-2xl border-2 border-mist-200 bg-white shadow-card">
        <table className="w-full min-w-[420px] border-collapse text-right text-sm">
          <thead>
            <tr className="border-b border-mist-200 bg-mist-50/80">
              <th className="whitespace-nowrap px-4 py-3 font-semibold text-ink sm:px-5">
                גיל בזמן ההקפאה
              </th>
              <th className="whitespace-nowrap px-4 py-3 font-semibold text-ink sm:px-5">
                ביציות בשלות
              </th>
              <th className="whitespace-nowrap px-4 py-3 font-semibold text-ink sm:px-5">
                סיכוי משוער ללידת חי אחת לפחות
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={row.age} className={idx % 2 === 1 ? "bg-mist-50/40" : undefined}>
                <td className="whitespace-nowrap px-4 py-3 align-top font-semibold text-ink sm:px-5">
                  {row.age}
                </td>
                <td className="whitespace-nowrap px-4 py-3 align-top text-ink/80 sm:px-5">
                  {ILLUSTRATIVE_EGGS}
                </td>
                <td className="whitespace-nowrap px-4 py-3 align-top text-ink/80 sm:px-5">
                  כ-{row.percent}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-ink/60">
        לפי אותו מודל, כדי להגיע להערכה של כ-75% ללידת חי אחת לפחות, נדרשו{" "}
        {rows.map((row, idx) => (
          <span key={row.age}>
            כ-{row.eggsNeeded} ביציות בגיל {row.age}
            {idx < rows.length - 1 ? (idx === rows.length - 2 ? " ו" : ", ") : ""}
          </span>
        ))}
        . הנתונים נועדו להמחשה בלבד.
      </p>
    </div>
  );
}
