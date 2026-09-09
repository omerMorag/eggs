import { Building2, FlaskConical, Zap } from "lucide-react";

const timeSaverItems = [
  { icon: FlaskConical, label: "פנייה לרופא/ה ותחילת הבדיקות" },
  { icon: Building2, label: "בירור איפה לעבור את התהליך" },
];

export default function TimeSaverSection() {
  return (
    <section className="rounded-2xl border-2 border-warm-300/60 bg-warm-100/50 p-5 shadow-card sm:p-6">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-warm-500 shadow-sm ring-1 ring-warm-300/50">
          <Zap className="h-4 w-4" strokeWidth={2} />
        </span>
        <h2 className="font-sans text-lg font-bold tracking-tight text-ink sm:text-xl">חוסכות זמן</h2>
      </div>
      <p className="mt-1 text-sm text-ink/60">את שני אלה אפשר להתחיל כבר עכשיו, בלי לחכות זה לזה:</p>
      <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {timeSaverItems.map((item) => {
          const Icon = item.icon;
          return (
            <li
              key={item.label}
              className="flex items-center gap-2.5 rounded-xl bg-white/80 px-3.5 py-3 text-sm font-medium text-ink/80 ring-1 ring-warm-300/40"
            >
              <Icon className="h-4 w-4 shrink-0 text-warm-500" strokeWidth={2} />
              {item.label}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
