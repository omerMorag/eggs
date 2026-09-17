"use client";

import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { LogIn, LogOut, RefreshCw, User } from "lucide-react";

/**
 * כפתור התחברות/התנתקות עם Google — לגמרי אופציונלי. מי שלא מתחברת ממשיכה
 * לעבוד בדיוק כמו היום (localStorage בלבד); כניסה עם Google מוסיפה סנכרון
 * ענן בין מכשירים/דפדפנים, מבלי לשנות שום התנהגות קיימת.
 */
export default function AuthControl() {
  const { data: session, status } = useSession();
  const [signingOut, setSigningOut] = useState(false);

  if (status === "loading") {
    return <div className="h-9 w-full animate-pulse rounded-full bg-mist-100" aria-hidden="true" />;
  }

  if (status === "authenticated" && session?.user) {
    const name = session.user.name ?? session.user.email ?? "מחוברת";

    return (
      <div className="flex items-center justify-between gap-2 rounded-full border-2 border-mist-200 bg-white px-2 py-1.5">
        <div className="flex min-w-0 items-center gap-2">
          {session.user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={session.user.image}
              alt=""
              className="h-6 w-6 shrink-0 rounded-full"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700">
              <User className="h-3.5 w-3.5" strokeWidth={2.5} />
            </span>
          )}
          <span className="truncate text-xs font-medium text-ink/70" title={name}>
            {name}
          </span>
        </div>
        <button
          type="button"
          onClick={() => {
            setSigningOut(true);
            signOut();
          }}
          disabled={signingOut}
          aria-label="התנתקות"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-ink/50 transition-colors hover:bg-mist-100 hover:text-ink/70 disabled:opacity-50"
        >
          <LogOut className="h-3.5 w-3.5" strokeWidth={2.25} />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => signIn("google")}
      className="flex w-full flex-col items-center gap-1 rounded-2xl border-2 border-warm-300 bg-warm-100/70 px-4 py-3 text-center shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-warm-100 hover:shadow-card"
    >
      <span className="inline-flex items-center gap-1.5 text-sm font-bold text-ink">
        <RefreshCw className="h-4 w-4" strokeWidth={2.25} />
        לסנכרן בין כל המכשירים שלך
      </span>
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink/60">
        <LogIn className="h-3.5 w-3.5" strokeWidth={2.25} />
        התחברות עם Google
      </span>
    </button>
  );
}
