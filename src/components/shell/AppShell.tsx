"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { useJourneyProgress } from "@/lib/useJourneyProgress";
import { useHashSection } from "@/lib/useHashSection";
import { useHeroScrollTransition } from "@/lib/useHeroScrollTransition";
import DisclaimerFooter from "@/components/DisclaimerFooter";
import RoadmapSection from "@/components/sections/RoadmapSection";
import TestsSection from "@/components/sections/TestsSection";
import WhereToGoSection from "@/components/sections/WhereToGoSection";
import MyChancesSection from "@/components/sections/MyChancesSection";
import GuidesSection from "@/components/sections/GuidesSection";
import CostEstimatorSection from "@/components/sections/CostEstimatorSection";
import StoriesSection from "@/components/sections/StoriesSection";
import HeroIntro from "@/components/hero/HeroIntro";
import PersonalIntroSection from "@/components/hero/PersonalIntroSection";
import Sidebar from "./Sidebar";
import MobileHeader from "./MobileHeader";
import MobileDrawer from "./MobileDrawer";

// dynamic import + ssr:false — עמוד המודרציה לא נשלח כלל לכל מבקרת רגילה
// (רק כש-section === "admin-stories" בפועל, וגם אז רק אחרי useIsAdmin()).
const AdminStoriesSection = dynamic(() => import("@/components/sections/AdminStoriesSection"), {
  ssr: false,
});

/**
 * מעטפת האפליקציה כולה: בכניסה ראשונה (או אחרי לחיצה על "להכיר את
 * מקפיאות"/הלוגו), מוצגים ברצף רגיל של גלילה — Hero (HeroIntro) -> מקטע
 * היכרות אישי (PersonalIntroSection) -> תחילת המסלול (RoadmapSection).
 * זהו תוכן זרימה רגיל לגמרי — לא pin/scrub — כך שהגלילה עצמה תמיד מגיבה
 * מיד לגלגלת/מגע; ר' useHeroScrollTransition.ts + HeroIntro.tsx +
 * PersonalIntroSection.tsx לפירוט. זהו ה-App Shell היחיד של כל האתר;
 * העמודים הישנים (/dashboard, /where-to-go, /my-chances) רק מפנים לכאן.
 *
 * חשוב: Hero+מקטע ההיכרות מרונדרים **מחוץ** לעטיפה עם `lg:ml-[252px]`
 * (מרווח קבוע למקום ה-Sidebar) — כדי שיתפסו את כל רוחב המסך במרכז, בלי
 * להיות מוסטים ימינה בגלל מקום שמור לסיידבר שעדיין לא גלוי. RoadmapSection
 * עצמו נשאר תמיד mounted באותו מקום כמו היום (בתוך main, בתוך העטיפה
 * הממורווחת). Sidebar/MobileHeader מוסתרים בעזרת visibility (לא
 * display:none) + pointer-events כל עוד ה-Chrome עדיין לא נחשף, כדי שלא
 * יהיו נגישים/לחיצים "מבעד" למסך הפתיחה.
 *
 * roadmapTopRef משמש שני תפקידים: (1) יעד גלילה מדויק לשני כפתורי ה-CTA
 * ("התחילי/המשיכי במסלול" ב-Hero, "מתחילה את המסלול" במקטע ההיכרות) —
 * זה בדיוק התיקון לבאג שבו לחיצה נחתה סמוך לסוף הצ'קליסט (הגלילה הישנה
 * הסתמכה על מרחק ה-pin של ה-Hero, לא על המיקום האמיתי של ראש המסלול);
 * (2) IntersectionObserver שמזהה הגעה בגלילה טבעית (בלי לחיצה על כפתור)
 * לראש המסלול, כדי לחשוף את ה-Chrome ולסמן hasSeenIntro גם במקרה הזה.
 */
