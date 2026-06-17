const express = require("express");
const { query } = require("../db");
const { requireAuth, requireAdmin } = require("../middleware/auth");
const { requestOrApply } = require("../utils/requestOrApply");
const { upload, fileUrl } = require("../utils/upload");

const router = express.Router();
router.use(requireAuth);

// ─── BILETLAR ───

// POST /admin/tickets — yangi bilet qo'shish (bo'sh savollar bilan)
router.post("/tickets", requireAdmin("tickets"), async (req, res) => {
  const { isPro, questionCount } = req.body;
  const { applied, result, pendingChange } = await requestOrApply(
    req.user,
    "add_ticket",
    { isPro: !!isPro, questionCount: questionCount || 20 },
    `Yangi bilet qo'shish${isPro ? " (PRO)" : ""}`
  );
  res.json({ applied, result, pendingChange });
});

// PATCH /admin/tickets/:id — Pro/Bepul holatini o'zgartirish
router.patch("/tickets/:id", requireAdmin("tickets"), async (req, res) => {
  const ticketId = Number(req.params.id);
  const { isPro } = req.body;
  const { applied, result, pendingChange } = await requestOrApply(
    req.user,
    "toggle_ticket_pro",
    { ticketId, isPro: !!isPro },
    `Bilet #${ticketId} holatini ${isPro ? "PRO" : "Bepul"} ga o'zgartirish`
  );
  res.json({ applied, result, pendingChange });
});

// PATCH /admin/tickets/:id/questions — savollarni tahrirlash
router.patch("/tickets/:id/questions", requireAdmin("tickets"), async (req, res) => {
  const ticketId = Number(req.params.id);
  const { questions } = req.body;
  if (!Array.isArray(questions)) return res.status(400).json({ error: "questions massiv bo'lishi kerak" });

  const { applied, result, pendingChange } = await requestOrApply(
    req.user,
    "edit_ticket_questions",
    { ticketId, questions },
    `Bilet #${ticketId} savollarini tahrirlash`
  );
  res.json({ applied, result, pendingChange });
});

// DELETE /admin/tickets/:id
router.delete("/tickets/:id", requireAdmin("tickets"), async (req, res) => {
  const ticketId = Number(req.params.id);
  const { applied, result, pendingChange } = await requestOrApply(
    req.user,
    "delete_ticket",
    { ticketId },
    `Bilet #${ticketId} ni o'chirish`
  );
  res.json({ applied, result, pendingChange });
});

// POST /admin/upload — savol/belgi rasmini yuklash, URL qaytaradi
router.post("/upload", requireAdmin(null), upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Fayl yuborilmadi" });
  res.json({ url: fileUrl(req.file.filename) });
});

// ─── MAVZULAR ───

// POST /admin/topics
router.post("/topics", requireAdmin("topics"), async (req, res) => {
  const { title, color, icon } = req.body;
  if (!title?.uz) return res.status(400).json({ error: "title.uz majburiy" });

  const { applied, result, pendingChange } = await requestOrApply(
    req.user,
    "add_topic",
    { title, color, icon },
    `Yangi mavzu qo'shish: ${title.uz}`
  );
  res.json({ applied, result, pendingChange });
});

// DELETE /admin/topics/:id
router.delete("/topics/:id", requireAdmin("topics"), async (req, res) => {
  const topicId = req.params.id;
  const rows = await query("SELECT * FROM Topic WHERE id=?", [topicId]);
  if (!rows.length) return res.status(404).json({ error: "Mavzu topilmadi" });
  const topic = rows[0];

  const { applied, result, pendingChange } = await requestOrApply(
    req.user,
    "delete_topic",
    { topicId },
    `Mavzuni o'chirish: ${topic.titleUz}`
  );
  res.json({ applied, result, pendingChange });
});

// ─── YO'L QOIDALARI ───

// POST /admin/rules/categories
router.post("/rules/categories", requireAdmin("rules"), async (req, res) => {
  const { title, color, icon } = req.body;
  if (!title?.uz) return res.status(400).json({ error: "title.uz majburiy" });

  const { applied, result, pendingChange } = await requestOrApply(
    req.user,
    "add_rule_category",
    { title, color, icon },
    `Yangi toifa qo'shish: ${title.uz}`
  );
  res.json({ applied, result, pendingChange });
});

// POST /admin/rules/categories/:id/items
router.post("/rules/categories/:id/items", requireAdmin("rules"), async (req, res) => {
  const categoryId = req.params.id;
  const { item } = req.body;
  if (!item?.uz) return res.status(400).json({ error: "item.uz majburiy" });

  const catRows = await query("SELECT * FROM RuleCategory WHERE id=?", [categoryId]);
  if (!catRows.length) return res.status(404).json({ error: "Toifa topilmadi" });

  const { applied, result, pendingChange } = await requestOrApply(
    req.user,
    "add_rule_item",
    { categoryId, item },
    `Yangi belgi qo'shish: ${item.uz}`
  );
  res.json({ applied, result, pendingChange });
});

// DELETE /admin/rules/items/:id
router.delete("/rules/items/:id", requireAdmin("rules"), async (req, res) => {
  const itemId = req.params.id;
  const itemRows = await query("SELECT * FROM RuleItem WHERE id=?", [itemId]);
  if (!itemRows.length) return res.status(404).json({ error: "Belgi topilmadi" });
  const item = itemRows[0];

  const { applied, result, pendingChange } = await requestOrApply(
    req.user,
    "delete_rule_item",
    { itemId },
    `Belgini o'chirish: ${item.titleUz}`
  );
  res.json({ applied, result, pendingChange });
});

module.exports = router;
