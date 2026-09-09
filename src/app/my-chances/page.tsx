import Link from "next/link";
import { BarChart3, HelpCircle, ListChecks, Snowflake, Workflow } from "lucide-react";
import SectionHeading from "@/components/dashboard/SectionHeading";
import DisclaimerFooter from "@/components/DisclaimerFooter";
import ChanceCalculator from "@/components/chances/ChanceCalculator";
import IllustrativeAgeTable from "@/components/chances/IllustrativeAgeTable";
import EggsNeededTable from "@/components/chances/EggsNeededTable";
import ProcessDiagram from "@/components/chances/ProcessDiagram";
import ChanceFaq from "@/components/chances/ChanceFaq";
import { chanceSources, keyFacts } from "@/data/chanceContent";

export default function MyChancesPage() {
  return (
    <main className="min-h-screen">
      {/* פס עליון */}
      <div className="border-b border-mist-200 bg-mist-100/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5 text-deep">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-white">
              <Snowflake className="h-4 w-4" strokeWidth={2.5} />
            </span>
            <span className="font-sans text-base font-extrabold tracking-tight text-ink sm:text-lg">
              המסע להקפאת ביציות
            </span>
          </div>
          <Link
            href="/"
            className="text-sm font-medium tracking-wide text-teal-700 underline-offset-4 transition-colors hover:text-teal-800 hover:underline"
          >
            חזרה למפת הדרך
          </Link>
        </div>
      </div>

      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        {/* אזור פתיחה */}
        <section className="animate-fadeUp text-center">
          <span className="eyebrow justify-center">מה הסיכוי שלי?</span>
          <h1 className="mx-auto mt-3 max-w-xl font-sans text-2xl font-extrabold leading-tight tracking-tight text-ink sm:text-3xl md:text-4xl">
            כמה ביציות צריך להקפיא כדי להגדיל את הסיכוי לילד?
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-ink/70">
            הגיל שבו הביציות הוקפאו ומספר הביציות הבשלות שנשמרו הם שניים מהגורמים המרכזיים
            שמשפיעים על הסיכוי להשתמש בהן בעתיד ולהגיע ללידת חי. כאן תוכלי לקבל הערכה
            סטטיסטית פשוטה המבוססת על מודלים מחקריים.
          </p>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-ink/50">
            זהו כלי להמחשה ולהבנת הנתונים בלבד. הוא אינו תחזית רפואית אישית ואינו מבטיח
            היריון או לידה.
          </p>
          <a
            href="#calculator"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-teal-600 px-8 py-3.5 text-sm font-bold tracking-wide text-white shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-700 hover:shadow-cardHover active:translate-y-0"
          >
            בדקי את ההערכה שלך
          </a>
        </section>

        {/* שלושה דברים שכדאי לדעת */}
        <section className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-3">
          {keyFacts.map((fact) => {
            const Icon = fact.icon;
            return (
              <div
                key={fact.title}
                className="rounded-2xl border-2 border-mist-200 bg-white p-5 shadow-card sm:p-6"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-50 text-teal-700 ring-1 ring-inset ring-teal-100">
                  <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
                </span>
                <h3 className="mt-2.5 font-sans text-base font-bold tracking-tight text-ink">
                  {fact.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink/70">{fact.description}</p>
              </div>
            );
          })}
        </section>

        {/* המחשבון */}
        <section className="mt-10 sm:mt-14">
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
        <section className="mt-10 sm:mt-14">
          <SectionHeading icon={HelpCircle} title="שאלות נפוצות" />
          <ChanceFaq />
        </section>

        {/* מקורות והבהרה רפואית */}
        <section className="mt-10 animate-fadeUp rounded-2xl border-2 border-mist-200 bg-mist-50/60 p-5 sm:mt-14 sm:p-6">
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

        {/* אזור סיום */}
        <section className="mt-10 flex flex-col items-center gap-5 text-center sm:mt-14">
          <div>
            <h2 className="font-sans text-lg font-bold tracking-tight text-ink sm:text-xl">
              המספר הוא רק חלק מהתמונה
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-ink/70 sm:text-[15px]">
              הסטטיסטיקה יכולה לעזור להבין את האפשרויות, אבל היא לא מספרת את כל הסיפור האישי
              שלך. כל תהליך נראה אחרת, וכל ביצית שנשמרה היא אפשרות נוספת לעתיד.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-7 py-3 text-sm font-bold tracking-wide text-white shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-700 hover:shadow-cardHover active:translate-y-0"
            >
              איך נראה תהליך ההקפאה?
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-full px-5 py-3 text-sm font-medium text-ink/60 transition-colors hover:text-teal-700"
            >
              חזרה למסע שלי
            </Link>
          </div>
        </section>
      </div>

      <DisclaimerFooter />
    </main>
  );
}
