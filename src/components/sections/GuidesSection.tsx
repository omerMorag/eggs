"use client";

import { useCallback, useRef, useState } from "react";
import RetrievalDayCard from "@/components/guides/RetrievalDayCard";
import RetrievalDayGuide from "@/components/guides/RetrievalDayGuide";

const RETRIEVAL_GUIDE_PANEL_ID = "retrieval-day-guide";

/**
 * "יום השאיבה" (לשעבר "מידע ומדריכים") — צומצם בכוונה לסקשן ממוקד יחיד:
 * הכרטיסייה הראשית + המדריך המורחב של יום השאיבה (RetrievalDayCard/
 * RetrievalDayGuide + src/data/retrievalDayGuide.ts), בלי כותרת/פתיח גנריים
 * מעליה (כותרת "יום השאיבה" שבתוך הכרטיסייה עצמה משמשת ככותרת האזור).
 *
 * ⚠️ הוסרו במכוון מכאן (לפי בקשת המשתמשת): כרטיס "ומה יקרה אם תרצי
 * להשתמש בביציות בעתיד?" (התוכן לא נשמר/הועבר לשום מקום אחר באתר — הוסר
 * כליל), וקישורי "קישור מהיר" ל-#my-chances/#where-to-go (כבר נגישים דרך
 * ה-navbar, כפילות מיותרת). `epilogueItems`/`EpilogueCard` נשארו בקוד בלי
 * שימוש חי (עדיין מיובאים ע"י `RoadmapExperience.tsx` היתום הקיים), בהתאם
 * לתקדים הקיים בפרויקט של לא למחוק קבצים יתומים.
 */
export default function GuidesSection() {
  const [guideOpen, setGuideOpen] = useState(false);
  const guideTitleRef = useRef<HTMLHeadingElement>(null);

  const handleToggleGuide = useCallback(() => {
    const willOpen = !guideOpen;
    setGuideOpen(willOpen);
    if (!willOpen) return;
    // גלילה עדינה לתחילת המדריך — רק אם היא אינה נראית כרגע במסך, לא בכל
    // פתיחה (בקשה מפורשת: לא לגרור את העין למקום שכבר נראה טוב).
    requestAnimationFrame(() => {
      const el = guideTitleRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const alreadyVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
      if (!alreadyVisible) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }, [guideOpen]);

  return (
    <div className="print-stack animate-fadeUp">
      <RetrievalDayCard open={guideOpen} onToggle={handleToggleGuide} panelId={RETRIEVAL_GUIDE_PANEL_ID} />
      {guideOpen && (
        <RetrievalDayGuide
          panelId={RETRIEVAL_GUIDE_PANEL_ID}
          onClose={handleToggleGuide}
          titleRef={guideTitleRef}
        />
      )}
    </div>
  );
}
