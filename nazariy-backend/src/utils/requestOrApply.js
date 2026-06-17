const { query } = require("../db");
const { genId } = require("./id");
const { applyChange } = require("./applyChange");
const { isSuperAdmin } = require("../middleware/auth");

/**
 * Frontenddagi requestOrApply(type, payload, description) mantiqi.
 *
 * - Super admin bo'lsa: o'zgarish darhol qo'llaniladi va natija qaytariladi.
 * - Boshqa admin bo'lsa: PendingChange yaratiladi, "pending" statusda,
 *   asosiy ma'lumotlarga hech narsa o'zgarmaydi.
 *
 * @returns {{ applied: boolean, result?: any, pendingChange?: object }}
 */
async function requestOrApply(user, type, payload, description) {
  if (isSuperAdmin(user)) {
    const result = await applyChange(type, payload);
    return { applied: true, result };
  }

  const id = genId();
  await query(
    "INSERT INTO PendingChange (id,type,payloadJson,description,adminId,status) VALUES (?,?,?,?,?,'pending')",
    [id, type, JSON.stringify(payload), description, user.id]
  );

  const pendingChange = {
    id, type, payload, description,
    status: "pending",
    adminName: [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username || "Admin",
    adminTgId: user.tgId,
    createdAt: new Date().toISOString(),
  };
  return { applied: false, pendingChange };
}

module.exports = { requestOrApply };
