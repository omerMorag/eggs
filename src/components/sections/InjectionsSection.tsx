"use client";

import { useEffect, useMemo, useState } from "react";
import { signIn } from "next-auth/react";
import { CalendarDays, Cloud, CloudOff, Info, LayoutList, Table2 } from "lucide-react";
import HenIllustration from "@/components/hens/HenIllustration";
import DayPanel from "@/components/injections/DayPanel";
import { DayStrip, PeriodTable } from "@/components/injections/JournalViews";
import GuidesLibrary from "@/components/injections/GuidesLibrary";
import { useInjectionJournal } from "@/lib/useInjectionJournal";
import { cycleDates, cycleMedGuideIds, formatDateLong, todayISO, type JournalCycle } from "@/lib/injectionJournal";

const inputCls =
  "mt-1 block w-full rounded-lg border border-mist-200 bg-white px-3 py-2 text-sm text-ink focus:border-teal-400 focus:outline-none";

/**
 * "תקופת הזריקות" — יומן אישי לתקופת הזריקות, מחובר לשלב 6 במסלול (קישור
 * משם). נפרד לגמרי מהתקדמות המסלול: מילוי היומן לא מסמן את שלב הזריקות
 * ולא מפעיל את רגע הסיום. הנתונים נשמרים דרך useInjectionJournal.
 */
export default function InjectionsSection() {
  const api = useInjectionJournal();
  const { ready, activeCycle, journal } = api;
  const [today, setToday] = useState<string>("");
  const [selected, setSelected] = useState<string>("");
  const [tableView, setTableView] = useState(false);
  const [openGuideId, setOpenGuideId] = useState<string | null>(null);
  const [showAllGuides, setShowAllGuides] = useState(false);

  useEffect(() => setToday(todayISO()), []);

  const dates = useMemo(() => (activeCycle && today ? cycleDates(activeCycle, today) : []), [activeCycle, today]);

  // יום נבחר ביומן: היום (אם בטווח), אחרת יום ההתחלה
  useEffect(() => {
    if (!activeCycle || !today) return;
    setSelected((prev) => {
      if (prev && dates.includes(prev)) return prev;
      return dates.includes(today) ? today : activeCycle.startDate;
    });
  }, [activeCycle, today, dates]);

  const myGuideIds = useMemo(() => cycleMedGuideIds(activeCycle), [activeCycle]);

  const openGuide = (guideId: string | null) => {
    if (guideId) {
      setOpenGuideId(guideId);
      if (!myGuideIds.includes(guideId)) setShowAllGuides(true);
    } else {
      setShowAllGuides(true);
    }
    // גלילה פנימית בלבד — בלי לשנות את ה-hash (שמשמש לניווט בין אזורי האתר)
    requestAnimationFrame(() => {
      const target = document.getElementById(guideId ? `guide-${guideId}` : "injection-guides");
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    });
  };

  // "היום שלי" מציג את היום בפועל; לפני תחילת הסבב — את יום ההתחלה
  const todayPanelDate = activeCycle && today ? (today < activeCycle.startDate ? activeCycle.startDate : today) : "";

  return (
    <div className="print-stack animate-fadeUp">
      {/* 1. פתיחה */}
      <section className="lg:flex lg:items-center lg:justify-between lg:gap-8">
        <div className="min-w-0 flex-1">
          <h1 className="font-sans text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">תקופת הזריקות</h1>
          <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-ink/65 sm:text-base">
            לא צריך לזכור הכול לבד. כאן אפשר לרכז את הזריקות, הבדיקות וההנחיות שקיבלת לאורך הסבב.
          </p>
          <p className="mt-3 flex max-w-xl items-start gap-2 rounded-xl border-2 border-teal-100 bg-teal-50/70 px-3.5 py-2.5 text-sm leading-relaxed text-ink/80">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" strokeWidth={2.25} aria-hidden="true" />
            את המינון, השעה ושינויי הטיפול קובעת היחידה המטפלת. היומן עוזר לך לתעד את ההנחיות שקיבלת.
          </p>
        </div>
        <div className="no-print mt-4 flex justify-center lg:mt-0 lg:shrink-0 lg:justify-end">
          <HenIllustration name="step-injections" blob="mint" sizeClassName="w-24 sm:w-32 lg:w-44" />
        </div>
      </section>

      <SyncNote api={api} />

      {!ready || !today ? (
        <p className="mt-8 text-sm text-ink/50">טוענת את היומן…</p>
      ) : !activeCycle ? (
        <CycleSetup onCreate={api.createCycle} defaultDate={today} />
      ) : (
        <>
          <CycleBar api={api} cycle={activeCycle} cycles={journal.cycles} />

          {/* 2. היום שלי */}
          <section aria-labelledby="today-title" className="mt-5 rounded-3xl border-2 border-mist-200 bg-white p-4 shadow-card sm:p-6">
            <h2 id="today-title" className="text-xs font-bold uppercase tracking-wide text-teal-700">
              היום שלי
            </h2>
            <div className="mt-1.5">
              <DayPanel
                key={`today-${todayPanelDate}`}
                cycle={activeCycle}
                date={todayPanelDate}
                today={today}
                onUpdateCycle={api.updateActiveCycle}
                onOpenGuide={openGuide}
                variant="today"
              />
            </div>
          </section>

          {/* 3. יומן ימים ובדיקות */}
          <section aria-labelledby="journal-title" className="mt-8">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <h2 id="journal-title" className="font-sans text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
                יומן הימים והמעקבים
              </h2>
              <div className="hidden gap-1 rounded-full bg-mist-100 p-1 md:flex" role="group" aria-label="תצוגת היומן">
                <button
                  type="button"
                  aria-pressed={!tableView}
                  onClick={() => setTableView(false)}
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold ${!tableView ? "bg-white text-ink shadow-sm" : "text-ink/60"}`}
                >
                  <LayoutList className="h-3.5 w-3.5" strokeWidth={2.25} />
                  יום אחרי יום
                </button>
                <button
                  type="button"
                  aria-pressed={tableView}
                  onClick={() => setTableView(true)}
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold ${tableView ? "bg-white text-ink shadow-sm" : "text-ink/60"}`}
                >
                  <Table2 className="h-3.5 w-3.5" strokeWidth={2.25} />
                  טבלה של כל התקופה
                </button>
              </div>
            </div>

            {tableView ? (
              <div className="mt-3 rounded-2xl border-2 border-mist-200 bg-white p-3">
                <PeriodTable
                  cycle={activeCycle}
                  dates={dates}
                  today={today}
                  onSelect={(d) => {
                    setSelected(d);
                    setTableView(false);
                  }}
                />
              </div>
            ) : (
              <>
                <div className="mt-3">
                  <DayStrip cycle={activeCycle} dates={dates} selected={selected} today={today} onSelect={setSelected} />
                </div>
                {selected && (
                  <div className="mt-2 rounded-3xl border-2 border-mist-200 bg-white p-4 shadow-card sm:p-6">
                    <DayPanel
                      key={`journal-${selected}`}
                      cycle={activeCycle}
                      date={selected}
                      today={today}
                      onUpdateCycle={api.updateActiveCycle}
                      onOpenGuide={openGuide}
                      variant="journal"
                    />
                  </div>
                )}
              </>
            )}
          </section>
        </>
      )}

      {/* 4. איך מזריקים? */}
      <div className="mt-10 border-t border-mist-200 pt-8">
        <GuidesLibrary
          myGuideIds={myGuideIds}
          openGuideId={openGuideId}
          onToggleGuide={(id) => setOpenGuideId((cur) => (cur === id ? null : id))}
          showAll={showAllGuides}
          onToggleShowAll={() => setShowAllGuides((v) => !v)}
        />
      </div>
    </div>
  );
}

