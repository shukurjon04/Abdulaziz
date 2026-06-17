const express = require("express");
const { query } = require("../db");
const { genId } = require("../utils/id");
const { verifyTelegramInitData } = require("../utils/telegramAuth");
const { signToken } = require("../utils/jwt");
const { genReferralCode } = require("../utils/referral");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

function userToClient(user) {
  return {
    id: user.id,
    tgId: user.tgId,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    isPro: !!user.isPro,
    proExpiresAt: user.proExpiresAt,
    referralCode: user.referralCode,
    isAdmin: !!user.adminRole,
    adminRole: user.adminRole,
    adminPerms: user.adminPerms ? JSON.parse(user.adminPerms) : null,
  };
}

// POST /auth/telegram
// Body: { initData: string, referredBy?: string }
// Frontenddagi useTelegram().loginToBackend() shu endpointni chaqiradi.
router.post("/telegram", async (req, res) => {
  const { initData, referredBy } = req.body || {};
  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  const result = verifyTelegramInitData(initData, botToken);
  if (!result.ok) {
    return res.status(401).json({ error: result.error || "initData yaroqsiz" });
  }

  const tgUser = result.user;
  if (!tgUser?.id) return res.status(400).json({ error: "Telegram foydalanuvchi ma'lumoti yo'q" });

  const existing = await query("SELECT * FROM User WHERE tgId = ?", [String(tgUser.id)]);
  let user;

  if (!existing.length) {
    // Referal kodi bo'yicha taklif qilgan foydalanuvchini topish (ixtiyoriy)
    let invitedById = null;
    if (referredBy) {
      const inviter = await query("SELECT id FROM User WHERE referralCode = ?", [referredBy]);
      if (inviter.length) invitedById = inviter[0].id;
    }

    const id = genId();
    await query(
      "INSERT INTO User (id,tgId,username,firstName,lastName,photoUrl,referralCode,invitedById) VALUES (?,?,?,?,?,?,?,?)",
      [id, String(tgUser.id), tgUser.username || null, tgUser.first_name || null, tgUser.last_name || null,
       tgUser.photo_url || null, genReferralCode(tgUser.id), invitedById]
    );
    const rows = await query("SELECT * FROM User WHERE id = ?", [id]);
    user = rows[0];
  } else {
    user = existing[0];
    // Profil ma'lumotlarini yangilab turamiz (ism/username o'zgargan bo'lsa)
    await query(
      "UPDATE User SET username=?, firstName=?, lastName=?, photoUrl=? WHERE id=?",
      [tgUser.username || user.username, tgUser.first_name || user.firstName,
       tgUser.last_name || user.lastName, tgUser.photo_url || user.photoUrl, user.id]
    );
    user = { ...user, username: tgUser.username || user.username, firstName: tgUser.first_name || user.firstName,
             lastName: tgUser.last_name || user.lastName, photoUrl: tgUser.photo_url || user.photoUrl };
  }

  const token = signToken(user);

  // Umumiy sozlamalarni ham birga qaytaramiz (DISCOUNT, LIMITS, ...)
  const settingsRows = await query("SELECT `key`, valueJson FROM Setting");
  const settings = {};
  for (const row of settingsRows) {
    try {
      settings[row.key] = JSON.parse(row.valueJson);
    } catch {
      settings[row.key] = null;
    }
  }

  res.json({ token, user: userToClient(user), settings });
});

// GET /auth/me — joriy foydalanuvchini token orqali olish
router.get("/me", requireAuth, async (req, res) => {
  res.json(userToClient(req.user));
});

module.exports = router;
