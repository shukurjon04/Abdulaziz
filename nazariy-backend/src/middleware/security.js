const rateLimit = require("express-rate-limit");

// Umumiy himoya — barcha so'rovlar uchun (DDoS/bot trafigini cheklash)
// 1 daqiqada bitta IP'dan 120 tadan ortiq so'rov bo'lsa, bloklanadi
const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Juda ko'p so'rov yuborildi. Birozdan keyin qayta urinib ko'ring." },
});

// Login (/auth/telegram) — brute-force/initData spam'iga qarshi
// 1 daqiqada 10 tadan ortiq urinish bloklanadi
const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Juda ko'p urinish. Birozdan keyin qayta urinib ko'ring." },
});

// Fayl yuklash (chek, rasm) — og'ir so'rovlar, kamroq limit
// 1 daqiqada 20 tadan ortiq yuklash bloklanadi
const uploadLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Juda ko'p fayl yuklandi. Birozdan keyin qayta urinib ko'ring." },
});

module.exports = { generalLimiter, authLimiter, uploadLimiter };
