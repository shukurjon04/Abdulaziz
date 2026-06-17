// ─── MySQL ulanish hovuzi (connection pool) ───
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_POOL_SIZE || 5), // Nano/Micro kabi kichik hostinglar uchun kam ulanish yetarli
  queueLimit: 0,
  dateStrings: true, // sanalarni JS Date emas, satr sifatida qaytaradi (JSON'ga yozish osonroq)
});

/**
 * SQL so'rov bajaradi va natija qatorlarini qaytaradi.
 * @param {string} sql - so'rov, `?` placeholder bilan
 * @param {Array} params - placeholder qiymatlari
 */
async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

module.exports = { pool, query };
