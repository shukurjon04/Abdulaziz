const express = require("express");
const { query } = require("../db");
const { genId } = require("../utils/id");
const { genReferralCode } = require("../utils/referral");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);
router.use(requireAdmin("admins")); // faqat "admins" ruxsatiga ega adminlar (odatda super)

const ADMIN_PERMS = {
  super: ["tickets", "topics", "rules", "notifications", "pro", "admins"],
  content: ["tickets", "topics", "rules"],
  support: ["notifications"],
};

function toClient(u) {
  return {
    id: u.id,
    tgId: u.tgId,
    name: [u.firstName, u.lastName].filter(Boolean).join(" ") || u.username || "Admin",
    username: u.username,
    role: u.adminRole,
    perms: u.adminPerms ? JSON.parse(u.adminPerms) : ADMIN_PERMS[u.adminRole] || [],
  };
}

// GET /admin/admins — barcha adminlar ro'yxati
router.get("/", async (req, res) => {
  const admins = await query("SELECT * FROM User WHERE adminRole IS NOT NULL ORDER BY createdAt ASC");
  res.json(admins.map(toClient));
});

// POST /admin/admins — yangi admin tayinlash (mavjud foydalanuvchi tgId orqali)
// Agar tgId bo'yicha foydalanuvchi topilmasa, "shell" yozuv yaratiladi —
// foydalanuvchi keyinchalik /auth/telegram orqali kirganda profili to'ladi.
router.post("/", async (req, res) => {
  const { tgId, name, username, role, perms } = req.body;
  if (!tgId || !role) return res.status(400).json({ error: "tgId va role majburiy" });
  if (!ADMIN_PERMS[role]) return res.status(400).json({ error: "Noto'g'ri role" });

  const existing = await query("SELECT * FROM User WHERE tgId=?", [String(tgId)]);
  const adminPerms = JSON.stringify(perms || ADMIN_PERMS[role]);

  let userId;
  if (existing.length) {
    userId = existing[0].id;
    await query("UPDATE User SET adminRole=?, adminPerms=? WHERE id=?", [role, adminPerms, userId]);
  } else {
    // Referal kodi unikal bo'lishi shart — vaqtinchalik kod yaratamiz
    userId = genId();
    await query(
      "INSERT INTO User (id,tgId,firstName,username,referralCode,adminRole,adminPerms) VALUES (?,?,?,?,?,?,?)",
      [userId, String(tgId), name || null, username || null, genReferralCode(tgId), role, adminPerms]
    );
  }

  const rows = await query("SELECT * FROM User WHERE id=?", [userId]);
  res.json(toClient(rows[0]));
});

// PATCH /admin/admins/:id — admin ma'lumotlari/rol/ruxsatlarini tahrirlash
router.patch("/:id", async (req, res) => {
  const { name, username, role, perms } = req.body;
  const rows = await query("SELECT * FROM User WHERE id=?", [req.params.id]);
  if (!rows.length || !rows[0].adminRole) return res.status(404).json({ error: "Admin topilmadi" });
  const target = rows[0];

  if (role && !ADMIN_PERMS[role]) return res.status(400).json({ error: "Noto'g'ri role" });

  const newName = name !== undefined ? name : target.firstName;
  const newUsername = username !== undefined ? username : target.username;
  const newRole = role || target.adminRole;
  const newPerms = perms ? JSON.stringify(perms) : (role ? JSON.stringify(ADMIN_PERMS[role]) : target.adminPerms);

  await query("UPDATE User SET firstName=?, username=?, adminRole=?, adminPerms=? WHERE id=?", [
    newName, newUsername, newRole, newPerms, target.id,
  ]);

  const updatedRows = await query("SELECT * FROM User WHERE id=?", [target.id]);
  res.json(toClient(updatedRows[0]));
});

// DELETE /admin/admins/:id — admin huquqlarini olib tashlash
// Oxirgi super adminni o'chirish taqiqlanadi
router.delete("/:id", async (req, res) => {
  const rows = await query("SELECT * FROM User WHERE id=?", [req.params.id]);
  if (!rows.length || !rows[0].adminRole) return res.status(404).json({ error: "Admin topilmadi" });
  const target = rows[0];

  if (target.adminRole === "super") {
    const [{ cnt }] = await query("SELECT COUNT(*) as cnt FROM User WHERE adminRole='super'");
    if (Number(cnt) <= 1) return res.status(400).json({ error: "Oxirgi super adminni o'chirib bo'lmaydi" });
  }

  await query("UPDATE User SET adminRole=NULL, adminPerms=NULL WHERE id=?", [target.id]);
  res.json({ ok: true });
});

module.exports = router;
