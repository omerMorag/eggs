/**
 * §15-§16: הכנת מבנה לרופאים פרטיים לעתיד — אין עדיין מאגר רופאים פעיל
 * באתר, ולכן הטיפוס הזה מוגדר ומתועד אך אינו בשימוש בשום מקום עדיין.
 * כשתהיה תשתית תוכן אמיתית, DoctorCard/DoctorsSection ייבנו מעל זה.
 *
 * חשוב (§16): בלי דירוג, בלי "הכי טוב/מומלץ/מתאים" — לא בטיפוס ולא ב-UI
 * שייבנה מעליו בעתיד.
 */
export interface DoctorProfile {
  id: string;
  name: string;
  photoUrl?: string;
  specialty: string;
  relevantExperience?: string;
  seesPatientsAt?: string[];
  worksAtMedicalCenters?: string[];
  consultationPrice?: string;
  arrangements?: string[];
  profileUrl?: string;
  contact?: { phone?: string; url?: string };
  /** §17: פרופיל ממומן — תמיד מסומן בבירור, לעולם לא מוצג כהמלצה של מקפיאות */
  sponsored?: { label: "ממומן" | "בשיתוף" };
}
