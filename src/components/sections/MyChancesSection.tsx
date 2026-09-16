"use client";

import { BarChart3, HelpCircle, ListChecks, Workflow } from "lucide-react";
import SectionHeading from "@/components/dashboard/SectionHeading";
import ChanceCalculator from "@/components/chances/ChanceCalculator";
import IllustrativeAgeTable from "@/components/chances/IllustrativeAgeTable";
import EggsNeededTable from "@/components/chances/EggsNeededTable";
import ProcessDiagram from "@/components/chances/ProcessDiagram";
import ChanceFaq from "@/components/chances/ChanceFaq";
import { chanceSources } from "@/data/chanceContent";

/**
 * "מה הסיכוי שלי?" — המחשבון הקיים וכל התוכן שמסביבו (chanceModel/chanceContent
 * ללא שינוי בנוסחאות). לפי הדרישה: בלי Hero גדול ובלי שלושת כרטיסי ההסבר —
 * המחשבון נפתח מיד אחרי כותרת קצרה.
 */
export default function MyChancesSection() {
  return (
    <div className="print-stack animate-fadeUp">
      <section>
        <h1 className="font-sans text-2xl font-extrabold leading-tight tracking-tight text-ink sm:text-3xl">
          כמה ביציות צריך להקפיא כדי להגדיל את הסיכוי לילד?
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/70 sm:text-base">
          הגיל שבו הביציות הוקפאו ומספר הביציות הבשלות שנשמרו הם שניים מהגורמים המרכזיים
          שמשפיעים על הסיכוי להשתמש בהן בעתיד ולהגיע ללידת חי. כאן תוכלי לקבל הערכה
          סטטיסטית פשוטה המבוססת על מודלים מחקריים.
        </p>
        <p className="mt-2 max-w-2xl text-xs leading-relaxed text-ink/50 sm:text-sm">
          זהו כלי להמחשה ולהבנת הנתונים בלבד. הוא אינו תחזית רפואית אישית ואינו מבטיח
          היריון או לידה.
        </p>
      </section>

      {/* המחשבון — מיד אחרי הכותרת, כנדרש */}
      <section className="mt-6 sm:mt-8">
        <ChanceCalculator />
      </section>

      {/* טבלת המחשה */}
      <section className="mt-10 sm:mt-14">
        <SectionHeading icon={BarChart3} title="אותו מספר ביציות – גיל שונה" />
        <p className="mb-4 text-sm leading-relaxed text-ink/70 sm:text-[15px]">
          הטבלה ממחישה מדוע הגיל בזמן ההקפאה משמעותי. אלו הערכות המבוססות על מודל מחקרי
          ואינן תחזית אישית.
        </p>
        <IllustrativeAgeTable />
      </section>

      {/* הדרך מביצית קפואה ללידת חי */}
      <section className="mt-10 sm:mt-14">
        <SectionHeading icon={Workflow} title="למה לא כל ביצית קפואה הופכת לילד?" />
        <p className="mb-4 text-sm leading-relaxed text-ink/70 sm:text-[15px]">
          בדרך מביצית שהוקפאה ועד ללידת חי יש כמה שלבים. בכל אחד מהם חלק מהביציות או
          העוברים עשויים שלא להמשיך לשלב הבא.
        </p>
        <ProcessDiagram />
        <p className="mt-4 text-sm leading-relaxed text-ink/60">
          לכן מספר הביציות שהוקפאו אינו זהה למספר העוברים, ההריונות או הילדים הצפויים.
        </p>
      </section>

      {/* כמה ביציות נחשב מספיק */}
      <section className="mt-10 sm:mt-14">
        <SectionHeading icon={ListChecks} title="אז כמה ביציות כדאי להקפיא?" />
        <p className="mb-4 text-sm leading-relaxed text-ink/70 sm:text-[15px]">
          אין מספר אחד שמתאים לכולן. המספר תלוי בגיל בזמן ההקפאה, במספר הילדים הרצוי
          ובנתונים האישיים. גם מודלים ומחקרים שונים עשויים להציג הערכות מעט שונות.
        </p>
        <EggsNeededTable />
        <p className="mt-4 text-sm leading-relaxed text-ink/60">
          המספרים הם נקודת התמצאות מחקרית בלבד. האיגוד האמריקאי לרפואת פריון מציין שאין
          כיום מספיק ראיות כדי לקבוע מספר מוחלט של ביציות הדרוש לכל אישה כדי להגיע ללידת
          חי.
        </p>
      </section>

      {/* שאלות נפוצות */}
      <section id="my-chances-faq" className="mt-10 sm:mt-14">
        <SectionHeading icon={HelpCircle} title="שאלות נפוצות" />
        <ChanceFaq />
      </section>

      {/* מקורות והבהרה רפואית */}
      <section className="mt-10 rounded-2xl border-2 border-mist-200 bg-mist-50/60 p-5 sm:mt-14 sm:p-6">
        <h2 className="font-sans text-lg font-bold tracking-tight text-ink sm:text-xl">
          חשוב לקרוא לפני שמסתמכים על המספר
        </h2>
        <p className="mt-2.5 text-sm leading-relaxed text-ink/70 sm:text-[15px]">
          המחשבון מציג הערכה המבוססת על מודל סטטיסטי שפורסם בשנת 2017. המודל כולל הנחות
          לגבי הישרדות ביציות לאחר הפשרה, התפתחות לבלסטוציסט, תקינות כרומוזומלית והסיכוי
          ללידת חי. הוא אינו מבוסס באופן בלעדי על נשים שחזרו להשתמש בביציות שהוקפאו מסיבות
          חברתיות.
        </p>
        <p className="mt-2.5 text-sm leading-relaxed text-ink/70 sm:text-[15px]">
          שיעורי ההצלחה עשויים להשתנות בין נשים, מרפאות, בתי חולים ומעבדות. המידע באתר
          אינו מהווה ייעוץ רפואי, אבחון או המלצה לעבור שאיבה נוספת. החלטות רפואיות יש
          לקבל עם רופא או רופאת פריון שמכירים את הנתונים האישיים שלך.
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
      </section>
    </div>
  );
}
