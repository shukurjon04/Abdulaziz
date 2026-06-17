const { verifyToken } = require("../utils/jwt");
const { query } = require("../db");

/**
 * Authorization: Bearer <token> headerini tekshiradi va
 * req.user ga foydalanuvchi obyektini joylashtiradi.
 * Token bo'lmasa/yaroqsiz bo'lsa — 401.
 */
async function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Token topilmadi" });

  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ error: "Token yaroqsiz" });

  const rows = await query("SELECT * FROM User WHERE id = ?", [payload.uid]);
  if (!rows.length) return res.status(401).json({ error: "Foydalanuvchi topilmadi" });

  req.user = rows[0];
  next();
}

/**
 * requireAuth dan keyin ishlatiladi. Foydalanuvchi admin ekanini
 * va kerakli ruxsatga (perm) ega ekanini tekshiradi.
 * Super admin har doim hamma ruxsatlarga ega.
 *
 * @param {string|null} perm - "tickets" | "topics" | "rules" | "notifications" | "pro" | "admins" | null (faqat admin bo'lishi kifoya)
 */
function requireAdmin(perm = null) {
  return (req, res, next) => {
    const role = req.user?.adminRole;
    if (!role) return res.status(403).json({ error: "Admin huquqi yo'q" });

    if (role === "super") return next();
    if (!perm) return next();

    let perms = [];
    try {
      perms = JSON.parse(req.user.adminPerms || "[]");
    } catch {
      perms = [];
    }
    if (!perms.includes(perm)) {
      return res.status(403).json({ error: `"${perm}" ruxsati yo'q` });
    }
    next();
  };
}

/** Joriy foydalanuvchi super admin emasligini bildiradi — PendingChange yaratish kerakligini ko'rsatadi */
function isSuperAdmin(user) {
  return user?.adminRole === "super";
}

module.exports = { requireAuth, requireAdmin, isSuperAdmin };
