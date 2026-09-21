import { Stethoscope } from "lucide-react";

/**
 * §15: תמצית בלבד להכנת הקרקע לרופאים פרטיים בעתיד — מופרדת בבירור
 * מבחירת יחידה (§15: "אף פעם לא לערבב רופא פרטי לתוך רשימת בתי החולים
 * כאילו זה אותו דבר"). אין עדיין מאגר רופאים פעיל, ולכן ה-CTA מסומן
 * "בקרוב" ולא מוביל לעמוד ריק (הנחיה מפורשת בבקשה).
 */
export default function PrivateDoctorTeaser() {
  return (
    <section className="mt-8 rounded-2xl border-2 border-mist-200 bg-mist-50/50 p-5 sm:mt-10 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-deep shadow-card">
          <Stethoscope className="h-[18px] w-[18px]" strokeWidth={2} />
        </span>
        <div className="min-w-0">
          <h2 className="font-sans text-base font-bold tracking-tight text-ink sm:text-lg">
            רוצה לעבור את התהליך עם רופא/ה פרטי/ת?
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-ink/65">
            בחלק מהמסלולים אפשר לבחור רופא/ת פריון פרטי/ת שמלווה את התהליך.
          </p>
          <span className="mt-3 inline-flex min-h-[36px] cursor-not-allowed items-center gap-1.5 rounded-full bg-mist-200 px-4 text-sm font-bold text-ink/45">
            לרופאים פרטיים ←
            <span className="rounded-full bg-white px-1.5 py-0.5 text-[10px] font-semibold text-ink/40">בקרוב</span>
          </span>
        </div>
      </div>
    </section>
  );
}
