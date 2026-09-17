import type { LucideIcon } from "lucide-react";
import { Info } from "lucide-react";

interface DisclaimerNoteProps {
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

/**
 * הודעת הבהרה קבועה (כספי-לא-רפואי / חוויה-אישית-לא-ייעוץ-רפואי וכו').
 * סגנון callout ניטרלי, עקבי עם שאר האתר (rounded-2xl border-2 bg-mist-50/60).
 */
export default function DisclaimerNote({ icon: Icon = Info, children, className = "" }: DisclaimerNoteProps) {
  return (
    <div
      className={`flex items-start gap-2.5 rounded-2xl border-2 border-mist-200 bg-mist-50/60 p-4 text-xs leading-relaxed text-ink/65 sm:p-5 sm:text-sm ${className}`}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-deep/60" strokeWidth={2} />
      <div>{children}</div>
    </div>
  );
}
