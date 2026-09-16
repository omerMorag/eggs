"use client";

import { useState } from "react";
import { Archive, Banknote, Building2, HeartPulse, ListChecks, Scale } from "lucide-react";
import { fundingPaths } from "@/data/fundingPaths";
import { eligibilityQuota, mohCircularSource, mohStorageSource } from "@/data/eligibility";
import { healthFunds } from "@/data/healthFunds";
import { comparisonGuideSource, hospitalPrices } from "@/data/hospitalPrices";
import { privateCostComponents, privateCostExample, privateFacilitiesNoFixedPrice } from "@/data/privateCost";
import { beyondPriceFactors, questionsBeforeComparing, storageChecklist } from "@/data/comparisonChecklists";
import FundingPathSelector from "@/components/where-to-go/FundingPathSelector";
import EligibilityQuotaTable from "@/components/where-to-go/EligibilityQuotaTable";
import HealthFundTable from "@/components/where-to-go/HealthFundTable";
import HospitalPriceTable from "@/components/where-to-go/HospitalPriceTable";
import PrivateCostTable from "@/components/where-to-go/PrivateCostTable";
import SectionHeading from "@/components/dashboard/SectionHeading";

/**
 * "איפה כדאי לעשות?" — כל התוכן שהיה בעמוד /where-to-go, מאורגן סביב
 * בורר ארבעת מסלולי המימון כדי שלא יורגש כמאמר ארוך אחד. שום מידע, מחיר,
 * בית חולים, מקור או הסתייגות לא נמחקו — רק שונה הסידור.
 */