export default function AppShell() {
  const progress = useJourneyProgress();
  const { section, navigate } = useHashSection();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openStepId, setOpenStepId] = useState<number | null>(null);
  const { showHero, chromeVisible, reducedMotion, revealChrome, resetHero } = useHeroScrollTransition();
  const { status: authStatus } = useSession();
  const roadmapTopRef = useRef<HTMLDivElement | null>(null);
  // "מי שכבר הייתה באתר" — יש לה **כל** סימון שמור (מקומי/מסונכרן), ולו
  // תת-משימה אחת, או שהיא מחוברת לגוגל. בכוונה **לא** progress.hasAnyProgress
  // הקיים (שם ההגדרה "שלב/בדיקה שלמה הושלמה" — מתאימה לכפתור האיפוס
  // ב-RoadmapSection, אבל תחסיר כאן מי שסימנה כמה משימות בלי לסיים שלב
  // שלם). לפני הידרציה (טעינת ה-localStorage) הכול 0 — ברירת המחדל נשארת
  // "חדשה", כמו ההתנהגות הקיימת היום, ומתעדכנת תוך כדי טעינת הדף. קובעת
  // רק את ניסוח כפתור ה-CTA ב-Hero (ר' HeroIntro.tsx) — לא קשורה ל-hasSeenIntro.
  const isReturningVisitor =
    progress.doneStepTasksCount > 0 ||
    progress.completedTestSubItems.size > 0 ||
    progress.selectedCareUnit !== null ||
    authStatus === "authenticated";

  // בכל מעבר בין אזורים, גוללים לראש התוכן — כמו מעבר בין "עמודים" אמיתי
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [section]);

  // "הושג המסלול" — גם בלחיצה על אחד מכפתורי ה-CTA וגם בהגעה בגלילה
  // טבעית: חושף את ה-Chrome ומסמנת hasSeenIntro (פעם אחת, אידמפוטנטית).
  // בכוונה **לא** קורה רק כי העמוד נטען — ר' דרישת "אל תסמן רק בגלל שעמוד
  // הבית נטען".
  const handleReachedRoadmap = useCallback(() => {
    revealChrome();
    progress.markIntroSeen();
    // progress.markIntroSeen עצמה יציבה (useCallback עם deps ריק בתוך
    // useJourneyProgress) — progress כאובייקט משתנה בכל render בכוונה
    // אינו נכלל, כדי שלא ליצור מחדש את ה-callback הזה (ואת ה-IntersectionObserver
    // שתלוי בו למטה) בכל רינדור.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealChrome, progress.markIntroSeen]);

  // כפתורי ה-CTA (גם ב-Hero וגם במקטע ההיכרות) — גלילה מדויקת לראש המסלול
  // בפועל (roadmapTopRef), לא להערכה/מרחק מחושב כלשהו. מכבדת prefers-reduced-motion.
  const scrollToRoadmap = useCallback(() => {
    const behavior: ScrollBehavior = reducedMotion ? "auto" : "smooth";
    roadmapTopRef.current?.scrollIntoView({ behavior, block: "start" });
  }, [reducedMotion]);

  const handleStartJourney = useCallback(() => {
    handleReachedRoadmap();
    scrollToRoadmap();
  }, [handleReachedRoadmap, scrollToRoadmap]);

  // הגעה לראש המסלול ע"י גלילה טבעית (בלי לחיצה על כפתור כלל) — פעיל רק
  // כל עוד ה-Hero מוצג וה-Chrome עדיין לא נחשף; מתנתק אוטומטית ברגע
  // שהמצב משתנה (cleanup בכל שינוי deps), כך שלא ממשיך "להאזין" לשווא.
  useEffect(() => {
    if (!showHero || chromeVisible || section !== "roadmap") return;
    const el = roadmapTopRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) handleReachedRoadmap();
      },
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [showHero, chromeVisible, section, handleReachedRoadmap]);

  const openStep = (id: number | null) => {
    setOpenStepId(id);
  };

  // לחיצה על הלוגו / קישור "להכיר את מקפיאות": "חוזרת הביתה" — גם חוזרת
  // לאזור "המסלול שלי" וגם מפעילה מחדש את מסך הפתיחה + מקטע ההיכרות
  // מעליו (תצוגה חוזרת מודעת — לא "שוכחת" ש-hasSeenIntro כבר סומן).
  const handleGoHome = () => {
    resetHero();
    navigate("roadmap");
  };

  return (
    <div className="min-h-screen bg-mist-50/40">
      <div
        className={chromeVisible ? "opacity-100" : "invisible pointer-events-none opacity-0"}
        aria-hidden={!chromeVisible}
      >
        <Sidebar
          section={section}
          progress={progress}
          onNavigate={navigate}
          onGoHome={handleGoHome}
        />
        <MobileHeader onMenuClick={() => setDrawerOpen(true)} onGoHome={handleGoHome} />
      </div>
      <MobileDrawer
        open={drawerOpen}
        section={section}
        progress={progress}
        onNavigate={navigate}
        onClose={() => setDrawerOpen(false)}
        onGoHome={handleGoHome}
      />

      {/* Hero + מקטע ההיכרות — תוכן זרימה רגיל, full-bleed מחוץ למרווח
          הסיידבר (הוא ממילא מוסתר כל עוד showHero פעיל). מוצגים רק באזור
          "roadmap" — כניסה ישירה ל-#tests/#where-to-go/#guides וכו' מדלגת
          עליהם לגמרי (showHero כבר false במקרה הזה, ר' useHeroScrollTransition). */}
      {section === "roadmap" && showHero && (
        <>
          <HeroIntro reducedMotion={reducedMotion} onCtaClick={handleStartJourney} isReturningVisitor={isReturningVisitor} />
          <PersonalIntroSection reducedMotion={reducedMotion} onCtaClick={handleStartJourney} />
        </>
      )}

      <div className="lg:mr-0 lg:ml-[252px]">
        <main className="mx-auto max-w-4xl px-3.5 py-6 sm:px-6 sm:py-9 lg:py-12">
          {section === "roadmap" && (
            <div ref={roadmapTopRef}>
              <RoadmapSection progress={progress} openStepId={openStepId} onOpenStep={openStep} />
            </div>
          )}
          {section === "tests" && <TestsSection progress={progress} />}
          {section === "where-to-go" && <WhereToGoSection progress={progress} />}
          {section === "my-chances" && <MyChancesSection />}
          {section === "cost-estimator" && <CostEstimatorSection />}
          {section === "stories" && <StoriesSection />}
          {section === "admin-stories" && <AdminStoriesSection />}
          {section === "guides" && <GuidesSection />}
        </main>

        <DisclaimerFooter />
      </div>
    </div>
  );
}
