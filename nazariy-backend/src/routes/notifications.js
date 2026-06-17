const express = require("express");
const { query } = require("../db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

// GET /notifications — joriy foydalanuvchi bildirishnomalari
router.get("/", async (req, res) => {
  const rows = await query(`
    SELECT n.*, un.\`read\` as un_read
    FROM UserNotification un
    JOIN Notification n ON n.id = un.notificationId
    WHERE un.userId = ?
    ORDER BY n.createdAt DESC
  `, [req.user.id]);

  res.json(rows.map(r => ({
    id: r.id,
    type: r.type,
    read: !!r.un_read,
    title: { uz: r.titleUz, ru: r.titleRu, kril: r.titleKril },
    body: { uz: r.bodyUz, ru: r.bodyRu, kril: r.bodyKril },
    createdAt: r.createdAt,
  })));
});

// POST /notifications/:id/read — o'qilgan deb belgilash
router.post("/:id/read", async (req, res) => {
  await query("UPDATE UserNotification SET `read`=1 WHERE userId=? AND notificationId=?", [req.user.id, req.params.id]);
  res.json({ ok: true });
});

module.exports = router;
