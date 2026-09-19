import HenIllustration from "@/components/hens/HenIllustration";
import RetrievalDayGuide from "@/components/guides/RetrievalDayGuide";
import { retrievalDayFull } from "@/data/retrievalDayGuide";

/**
 * "יום השאיבה" (לשעבר "מידע ומדריכים") — עמוד אחיד אחד, בלי כרטיסיית
 * טיזר נפרדת ובלי מנגנון פתיחה/סגירה: כותרת+פתיח באותו דפוס פריסה כמו
 * שאר עמודי האתר (טקסט מול איור התרנגולת), ומיד אחריהם כל תוכן המדריך
 * גלוי תמיד (RetrievalDayGuide — ציר זמן, רשימת ציוד, טיפים, אחרי השאיבה).
 *
 * ⚠️ RetrievalDayCard.tsx (כרטיסיית הטיזר עם הכפתור "למדריך המלא")
 * שהיה כאן קודם — נמחקה לגמרי (לא רק הוצאה משימוש): נוצרה באותו סבב
 * עבודה, לא הייתה בשימוש בשום מקום אחר, והתייתרה כליל ברגע שהמדריך גלוי
 * תמיד ולא צריך "להיפתח". `epilogueItems`/`EpilogueCard` נשארו בקוד בלי
 * שימוש חי (עדיין מיובאים ע"י `RoadmapExperience.tsx` היתום הקיים) —
 * בהתאם לתקדים הקיים בפרויקט של לא למחוק קבצים יתומים ותיקים.
 */
export default function GuidesSection() {
  return (
    <div className="print-stack animate-fadeUp">
      <section className="lg:flex lg:items-center lg:justify-between lg:gap-8">
        <div className="min-w-0">
          <h1 className="font-sans text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            יום השאיבה
          </h1>
          <p className="mt-1.5 max-w-lg text-sm leading-relaxed text-ink/60 sm:text-base">
            {retrievalDayFull.intro}
          </p>
        </div>

        {/* התרנגולת עם התיק — מוצגת במובייל אחרי הכותרת והתקציר, ובדסקטופ בצד הנגדי לטקסט */}
        <div className="no-print mt-4 flex justify-center lg:mt-0 lg:shrink-0 lg:justify-end">
          <HenIllustration name="retrieval-day-bag" blob="mint" />
        </div>
      </section>

      <RetrievalDayGuide />
    </div>
  );
}
