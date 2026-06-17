const express = require("express");
const { query } = require("../db");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);
router.use(requireAdmin(null)); // har qanday admin (rolidan qat'i nazar)

const ADMIN_PERMS = {
  super: ["tickets", "topics", "rules", "notifications", "pro", "admins"],
  content: ["tickets", "topics", "rules"],
  support: ["notifications"],
};

function questionToClient(q) {
  let options = { uz: [], ru: [], kril: [] };
  try { options = JSON.parse(q.optionsJson); } catch {}
  return {
    id: q.id,
    order: q.order,
    question: { uz: q.questionUz, ru: q.questionRu, kril: q.questionKril },
    options,
    correct: q.correct,
    image: q.image,
    topicId: q.topicId,
    explanation: { uz: q.explanationUz || "", ru: q.explanationRu || "", kril: q.explanationKril || "" },
  };
}

function userName(u) {
  return [u.firstName, u.lastName].filter(Boolean).join(" ") || u.username || "Admin";
}

// GET /admin/bundle
// Admin panel ochilganda kerakli BARCHA ma'lumotlarni (huquqlardan kelib chiqib) bitta so'rovda qaytaradi.
router.get("/", async (req, res) => {
  const myPerms = req.user.adminRole === "super"
    ? ADMIN_PERMS.super
    : (req.user.adminPerms ? JSON.parse(req.user.adminPerms) : ADMIN_PERMS[req.user.adminRole] || []);

  const result = { perms: myPerms, role: req.user.adminRole };

  // Tickets/Topics/Rules — "tickets"/"topics"/"rules" ruxsati bo'lganlarga, barcha bilet va savollar bilan
  if (myPerms.includes("tickets") || myPerms.includes("topics") || myPerms.includes("rules")) {
    const tickets = await query("SELECT * FROM Ticket ORDER BY number ASC");
    const questions = await query("SELECT * FROM Question ORDER BY `order` ASC");
    result.tickets = tickets.map(t => ({
      id: t.id, number: t.number, isPro: !!t.isPro,
      questions: questions.filter(q => q.ticketId === t.id).map(questionToClient),
    }));

    const topics = await query(`
      SELECT t.*, COUNT(q.id) as questionCount
      FROM Topic t LEFT JOIN Question q ON q.topicId = t.id
      GROUP BY t.id ORDER BY t.createdAt ASC
    `);
    result.topics = topics.map(t => ({
      id: t.id,
      title: { uz: t.titleUz, ru: t.titleRu, kril: t.titleKril },
      color: t.color, icon: t.icon,
      questionCount: Number(t.questionCount),
    }));

    const categories = await query("SELECT * FROM RuleCategory ORDER BY createdAt ASC");
    const items = await query("SELECT * FROM RuleItem ORDER BY `order` ASC");
    result.rules = categories.map(cat => ({
      id: cat.id,
      title: { uz: cat.titleUz, ru: cat.titleRu, kril: cat.titleKril },
      color: cat.color, icon: cat.icon,
      items: items.filter(it => it.categoryId === cat.id).map(it => ({
        id: it.id,
        title: { uz: it.titleUz, ru: it.titleRu, kril: it.titleKril },
        desc: it.descUz ? { uz: it.descUz, ru: it.descRu || it.descUz, kril: it.descKril || it.descUz } : null,
        image: it.image,
      })),
    }));
  }

  // Pending changes — har doim (super hammasini, boshqalar o'zinikini ko'radi)
  const pendingChanges = req.user.adminRole === "super"
    ? await query("SELECT * FROM PendingChange ORDER BY createdAt DESC")
    : await query("SELECT * FROM PendingChange WHERE adminId=? ORDER BY createdAt DESC", [req.user.id]);

  const pcAdminIds = [...new Set(pendingChanges.map(c => c.adminId))];
  let pcAdmins = [];
  if (pcAdminIds.length) {
    const placeholders = pcAdminIds.map(() => "?").join(",");
    pcAdmins = await query(`SELECT * FROM User WHERE id IN (${placeholders})`, pcAdminIds);
  }
  const pcAdminMap = Object.fromEntries(pcAdmins.map(a => [a.id, a]));

  result.pendingChanges = pendingChanges.map(c => ({
    id: c.id, type: c.type, payload: JSON.parse(c.payloadJson),
    description: c.description, status: c.status,
    adminName: userName(pcAdminMap[c.adminId]), adminTgId: pcAdminMap[c.adminId]?.tgId,
    createdAt: c.createdAt,
  }));

  // Pro requests + referral grants — "pro" ruxsati
  if (myPerms.includes("pro")) {
    const proRequests = await query("SELECT * FROM ProRequest ORDER BY createdAt DESC");
    const referralGrants = await query("SELECT * FROM ReferralGrant ORDER BY createdAt DESC");

    const userIds = [...new Set([...proRequests, ...referralGrants].map(r => r.userId))];
    let users = [];
    if (userIds.length) {
      const placeholders = userIds.map(() => "?").join(",");
      users = await query(`SELECT * FROM User WHERE id IN (${placeholders})`, userIds);
    }
    const userMap = Object.fromEntries(users.map(u => [u.id, u]));

    result.proRequests = proRequests.map(r => ({
      id: r.id, name: userName(userMap[r.userId]), username: userMap[r.userId]?.username, tgId: userMap[r.userId]?.tgId,
      planLabel: r.planLabel, planDays: r.planDays, amount: r.amount,
      receiptUrl: r.receiptUrl, status: r.status, createdAt: r.createdAt,
      isMe: r.userId === req.user.id,
    }));

    result.referralGrants = referralGrants.map(g => ({
      id: g.id, name: userName(userMap[g.userId]), username: userMap[g.userId]?.username, tgId: userMap[g.userId]?.tgId,
      milestoneCount: g.milestoneCount, days: g.days, status: g.status, createdAt: g.createdAt,
      isMe: g.userId === req.user.id,
    }));
  }

  // Adminlar ro'yxati — "admins" ruxsati
  if (myPerms.includes("admins")) {
    const admins = await query("SELECT * FROM User WHERE adminRole IS NOT NULL ORDER BY createdAt ASC");
    result.admins = admins.map(a => ({
      id: a.id, tgId: a.tgId, name: userName(a), username: a.username,
      role: a.adminRole, perms: a.adminPerms ? JSON.parse(a.adminPerms) : ADMIN_PERMS[a.adminRole] || [],
    }));
  }

  // Yuborilgan bildirishnomalar — "notifications" ruxsati
  if (myPerms.includes("notifications")) {
    const notifications = await query("SELECT * FROM Notification ORDER BY createdAt DESC");
    result.sentNotifications = notifications.map(n => ({
      id: n.id, type: n.type,
      title: { uz: n.titleUz, ru: n.titleRu, kril: n.titleKril },
      body: { uz: n.bodyUz, ru: n.bodyRu, kril: n.bodyKril },
      createdAt: n.createdAt,
    }));
  }

  // Sozlamalar — "pro" ruxsati (Pro/Discount/Limits/Referral tab)
  if (myPerms.includes("pro")) {
    const settingRows = await query("SELECT `key`, valueJson FROM Setting");
    const settings = {};
    for (const row of settingRows) {
      try { settings[row.key] = JSON.parse(row.valueJson); } catch {}
    }
    result.settings = settings;
  }

  // Dashboard statistikasi — har doim
  const [[{ cnt: totalUsers }], [{ cnt: proUsers }], [{ cnt: totalTickets }], [{ cnt: totalTopics }]] = await Promise.all([
    query("SELECT COUNT(*) as cnt FROM User"),
    query("SELECT COUNT(*) as cnt FROM User WHERE isPro=1"),
    query("SELECT COUNT(*) as cnt FROM Ticket"),
    query("SELECT COUNT(*) as cnt FROM Topic"),
  ]);
  result.dashboard = {
    totalUsers: Number(totalUsers),
    proUsers: Number(proUsers),
    totalTickets: Number(totalTickets),
    totalTopics: Number(totalTopics),
  };

  res.json(result);
});

module.exports = router;
