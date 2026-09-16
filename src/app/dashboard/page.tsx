import HashRedirect from "@/components/shell/HashRedirect";

/** נתיב ישן — מפנה אל האזור "המסלול שלי" בתוך ה-App Shell החדש (/#roadmap). */
export default function DashboardRedirectPage() {
  return <HashRedirect hash="#roadmap" />;
}