function SyncNote({ api }: { api: ReturnType<typeof useInjectionJournal> }) {
  if (!api.ready) return null;
  if (!api.isSignedIn) {
    return (
      <p className="no-print mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink/55" data-testid="sync-note">
        <CloudOff className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
        היומן נשמר רק בדפדפן הזה.
        <button type="button" onClick={() => signIn("google")} className="font-semibold text-teal-700 hover:underline">
          התחברי עם Google כדי לשמור אותו בחשבון
        </button>
      </p>
    );
  }
  const text =
    api.syncState === "offline"
      ? "אין כרגע חיבור לשמירה בחשבון — השינויים נשמרים בדפדפן ויישמרו בחשבון כשיחזור החיבור."
      : api.syncState === "saving" || api.syncState === "loading"
        ? "שומרת בחשבון…"
        : "היומן נשמר בחשבון שלך.";
  return (
    <p className="no-print mt-4 flex items-center gap-2 text-xs text-ink/55" data-testid="sync-note">
      {api.syncState === "offline" ? <CloudOff className="h-3.5 w-3.5" strokeWidth={2} /> : <Cloud className="h-3.5 w-3.5" strokeWidth={2} />}
      {text}
    </p>
  );
}

function CycleSetup({ onCreate, defaultDate }: { onCreate: (startDate: string, label: string) => void; defaultDate: string }) {
  const [date, setDate] = useState(defaultDate);
  const [label, setLabel] = useState("הסבב שלי");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (date) onCreate(date, label.trim() || "הסבב שלי");
      }}
      className="mt-6 rounded-3xl border-2 border-mist-200 bg-white p-5 shadow-card sm:p-6"
      data-testid="cycle-setup"
    >
      <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
        <CalendarDays className="h-5 w-5 text-teal-700" strokeWidth={2} aria-hidden="true" />
        מתי מתחילות הזריקות?
      </h2>
      <p className="mt-1 text-sm text-ink/60">לפי התאריך הזה נחשב את ״יום 1״, ״יום 2״ וכן הלאה. אפשר לשנות אותו בהמשך.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="block text-xs font-semibold text-ink/70">
          יום הזריקה הראשון
          <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} dir="ltr" />
        </label>
        <label className="block text-xs font-semibold text-ink/70">
          שם לסבב (לא חובה)
          <input value={label} onChange={(e) => setLabel(e.target.value)} className={inputCls} maxLength={60} />
        </label>
      </div>
      <button type="submit" className="mt-4 min-h-[42px] rounded-full bg-teal-600 px-6 text-sm font-bold text-ink hover:bg-teal-500">
        פתיחת היומן
      </button>
    </form>
  );
}

