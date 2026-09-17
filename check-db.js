require("dotenv").config({ path: ".env.local" });
const { Pool } = require("pg");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  try {
    const res = await pool.query(`
      select table_name from information_schema.tables
      where table_schema = 'public'
      order by table_name;
    `);
    console.log("\n=== חיבור למסד הנתונים הצליח ===");
    if (res.rows.length === 0) {
      console.log("אין אף טבלה עדיין — המיגרציה לא רצה בפועל.");
    } else {
      console.log("הטבלאות הקיימות במסד:");
      for (const row of res.rows) console.log(" - " + row.table_name);
      const expected = ["cost_items", "saved_cost_estimates", "stories", "story_reports", "story_edit_audit"];
      const missing = expected.filter((t) => !res.rows.some((r) => r.table_name === t));
      if (missing.length === 0) {
        console.log("\n✅ כל 5 הטבלאות הצפויות קיימות — המיגרציה הצליחה במלואה.");
      } else {
        console.log("\n⚠️ חסרות הטבלאות: " + missing.join(", "));
      }
    }
  } catch (err) {
    console.log("\n=== שגיאת חיבור ===");
    console.log(err.message);
  } finally {
    await pool.end();
  }
}

main();
