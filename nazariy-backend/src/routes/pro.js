const express = require("express");
const { query } = require("../db");
const { genId } = require("../utils/id");
const { requireAuth } = require("../middleware/auth");
const { upload, fileUrl } = require("../utils/upload");

const router = express.Router();
router.use(requireAuth);

const PLAN_DAYS = { proWeekly: 7, proMonth1: 30, proMonth2: 60 };
const DEFAULT_PRICES = { proWeekly: 9900, proMonth1: 29900, proMonth2: 49900 };

// Admin tomonidan o'zgartirilgan narxlarni Setting jadvalidan o'qiydi (mavjud bo'lmasa standart narxlar)
async function getPlanAmounts() {
  const rows = await query("SELECT valueJson FROM Setting WHERE `key`='prices'");
  if (!rows.length) return DEFAULT_PRICES;
  try {
    const p = JSON.parse(rows[0].valueJson);
    return {
      proWeekly: p.week ?? DEFAULT_PRICES.proWeekly,
      proMonth1: p.month1 ?? DEFAULT_PRICES.proMonth1,
      proMonth2: p.month2 ?? DEFAULT_PRICES.proMonth2,
    };
  } catch {
    return DEFAULT_PRICES;
  }
}

function toClient(r) {
  return {
    id: r.id,
    planLabel: r.planLabel,
    planDays: r.planDays,
    amount: r.amount,
    receiptUrl: r.receiptUrl,
    status: r.status,
    createdAt: r.createdAt,
  };
}

// POST /pro/requests — Pro sotib olish so'rovi (multipart: receipt fayli + planLabel)
router.post("/requests", upload.single("receipt"), async (req, res) => {
  const { planLabel } = req.body;
  if (!PLAN_DAYS[planLabel]) return res.status(400).json({ error: "Noto'g'ri tarif" });

  const receiptUrl = req.file ? fileUrl(req.file.filename) : null;
  const PLAN_AMOUNTS = await getPlanAmounts();

  const id = genId();
  await query(
    "INSERT INTO ProRequest (id,userId,planLabel,planDays,amount,receiptUrl,status) VALUES (?,?,?,?,?,?,'pending')",
    [id, req.user.id, planLabel, PLAN_DAYS[planLabel], PLAN_AMOUNTS[planLabel], receiptUrl]
  );

  const rows = await query("SELECT * FROM ProRequest WHERE id=?", [id]);
  res.json(toClient(rows[0]));
});

// GET /pro/requests/mine — joriy foydalanuvchining o'z so'rovlari
router.get("/requests/mine", async (req, res) => {
  const requests = await query("SELECT * FROM ProRequest WHERE userId=? ORDER BY createdAt DESC", [req.user.id]);
  res.json(requests.map(toClient));
});

module.exports = router;
