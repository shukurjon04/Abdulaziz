const express = require("express");
const { query } = require("../db");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();

// Frontenddagi LIMITS / DISCOUNT / REFERRAL_CONFIG.milestones uchun standart qiymatlar
const DEFAULTS = {
  limits: { dailyTestLimit: 3, freeExamCount: 2, freeTicketCount: 10 },
  discount: { active: false, percent: 20, endDate: null },
  prices: { week: 9900, month1: 29900, month2: 49900 },
  referral_milestones: [
    { count: 3, reward: "week", labelKey: "proWeekly", days: 7 },
    { count: 5, reward: "month1", labelKey: "proMonth1", days: 30 },
    { count: 10, reward: "month2", labelKey: "proMonth2", days: 60 },
  ],
};

// GET /settings — barcha umumiy sozlamalar (foydalanuvchiga ham kerak)
router.get("/", requireAuth, async (req, res) => {
  const rows = await query("SELECT `key`, valueJson FROM Setting");
  const result = { ...DEFAULTS };
  for (const row of rows) {
    try { result[row.key] = JSON.parse(row.valueJson); } catch {}
  }
  res.json(result);
});

// PATCH /settings/:key — admin sozlamani yangilaydi (faqat "pro" ruxsatiga ega adminlar)
// Super bo'lmagan adminlar uchun ham to'g'ridan-to'g'ri ruxsat berilgan,
// chunki sozlamalar PendingChange ro'yxatiga kiritilmaydi (kichik ta'sir doirasi).
// Agar kerak bo'lsa, bu yerga ham PendingChange logikasi qo'shilishi mumkin.
router.patch("/:key", requireAuth, requireAdmin("pro"), async (req, res) => {
  const { key } = req.params;
  if (!["limits", "discount", "prices", "referral_milestones"].includes(key)) {
    return res.status(400).json({ error: "Noma'lum sozlama kaliti" });
  }

  const value = req.body;
  await query(
    "INSERT INTO Setting (`key`, valueJson) VALUES (?, ?) ON DUPLICATE KEY UPDATE valueJson = ?",
    [key, JSON.stringify(value), JSON.stringify(value)]
  );

  res.json({ ok: true, key, value });
});

module.exports = router;
