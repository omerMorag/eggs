import type { CSSProperties } from "react";

interface LogoMarkProps {
  className?: string;
  style?: CSSProperties;
}

/**
 * הסמל הגרפי של "מקפיאות": צורה אורגנית של ביצית (path מקומי, לא ספריית
 * אייקונים) עם רמז עדין ל"קור"/כפור — שלוש קווי-כפית קטנים בפינה
 * העליונה־ימנית של הביצית, בלי פתית שלג גדול וקלישאתי. גוון אחד
 * (teal-600 מה-palette הקיים של האתר) + לבן לאקצנט הכפור, כדי שהסמל יעבוד
 * גם על רקע צבעוני וגם על כרטיס לבן בלי תלות ברקע שמאחוריו.
 *
 * דקורטיבי גרידא — aria-hidden, כי שם האתר "מקפיאות" תמיד מופיע גם כטקסט
 * אמיתי לצידו ברכיב Logo.
 */
export default function LogoMark({ className, style }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
      style={style}
    >
      <path
        d="M24.0,7.0 C26.55,7.0 29.34,8.37 31.65,10.44 C33.96,12.51 36.56,16.09 37.86,19.44 C39.16,22.79 40.05,27.21 39.46,30.56 C38.87,33.91 36.88,37.49 34.3,39.56 C31.72,41.63 27.43,43.0 24.0,43.0 C20.57,43.0 16.28,41.63 13.7,39.56 C11.12,37.49 9.13,33.91 8.54,30.56 C7.95,27.21 8.84,22.79 10.14,19.44 C11.44,16.09 14.04,12.51 16.35,10.44 C18.66,8.37 21.45,7.0 24.0,7.0 Z"
        fill="#E25068"
      />
      <line x1="30.0" y1="10.9" x2="30.0" y2="20.1" stroke="#ffffff" strokeWidth="1.7" strokeLinecap="round" />
      <line x1="26.02" y1="13.2" x2="33.98" y2="17.8" stroke="#ffffff" strokeWidth="1.7" strokeLinecap="round" />
      <line x1="26.02" y1="17.8" x2="33.98" y2="13.2" stroke="#ffffff" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="30.0" cy="10.9" r="0.75" fill="#ffffff" />
      <circle cx="30.0" cy="20.1" r="0.75" fill="#ffffff" />
      <circle cx="26.02" cy="13.2" r="0.75" fill="#ffffff" />
      <circle cx="33.98" cy="17.8" r="0.75" fill="#ffffff" />
      <circle cx="26.02" cy="17.8" r="0.75" fill="#ffffff" />
      <circle cx="33.98" cy="13.2" r="0.75" fill="#ffffff" />
    </svg>
  );
}
