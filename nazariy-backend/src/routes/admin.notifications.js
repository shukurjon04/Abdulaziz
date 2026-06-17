const express = require("express");
const { query } = require("../db");
const { genId } = require("../utils/id");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

// POST /admin/notifications — barcha foydalanuvchilarga bildirishnoma yuborish
// Body: { type, title:{uz,ru,kril}, body:{uz,ru,kril} }
router.post("/notifications", requireAdmin("notifications"), async (req, res) => {
  const { type, title, body } = req.body;
  if (!title?.uz || !body?.uz) return res.status(400).json({ error: "title.uz va body.uz majburiy" });

  const notificationId = genId();
  await query(
    "INSERT INTO Notification (id,type,titleUz,titleRu,titleKril,bodyUz,bodyRu,bodyKril) VALUES (?,?,?,?,?,?,?,?)",
    [notificationId, type || "new", title.uz, title.ru || title.uz, title.kril || title.uz, body.uz, body.ru || body.uz, body.kril || body.uz]
  );

  // Barcha foydalanuvchilar uchun UserNotification yozuvi yaratish.
  // Katta bazalarda bu batch/queue orqali bajarilishi kerak — bu yerda oddiy yondashuv.
  const users = await query("SELECT id FROM User");
  if (users.length) {
    const values = [];
    const placeholders = [];
    for (const u of users) {
      values.push(genId(), u.id, notificationId, 0);
      placeholders.push("(?,?,?,?)");
    }
    await query(`INSERT IGNORE INTO UserNotification (id,userId,notificationId,\`read\`) VALUES ${placeholders.join(",")}`, values);
  }

  res.json({
    id: notificationId,
    type: type || "new",
    title: { uz: title.uz, ru: title.ru || title.uz, kril: title.kril || title.uz },
    body: { uz: body.uz, ru: body.ru || body.uz, kril: body.kril || body.uz },
    sentTo: users.length,
  });
});

// GET /admin/notifications — yuborilgan bildirishnomalar tarixi
router.get("/notifications", requireAdmin("notifications"), async (req, res) => {
  const notifications = await query("SELECT * FROM Notification ORDER BY createdAt DESC");
  res.json(notifications.map(n => ({
    id: n.id,
    type: n.type,
    title: { uz: n.titleUz, ru: n.titleRu, kril: n.titleKril },
    body: { uz: n.bodyUz, ru: n.bodyRu, kril: n.bodyKril },
    createdAt: n.createdAt,
  })));
});

module.exports = router;
