const express = require("express");
const { query } = require("../db");
const { requireAuth, requireAdmin } = require("../middleware/auth");
const { isProActive } = require("../utils/proStatus");

const router = express.Router();
router.use(requireAuth);

// `g` — ReferralGrant qatori + g.user (User obyekti)
function toClient(g) {
  return {
    id: g.id,
    name: [g.user.firstName, g.user.lastName].filter(Boolean).join(" ") || g.user.username || "Foydalanuvchi",
    username: g.user.username,
    tgId: g.user.tgId,
    milestoneCount: g.milestoneCount,
    days: g.days,
    status: g.status,
    createdAt: g.createdAt,
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

// GET /admin/referral-grants
router.get("/referral-grants", requireAdmin("pro"), async (req, res) => {
  const grants = await query("SELECT * FROM ReferralGrant ORDER BY createdAt DESC");
  res.json((await attachUser(grants)).map(toClient));
});

// POST /admin/referral-grants/:id/approve
router.post("/referral-grants/:id/approve", requireAdmin("pro"), async (req, res) => {
  const rows = await query("SELECT * FROM ReferralGrant WHERE id=?", [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: "So'rov topilmadi" });
  const grant = rows[0];
  if (grant.status !== "pending") return res.status(400).json({ error: "Bu so'rov allaqachon ko'rib chiqilgan" });

  const [user] = await attachUser([grant]).then(r => [r[0].user]);

  const now = new Date();
  const base = isProActive(user) ? new Date(user.proExpiresAt) : now;
  const proExpiresAt = new Date(base.getTime() + grant.days * 24 * 60 * 60 * 1000);

  await query("UPDATE User SET isPro=1, proExpiresAt=? WHERE id=?", [proExpiresAt, grant.userId]);
  await query("UPDATE ReferralGrant SET status='approved', resolvedAt=NOW() WHERE id=?", [grant.id]);

  const updatedRows = await query("SELECT * FROM ReferralGrant WHERE id=?", [grant.id]);
  res.json(toClient((await attachUser(updatedRows))[0]));
});

// POST /admin/referral-grants/:id/reject
router.post("/referral-grants/:id/reject", requireAdmin("pro"), async (req, res) => {
  const rows = await query("SELECT * FROM ReferralGrant WHERE id=?", [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: "So'rov topilmadi" });
  const grant = rows[0];
  if (grant.status !== "pending") return res.status(400).json({ error: "Bu so'rov allaqachon ko'rib chiqilgan" });

  await query("UPDATE ReferralGrant SET status='rejected', resolvedAt=NOW() WHERE id=?", [grant.id]);

  const updatedRows = await query("SELECT * FROM ReferralGrant WHERE id=?", [grant.id]);
  res.json(toClient((await attachUser(updatedRows))[0]));
});

module.exports = router;
