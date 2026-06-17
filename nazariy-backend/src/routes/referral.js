const express = require("express");
const { query } = require("../db");
const { genId } = require("../utils/id");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

function toClient(g) {
  return {
    id: g.id,
    milestoneCount: g.milestoneCount,
    days: g.days,
    status: g.status,
    createdAt: g.createdAt,
  };
}

// GET /referral/me — referal kodi, taklif qilinganlar soni, daraja holati
router.get("/me", async (req, res) => {
  const [{ cnt: invitedCount }] = await query("SELECT COUNT(*) as cnt FROM User WHERE invitedById = ?", [req.user.id]);

  const settingRows = await query("SELECT valueJson FROM Setting WHERE `key`='referral_milestones'");
  let milestones = [];
  try { milestones = JSON.parse(settingRows[0]?.valueJson || "[]"); } catch {}

  const myGrants = await query("SELECT * FROM ReferralGrant WHERE userId=? ORDER BY createdAt DESC", [req.user.id]);

  res.json({
    referralCode: req.user.referralCode,
    invitedCount: Number(invitedCount),
    milestones,
    grants: myGrants.map(toClient),
  });
});

// POST /referral/claim — milestone uchun Pro so'rash
// Body: { milestoneCount, days }
router.post("/claim", async (req, res) => {
  const { milestoneCount, days } = req.body;
  if (!milestoneCount || !days) return res.status(400).json({ error: "milestoneCount va days majburiy" });

  const [{ cnt: invitedCount }] = await query("SELECT COUNT(*) as cnt FROM User WHERE invitedById = ?", [req.user.id]);
  if (Number(invitedCount) < milestoneCount) {
    return res.status(400).json({ error: "Bu darajaga hali yetmagansiz" });
  }

  const id = genId();
  await query("INSERT INTO ReferralGrant (id,userId,milestoneCount,days,status) VALUES (?,?,?,?,'pending')", [id, req.user.id, milestoneCount, days]);

  const rows = await query("SELECT * FROM ReferralGrant WHERE id=?", [id]);
  res.json(toClient(rows[0]));
});

module.exports = router;
