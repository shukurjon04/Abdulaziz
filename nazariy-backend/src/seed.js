// Boshlang'ich ma'lumotlar: node src/seed.js
require("dotenv").config();
const { pool, query } = require("./db");
const { genId } = require("./utils/id");

const EMPTY_OPTIONS = JSON.stringify({ uz: ["", "", "", ""], ru: ["", "", "", ""], kril: ["", "", "", ""] });

async function main() {
  // ── 1. Super admin ──
  const superAdminTgId = process.env.SUPER_ADMIN_TG_ID || "000000001";
  const existing = await query("SELECT id FROM User WHERE tgId = ?", [superAdminTgId]);
  if (existing.length) {
    await query("UPDATE User SET adminRole=?, adminPerms=? WHERE id=?", [
      "super", JSON.stringify(["tickets","topics","rules","notifications","pro","admins"]), existing[0].id,
    ]);
  } else {
    await query(
      "INSERT INTO User (id, tgId, firstName, referralCode, adminRole, adminPerms) VALUES (?,?,?,?,?,?)",
      [genId(), superAdminTgId, "Super Admin", "NAZ" + superAdminTgId.slice(-7).toUpperCase(), "super", JSON.stringify(["tickets","topics","rules","notifications","pro","admins"])]
    );
  }
  console.log(`✅ Super admin tayyor (tgId=${superAdminTgId})`);

  // ── 2. Mavzular ──
  const topics = [
    { titleUz:"Svetoforlar", titleRu:"Светофоры", titleKril:"Светофорлар", color:"#1A6BFF", icon:"traffic" },
    { titleUz:"Yo'l belgilari", titleRu:"Дорожные знаки", titleKril:"Йўл белгилари", color:"#22C55E", icon:"roadsign" },
    { titleUz:"Harakatlanish tartibi", titleRu:"Порядок движения", titleKril:"Ҳаракатланиш тартиби", color:"#F59E0B", icon:"refresh" },
    { titleUz:"Kesishmalar", titleRu:"Перекрёстки", titleKril:"Кесишмалар", color:"#8B5CF6", icon:"refresh" },
    { titleUz:"Piyodalar", titleRu:"Пешеходы", titleKril:"Пиёдалар", color:"#EC4899", icon:"walk" },
    { titleUz:"Ob-havo sharoiti", titleRu:"Погодные условия", titleKril:"Об-ҳаво шароити", color:"#0EA5E9", icon:"weather" },
    { titleUz:"Tezlik chegarasi", titleRu:"Скорость", titleKril:"Тезлик чегараси", color:"#EF4444", icon:"speed" },
    { titleUz:"To'xtash va turish", titleRu:"Остановка и стоянка", titleKril:"Тўхташ ва туриш", color:"#F97316", icon:"mandatory" },
    { titleUz:"Maxsus transport", titleRu:"Спецтранспорт", titleKril:"Махсус транспорт", color:"#14B8A6", icon:"ambulance" },
    { titleUz:"Texnik holat", titleRu:"Техническое состояние", titleKril:"Техник ҳолат", color:"#6366F1", icon:"wrench" },
  ];
  for (const t of topics) {
    const exists = await query("SELECT id FROM Topic WHERE titleUz=?", [t.titleUz]);
    if (!exists.length) {
      await query("INSERT INTO Topic (id,titleUz,titleRu,titleKril,color,icon) VALUES (?,?,?,?,?,?)",
        [genId(), t.titleUz, t.titleRu, t.titleKril, t.color, t.icon]);
    }
  }
  console.log(`✅ ${topics.length} mavzu tayyor`);

  // ── 3. Yo'l qoidalari toifalari ──
  const categories = [
    { titleUz:"Ogohlantiruvchi belgilar", titleRu:"Предупреждающие знаки", titleKril:"Огоҳлантирувчи белгилар", color:"#F59E0B", icon:"warning" },
    { titleUz:"Taqiqlovchi belgilar", titleRu:"Запрещающие знаки", titleKril:"Тақиқловчи белгилар", color:"#EF4444", icon:"prohibit" },
    { titleUz:"Buyuruvchi belgilar", titleRu:"Предписывающие знаки", titleKril:"Буюрувчи белгилар", color:"#1A6BFF", icon:"mandatory" },
    { titleUz:"Servis belgilari", titleRu:"Знаки сервиса", titleKril:"Сервис белгилари", color:"#22C55E", icon:"info" },
  ];
  for (const c of categories) {
    const exists = await query("SELECT id FROM RuleCategory WHERE titleUz=?", [c.titleUz]);
    if (!exists.length) {
      await query("INSERT INTO RuleCategory (id,titleUz,titleRu,titleKril,color,icon) VALUES (?,?,?,?,?,?)",
        [genId(), c.titleUz, c.titleRu, c.titleKril, c.color, c.icon]);
    }
  }
  console.log(`✅ ${categories.length} yo'l qoidasi toifasi tayyor`);

  // ── 4. Biletlar (100 ta, har biri 20 bo'sh savol bilan) ──
  const [{ cnt }] = await query("SELECT COUNT(*) as cnt FROM Ticket");
  if (cnt === 0) {
    for (let i = 1; i <= 100; i++) {
      const result = await query("INSERT INTO Ticket (number, isPro) VALUES (?,?)", [i, i > 10 ? 1 : 0]);
      const ticketId = result.insertId;

      const values = [];
      const placeholders = [];
      for (let j = 0; j < 20; j++) {
        values.push(genId(), ticketId, j, "", "", "", EMPTY_OPTIONS, 0, "", "", "");
        placeholders.push("(?,?,?,?,?,?,?,?,?,?,?)");
      }
      await query(
        `INSERT INTO Question (id,ticketId,\`order\`,questionUz,questionRu,questionKril,optionsJson,correct,explanationUz,explanationRu,explanationKril) VALUES ${placeholders.join(",")}`,
        values
      );
    }
    console.log("✅ 100 ta bilet (har biri 20 bo'sh savol bilan) yaratildi");
  } else {
    console.log("ℹ️  Biletlar allaqachon mavjud, o'tkazib yuborildi");
  }

  // ── 5. Sozlamalar ──
  const settings = {
    limits: { dailyTestLimit: 3, freeExamCount: 2, freeTicketCount: 10 },
    discount: { active: false, percent: 20, endDate: null },
    prices: { week: 9900, month1: 29900, month2: 49900 },
    referral_milestones: [
      { count: 3, reward: "week", labelKey: "proWeekly", days: 7 },
      { count: 5, reward: "month1", labelKey: "proMonth1", days: 30 },
      { count: 10, reward: "month2", labelKey: "proMonth2", days: 60 },
    ],
  };
  for (const [key, value] of Object.entries(settings)) {
    const exists = await query("SELECT `key` FROM Setting WHERE `key`=?", [key]);
    if (!exists.length) {
      await query("INSERT INTO Setting (`key`, valueJson) VALUES (?,?)", [key, JSON.stringify(value)]);
    }
  }
  console.log("✅ Sozlamalar (limits, discount, prices, referral_milestones) tayyor");

  await pool.end();
}

main().catch(e => { console.error("❌ Seed xatosi:", e); process.exit(1); });
