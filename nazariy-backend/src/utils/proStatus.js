// `dateStrings: true` sozlamasi tufayli MySQL'dan kelgan sanalar JS satr (string)
// ko'rinishida bo'ladi — solishtirish uchun Date'ga aylantirib olamiz.

/**
 * Foydalanuvchining Pro obunasi hozir faolmi (muddati o'tmaganmi) tekshiradi.
 * @param {{isPro: number|boolean, proExpiresAt: string|Date|null}} user
 */
function isProActive(user) {
  if (!user?.isPro) return false;
  if (!user.proExpiresAt) return true; // muddatsiz Pro
  return new Date(user.proExpiresAt) > new Date();
}

module.exports = { isProActive };
