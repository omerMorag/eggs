"use client";

import { useEffect, useState } from "react";
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
import Sidebar from "./Sidebar";
import MobileHeader from "./MobileHeader";
import MobileDrawer from "./MobileDrawer";

// dynamic import + ssr:false — עמוד המודרציה לא נשלח כלל לכל מבקרת רגילה
// (רק כש-section === "admin-stories" בפועל, וגם אז רק אחרי useIsAdmin()).
const AdminStoriesSection = dynamic(() => import("@/components/sections/AdminStoriesSection"), {
  ssr: false,
});

/**
 * מעטפת האפליקציה כולה: מסך כניסה עריכתי (HeroIntro) שנחשף בגלילה אמיתית
 * (GSAP ScrollTrigger — pin+scrub, ראו useHeroScrollTransition.ts +
 * HeroIntro.tsx לפירוט הארכיטקטורה) עד שהוא "משתחרר" ומגלה את מסך המסלול
 * הרגיל (Sidebar קבוע בדסקטופ / Header+Drawer במובייל + אזור תוכן מרכזי
 * שמציג תמיד רק את האזור הפעיל לפי #hash). זהו ה-App Shell היחיד של כל
 * האתר; העמודים הישנים (/dashboard, /where-to-go, /my-chances) רק מפנים
 * לכאן (ראו את קבצי ה-page.tsx שלהם).
 *
 * חשוב: HeroIntro מרונדר **מחוץ** לעטיפה עם `lg:ml-[252px]` (מרווח קבוע
 * למקום ה-Sidebar), ולא בתוכה — כדי שיתפוס את כל רוחב המסך במרכז גם
 * בדסקטופ, בלי להיות מוסט ימינה בגלל מקום שמור לסיידבר שעדיין לא גלוי.
 * RoadmapSection עצמו נשאר תמיד mounted באותו מקום כמו היום (בתוך main,
 * בתוך העטיפה הממורווחת) — HeroIntro רק "יושב מעליו" בגלילה, בלי לגעת
 * בקוד שלו כלל. Sidebar/MobileHeader מוסתרים בעזרת visibility (לא
 * display:none) + pointer-events כל עוד ה-Hero עדיין לא הושלם, כדי שלא
 * יהיו נגישים/לחיצים "מבעד" למסך הפתיחה.
 */
export default function AppShell() {
  const progress = useJourneyProgress();
  const { section, navigate } = useHashSection();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openStepId, setOpenStepId] = useState<number | null>(null);
  const { showHero, chromeVisible, reducedMotion, onHeroComplete, resetHero } =
    useHeroScrollTransition();
  const { status: authStatus } = useSession();
  // "מי שכבר הייתה באתר" — יש לה **כל** סימון שמור (מקומי/מסונכרן), ולו
  // תת-משימה אחת, או שהיא מחוברת לגוגל. בכוונה **לא** progress.hasAnyProgress
  // הקיים (שם ההגדרה "שלב/בדיקה שלמה הושלמה" — מתאימה לכפתור האיפוס
  // ב-RoadmapSection, אבל תחסיר כאן מי שסימנה כמה משימות בלי לסיים שלב
  // שלם). לפני הידרציה (טעינת ה-localStorage) הכול 0 — ברירת המחדל נשארת
  // "חדשה", כמו ההתנהגות הקיימת היום, ומתעדכנת תוך כדי טעינת הדף.
  const isReturningVisitor =
    progress.doneStepTasksCount > 0 ||
    progress.completedTestSubItems.size > 0 ||
    progress.selectedCareUnit !== null ||
    authStatus === "authenticated";

  // בכל מעבר בין אזורים, גוללים לראש התוכן — כמו מעבר בין "עמודים" אמיתי
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [section]);

  const openStep = (id: number | null) => {
    setOpenStepId(id);
  };

  // לחיצה על הלוגו: "חוזרת הביתה" — בדיוק כמו היום — כלומר גם חוזרת
  // לאזור "המסלול שלי" וגם מפעילה מחדש את מסך הפתיחה מעליו.
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

      {/* במעבר המונפש (לא reducedMotion) ה-Hero יושב *מחוץ* לעטיפה הממורווחת
          כדי לתפוס את כל רוחב המסך במרכז — ה-Chrome ממילא מוסתר כל עוד
          הוא פעיל, כך שאין התנגשות עם מקום ה-Sidebar. ב-reducedMotion,
          לעומת זאת, ה-Chrome גלוי מההתחלה, אז ה-Hero הסטטי מתמרכז ביחס
          לעמודת התוכן בדיוק כמו RoadmapSection שמתחתיו — לכן הוא מרונדר
          בתוך ה-main, לא כאלמנט full-bleed נפרד. */}
      {section === "roadmap" && showHero && !reducedMotion && (
        <HeroIntro
          reducedMotion={false}
          onComplete={onHeroComplete}
          isReturningVisitor={isReturningVisitor}
        />
      )}

      <div className="lg:mr-0 lg:ml-[252px]">
        <main className="mx-auto max-w-4xl px-3.5 py-6 sm:px-6 sm:py-9 lg:py-12">
          {section === "roadmap" && showHero && reducedMotion && (
            <HeroIntro
              reducedMotion
              onComplete={onHeroComplete}
              isReturningVisitor={isReturningVisitor}
            />
          )}
          {section === "roadmap" && (
            <RoadmapSection progress={progress} openStepId={openStepId} onOpenStep={openStep} />
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
