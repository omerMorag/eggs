"use client";

import { useEffect, useRef, useState } from "react";

/**
 * רגע הסיום של המסלול — מקטע מתחת לצ'קליסט, מוצג רק כשהמסלול כולו הושלם.
 *
 * שני מצבים:
 *  - celebrate=true: רק מיד אחרי שהמשתמשת סימנה בעצמה את הצ'קבוקס האחרון
 *    (ר' RoadmapSection). גוללים אל המקטע, והסרטון מתחיל לנגן רק כשהוא
 *    נראה לעין. בסיום הסרטון מתחלף בתמונת הפריים האחרון.
 *  - celebrate=false: ביקור חוזר / מסלול שכבר הושלם. אין גלילה ואין סרטון,
 *    רק תמונת הסיום.
 *
 * הסרטון שקט (הקובץ עצמו נשמר בלי ערוץ שמע), בלי פקדים ובלי לופ, ונטען רק
 * ברגע שצריך אותו (אין src עד שהמקטע נראה). אם הדפדפן חוסם הפעלה אוטומטית,
 * הקובץ לא נטען, או שהמשתמשת מעדיפה פחות תנועה — מוצגת תמונת הסיום, בלי
 * מסך שחור ובלי אייקון Play.
 *
 * הטקסט מניח שהמסלול הושלם כולל המשימה "קיבלתי עדכון כמה ביציות הוקפאו"
 * (שלב 7, steps.ts) — לכן המשפט על הביציות שבמקפיא מתאים רק כשהמקטע מוצג,
 * והוא מוצג רק כשכל המשימות, כולל זו, מסומנות.
 */

/** WebM (VP9) קודם — קטן יותר ונתמך בכרום/פיירפוקס/אנדרואיד; MP4 (H.264) לספארי ולשאר */
export const FINALE_VIDEO_WEBM = "/finale/hen-beach-finale.webm";
export const FINALE_VIDEO_MP4 = "/finale/hen-beach-finale.mp4";
export const FINALE_FINAL_FRAME_SRC = "/finale/hen-beach-final.jpg";
export const FINALE_FINAL_FRAME_WEBP = "/finale/hen-beach-final.webp";
export const FINALE_POSTER_SRC = "/finale/hen-beach-start.jpg";

const FINAL_ALT = "התרנגולת של מקפיאות בבגד ים, נחה בערסל על חוף שמשי עם משקה קוקוס";
/** אם הסרטון לא התחיל לנגן תוך הזמן הזה מרגע שביקשנו — עוברים לתמונה */
const START_TIMEOUT_MS = 6000;

type Phase = "static" | "waiting" | "playing" | "done";

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && !!window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

interface JourneyFinaleProps {
  /** true רק מיד אחרי שהמשתמשת סימנה בעצמה את הצ'קבוקס האחרון */
  celebrate: boolean;
}

export default function JourneyFinale({ celebrate }: JourneyFinaleProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [phase, setPhase] = useState<Phase>(() => (celebrate && !prefersReducedMotion() ? "waiting" : "static"));
  // המקורות מוכנסים ל-<video> רק כשהמקטע נראה — עד אז לא נטען אף בייט
  const [loadVideo, setLoadVideo] = useState(false);

  // גלילה אל המקטע + החלטה אם לנגן — פעם אחת, ב-mount
  useEffect(() => {
    if (!celebrate) return;
    const reduce = prefersReducedMotion();
    const id = requestAnimationFrame(() => {
      sectionRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    });
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // מתחילים לטעון ולנגן רק כשהסרטון עצמו נראה לעין
  useEffect(() => {
    if (phase !== "waiting") return;
    const el = frameRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setLoadVideo(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          setLoadVideo(true);
        }
      },
      { threshold: 0.6 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [phase]);

  // ברגע שיש src — מנסים לנגן. כל כישלון (חסימת autoplay, שגיאת טעינה,
  // טעינה איטית מדי) מסתיים בתמונת הסיום.
  useEffect(() => {
    if (!loadVideo || phase !== "waiting") return;
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    let settled = false;
    const fail = () => {
      if (settled) return;
      settled = true;
      setPhase("done");
    };
    const timer = window.setTimeout(fail, START_TIMEOUT_MS);
    const onPlaying = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      setPhase("playing");
    };
    video.addEventListener("playing", onPlaying);
    video.addEventListener("error", fail);
    video.load();
    const p = video.play();
    if (p && typeof p.catch === "function") p.catch(fail);
    return () => {
      window.clearTimeout(timer);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("error", fail);
    };
  }, [loadVideo, phase]);

  // הווידאו נשאר ב-DOM גם אחרי הסיום (עצור על הפריים האחרון) כדי שהמעבר
  // לתמונה יהיה חלק, בלי הבהוב של רקע ריק באמצע ה-fade.
  const showVideo = phase !== "static";
  const finalVisible = phase === "static" || phase === "done";

  return (
    <section
      ref={sectionRef}
      id="journey-finale"
      aria-labelledby="journey-finale-title"
      className="no-print mt-10 scroll-mt-20 sm:mt-12 sm:scroll-mt-24 lg:scroll-mt-8"
      data-testid="journey-finale"
      data-phase={phase}
    >
      <div className="rounded-3xl border-2 border-mist-200 bg-white p-4 shadow-card sm:p-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="journey-finale-title"
            className="font-sans text-2xl font-extrabold leading-snug tracking-tight text-ink sm:text-3xl"
          >
            הביציות נשארות במקפיא. את יוצאת לשמש. ☀️
          </h2>
          <p className="mt-2 text-base leading-relaxed text-ink/70 sm:text-lg">
            כל הכבוד לך על הדרך שעשית. עכשיו מגיע לך רגע לנשום.
          </p>
        </div>

        <div
          ref={frameRef}
          className="relative mt-4 aspect-video w-full overflow-hidden rounded-2xl bg-mist-100 sm:mt-5"
        >
          {showVideo && (
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-cover"
              poster={FINALE_POSTER_SRC}
              muted
              playsInline
              preload="none"
              disablePictureInPicture
              controls={false}
              loop={false}
              aria-hidden="true"
              tabIndex={-1}
              onEnded={() => setPhase("done")}
              data-testid="journey-finale-video"
            >
              {loadVideo && <source src={FINALE_VIDEO_WEBM} type="video/webm" />}
              {/* שגיאה על המקור האחרון = אף מקור לא נטען → תמונת הסיום */}
              {loadVideo && <source src={FINALE_VIDEO_MP4} type="video/mp4" onError={() => setPhase("done")} />}
            </video>
          )}
          <picture>
            <source srcSet={FINALE_FINAL_FRAME_WEBP} type="image/webp" />
            <img
              src={FINALE_FINAL_FRAME_SRC}
              alt={FINAL_ALT}
              loading={celebrate ? "eager" : "lazy"}
              decoding="async"
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out motion-reduce:transition-none ${
                finalVisible ? "opacity-100" : "opacity-0"
              }`}
              aria-hidden={!finalVisible}
              data-testid="journey-finale-image"
            />
          </picture>
        </div>
      </div>
    </section>
  );
}