function CycleBar({
  api,
  cycle,
  cycles,
}: {
  api: ReturnType<typeof useInjectionJournal>;
  cycle: JournalCycle;
  cycles: JournalCycle[];
}) {
  const [editing, setEditing] = useState(false);
  const [creating, setCreating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [date, setDate] = useState(cycle.startDate);
  const [label, setLabel] = useState(cycle.label);

  useEffect(() => {
    setDate(cycle.startDate);
    setLabel(cycle.label);
    setEditing(false);
    setConfirmDelete(false);
  }, [cycle.id, cycle.startDate, cycle.label]);

  if (creating) {
    return (
      <CycleSetup
        defaultDate={todayISO()}
        onCreate={(d, l) => {
          api.createCycle(d, l);
          setCreating(false);
        }}
      />
    );
  }

  return (
    <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-2xl bg-mist-100/70 px-4 py-3 text-sm" data-testid="cycle-bar">
      {cycles.length > 1 ? (
        <label className="inline-flex items-center gap-2 font-semibold text-ink">
          <span className="sr-only">בחירת סבב</span>
          <select
            value={cycle.id}
            onChange={(e) => api.setActiveCycle(e.target.value)}
            className="rounded-lg border border-mist-200 bg-white px-2 py-1 text-sm"
          >
            {cycles.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
      ) : (
        <span className="font-bold text-ink">{cycle.label}</span>
      )}
      {editing ? (
        <form
          className="flex flex-wrap items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!date) return;
            api.updateActiveCycle((c) => ({ ...c, startDate: date, label: label.trim() || c.label }));
            setEditing(false);
          }}
        >
          <label className="text-xs font-semibold text-ink/70">
            תאריך התחלה
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-0.5 block rounded-lg border border-mist-200 bg-white px-2 py-1 text-sm" dir="ltr" />
          </label>
          <label className="text-xs font-semibold text-ink/70">
            שם
            <input value={label} onChange={(e) => setLabel(e.target.value)} className="mt-0.5 block w-32 rounded-lg border border-mist-200 bg-white px-2 py-1 text-sm" />
          </label>
          <button type="submit" className="rounded-full bg-teal-600 px-3 py-1.5 text-xs font-bold text-ink">
            שמירה
          </button>
          <button type="button" onClick={() => setEditing(false)} className="px-2 py-1.5 text-xs font-semibold text-ink/55">
            ביטול
          </button>
        </form>
      ) : (
        <>
          <span className="text-ink/60">התחלה: {formatDateLong(cycle.startDate)}</span>
          <span className="flex flex-wrap gap-3 text-xs font-semibold sm:mr-auto">
            <button type="button" onClick={() => setEditing(true)} className="text-teal-700 hover:underline">
              עריכת תאריך ושם
            </button>
            <button type="button" onClick={() => setCreating(true)} className="text-teal-700 hover:underline">
              סבב חדש
            </button>
            {confirmDelete ? (
              <span className="inline-flex gap-2">
                <span className="text-ink/60">למחוק את כל הסבב?</span>
                <button type="button" onClick={() => api.deleteCycle(cycle.id)} className="font-bold text-teal-700 hover:underline">
                  כן
                </button>
                <button type="button" onClick={() => setConfirmDelete(false)} className="text-ink/55 hover:underline">
                  לא
                </button>
              </span>
            ) : (
              <button type="button" onClick={() => setConfirmDelete(true)} className="text-ink/50 hover:text-ink/80">
                מחיקת הסבב
              </button>
            )}
          </span>
        </>
      )}
    </div>
  );
}
