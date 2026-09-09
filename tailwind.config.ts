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
        // פלטה בהירה, רכה ונשית-מודרנית: ורוד-אפרסק כאקצנט ראשי,
        // מנטה כאקצנט משני, רקע לבן-כמעט-לבן עם גוון קרם חמים, טקסט חום-אפרפר רך (לא שחור).
        ink: "#433632",
        deep: "#EA8F53",
        teal: {
          50: "#FFF0F2",
          100: "#FFDBE1",
          200: "#FDB9C5",
          300: "#F994A5",
          400: "#F47187",
          500: "#EB6077",
          600: "#E25068",
          700: "#CC334D",
          800: "#9A2D3F",
          900: "#6F2531",
        },
        mist: {
          50: "#FCF9F8",
          100: "#F9F1EC",
          200: "#EFE1D7",
          300: "#DCC9BC",
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
        card: "0 1px 3px rgba(226, 80, 104, 0.08), 0 1px 2px rgba(67, 54, 50, 0.04)",
        cardHover: "0 12px 28px rgba(226, 80, 104, 0.16), 0 3px 8px rgba(67, 54, 50, 0.06)",
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
