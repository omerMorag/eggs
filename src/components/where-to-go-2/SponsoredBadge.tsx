/**
 * §17: תג "ממומן/בשיתוף" גנרי, מוכן לשימוש עתידי (עדיין לא בשימוש בשום
 * מקום פעיל באתר). כל תוכן ממומן שייבנה בעתיד חייב לשאת את התג הזה בבירור
 * — לעולם לא להיראות כהמלצה עצמאית של מקפיאות.
 */
export default function SponsoredBadge({ label = "ממומן" }: { label?: "ממומן" | "בשיתוף" }) {
  return (
    <span className="inline-flex items-center rounded-full bg-warm-100 px-2 py-0.5 text-[11px] font-semibold text-warm-500 ring-1 ring-inset ring-warm-300/60">
      {label}
    </span>
  );
}
