// Frontenddagi genReferralCode(user) bilan bir xil mantiq —
// tgId asosida 10 belgili "NAZxxxxxxx" formatdagi kod yaratadi.

function genReferralCode(tgId) {
  const base = String(tgId || "USER");
  let numeric = 0;
  for (const ch of base) numeric += ch.charCodeAt(0);
  const suffix = String(1000 + (numeric % 9000 || 1234)).slice(0, 4);
  const tail = base.replace(/\D/g, "").slice(-4).padStart(4, "0");
  return ("NAZ" + tail + suffix).slice(0, 10).toUpperCase();
}

module.exports = { genReferralCode };
