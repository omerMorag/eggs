/** צורות הנתונים הציבוריות כפי שמוחזרות מה-API — allow-list בלבד, בלי author_user_id ובלי email/id פנימי */
export interface PublicStoryListItem {
  id: string;
  title: string;
  displayName: string | null;
  isAnonymous: boolean;
  summary: string;
  ageRange: string | null;
  cyclesCount: number | null;
  treatmentRoute: string | null;
  clinic: string | null;
  region: string | null;
  publishedAt: string | null;
}

export interface PublicStoryDetail {
  id: string;
  title: string;
  displayName: string | null;
  isAnonymous: boolean;
  storyText: string;
  personalTip: string | null;
  ageRange: string | null;
  hmo: string | null;
  clinic: string | null;
  region: string | null;
  treatmentRoute: string | null;
  cyclesCount: number | null;
  retrievedCount: number | null;
  frozenCount: number | null;
  publishedAt: string | null;
}

export const TREATMENT_ROUTE_LABELS: Record<string, string> = {
  public: "ציבורי",
  private: "פרטי",
  not_specified: "לא צוין",
};

export const HMO_LABELS: Record<string, string> = {
  clalit: "כללית",
  maccabi: "מכבי",
  meuhedet: "מאוחדת",
  leumit: "לאומית",
  none: "ללא קופה",
  other: "אחר",
};
