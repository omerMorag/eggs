import type { Metadata } from "next";
import "@fontsource/assistant/400.css";
import "@fontsource/assistant/500.css";
import "@fontsource/assistant/600.css";
import "@fontsource/assistant/700.css";
import "@fontsource/assistant/800.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "המסע שלך להקפאת ביציות",
  description:
    "מלווה אישי דיגיטלי לתהליך הקפאת ביציות — מפת דרך ברורה ולוח מעקב אישי, שלב אחר שלב.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
