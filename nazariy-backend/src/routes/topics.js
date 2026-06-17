const express = require("express");
const { query } = require("../db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// GET /topics — mavzular ro'yxati, har biriga tegishli savollar soni bilan
router.get("/", requireAuth, async (req, res) => {
  const topics = await query(`
    SELECT t.*, COUNT(q.id) as questionCount
    FROM Topic t LEFT JOIN Question q ON q.topicId = t.id
    GROUP BY t.id ORDER BY t.createdAt ASC
  `);
  res.json(topics.map(t => ({
    id: t.id,
    title: { uz: t.titleUz, ru: t.titleRu, kril: t.titleKril },
    color: t.color,
    icon: t.icon,
    questionCount: Number(t.questionCount),
  })));
});

module.exports = router;
