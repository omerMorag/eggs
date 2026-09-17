"use client";

import { useIsAdmin } from "@/lib/useIsAdmin";
import AdminModerationPanel from "@/components/stories/AdminModerationPanel";

/**
 * עמוד המודרציה — לא מופיע ב-navSections (ר' src/data/navSections.ts),
 * מוטען דרך dynamic import עם ssr:false ב-AppShell (לא נשלח ללקוחות רגילות
 * בכלל). useIsAdmin כאן הוא רק UX (הודעת "אין הרשאה" למי שמגיעה בכל זאת
 * דרך hash ישיר) — האכיפה האמיתית היחידה היא requireAdmin() בכל route.
 */
export default function AdminStoriesSection() {
  const isAdmin = useIsAdmin();

  if (!isAdmin) {
    return (
      <div className="animate-fadeUp rounded-2xl border-2 border-mist-200 bg-mist-50/60 p-6 text-center">
        <p className="text-sm text-ink/60">האזור הזה מיועד למנהלות המערכת בלבד.</p>
      </div>
    );
  }

  return (
    <div className="animate-fadeUp">
      <h1 className="font-sans text-2xl font-extrabold leading-tight tracking-tight text-ink sm:text-3xl">
        מודרציית סיפורים
      </h1>
      <div className="mt-6">
        <AdminModerationPanel />
      </div>
    </div>
  );
}
