import Link from "next/link";
import { ArrowLeft, Snowflake } from "lucide-react";
import RoadmapExperience from "@/components/roadmap/RoadmapExperience";
import DisclaimerFooter from "@/components/DisclaimerFooter";
import LineArtBloom from "@/components/LineArtBloom";
import ReadingMenu from "@/components/shared/ReadingMenu";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
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
          <div className="flex items-center gap-1 sm:gap-2">
            <ReadingMenu />
            <Link
              href="/dashboard"
              className="text-sm font-medium tracking-wide text-teal-700 underline-offset-4 transition-colors hover:text-teal-800 hover:underline"
            >
              כבר התחלתי
            </Link>
          </div>
        </div>
      </div>

      {/* כפתור "אני רוצה להתחיל" צף, נראה כל הזמן */}
      <Link
        href="/dashboard"
        className="group fixed bottom-5 left-4 z-40 inline-flex items-center gap-2 rounded-full bg-teal-600 px-5 py-3 text-sm font-bold tracking-[0.02em] text-white shadow-cardHover transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-700 active:translate-y-0 sm:bottom-6 sm:left-6 sm:px-6 sm:py-3.5"
      >
        אני רוצה להתחיל
        <ArrowLeft
          className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
          strokeWidth={2.5}
        />
      </Link>

      <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        {/* כותרת */}
        <section className="relative animate-fadeUp text-center">
          <LineArtBloom className="pointer-events-none absolute -right-16 top-1/2 hidden h-[280px] w-[220px] -translate-y-1/2 text-teal-300/70 lg:block xl:-right-24" />
          <LineArtBloom className="pointer-events-none absolute -left-16 top-1/2 hidden h-[220px] w-[170px] -translate-y-1/2 scale-x-[-1] text-warm-500/50 lg:block xl:-left-20" />
          <span className="eyebrow justify-center">המסע שלך מתחיל כאן</span>
          <h1 className="mt-3 font-sans text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl md:text-5xl">
            הדרך שלך להקפאת ביציות
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-ink/60 sm:text-lg">
            צעד אחר צעד, בפשטות ובלי ללכת לאיבוד.
          </p>
        </section>

        {/* תרשים זרימה אינטרקטיבי */}
        <section className="mt-10 sm:mt-14" aria-label="מסלול התהליך שלך">
          <RoadmapExperience />
        </section>

        {/* קריאה לפעולה */}
        <section className="mt-12 flex flex-col items-center text-center sm:mt-16">
          <Link
            href="/dashboard"
            className="group inline-flex items-center gap-2.5 rounded-full bg-teal-600 px-9 py-4 text-sm font-bold tracking-[0.04em] text-white shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-700 hover:shadow-cardHover active:translate-y-0"
          >
            אני רוצה להתחיל
            <ArrowLeft
              className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
              strokeWidth={2.5}
            />
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink/50">
            בעמוד הבא יחכו לך המשימות, הבדיקות ומעקב ההתקדמות שלך.
          </p>
        </section>
      </div>

      <DisclaimerFooter />
    </main>
  );
}
