// Ma'lumotlar bazasi jadvallarini yaratish: node src/migrate.js
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { pool } = require("./db");

async function main() {
  const sql = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");

  // Har bir CREATE TABLE bayonotini alohida bajaramiz (ba'zi hostinglar multi-statement so'rovlarni cheklaydi)
  const statements = sql
    .split(";")
    .map(s => {
      // Har bir qatordan "-- izoh" qatorlarini olib tashlaymiz, faqat SQL qoladi
      return s
        .split("\n")
        .filter(line => !line.trim().startsWith("--"))
        .join("\n")
        .trim();
    })
    .filter(s => s && !s.toUpperCase().startsWith("SET NAMES"));

  for (const stmt of statements) {
    const firstLine = stmt.split("\n").find(l => l.trim() && !l.trim().startsWith("--")) || "";
    console.log(`▶ ${firstLine.trim().slice(0, 60)}...`);
    await pool.query(stmt);
  }

  console.log(`✅ ${statements.length} jadval/bayonot muvaffaqiyatli bajarildi`);
  await pool.end();
}

main().catch(e => {
  console.error("❌ Migratsiya xatosi:", e.message);
  process.exit(1);
});
