const express = require("express");
const { query } = require("../db");
const { requireAuth } = require("../middleware/auth");
const { isProActive } = require("../utils/proStatus");

const router = express.Router();
router.use(requireAuth);

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

function questionToClient(q) {
  let options = { uz: [], ru: [], kril: [] };
  try { options = JSON.parse(q.optionsJson); } catch {}
  return {
    id: q.id,
    order: q.order,
    question: { uz: q.questionUz, ru: q.questionRu, kril: q.questionKril },
    options,
    correct: q.correct,
    image: q.image,
    topicId: q.topicId,
    explanation: { uz: q.explanationUz || "", ru: q.explanationRu || "", kril: q.explanationKril || "" },
  };
}

// GET /content/bundle
// Ilova ochilganda bitta so'rov bilan kerakli barcha kontentni oladi:
// biletlar (faqat foydalanuvchiga ruxsat etilganlari, savollari bilan),
// mavzular, yo'l qoidalari va umumiy sozlamalar.
router.get("/bundle", async (req, res) => {
  const isPro = isProActive(req.user);

  const tickets = isPro
    ? await query("SELECT * FROM Ticket ORDER BY number ASC")
    : await query("SELECT * FROM Ticket WHERE isPro = 0 ORDER BY number ASC");

  const ticketIds = tickets.map(t => t.id);
  let questions = [];
  if (ticketIds.length) {
    const placeholders = ticketIds.map(() => "?").join(",");
    questions = await query(`SELECT * FROM Question WHERE ticketId IN (${placeholders}) ORDER BY \`order\` ASC`, ticketIds);
  }

  const topics = await query("SELECT * FROM Topic ORDER BY createdAt ASC");
  const categories = await query("SELECT * FROM RuleCategory ORDER BY createdAt ASC");
  const items = await query("SELECT * FROM RuleItem ORDER BY `order` ASC");

  const settingRows = await query("SELECT `key`, valueJson FROM Setting");
  const settings = { ...DEFAULTS };
  for (const row of settingRows) {
    try { settings[row.key] = JSON.parse(row.valueJson); } catch {}
  }

  res.json({
    tickets: tickets.map(t => ({
      id: t.id,
      number: t.number,
      isPro: !!t.isPro,
      questions: questions.filter(q => q.ticketId === t.id).map(questionToClient),
    })),
    topics: topics.map(t => ({
      id: t.id,
      title: { uz: t.titleUz, ru: t.titleRu, kril: t.titleKril },
      color: t.color,
      icon: t.icon,
    })),
    rules: categories.map(cat => ({
      id: cat.id,
      title: { uz: cat.titleUz, ru: cat.titleRu, kril: cat.titleKril },
      desc: { uz: cat.descUz || "", ru: cat.descRu || "", kril: cat.descKril || "" },
      color: cat.color,
      icon: cat.icon,
      items: items.filter(it => it.categoryId === cat.id).map(it => ({
        id: it.id,
        title: { uz: it.titleUz, ru: it.titleRu, kril: it.titleKril },
        desc: it.descUz ? { uz: it.descUz, ru: it.descRu || it.descUz, kril: it.descKril || it.descUz } : null,
        image: it.image,
      })),
    })),
    settings,
  });
});

module.exports = router;
