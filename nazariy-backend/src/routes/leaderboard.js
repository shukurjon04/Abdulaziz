const express = require("express");
const { query } = require("../db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

function userName(u) {
  return [u.firstName, u.lastName].filter(Boolean).join(" ") || u.username || "Foydalanuvchi";
}

function periodStart(period) {
  const now = new Date();
  if (period === "daily") return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (period === "weekly") {
    const d = new Date(now);
    d.setDate(d.getDate() - 7);
    return d;
  }
  if (period === "monthly") {
    const d = new Date(now);
    d.setMonth(d.getMonth() - 1);
    return d;
  }
  return null; // "all"
}

// MySQL DATETIME formatiga o'girish: "YYYY-MM-DD HH:MM:SS"
function toMysqlDate(d) {
  return d.toISOString().slice(0, 19).replace("T", " ");
}

// GET /leaderboard?period=daily|weekly|monthly|all
// XP = to'g'ri javoblar soni * 10. Eng yuqori 20 ta foydalanuvchi + joriy foydalanuvchining o'rni qaytariladi.
router.get("/", async (req, res) => {
  const period = req.query.period || "all";
  const since = periodStart(period);

  const grouped = since
    ? await query("SELECT userId, SUM(correct) as totalCorrect FROM TestResult WHERE createdAt >= ? GROUP BY userId", [toMysqlDate(since)])
    : await query("SELECT userId, SUM(correct) as totalCorrect FROM TestResult GROUP BY userId");

  const ranked = grouped
    .map(g => ({ userId: g.userId, xp: Number(g.totalCorrect || 0) * 10 }))
    .sort((a, b) => b.xp - a.xp);

  const top = ranked.slice(0, 20);
  const userIds = top.map(r => r.userId);

  // Joriy foydalanuvchi top20'da bo'lmasa, uni alohida qo'shamiz
  const myEntry = ranked.find(r => r.userId === req.user.id);
  if (myEntry && !userIds.includes(myEntry.userId)) userIds.push(myEntry.userId);

  let users = [];
  if (userIds.length) {
    const placeholders = userIds.map(() => "?").join(",");
    users = await query(`SELECT * FROM User WHERE id IN (${placeholders})`, userIds);
  }
  const userMap = Object.fromEntries(users.map(u => [u.id, u]));

  const toEntry = (r, rank) => ({
    rank,
    userId: r.userId,
    name: userMap[r.userId] ? userName(userMap[r.userId]) : "Foydalanuvchi",
    av: userMap[r.userId] ? userName(userMap[r.userId])[0].toUpperCase() : "?",
    xp: r.xp,
    me: r.userId === req.user.id,
  });

  const leaderboard = top.map((r, i) => toEntry(r, i + 1));

  let me = leaderboard.find(e => e.me) || null;
  if (!me && myEntry) {
    const myRank = ranked.findIndex(r => r.userId === req.user.id) + 1;
    me = toEntry(myEntry, myRank);
  }
  if (!me) {
    me = { rank: null, userId: req.user.id, name: userName(req.user), av: userName(req.user)[0].toUpperCase(), xp: 0, me: true };
  }

  res.json({ leaderboard, me, period });
});

module.exports = router;
