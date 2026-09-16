import HashRedirect from "@/components/shell/HashRedirect";

/** נתיב ישן — מפנה אל האזור "מה הסיכוי שלי?" בתוך ה-App Shell החדש (/#my-chances). */
export default function MyChancesRedirectPage() {
  return <HashRedirect hash="#my-chances" />;
}
