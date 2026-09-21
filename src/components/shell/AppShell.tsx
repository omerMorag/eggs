"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useJourneyProgress } from "@/lib/useJourneyProgress";
import { useHashSection } from "@/lib/useHashSection";
import { useIntroJourneyTransition } from "@/lib/useIntroJourneyTransition";
import DisclaimerFooter from "@/components/DisclaimerFooter";
import RoadmapSection from "@/components/sections/RoadmapSection";
import TestsSection from "@/components/sections/TestsSection";
import WhereToGoSection from "@/components/sections/WhereToGoSection";
import MyChancesSection from "@/components/sections/MyChancesSection";
import GuidesSection from "@/components/sections/GuidesSection";
import CostEstimatorSection from "@/components/sections/CostEstimatorSection";
import StoriesSection from "@/components/sections/StoriesSection";
import IntroScreen from "@/components/screens/IntroScreen";
import Sidebar from "./Sidebar";
import MobileHeader from "./MobileHeader";
import MobileDrawer from "./MobileDrawer";

// dynamic import + ssr:false — עמוד המודרציה לא נשלח כלל לכל מבקרת רגילה
// (רק כש-section === "admin-stories" בפועל, וגם אז רק אחרי useIsAdmin()).
const AdminStoriesSection = dynamic(() => import("@/components/sections/AdminStoriesSection"), {
  ssr: false,
});

/**
 * מעטפת האפליקציה כולה: מסך פתיחה מלא (IntroScreen) שעובר למסך המסלול
 * (Sidebar קבוע בדסקטופ / Header+Drawer במובייל + אזור תוכן מרכזי שמציג
 * תמיד רק את האזור הפעיל לפי #hash) במעבר translateY אחד — ראו
 * useIntroJourneyTransition.ts לפירוט הארכיטקטורה. זהו ה-App Shell היחיד
 * של כל האתר; העמודים הישנים (/dashboard, /where-to-go, /my-chances) רק
 * מפנים לכאן (ראו את קבצי ה-page.tsx שלהם).
 *
 * חשוב: תוכן המסלול (Sidebar/MobileHeader/main) נשאר תמיד mounted בזרימת
 * המסמך הרגילה, בלי שום עטיפה עם transform — רק עטיפת IntroScreen מקבלת
 * transform/position:fixed. כך ה-position:fixed הקיים ב-Sidebar לא נשבר
 * (transform על אב היה יוצר containing block חדש). Sidebar/MobileHeader
 * מוסתרים בעזרת visibility (לא display:none) + pointer-events כל עוד מסך
 * הפתיחה פעיל או שאנימציית מעבר בעיצומה, כדי שלא יהיו נגישים/לחיצים
 * "מבעד" למסך הפתיחה.
 */
export default function AppShell() {
  const progress = useJourneyProgress();
  const { section, navigate } = useHashSection();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openStepId, setOpenStepId] = useState<number | null>(null);
  const { screen, locked, introScrollRef, goToJourney, goToIntro, transitionMs } =
    useIntroJourneyTransition();

  // בכל מעבר בין אזורים, גוללים לראש התוכן — כמו מעבר בין "עמודים" אמיתי
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [section]);

  const openStep = (id: number | null) => {
    setOpenStepId(id);
  };

  // ה"שלד" של מסך המסלול (Sidebar/MobileHeader) גלוי ובר-פוקוס רק כשמסך
  // המסלול פעיל בפועל ואין אנימציית מעבר בעיצומה (לכל כיוון) — כדי שאף
  // רגע שבו שני המסכים "מוצגים יחד" לא ייחשף.
  const journeyChromeVisible = screen === "journey" && !locked;

  return (
    <div className="min-h-screen bg-mist-50/40">
      <div
        className={
          journeyChromeVisible
            ? "opacity-100"
            : "invisible pointer-events-none opacity-0"
        }
        aria-hidden={!journeyChromeVisible}
      >
        <Sidebar
          section={section}
          progress={progress}
          onNavigate={navigate}
          onGoHome={goToIntro}
        />
        <MobileHeader onMenuClick={() => setDrawerOpen(true)} onGoHome={goToIntro} />
      </div>
      <MobileDrawer
        open={drawerOpen}
        section={section}
        progress={progress}
        onNavigate={navigate}
        onClose={() => setDrawerOpen(false)}
        onGoHome={goToIntro}
      />

      <div className="lg:mr-0 lg:ml-[252px]">
        <main className="mx-auto max-w-4xl px-3.5 py-6 sm:px-6 sm:py-9 lg:py-12">
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

      {/* מסך הפתיחה — overlay מלא (position:fixed) שמחליק translateY מעל
          תוכן המסלול. אטום עד שהוא נעלם לגמרי, ולכן חוסם כל "בזבוז" של
          המסלול שמתחתיו עד לרגע המדויק שבו האנימציה מסתיימת. */}
      <div
        className="no-print fixed inset-0 z-[70]"
        style={{
          transform: screen === "intro" ? "translateY(0)" : "translateY(-100%)",
          transition: `transform ${transitionMs}ms cubic-bezier(0.22, 0.72, 0.2, 1)`,
          visibility: journeyChromeVisible ? "hidden" : "visible",
          pointerEvents: screen === "intro" ? "auto" : "none",
        }}
        aria-hidden={screen !== "intro"}
      >
        <IntroScreen onEnter={goToJourney} active={screen === "intro"} scrollRef={introScrollRef} />
      </div>
    </div>
  );
}
