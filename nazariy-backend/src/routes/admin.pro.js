const express = require("express");
const { query } = require("../db");
const { requireAuth, requireAdmin } = require("../middleware/auth");
const { isProActive } = require("../utils/proStatus");

const router = express.Router();
router.use(requireAuth);

// `r` — ProRequest qatori + r.user (User obyekti)
function toClient(r) {
  return {
    id: r.id,
    name: [r.user.firstName, r.user.lastName].filter(Boolean).join(" ") || r.user.username || "Foydalanuvchi",
    username: r.user.username,
    tgId: r.user.tgId,
    planLabel: r.planLabel,
    planDays: r.planDays,
    amount: r.amount,
    receiptUrl: r.receiptUrl,
    status: r.status,
    createdAt: r.createdAt,
  };
}

async function attachUser(rows) {
  const userIds = [...new Set(rows.map(r => r.userId))];
  let users = [];
  if (userIds.length) {
    const placeholders = userIds.map(() => "?").join(",");
    users = await query(`SELECT * FROM User WHERE id IN (${placeholders})`, userIds);
  }
  const userMap = Object.fromEntries(users.map(u => [u.id, u]));
  return rows.map(r => ({ ...r, user: userMap[r.userId] }));
}

// GET /admin/pro-requests
router.get("/pro-requests", requireAdmin("pro"), async (req, res) => {
  const requests = await query("SELECT * FROM ProRequest ORDER BY createdAt DESC");
  res.json((await attachUser(requests)).map(toClient));
});

// POST /admin/pro-requests/:id/approve
router.post("/pro-requests/:id/approve", requireAdmin("pro"), async (req, res) => {
  const rows = await query("SELECT * FROM ProRequest WHERE id=?", [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: "So'rov topilmadi" });
  const request = rows[0];
  if (request.status !== "pending") return res.status(400).json({ error: "Bu so'rov allaqachon ko'rib chiqilgan" });

  const [user] = await attachUser([request]).then(r => [r[0].user]);

  const now = new Date();
  const base = isProActive(user) ? new Date(user.proExpiresAt) : now;
  const proExpiresAt = new Date(base.getTime() + request.planDays * 24 * 60 * 60 * 1000);

  await query("UPDATE User SET isPro=1, proExpiresAt=? WHERE id=?", [proExpiresAt, request.userId]);
  await query("UPDATE ProRequest SET status='approved', resolvedAt=NOW() WHERE id=?", [request.id]);

  const updatedRows = await query("SELECT * FROM ProRequest WHERE id=?", [request.id]);
  res.json(toClient((await attachUser(updatedRows))[0]));
  // TODO: bildirishnoma yaratish — "Pro obuna faollashtirildi"
});

// POST /admin/pro-requests/:id/reject
router.post("/pro-requests/:id/reject", requireAdmin("pro"), async (req, res) => {
  const rows = await query("SELECT * FROM ProRequest WHERE id=?", [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: "So'rov topilmadi" });
  const request = rows[0];
  if (request.status !== "pending") return res.status(400).json({ error: "Bu so'rov allaqachon ko'rib chiqilgan" });

  await query("UPDATE ProRequest SET status='rejected', resolvedAt=NOW() WHERE id=?", [request.id]);

  const updatedRows = await query("SELECT * FROM ProRequest WHERE id=?", [request.id]);
  res.json(toClient((await attachUser(updatedRows))[0]));
  // TODO: bildirishnoma yaratish — "To'lov tasdiqlanmadi"
});

module.exports = router;
