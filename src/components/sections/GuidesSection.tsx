"use client";

import { ArrowLeft, HelpCircle, MapPin } from "lucide-react";
import { epilogueItems } from "@/data/epilogue";
import EpilogueCard from "@/components/shared/EpilogueCard";
import HenIllustration from "@/components/hens/HenIllustration";

/**
 * "מידע ומדריכים" — תוכן משלים קיים (מה קורה אחרי השאיבה / שימוש עתידי
 * בביציות) כרשימת כרטיסי Accordion קצרים. השאלות הנפוצות של המחשבון ומידע
 * האחסון כבר נמצאים ב"מה הסיכוי שלי?" וב"איפה כדאי לעשות?" בהתאמה —
 * כדי לא לשכפל תוכן, כאן מוצג רק קישור מהיר אליהם (לא הטקסט המלא פעמיים).
 */
export default function GuidesSection() {
  return (
    <div className="print-stack animate-fadeUp">
      <section className="lg:flex lg:items-center lg:justify-between lg:gap-8">
        <div className="min-w-0">
          <h1 className="font-sans text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            מידע ומדריכים
          </h1>
          <p className="mt-1.5 max-w-lg text-sm leading-relaxed text-ink/60 sm:text-base">
            מידע נוסף שיכול לעזור לאורך הדרך — מה קורה אחרי השאיבה, ומה קורה כשתרצי להשתמש
            בביציות בעתיד.
          </p>
        </div>

        {/* התרנגולת הקוראת — מוצגת במובייל אחרי הכותרת והתקציר, ובדסקטופ בצד הנגדי לטקסט */}
        <div className="no-print mt-4 flex justify-center lg:mt-0 lg:shrink-0 lg:justify-end">
          <HenIllustration name="learning" blob="mint" />
        </div>
      </section>

      <section className="mt-6 flex flex-col gap-2.5 sm:mt-8 sm:gap-3">
        {epilogueItems.map((item) => (
          <EpilogueCard key={item.title} {...item} />
        ))}
      </section>

      {/* קישורים מהירים למידע קשור באזורים אחרים, בלי לשכפל את התוכן */}
      <section className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-2">
        <a
          href="#my-chances"
          className="group flex items-center justify-between gap-3 rounded-2xl border-2 border-mist-200 bg-white p-4 shadow-card transition-colors duration-300 hover:border-teal-200 hover:bg-teal-50/30 sm:p-5"
        >
          <span className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-700 ring-1 ring-inset ring-teal-100">
              <HelpCircle className="h-[18px] w-[18px]" strokeWidth={2} />
            </span>
            <span>
              <span className="block text-sm font-bold text-ink">שאלות נפוצות על הסיכויים</span>
              <span className="block text-xs text-ink/55">נמצא באזור ״מה הסיכוי שלי?״</span>
            </span>
          </span>
          <ArrowLeft
            className="h-4 w-4 shrink-0 text-ink/40 transition-transform duration-300 group-hover:-translate-x-1"
            strokeWidth={2.25}
          />
        </a>

        <a
          href="#where-to-go"
          className="group flex items-center justify-between gap-3 rounded-2xl border-2 border-mist-200 bg-white p-4 shadow-card transition-colors duration-300 hover:border-teal-200 hover:bg-teal-50/30 sm:p-5"
        >
          <span className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-700 ring-1 ring-inset ring-teal-100">
              <MapPin className="h-[18px] w-[18px]" strokeWidth={2} />
            </span>
            <span>
              <span className="block text-sm font-bold text-ink">מידע על אחסון הביציות</span>
              <span className="block text-xs text-ink/55">נמצא באזור ״איפה כדאי לעשות?״</span>
            </span>
          </span>
          <ArrowLeft
            className="h-4 w-4 shrink-0 text-ink/40 transition-transform duration-300 group-hover:-translate-x-1"
            strokeWidth={2.25}
          />
        </a>
      </section>
    </div>
  );
}
