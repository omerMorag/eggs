"use client";

import { BarChart3, HelpCircle, Sparkles, Workflow } from "lucide-react";
import SectionHeading from "@/components/dashboard/SectionHeading";
import ChanceCalculator from "@/components/chances/ChanceCalculator";
import IllustrativeAgeTable from "@/components/chances/IllustrativeAgeTable";
import ProcessDiagram from "@/components/chances/ProcessDiagram";
import KeyFactsGrid from "@/components/chances/KeyFactsGrid";
import ChanceSupportCard from "@/components/chances/ChanceSupportCard";
import ChanceFaq from "@/components/chances/ChanceFaq";
import { chanceSources } from "@/data/chanceContent";

/**
 * "מה הסיכוי שלי?" — זוקק לפי בקשת המשתמשת (ראו site-build-summary.md
 * ל"עדכון" המפורט). המחשבון עצמו (ChanceCalculator, chanceModel, chanceContent)
 * לא שונה בשום דרך פונקציונלית — רק ההצגה סביבו. סדר הסקשנים הסופי:
 * 1. כותרת+פתיח קצר, 2-3. מחשבון+תוצאה (בתוך ChanceCalculator עצמו),
 * 4. טבלת "אותו מספר ביציות – גיל שונה", 5. שלושה דברים שחשוב לזכור,
 * 6. משפך התהליך, 7. כרטיס תמיכה, 8. שלוש שאלות נפוצות,
 * 9. מקורות ומתודולוגיה (גלוי תמיד — לא אקורדיון, כדי שכולן יראו על מה
 * ההערכה מבוססת בלי צורך ללחוץ על כלום), 10. הבהרה רפואית.
 */
export default function MyChancesSection() {
  return (
    <div className="print-stack animate-fadeUp">
      {/* 1. כותרת ופתיח קצר */}
      <section>
        <h1 className="font-sans text-2xl font-extrabold leading-tight tracking-tight text-ink sm:text-3xl">
          מה הסיכוי שלי?
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/70 sm:text-base">
          בחרי את הגיל שבו הוקפאו הביציות ואת מספר הביציות הבשלות שהוקפאו, וקבלי הערכה
          סטטיסטית לסיכוי ללידת חי.
        </p>
        <p className="mt-2 max-w-2xl text-xs leading-relaxed text-ink/50 sm:text-sm">
          החישוב הוא הערכה כללית המבוססת על נתונים מחקריים, ואינו תחזית רפואית אישית.
        </p>
      </section>

      {/* 2-3. המחשבון + התוצאה — בדיוק כפי שהם, בלי שום שינוי בפונקציונליות */}
      <section className="mt-6 sm:mt-8">
        <ChanceCalculator />
      </section>

      {/* 4. טבלת "אותו מספר ביציות – גיל שונה" */}
      <section className="mt-10 sm:mt-14">
        <SectionHeading icon={BarChart3} title="אותו מספר ביציות – גיל שונה" />
        <p className="mb-4 text-sm leading-relaxed text-ink/70 sm:text-[15px]">
          הטבלה ממחישה בקצרה עד כמה הגיל בזמן ההקפאה משפיע על ההערכה.
        </p>
        <IllustrativeAgeTable />
      </section>

      {/* 5. שלושה דברים שחשוב לזכור */}
      <section className="mt-10 sm:mt-14">
        <SectionHeading icon={Sparkles} title="שלושה דברים שחשוב לזכור" />
        <KeyFactsGrid />
      </section>

      {/* 6. משפך "למה לא כל ביצית קפואה הופכת לילד?" */}
      <section className="mt-10 sm:mt-14">
        <SectionHeading icon={Workflow} title="למה לא כל ביצית קפואה הופכת לילד?" />
        <ProcessDiagram />
      </section>

      {/* 7. כרטיס תמיכה */}
      <section className="mt-10 sm:mt-14">
        <ChanceSupportCard />
      </section>

      {/* 8. שלוש שאלות נפוצות */}
      <section id="my-chances-faq" className="mt-10 sm:mt-14">
        <SectionHeading icon={HelpCircle} title="שאלות נפוצות" />
        <ChanceFaq />
      </section>

      {/* 9. מקורות ומתודולוגיה — גלוי תמיד (לא אקורדיון), כדי שכל מי שנכנסת
          לעמוד תראה בבירור על מה ההערכה מבוססת, בלי צורך ללחוץ על כלום */}
      <section className="mt-10 sm:mt-14">
        <div className="rounded-2xl border-2 border-mist-200 bg-mist-50/60 p-5 sm:p-6">
          <h2 className="font-sans text-base font-bold tracking-tight text-ink sm:text-lg">
            על מה מבוססת ההערכה?
          </h2>
          <p className="mt-2.5 text-sm leading-relaxed text-ink/70 sm:text-[15px]">
            המחשבון מציג הערכה המבוססת על מודל סטטיסטי שפורסם בשנת 2017. המודל כולל הנחות
            לגבי הישרדות ביציות לאחר הפשרה, התפתחות לבלסטוציסט, תקינות כרומוזומלית והסיכוי
            ללידת חי.
          </p>
          <p className="mt-2.5 text-sm leading-relaxed text-ink/70 sm:text-[15px]">
            שיעורי ההצלחה עשויים להשתנות בין נשים, מרפאות, בתי חולים ומעבדות.
          </p>
          <p className="mt-4 text-xs font-semibold text-ink/50">מקורות:</p>
          <ul className="mt-1.5 space-y-1 text-xs leading-relaxed text-ink/50">
            {chanceSources.map((source) => (
              <li key={source.url}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-dotted underline-offset-2 hover:text-teal-700"
                >
                  {source.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 10. הבהרה רפואית */}
      <section className="mt-6 rounded-2xl bg-mist-50/60 p-4 sm:p-5">
        <p className="text-xs leading-relaxed text-ink/60 sm:text-sm">
          המידע באתר נועד להנגשת מידע כללי בלבד ואינו מהווה ייעוץ רפואי, אבחון או המלצה
          טיפולית. לקבלת הערכה אישית יש לפנות לרופא/ת פוריות.
        </p>
      </section>
    </div>
  );
}
