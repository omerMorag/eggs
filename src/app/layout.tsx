import type { Metadata } from "next";
import "@fontsource/assistant/400.css";
import "@fontsource/assistant/500.css";
import "@fontsource/assistant/600.css";
import "@fontsource/assistant/700.css";
import "@fontsource/assistant/800.css";
import "./globals.css";
import { AuthSessionProvider } from "@/components/shell/AuthSessionProvider";

const SITE_TITLE = "מקפיאות | הדרך שלך להקפאת ביציות";
const SITE_DESCRIPTION =
  "מידע, סדר וכלים שיעזרו לך להבין את תהליך הקפאת הביציות ולעבור אותו שלב אחר שלב.";

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  appleWebApp: {
    title: "מקפיאות",
    statusBarStyle: "default",
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    siteName: "מקפיאות",
    locale: "he_IL",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body className="min-h-screen font-sans antialiased">
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </body>
    </html>
  );
}
