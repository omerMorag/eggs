-- הרחבת pg_trgm לחיפוש ILIKE יעיל בעברית על טקסט חופשי (כותרת/תוכן/טיפ/מרפאה/שם תצוגה).
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ה-migration הקודם יצר את stories.search_blob כעמודת text רגילה (ריקה).
-- מחליפים אותה כאן בעמודה מחושבת (GENERATED ALWAYS AS ... STORED) — מוגדר
-- כ-SQL ידני ולא בסכימת ה-TS כי תמיכת drizzle-orm בעמודות מחושבות משתנה
-- בין גרסאות; ה-TS משאיר את השדה כטקסט רגיל למען טיפוסי query בלבד,
-- והאפליקציה לעולם לא כותבת אליו ישירות.
ALTER TABLE stories DROP COLUMN IF EXISTS search_blob;
ALTER TABLE stories
  ADD COLUMN search_blob text
  GENERATED ALWAYS AS (
    coalesce(title, '') || ' ' ||
    coalesce(story_text, '') || ' ' ||
    coalesce(personal_tip, '') || ' ' ||
    coalesce(clinic, '') || ' ' ||
    coalesce(display_name, '')
  ) STORED;

CREATE INDEX IF NOT EXISTS stories_search_trgm_idx ON stories USING gin (search_blob gin_trgm_ops);

-- מבטיח שטווח מחיר בפריט עלות תמיד הגיוני כשקיימים שני הקצוות.
ALTER TABLE cost_items
  ADD CONSTRAINT cost_items_price_range_chk
  CHECK (min_price IS NULL OR max_price IS NULL OR min_price <= max_price);