export default function WhereToGoSection() {
  const [activePath, setActivePath] = useState(0);

  return (
    <div className="print-stack animate-fadeUp">
      {/* כותרת */}
      <section>
        <h1 className="font-sans text-2xl font-extrabold leading-tight tracking-tight text-ink sm:text-3xl">
          איפה כדאי להקפיא ביציות – וכמה זה באמת עולה?
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/70 sm:text-base">
          אין מקום אחד שמתאים לכולן. אפשר לעבור את התהליך בבית חולים ציבורי, דרך הסדר של
          הביטוח המשלים או במסלול פרטי עם רופא/ה שבחרת.
        </p>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/70">
          לפני שאת משווה מחירים, חשוב להבין באיזה מסלול את זכאית לעבור את התהליך, מה כל
          מחיר כולל ואילו הוצאות נוספות עשויות להתווסף. לפעמים מחיר שנראה זול אינו כולל
          תרופות, פגישת ייעוץ או אחסון, ולעומת זאת מחיר גבוה יותר עשוי לכלול ליווי רפואי
          ואחסון למספר שנים.
        </p>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/60">
          בחרי למטה את המסלול שהכי מתאים לך כדי לראות את המידע הרלוונטי.
        </p>
      </section>

      {/* בורר ארבעת המסלולים */}
      <section className="mt-6 sm:mt-8">
        <FundingPathSelector activeIndex={activePath} onSelect={setActivePath} />
      </section>

      {/* תוכן המסלול הנבחר */}
      <section className="mt-5 sm:mt-6">
        {/* מסלול 1: שימור פוריות מסיבה רפואית */}
        {activePath === 0 && (
          <div id="funding-path-panel-0" role="tabpanel" className="animate-fadeUp">
            <div className="rounded-2xl border-2 border-teal-200 bg-teal-50/60 p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-teal-700 shadow-card">
                  <HeartPulse className="h-[18px] w-[18px]" strokeWidth={2} />
                </span>
                <div className="min-w-0">
                  <h2 className="font-sans text-lg font-bold tracking-tight text-ink sm:text-xl">
                    לפני הכול: האם את זכאית למימון רפואי?
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-ink/70 sm:text-[15px]">
                    {fundingPaths[0].description}
                  </p>
                  <div className="mt-2.5 space-y-2.5 text-sm leading-relaxed text-ink/70 sm:text-[15px]">
                    <p>
                      לפני שמשלמים מחיר מלא, כדאי לבדוק אם קיימת סיבה רפואית שיכולה להקנות
                      זכאות לשימור פוריות במסגרת סל הבריאות.
                    </p>
                    <p>
                      זכאות רפואית עשויה להיות רלוונטית, בין היתר, לפני טיפולים שעלולים לפגוע
                      בפוריות, במצבים מסוימים של רזרבה שחלתית ירודה, לפני ניתוח שעלול לפגוע
                      בשחלות, במקרים מסוימים של אנדומטריוזיס ובמצבים גנטיים הקשורים לסיכון
                      לאל־וסת מוקדמת.
                    </p>
                    <p>
                      הקריטריונים אינם נקבעים לפי בדיקה אחת בלבד, ולכן תוצאה נמוכה של AMH,
                      למשל, אינה מהווה בהכרח אישור אוטומטי. רופא/ת הפוריות והקופה צריכים לבדוק
                      את התמונה המלאה ואת העמידה בתנאי הסל.
                    </p>
                    <p>
                      במסלולים רפואיים מסוימים הזכאות היא עד ארבעה מחזורי טיפול או עד 20
                      ביציות, ובנשאיות של פרה־מוטציה ל־X שביר עשויים לחול תנאים אחרים. לכן אין
                      להשתמש במספרים האלה כדי להסביר את המסלול האלקטיבי הרגיל.{" "}
                      <a
                        href="https://www.maccabi4u.co.il/new/eligibilites/1834/"
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold underline-offset-4 hover:underline"
                      >
                        פירוט זכאות רפואית במכבי
                      </a>
                    </p>
                    <p>
                      גם אם הגעת כדי לבצע הקפאה מבחירה, שווה לברר קודם עם הקופה האם הנתונים
                      הרפואיים שלך עשויים להתאים למסלול שממומן בסל.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* מסלול 2: הקפאה דרך הביטוח המשלים */}
        {activePath === 1 && (
          <div id="funding-path-panel-1" role="tabpanel" className="animate-fadeUp">
            <SectionHeading
              icon={Banknote}
              title="הקפאת ביציות דרך קופות החולים"
              subtitle="שימור פוריות מבחירה דרך הביטוח המשלים — לא זכאות רפואית בסל"
            />
            <p className="mb-4 text-sm leading-relaxed text-ink/70 sm:text-[15px]">
              {fundingPaths[1].description}
            </p>
            <HealthFundTable rows={healthFunds} />
            <p className="mt-4 rounded-xl bg-mist-50 p-3.5 text-sm leading-relaxed text-ink/70">
              <span className="font-semibold text-ink">חשוב:</span> זכאות של הקופה אינה מבטלת
              את מגבלות משרד הבריאות. לפני קביעת תור יש לבדוק באתר הקופה את הגיל המדויק, הוותק
              הנדרש, מספר הסבבים, בתי החולים שבהסדר ועלות התרופות.
            </p>
          </div>
        )}

        {/* מסלול 3: תשלום עצמי בבית חולים ציבורי */}
        {activePath === 2 && (
          <div id="funding-path-panel-2" role="tabpanel" className="animate-fadeUp">
            <SectionHeading
              icon={Scale}
              title="הקפאה מבחירה: מי יכולה לבצע וכמה ביציות מותר להקפיא?"
            />
            <p className="mb-4 text-sm leading-relaxed text-ink/70 sm:text-[15px]">
              {fundingPaths[2].description}
            </p>
            <p className="mb-4 text-sm leading-relaxed text-ink/70 sm:text-[15px]">
              בישראל ניתן לבצע הקפאת ביציות מסיבות שאינן רפואיות החל מגיל 30 ועד לפני גיל 41.
              לפי הנוהל המעודכן:
            </p>
            <EligibilityQuotaTable rows={eligibilityQuota} />
            <div className="mt-4 space-y-2.5 text-sm leading-relaxed text-ink/70 sm:text-[15px]">
              <p>
                הטיפול מסתיים כאשר מגיעים למספר השאיבות המרבי או למכסת הביציות הרלוונטית, לפי
                המוקדם מביניהם.
              </p>
              <p>
                אם המכסה המלאה הושגה כבר בשאיבה הראשונה, היחידה רשאית לאשר שאיבה נוספת אחת,
                אך היא אינה מחויבת לכך. אישה שהחלה את התהליך לפני גיל 41 יכולה, בתנאים
                מסוימים, להמשיך אותו ברצף גם לאחר מכן.{" "}
                <a
                  href={mohCircularSource.url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-teal-700 underline-offset-4 hover:text-teal-800 hover:underline"
                >
                  {mohCircularSource.label}
                </a>
              </p>
            </div>

            <div className="mt-6 rounded-2xl border-2 border-warm-300/70 bg-warm-100/60 p-5 sm:p-6">
              <h3 className="font-sans text-base font-bold tracking-tight text-ink sm:text-lg">
                מה פירוש ״עד 25 ביציות״?
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70 sm:text-[15px]">
                זו תקרה חוקית, ולא הבטחה שבסבב אחד יישאבו או יוקפאו 25 ביציות. בכל סבב יכולים
                להיות מספרים שונים:
              </p>
              <ul className="mt-2.5 list-disc space-y-1 pr-5 text-sm leading-relaxed text-ink/70 sm:text-[15px]">
                <li>מספר הזקיקים שנצפו במעקב.</li>
                <li>מספר הביציות שנשאבו.</li>
                <li>מספר הביציות שנמצאו בשלות.</li>
                <li>מספר הביציות שהתאימו להקפאה.</li>
              </ul>
              <p className="mt-2.5 text-sm leading-relaxed text-ink/70 sm:text-[15px]">
                המספרים האלה אינם בהכרח זהים. ייתכן שיידרש יותר מסבב אחד כדי להגיע למספר
                הביציות הרצוי, וייתכן שהרופא/ה ימליצו לעצור לפני המכסה בהתאם לתגובה לטיפול
                ולמצב הרפואי.
              </p>
              <p className="mt-2.5 text-sm leading-relaxed text-ink/70 sm:text-[15px]">
                גם הקפאה של 25 או 35 ביציות אינה מבטיחה היריון או לידה בעתיד. הסיכוי מושפע
                בעיקר מהגיל שבו הביציות הוקפאו, ממספר הביציות הבשלות ומגורמים רפואיים נוספים.
              </p>
            </div>

            <div className="mt-6">
              <SectionHeading
                icon={Building2}
                title="מחירון בתי חולים בתשלום עצמי"
                subtitle="הקפאה מבחירה, מחיר עצמי ללא סבסוד — לפי מה שפורסם"
              />
              <HospitalPriceTable rows={hospitalPrices} />
              <p className="mt-4 text-xs leading-relaxed text-ink/45">
                חלק מהמחירים אומתו בפרסום הרשמי של בית החולים, וחלק מבוססים על מדריכי השוואה
                ברשת (בעיקר{" "}
                <a
                  href={comparisonGuideSource.url}
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-dotted underline-offset-2 hover:text-teal-700"
                >
                  {comparisonGuideSource.label}
                </a>
                ) ולא על מחירון עדכני שנמצא באתר הרשמי של כל יחידה — אלה מסומנים ״דורש אימות״.
                אין להסתמך על התאריך הנוכחי כמחיר מעודכן עד שמתקשרים לכל יחידה.
              </p>
            </div>
          </div>
        )}

        {/* מסלול 4: מסלול פרטי */}
        {activePath === 3 && (
          <div id="funding-path-panel-3" role="tabpanel" className="animate-fadeUp">
            <SectionHeading icon={Building2} title="כמה עולה מסלול פרטי?" />
            <p className="mb-4 text-sm leading-relaxed text-ink/70 sm:text-[15px]">
              {fundingPaths[3].description}
            </p>
            <p className="mb-4 text-sm leading-relaxed text-ink/70 sm:text-[15px]">
              במסלול פרטי אין מחיר אחיד. העלות מורכבת בדרך כלל מכמה חלקים:
            </p>
            <PrivateCostTable rows={privateCostComponents} />

            <div className="mt-5 rounded-2xl border-2 border-mist-200 bg-white p-5 shadow-card sm:p-6">
              <h3 className="font-sans text-base font-bold tracking-tight text-ink sm:text-lg">
                דוגמה לחישוב
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-ink/60">נניח שקיבלת את ההצעה הבאה:</p>
              <ul className="mt-2.5 list-disc space-y-1 pr-5 text-sm leading-relaxed text-ink/70">
                {privateCostExample.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="mt-3 text-sm leading-relaxed text-ink/70">
                העלות הכוללת היא הסכום של כל הרכיבים, ולא רק ״מחיר השאיבה״. לכן כדאי לבקש
                הצעת מחיר כתובה גם מהרופא/ה וגם מבית החולים.
              </p>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-ink/60">
              {privateFacilitiesNoFixedPrice.join(", ")} אינם מפרסמים כיום באתריהם מחיר כולל
              ואחיד למסלול פרטי, ולכן אי אפשר להציג עבורם מספר קבוע — לגביהם מוצג ״לקבלת הצעת
              מחיר״ עד לקבלת מחירון ישיר ומעודכן.
            </p>
          </div>
        )}
      </section>

      {/* מידע כללי שרלוונטי לכל המסלולים */}
      <section className="mt-10 sm:mt-14">
        <SectionHeading icon={ListChecks} title="מה צריך לבדוק לפני שמשווים מחירים?" />
        <p className="mb-3 text-sm leading-relaxed text-ink/70 sm:text-[15px]">
          שני מחירים שנראים דומים לא בהכרח כוללים את אותם דברים. לפני שאת מחליטה, שאלי כל
          יחידה:
        </p>
        <div className="rounded-2xl border-2 border-mist-200 bg-white p-5 shadow-card sm:p-6">
          <ul className="grid gap-2 text-sm leading-relaxed text-ink/70 sm:grid-cols-2 sm:text-[15px]">
            {questionsBeforeComparing.map((q) => (
              <li key={q} className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400" />
                {q}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-10 sm:mt-14">
        <h2 className="font-sans text-lg font-bold tracking-tight text-ink sm:text-xl">
          לא לבחור רק לפי המחיר
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink/70 sm:text-[15px]">
          המחיר חשוב, אבל הוא אינו הדבר היחיד שישפיע על החוויה שלך. במהלך הסבב תצטרכי
          להגיע למספר מעקבי בוקר, לפעמים בהתראה קצרה. לכן גם המרחק מהבית, זמינות התורים
          ושעות הפעילות יכולים להיות משמעותיים.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-ink/70 sm:text-[15px]">כדאי להשוות גם:</p>
        <ul className="mt-2.5 grid gap-2 text-sm leading-relaxed text-ink/70 sm:grid-cols-2 sm:text-[15px]">
          {beyondPriceFactors.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-warm-500" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 rounded-2xl border-2 border-teal-200 bg-teal-50/60 p-5 sm:mt-14 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-teal-700 shadow-card">
            <Archive className="h-[18px] w-[18px]" strokeWidth={2} />
          </span>
          <div className="min-w-0">
            <h2 className="font-sans text-lg font-bold tracking-tight text-ink sm:text-xl">
              חשוב לדעת על אחסון הביציות
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink/70 sm:text-[15px]">
              הביציות נשמרות בדרך כלל לתקופה ראשונית של עד חמש שנים, עם אפשרות להאריך את
              האחסון. האחריות ליצור קשר עם היחידה, לעדכן פרטים ולהסדיר את המשך השמירה
              והתשלום היא של המטופלת.{" "}
              <a
                href={mohStorageSource.url}
                target="_blank"
                rel="noreferrer"
                className="font-semibold underline-offset-4 hover:underline"
              >
                {mohStorageSource.label}
              </a>
            </p>
            <p className="mt-3 text-sm font-semibold text-ink/80">מומלץ לשמור במקום מסודר:</p>
            <ul className="mt-1.5 grid gap-1.5 text-sm leading-relaxed text-ink/70 sm:grid-cols-2">
              {storageChecklist.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border-2 border-mist-200 bg-mist-50/60 p-4 sm:mt-10 sm:p-5">
        <p className="text-sm leading-relaxed text-ink/70">
          <span className="font-semibold text-ink">הערה:</span> המחירים וההסדרים עשויים
          להשתנות. הנתונים נועדו לסייע בהשוואה ראשונית ואינם מהווים הצעת מחיר מטעם בית
          החולים או קופת החולים. לפני קביעת תור או ביצוע תשלום יש לאמת מול היחידה מהו
          המחיר העדכני, מה הוא כולל, מהי הזכאות דרך הקופה ומהם תנאי הביטול וההחזר.
        </p>
      </section>

      <section className="mt-8 border-t border-mist-200 pt-6 text-xs leading-relaxed text-ink/40">
        <p className="font-semibold text-ink/50">מקורות עיקריים:</p>
        <p className="mt-1 text-ink/40">
          מקורות ספציפיים לכל בית חולים מופיעים בכפתור ״פרטים נוספים״ של השורה שלו בטבלת
          המחירים שמעלה.
        </p>
        <ul className="mt-2 space-y-1">
          <li>
            <a
              href={mohCircularSource.url}
              target="_blank"
              rel="noreferrer"
              className="underline decoration-dotted underline-offset-2 hover:text-teal-700"
            >
              {mohCircularSource.label} — משרד הבריאות
            </a>
          </li>
          <li>
            <a
              href={mohStorageSource.url}
              target="_blank"
              rel="noreferrer"
              className="underline decoration-dotted underline-offset-2 hover:text-teal-700"
            >
              {mohStorageSource.label}
            </a>
          </li>
          <li>
            <a
              href="https://mushlam.clalit.co.il/he/content_worlds/pregnancy-and-childbirth/Pages/Fertility-preservation.aspx"
              target="_blank"
              rel="noreferrer"
              className="underline decoration-dotted underline-offset-2 hover:text-teal-700"
            >
              תנאי כללית מושלם — שימור פוריות
            </a>
          </li>
          <li>
            <a
              href="https://www.maccabi4u.co.il/eligibilites/117173/"
              target="_blank"
              rel="noreferrer"
              className="underline decoration-dotted underline-offset-2 hover:text-teal-700"
            >
              תנאי מכבי שלי — שימור פוריות לנשים
            </a>
          </li>
          <li>
            <a
              href="https://www.maccabi4u.co.il/new/eligibilites/1834/"
              target="_blank"
              rel="noreferrer"
              className="underline decoration-dotted underline-offset-2 hover:text-teal-700"
            >
              שימור פוריות לנשים — תנאי זכאות רפואית — מכבי שירותי בריאות
            </a>
          </li>
          <li>
            <a
              href="https://www.ynet.co.il/health/article/skzmnuamgg"
              target="_blank"
              rel="noreferrer"
              className="underline decoration-dotted underline-offset-2 hover:text-teal-700"
            >
              לאומית מצטרפת להליך הקפאת ביציות שלא מטעמים רפואיים — Ynet (סיקור תקשורתי,
              לא עמוד רשמי של הקופה)
            </a>
          </li>
          <li>
            <a
              href={comparisonGuideSource.url}
              target="_blank"
              rel="noreferrer"
              className="underline decoration-dotted underline-offset-2 hover:text-teal-700"
            >
              {comparisonGuideSource.label}
            </a>
          </li>
          <li>
            <a
              href="https://www.hon.co.il/%D7%94%D7%A7%D7%A4%D7%90%D7%AA-%D7%91%D7%99%D7%A6%D7%99%D7%95%D7%AA-%D7%9B%D7%9E%D7%94-%D7%96%D7%94-%D7%A2%D7%95%D7%9C%D7%94-%D7%95%D7%91%D7%90%D7%99%D7%9C%D7%95-%D7%9E%D7%A7%D7%A8%D7%99%D7%9D/"
              target="_blank"
              rel="noreferrer"
              className="underline decoration-dotted underline-offset-2 hover:text-teal-700"
            >
              הקפאת ביציות — כמה זה עולה ומתי המדינה מסבסדת — Hon
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
