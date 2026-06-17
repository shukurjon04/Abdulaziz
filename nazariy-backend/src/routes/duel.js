const express = require("express");
const { query } = require("../db");
const { genId } = require("../utils/id");
const { requireAuth } = require("../middleware/auth");
const { isProActive } = require("../utils/proStatus");

const router = express.Router();
router.use(requireAuth);

function questionToClient(q) {
  let options = { uz: [], ru: [], kril: [] };
  try { options = JSON.parse(q.optionsJson); } catch {}
  return {
    id: q.id,
    question: { uz: q.questionUz, ru: q.questionRu, kril: q.questionKril },
    options,
    correct: q.correct,
    image: q.image,
    topicId: q.topicId,
    explanation: { uz: q.explanationUz || "", ru: q.explanationRu || "", kril: q.explanationKril || "" },
  };
}

function userName(u) {
  return [u?.firstName, u?.lastName].filter(Boolean).join(" ") || u?.username || "Foydalanuvchi";
}

// Duel obyektini frontend uchun ro'yxat ko'rinishiga o'giradi
// `d` — Duel qatori + d.creator/d.opponent (User obyektlari yoki null)
function toListItem(d, myId) {
  const amCreator = d.creatorId === myId;
  const opponent = amCreator ? d.opponent : d.creator;

  let status;
  if (!d.opponentId) status = "waiting"; // hali hech kim qo'shilmagan, taklif kutilmoqda
  else if (d.status === "done") status = "done";
  else if (amCreator ? !d.creatorDone : !d.opponentDone) status = "your_turn";
  else status = "waiting"; // men javob berdim, raqib navbatida

  return {
    id: d.id,
    opponent: opponent ? userName(opponent) : null,
    opAvatar: opponent ? userName(opponent)[0].toUpperCase() : "?",
    status,
    myScore: amCreator ? d.creatorScore : d.opponentScore,
    opScore: amCreator ? d.opponentScore : d.creatorScore,
    hoursAgo: Math.floor((Date.now() - new Date(d.createdAt).getTime()) / 3600000),
    amCreator,
  };
}

// Berilgan Duel qatorlariga creator/opponent User obyektlarini biriktiradi
async function attachUsers(duels) {
  const userIds = [...new Set(duels.flatMap(d => [d.creatorId, d.opponentId]).filter(Boolean))];
  let users = [];
  if (userIds.length) {
    const placeholders = userIds.map(() => "?").join(",");
    users = await query(`SELECT * FROM User WHERE id IN (${placeholders})`, userIds);
  }
  const userMap = Object.fromEntries(users.map(u => [u.id, u]));
  return duels.map(d => ({ ...d, creator: userMap[d.creatorId] || null, opponent: d.opponentId ? userMap[d.opponentId] || null : null }));
}

// GET /duel — mening barcha duellarim (creator yoki opponent sifatida)
router.get("/", async (req, res) => {
  const duels = await query("SELECT * FROM Duel WHERE creatorId=? OR opponentId=? ORDER BY createdAt DESC", [req.user.id, req.user.id]);
  const withUsers = await attachUsers(duels);
  res.json(withUsers.map(d => toListItem(d, req.user.id)));
});

// POST /duel — yangi duel yaratish (20 ta tasodifiy savol bilan)
router.post("/", async (req, res) => {
  const isPro = isProActive(req.user);

  const tickets = isPro
    ? await query("SELECT id FROM Ticket")
    : await query("SELECT id FROM Ticket WHERE isPro = 0");

  let allQuestions = [];
  if (tickets.length) {
    const placeholders = tickets.map(() => "?").join(",");
    allQuestions = await query(`SELECT id FROM Question WHERE ticketId IN (${placeholders})`, tickets.map(t => t.id));
  }
  if (allQuestions.length < 20) return res.status(400).json({ error: "Savollar soni yetarli emas" });

  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5).slice(0, 20);

  const id = genId();
  await query("INSERT INTO Duel (id,creatorId,questionIds,status) VALUES (?,?,?,'waiting')", [
    id, req.user.id, JSON.stringify(shuffled.map(q => q.id)),
  ]);

  res.json({ id });
});

