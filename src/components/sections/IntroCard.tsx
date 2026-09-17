"use client";

import { ArrowLeft, MapPin, Waypoints, FlaskConical } from "lucide-react";
import LineArtBloom from "@/components/LineArtBloom";
import Logo from "@/components/brand/Logo";

const benefits = [
  { icon: Waypoints, label: "מסלול מסודר שלב אחר שלב" },
  { icon: FlaskConical, label: "רשימת בדיקות ומשימות" },
  { icon: MapPin, label: "מידע על מקומות, עלויות וזכויות" },
];

interface IntroCardProps {
  ctaLabel: string;
  onCtaClick: () => void;
  /** מוצג מתחת לכפתור רק כשזה נכון בפועל לאופן שבו האתר שומר נתונים (localStorage) */
  showPersistenceNote?: boolean;
}

/**
 * כרטיס היכרות קצר בראש "המסלול שלי" — לא עמוד נחיתה נפרד, אלא שכבת
 * היכרות קומפקטית בתוך העמוד הקיים, כדי שמשתמשת חדשה תבין תוך שניות
 * מהו האתר ומאיפה להתחיל.
 */
export default function IntroCard({ ctaLabel, onCtaClick, showPersistenceNote = true }: IntroCardProps) {
  return (
    <section className="relative animate-fadeUp overflow-hidden rounded-2xl border-2 border-teal-200 bg-gradient-to-br from-teal-50 via-white to-deep/5 p-5 shadow-card sm:p-6 lg:p-8">
      {/* איור פרח עדין נוסף ברקע הכרטיס, בפינה הימנית-עליונה */}
      <LineArtBloom
        className="pointer-events-none absolute -top-8 -right-10 hidden h-32 w-28 rotate-[-12deg] text-teal-300/35 sm:block lg:h-40 lg:w-32"
        aria-hidden="true"
      />

      <div className="relative z-10 lg:flex lg:items-center lg:justify-between lg:gap-10">
        <div className="lg:max-w-xl">
          <Logo variant="full" />

          <p className="mt-4 font-sans text-base font-bold leading-snug text-deep sm:text-lg">
            גם את מרגישה שיש לך מיליון שאלות ואין לך מושג מאיפה להתחיל?
          </p>

          <h1 className="mt-2 font-sans text-2xl font-extrabold leading-tight tracking-tight text-ink sm:text-3xl">
            כל הדרך להקפאת ביציות, במקום אחד
          </h1>
          <p className="mt-2.5 text-sm leading-relaxed text-ink/70 sm:text-base">
            כאן תוכלי להבין מה עושים ובאיזה סדר, להכין את כל הבדיקות, להשוות בין מקומות ולעקוב
            אחרי ההתקדמות שלך.
          </p>

          <ul className="mt-4 flex flex-col gap-2 sm:mt-5">
            {benefits.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.label} className="flex items-center gap-2.5 text-sm font-medium text-ink/80">
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-700 ring-1 ring-inset ring-teal-100"
                    aria-hidden="true"
                  >
                    <Icon className="h-4 w-4" strokeWidth={2} />
                  </span>
                  {item.label}
                </li>
              );
            })}
          </ul>

          <div className="mt-5 sm:mt-6">
            <button
              type="button"
              onClick={onCtaClick}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-teal-600 px-7 py-3.5 text-sm font-bold tracking-wide text-ink shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-500 hover:shadow-cardHover active:translate-y-0 sm:w-auto"
            >
              {ctaLabel}
              <ArrowLeft
                className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
                strokeWidth={2.5}
              />
            </button>
            {showPersistenceNote && (
              <p className="mt-2 text-xs text-ink/50">ההתקדמות שלך נשמרת אוטומטית במכשיר הזה.</p>
            )}
          </div>
        </div>

        <div className="mt-6 hidden shrink-0 lg:mt-0 lg:block" aria-hidden="true">
          <LineArtBloom className="h-56 w-44 text-teal-300/70" />
        </div>
      </div>
    </section>
  );
}
