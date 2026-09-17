import type { CSSProperties } from "react";

interface LogoMarkProps {
  className?: string;
  style?: CSSProperties;
}

/**
 * הסמל הגרפי של "מקפיאות": איור התרנגולת (public/brand/hen-full.png),
 * מוצג תמיד בשלמותו — כל הגוף גלוי, בלי חיתוך/מסכה עגולה שקוטעת אותה.
 * הקובץ כבר חתוך (trim) לשוליים השקופים סביב האיור, כך שאין רווח מבוזבז
 * מסביב כשהוא מוקטן לגדלים השונים באתר.
 *
 * הגובה נקבע ע"י הצרכן (ראו Logo.tsx / DEFAULT_MARK_SIZE); הרוחב תמיד
 * "auto" כדי לשמר את יחס הגובה-רוחב המקורי של האיור ולעולם לא למתוח/לקטוע
 * אותו.
 *
 * דקורטיבי גרידא — aria-hidden, כי שם האתר "מקפיאות" תמיד מופיע כטקסט
 * אמיתי לצידו ברכיב Logo.
 */
export default function LogoMark({ className, style }: LogoMarkProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/hen-full.png"
      alt=""
      aria-hidden="true"
      className={className}
      style={{ ...style, width: "auto" }}
    />
  );
}
