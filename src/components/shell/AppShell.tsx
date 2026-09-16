"use client";

import { useEffect, useState } from "react";
import { useJourneyProgress } from "@/lib/useJourneyProgress";
import { useHashSection } from "@/lib/useHashSection";
import DisclaimerFooter from "@/components/DisclaimerFooter";
import RoadmapSection from "@/components/sections/RoadmapSection";
import TestsSection from "@/components/sections/TestsSection";
import WhereToGoSection from "@/components/sections/WhereToGoSection";
import MyChancesSection from "@/components/sections/MyChancesSection";
import GuidesSection from "@/components/sections/GuidesSection";
import Sidebar from "./Sidebar";
import MobileHeader from "./MobileHeader";
import MobileDrawer from "./MobileDrawer";

/**
 * מעטפת האפליקציה כולה: Sidebar קבוע בדסקטופ / Header+Drawer במובייל,
 * ואזור תוכן מרכזי שמציג תמיד רק את האזור הפעיל (לפי #hash) — בלי טעינת
 * עמוד חדשה. זהו ה-App Shell היחיד של כל האתר; העמודים הישנים
 * (/dashboard, /where-to-go, /my-chances) רק מפנים לכאן (ראו את קבצי
 * ה-page.tsx שלהם).
 */
export default function AppShell() {
  const progress = useJourneyProgress();
  const { section, navigate } = useHashSection();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openStepId, setOpenStepId] = useState<number | null>(null);

  // בכל מעבר בין אזורים, גוללים לראש התוכן — כמו מעבר בין "עמודים" אמיתי
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [section]);

  const openStep = (id: number | null) => {
    setOpenStepId(id);
  };

  return (
    <div className="min-h-screen bg-mist-50/40">
      <Sidebar section={section} progress={progress} onNavigate={navigate} />
      <MobileHeader section={section} onMenuClick={() => setDrawerOpen(true)} />
      <MobileDrawer
        open={drawerOpen}
        section={section}
        progress={progress}
        onNavigate={navigate}
        onClose={() => setDrawerOpen(false)}
      />

      <div className="lg:mr-0 lg:ml-[252px]">
        <main className="mx-auto max-w-4xl px-3.5 py-6 sm:px-6 sm:py-9 lg:py-12">
          {section === "roadmap" && (
            <RoadmapSection progress={progress} openStepId={openStepId} onOpenStep={openStep} />
          )}
          {section === "tests" && <TestsSection progress={progress} />}
          {section === "where-to-go" && <WhereToGoSection />}
          {section === "my-chances" && <MyChancesSection />}
          {section === "guides" && <GuidesSection />}
        </main>

        <DisclaimerFooter />
      </div>
    </div>
  );
}
