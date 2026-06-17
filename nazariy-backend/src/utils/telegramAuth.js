// ─── Telegram Mini App initData tekshiruvi ───
// Telegram dokumentatsiyasi:
// https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app

const crypto = require("crypto");

/**
 * Telegram tomonidan yuborilgan `initData` qatorini tekshiradi va
 * agar to'g'ri bo'lsa, undan foydalanuvchi ma'lumotlarini ajratib qaytaradi.
 *
 * @param {string} initData - tg.initData (URL-encoded query string)
 * @param {string} botToken - @BotFather dan olingan bot tokeni
 * @returns {{ ok: boolean, user?: object, authDate?: number, error?: string }}
 */
function verifyTelegramInitData(initData, botToken) {
  if (!initData || !botToken) {
    return { ok: false, error: "initData yoki botToken yo'q" };
  }

  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash) return { ok: false, error: "hash topilmadi" };

  // hash'dan tashqari barcha maydonlarni alfabit tartibida birlashtiramiz
  const pairs = [];
  for (const [key, value] of params.entries()) {
    if (key === "hash") continue;
    pairs.push(`${key}=${value}`);
  }
  pairs.sort();
  const dataCheckString = pairs.join("\n");

  // Maxfiy kalit: HMAC-SHA256(bot_token, "WebAppData")
  const secretKey = crypto
    .createHmac("sha256", "WebAppData")
    .update(botToken)
    .digest();

  const computedHash = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  if (computedHash !== hash) {
    return { ok: false, error: "Imzo mos kelmadi (hash noto'g'ri)" };
  }

  // auth_date eskirganligini tekshirish (masalan 24 soatdan eski bo'lmasligi kerak)
  const authDate = Number(params.get("auth_date") || 0);
  const MAX_AGE_SECONDS = 24 * 60 * 60;
  if (authDate && Date.now() / 1000 - authDate > MAX_AGE_SECONDS) {
    return { ok: false, error: "initData eskirgan" };
  }

  let user = null;
  const userRaw = params.get("user");
  if (userRaw) {
    try {
      user = JSON.parse(userRaw);
    } catch {
      return { ok: false, error: "user JSON noto'g'ri" };
    }
  }

  return { ok: true, user, authDate };
}

module.exports = { verifyTelegramInitData };
