const express = require("express");
const { query } = require("../db");
const { requireAuth } = require("../middleware/auth");
const { isProActive } = require("../utils/proStatus");

const router = express.Router();

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

// GET /tickets — barcha biletlar ro'yxati (savol matnlarisiz, faqat metadata)
router.get("/", requireAuth, async (req, res) => {
  const tickets = await query(`
    SELECT t.id, t.number, t.isPro, COUNT(q.id) as questionCount
    FROM Ticket t LEFT JOIN Question q ON q.ticketId = t.id
    GROUP BY t.id ORDER BY t.number ASC
  `);
  res.json(tickets.map(t => ({
    id: t.id,
    number: t.number,
    isPro: !!t.isPro,
    questionCount: Number(t.questionCount),
  })));
});

// GET /tickets/:id — bitta biletning savollari
// Pro bilet bo'lsa va foydalanuvchi Pro bo'lmasa — 403
router.get("/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  const tickets = await query("SELECT * FROM Ticket WHERE id = ?", [id]);
  if (!tickets.length) return res.status(404).json({ error: "Bilet topilmadi" });
  const ticket = tickets[0];

  if (ticket.isPro && !isProActive(req.user)) {
    return res.status(403).json({ error: "Bu bilet faqat Pro foydalanuvchilar uchun" });
  }

  const questions = await query("SELECT * FROM Question WHERE ticketId = ? ORDER BY `order` ASC", [id]);

  res.json({
    id: ticket.id,
    number: ticket.number,
    isPro: !!ticket.isPro,
    questions: questions.map(questionToClient),
  });
});

module.exports = router;
