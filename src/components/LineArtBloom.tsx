interface LineArtBloomProps {
  className?: string;
}

/**
 * איור קו מינימליסטי מקורי — ענף פרח עדין וקרחוני שלג קטן, קו אחיד וללא צבע
 * (מלבד currentColor). מיועד כאלמנט עיצובי עדין ברקע/לצד טקסט, לא כתמונה מרכזית.
 */
export default function LineArtBloom({ className = "" }: LineArtBloomProps) {
  return (
    <svg
      viewBox="0 0 320 400"
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {/* גבעול מרכזי */}
      <path
        d="M160 380 C158 300 168 250 150 190 C136 144 168 120 158 70"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* עלים */}
      <path
        d="M150 190 C118 182 96 196 82 224 C108 228 132 218 150 190Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M158 236 C190 224 214 234 230 260 C202 268 176 260 158 236Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M150 300 C122 296 100 312 90 340 C118 342 142 330 150 300Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* פרח פתוח בראש הגבעול — עלי כותרת חופפים בקו אחד */}
      <g strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M158 70 C142 56 140 34 154 20 C166 34 166 56 158 70Z" stroke="currentColor" />
        <path d="M158 70 C174 58 196 58 210 72 C194 82 174 82 158 70Z" stroke="currentColor" />
        <path d="M158 70 C146 86 124 92 106 84 C118 70 138 64 158 70Z" stroke="currentColor" />
        <path d="M158 70 C172 84 174 106 162 122 C148 108 146 86 158 70Z" stroke="currentColor" />
        <circle cx="158" cy="70" r="6" stroke="currentColor" strokeWidth="1.3" />
      </g>

      {/* קרחוני שלג עדינים, נגיעה למוטיב ההקפאה */}
      <g strokeWidth="1.1" strokeLinecap="round" opacity="0.75">
        <g transform="translate(238 128)">
          <line x1="-10" y1="0" x2="10" y2="0" stroke="currentColor" />
          <line x1="0" y1="-10" x2="0" y2="10" stroke="currentColor" />
          <line x1="-7" y1="-7" x2="7" y2="7" stroke="currentColor" />
          <line x1="-7" y1="7" x2="7" y2="-7" stroke="currentColor" />
        </g>
        <g transform="translate(70 260) scale(0.7)">
          <line x1="-10" y1="0" x2="10" y2="0" stroke="currentColor" />
          <line x1="0" y1="-10" x2="0" y2="10" stroke="currentColor" />
          <line x1="-7" y1="-7" x2="7" y2="7" stroke="currentColor" />
          <line x1="-7" y1="7" x2="7" y2="-7" stroke="currentColor" />
        </g>
      </g>
    </svg>
  );
}