// POST /duel/:id/join — taklif havolasi orqali duelga qo'shilish
router.post("/:id/join", async (req, res) => {
  const rows = await query("SELECT * FROM Duel WHERE id=?", [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: "Duel topilmadi" });
  const duel = rows[0];

  if (duel.creatorId === req.user.id) return res.status(400).json({ error: "O'zingiz yaratgan duelga qo'shila olmaysiz" });
  if (duel.opponentId && duel.opponentId !== req.user.id) return res.status(400).json({ error: "Bu duelga allaqachon boshqa o'yinchi qo'shilgan" });

  await query("UPDATE Duel SET opponentId=?, status='active' WHERE id=?", [req.user.id, duel.id]);

  const updatedRows = await query("SELECT * FROM Duel WHERE id=?", [duel.id]);
  const [withUsers] = await attachUsers(updatedRows);
  res.json(toListItem(withUsers, req.user.id));
});

// GET /duel/:id/questions — javob berish uchun savollar ro'yxati
router.get("/:id/questions", async (req, res) => {
  const rows = await query("SELECT * FROM Duel WHERE id=?", [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: "Duel topilmadi" });
  const duel = rows[0];

  const amCreator = duel.creatorId === req.user.id;
  const amOpponent = duel.opponentId === req.user.id;
  if (!amCreator && !amOpponent) return res.status(403).json({ error: "Bu duel sizga tegishli emas" });

  const done = amCreator ? duel.creatorDone : duel.opponentDone;
  if (done) return res.status(400).json({ error: "Siz allaqachon javob bergansiz" });

  const ids = JSON.parse(duel.questionIds);
  let questions = [];
  if (ids.length) {
    const placeholders = ids.map(() => "?").join(",");
    questions = await query(`SELECT * FROM Question WHERE id IN (${placeholders})`, ids);
  }
  const ordered = ids.map(id => questions.find(q => q.id === id)).filter(Boolean);

  res.json({ id: duel.id, questions: ordered.map(questionToClient) });
});

// POST /duel/:id/submit — javoblarni yuborish va ballni hisoblash
// Body: { answers: {questionIndex: tanlangan variant} }
router.post("/:id/submit", async (req, res) => {
  const rows = await query("SELECT * FROM Duel WHERE id=?", [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: "Duel topilmadi" });
  const duel = rows[0];

  const amCreator = duel.creatorId === req.user.id;
  const amOpponent = duel.opponentId === req.user.id;
  if (!amCreator && !amOpponent) return res.status(403).json({ error: "Bu duel sizga tegishli emas" });

  const done = amCreator ? duel.creatorDone : duel.opponentDone;
  if (done) return res.status(400).json({ error: "Siz allaqachon javob bergansiz" });

  const ids = JSON.parse(duel.questionIds);
  let questions = [];
  if (ids.length) {
    const placeholders = ids.map(() => "?").join(",");
    questions = await query(`SELECT * FROM Question WHERE id IN (${placeholders})`, ids);
  }
  const ordered = ids.map(id => questions.find(q => q.id === id)).filter(Boolean);

  const { answers } = req.body;
  let score = 0;
  ordered.forEach((q, i) => { if (answers?.[i] === q.correct) score++; });

  const bothDone = (amCreator ? true : !!duel.creatorDone) && (amCreator ? !!duel.opponentDone : true);

  if (amCreator) {
    await query("UPDATE Duel SET creatorScore=?, creatorDone=1, status=? WHERE id=?", [score, bothDone ? "done" : duel.status, duel.id]);
  } else {
    await query("UPDATE Duel SET opponentScore=?, opponentDone=1, status=? WHERE id=?", [score, bothDone ? "done" : duel.status, duel.id]);
  }

  const updatedRows = await query("SELECT * FROM Duel WHERE id=?", [duel.id]);
  const [withUsers] = await attachUsers(updatedRows);
  res.json(toListItem(withUsers, req.user.id));
});

module.exports = router;
