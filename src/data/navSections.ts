import { BookOpen, FlaskConical, ListChecks, MapPin, Percent } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type SectionId = "roadmap" | "tests" | "where-to-go" | "my-chances" | "guides";

export interface NavSectionDef {
  id: SectionId;
  label: string;
  icon: LucideIcon;
}

/**
 * חמשת אזורי התוכן של האפליקציה. זהו מקור האמת היחיד לניווט —
 * גם ה-Sidebar בדסקטופ וגם ה-Drawer במובייל בונים את הרשימה שלהם מכאן,
 * כדי שלא יהיו שני מקומות נפרדים שיכולים להתבדר זה מזה.
 */
export const navSections: NavSectionDef[] = [
  { id: "roadmap", label: "המסלול שלי", icon: ListChecks },
  { id: "tests", label: "הבדיקות שלי", icon: FlaskConical },
  { id: "where-to-go", label: "איפה כדאי לעשות?", icon: MapPin },
  { id: "my-chances", label: "מה הסיכוי שלי?", icon: Percent },
  { id: "guides", label: "מידע ומדריכים", icon: BookOpen },
];

export const DEFAULT_SECTION: SectionId = "roadmap";

export function isSectionId(value: string): value is SectionId {
  return navSections.some((s) => s.id === value);
}
