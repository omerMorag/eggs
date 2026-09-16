import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // פלטה צבעונית וחמה: ורוד חי כאקצנט ראשי (כפתורים, סימוני הצלחה,
        // אייקונים, אלמנטים פעילים), כתום-אפרסק כהדגשה שנייה (מספרי שלבים,
        // פרטים קטנים), ירוק-מנטה כהדגשה משנית ("חוסכות זמן") ליצירת ניגוד
        // צבעוני נעים, רקע ניטרלי בגווני קרם-אפרסק בהירים עם כרטיסים לבנים,
        // וטקסט כמעט-שחור חם לקריאות גבוהה.
        ink: "#241619",
        deep: "#EA8F53",
        teal: {
          50: "#FDF4F6",
          100: "#FBE6EA",
          200: "#F6C7CF",
          300: "#F0A4B0",
          400: "#EA7E8F",
          500: "#E56277",
          600: "#E25068",
          700: "#C13655",
          800: "#9A3647",
          900: "#762A36",
        },
        mist: {
          50: "#FCF8F7",
          100: "#F5EBE6",
          200: "#EEDDD6",
          300: "#E8D2C8",
        },
        warm: {
          100: "#E4FBF3",
          300: "#A9EFD3",
          500: "#4FC79A",
        },
      },
      fontFamily: {
        sans: [
          '"Assistant"',
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Arial Hebrew",
          "Arial",
          "Helvetica Neue",
          "Helvetica",
          "sans-serif",
        ],
        serif: [
          '"Assistant"',
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Arial Hebrew",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 3px rgba(226, 80, 104, 0.14), 0 1px 2px rgba(36, 22, 25, 0.06)",
        cardHover: "0 12px 28px rgba(226, 80, 104, 0.22), 0 3px 8px rgba(36, 22, 25, 0.08)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.5s ease-out both",
        pulseSoft: "pulseSoft 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
