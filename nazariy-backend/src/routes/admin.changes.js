const express = require("express");
const { query } = require("../db");
const { requireAuth, requireAdmin, isSuperAdmin } = require("../middleware/auth");
const { applyChange } = require("../utils/applyChange");

const router = express.Router();
router.use(requireAuth);

// `c` — PendingChange qatori + c.admin (User obyekti)
function toClient(c) {
  return {
    id: c.id,
    type: c.type,
    payload: JSON.parse(c.payloadJson),
    description: c.description,
    status: c.status,
    adminName: [c.admin.firstName, c.admin.lastName].filter(Boolean).join(" ") || c.admin.username || "Admin",
    adminTgId: c.admin.tgId,
    createdAt: c.createdAt,
  };
}

// PendingChange qatorlariga admin (User) obyektini biriktiradi
async function attachAdmins(changes) {
  const adminIds = [...new Set(changes.map(c => c.adminId))];
  let admins = [];
  if (adminIds.length) {
    const placeholders = adminIds.map(() => "?").join(",");
    admins = await query(`SELECT * FROM User WHERE id IN (${placeholders})`, adminIds);
  }
  const adminMap = Object.fromEntries(admins.map(a => [a.id, a]));
  return changes.map(c => ({ ...c, admin: adminMap[c.adminId] }));
}

// GET /admin/changes
// - Super admin: barcha o'zgarishlarni ko'radi
// - Boshqa admin: faqat o'zining yuborganlarini ko'radi
router.get("/", requireAdmin(null), async (req, res) => {
  const changes = isSuperAdmin(req.user)
    ? await query("SELECT * FROM PendingChange ORDER BY createdAt DESC")
    : await query("SELECT * FROM PendingChange WHERE adminId=? ORDER BY createdAt DESC", [req.user.id]);
  res.json((await attachAdmins(changes)).map(toClient));
});

// PATCH /admin/changes/:id — kutilayotgan o'zgarish payload/description'ini tahrirlash
// (faqat super admin, faqat status="pending" bo'lganda)
router.patch("/:id", requireAdmin("admins"), async (req, res) => {
  if (!isSuperAdmin(req.user)) return res.status(403).json({ error: "Faqat super admin tahrirlay oladi" });

  const rows = await query("SELECT * FROM PendingChange WHERE id=?", [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: "O'zgarish topilmadi" });
  const change = rows[0];
  if (change.status !== "pending") return res.status(400).json({ error: "Faqat kutilayotgan o'zgarishlar tahrirlanadi" });

  const { payload, description } = req.body;
  await query("UPDATE PendingChange SET payloadJson=?, description=? WHERE id=?", [
    payload ? JSON.stringify(payload) : change.payloadJson,
    description || change.description,
    change.id,
  ]);

  const updatedRows = await query("SELECT * FROM PendingChange WHERE id=?", [change.id]);
  const [withAdmin] = await attachAdmins(updatedRows);
  res.json(toClient(withAdmin));
});

// POST /admin/changes/:id/approve — faqat super admin
router.post("/:id/approve", requireAdmin("admins"), async (req, res) => {
  if (!isSuperAdmin(req.user)) return res.status(403).json({ error: "Faqat super admin tasdiqlay oladi" });

  const rows = await query("SELECT * FROM PendingChange WHERE id=?", [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: "O'zgarish topilmadi" });
  const change = rows[0];
  if (change.status !== "pending") return res.status(400).json({ error: "Bu o'zgarish allaqachon ko'rib chiqilgan" });

  await applyChange(change.type, JSON.parse(change.payloadJson));
  await query("UPDATE PendingChange SET status='approved', resolvedAt=NOW() WHERE id=?", [change.id]);

  const updatedRows = await query("SELECT * FROM PendingChange WHERE id=?", [change.id]);
  const [withAdmin] = await attachAdmins(updatedRows);
  res.json(toClient(withAdmin));
});

// POST /admin/changes/:id/reject — faqat super admin
router.post("/:id/reject", requireAdmin("admins"), async (req, res) => {
  if (!isSuperAdmin(req.user)) return res.status(403).json({ error: "Faqat super admin rad etishi mumkin" });

  const rows = await query("SELECT * FROM PendingChange WHERE id=?", [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: "O'zgarish topilmadi" });
  const change = rows[0];
  if (change.status !== "pending") return res.status(400).json({ error: "Bu o'zgarish allaqachon ko'rib chiqilgan" });

  await query("UPDATE PendingChange SET status='rejected', resolvedAt=NOW() WHERE id=?", [change.id]);

  const updatedRows = await query("SELECT * FROM PendingChange WHERE id=?", [change.id]);
  const [withAdmin] = await attachAdmins(updatedRows);
  res.json(toClient(withAdmin));
});

// POST /admin/changes/:id/restore — rad etilganni qayta "pending" qilish
// Hech narsa butunlay o'chmasligi uchun (frontenddagi restoreChange bilan bir xil)
router.post("/:id/restore", requireAdmin("admins"), async (req, res) => {
  if (!isSuperAdmin(req.user)) return res.status(403).json({ error: "Faqat super admin qaytara oladi" });

  const rows = await query("SELECT * FROM PendingChange WHERE id=?", [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: "O'zgarish topilmadi" });
  const change = rows[0];
  if (change.status !== "rejected") return res.status(400).json({ error: "Faqat rad etilganlarni qaytarish mumkin" });

  await query("UPDATE PendingChange SET status='pending', resolvedAt=NULL WHERE id=?", [change.id]);

  const updatedRows = await query("SELECT * FROM PendingChange WHERE id=?", [change.id]);
  const [withAdmin] = await attachAdmins(updatedRows);
  res.json(toClient(withAdmin));
});

module.exports = router;
