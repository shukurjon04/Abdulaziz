const express = require("express");
const { query } = require("../db");
const { genId } = require("../utils/id");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

// POST /results — bilet/test/imtihon natijasini saqlash
// Body: { type:"ticket"|"test"|"exam", correct, wrong, total, topicMistakes?: {topicId: wrongCount} }
router.post("/", async (req, res) => {
  const { type, correct, wrong, total, topicMistakes } = req.body;
  if (!type || correct == null || wrong == null || total == null) {
    return res.status(400).json({ error: "type, correct, wrong, total majburiy" });
  }

  const id = genId();
  await query(
    "INSERT INTO TestResult (id,userId,type,correct,wrong,total,topicMistakesJson) VALUES (?,?,?,?,?,?,?)",
    [id, req.user.id, type, correct, wrong, total, topicMistakes ? JSON.stringify(topicMistakes) : null]
  );

  res.json({ id, createdAt: new Date().toISOString() });
});

// GET /stats — foydalanuvchining umumiy statistikasi + mavzular bo'yicha xatolar
router.get("/stats", async (req, res) => {
  const results = await query("SELECT * FROM TestResult WHERE userId = ?", [req.user.id]);

  const totals = results.reduce(
    (acc, r) => {
      acc.totalQ += r.total;
      acc.correctA += r.correct;
      acc.wrongA += r.wrong;
      return acc;
    },
    { totalQ: 0, correctA: 0, wrongA: 0 }
  );
  const correctPct = totals.totalQ > 0 ? Math.round((totals.correctA / totals.totalQ) * 100) : 0;

  // Mavzular bo'yicha xatolarni yig'ish
  const topicWrong = {};
  for (const r of results) {
    if (!r.topicMistakesJson) continue;
    let m = {};
    try { m = JSON.parse(r.topicMistakesJson); } catch { continue; }
    for (const [topicId, count] of Object.entries(m)) {
      topicWrong[topicId] = (topicWrong[topicId] || 0) + count;
    }
  }

  const topicIds = Object.keys(topicWrong);
  let topics = [];
  if (topicIds.length) {
    const placeholders = topicIds.map(() => "?").join(",");
    topics = await query(`SELECT * FROM Topic WHERE id IN (${placeholders})`, topicIds);
  }

  const totalWrongAcrossTopics = Object.values(topicWrong).reduce((a, b) => a + b, 0) || 1;
  const mistakesByTopic = topics
    .map(t => ({
      id: t.id,
      title: { uz: t.titleUz, ru: t.titleRu, kril: t.titleKril },
      color: t.color,
      pct: Math.round((topicWrong[t.id] / totalWrongAcrossTopics) * 100),
    }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 5);

  res.json({
    totalQ: totals.totalQ,
    correctA: totals.correctA,
    wrongA: totals.wrongA,
    correctPct,
    mistakesByTopic,
  });
});

module.exports = router;
