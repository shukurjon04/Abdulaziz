// Prisma'dagi cuid() o'rnini bosadigan, qo'shimcha kutubxonasiz ID generator.
// Format: "c" + vaqt(36-asos) + tasodifiy(36-asos) — taxminan 20 belgi, taqqoslash uchun qulay.
const crypto = require("crypto");

function genId() {
  const time = Date.now().toString(36);
  const rand = crypto.randomBytes(8).toString("hex");
  return `c${time}${rand}`;
}

module.exports = { genId };
