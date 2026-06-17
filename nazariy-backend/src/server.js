require("dotenv").config();
const express = require("express");
require("express-async-errors"); // async route handlerlardagi xatolarni avtomatik next(err)ga yo'naltiradi
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");

const { generalLimiter, authLimiter, uploadLimiter } = require("./middleware/security");

const authRoutes = require("./routes/auth");
const ticketsRoutes = require("./routes/tickets");
const topicsRoutes = require("./routes/topics");
const rulesRoutes = require("./routes/rules");
const settingsRoutes = require("./routes/settings");
const notificationsRoutes = require("./routes/notifications");
const resultsRoutes = require("./routes/results");
const proRoutes = require("./routes/pro");
const referralRoutes = require("./routes/referral");
const leaderboardRoutes = require("./routes/leaderboard");
const duelRoutes = require("./routes/duel");

const adminContentRoutes = require("./routes/admin.content");
const adminChangesRoutes = require("./routes/admin.changes");
const adminAdminsRoutes = require("./routes/admin.admins");
const adminProRoutes = require("./routes/admin.pro");
const adminReferralRoutes = require("./routes/admin.referral");
const adminNotificationsRoutes = require("./routes/admin.notifications");
const adminBundleRoutes = require("./routes/admin.bundle");
const contentRoutes = require("./routes/content");

const app = express();

// Xavfsizlik HTTP headerlari (XSS, clickjacking va boshqalardan himoya)
app.use(helmet({
  // Telegram Mini App rasm/iframe ichida ochiladi — crossOriginResourcePolicy'ni bo'shashtiramiz
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

// CORS — production'da FRONTEND_ORIGIN ni Mini App manzilingizga o'rnating (masalan https://app.nazariy.uz)
// "*" faqat development uchun, productionda aniq domen ko'rsatish tavsiya etiladi
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || "*" }));

app.use(express.json({ limit: "5mb" }));

// Umumiy rate-limit — barcha so'rovlarga
app.use(generalLimiter);

// JWT_SECRET productionda standart qiymat bilan qolib ketmasligi kerak
if (process.env.NODE_ENV === "production" && (!process.env.JWT_SECRET || process.env.JWT_SECRET === "dev_secret_change_me")) {
  console.error("❌ XATOLIK: JWT_SECRET o'rnatilmagan yoki standart qiymatda qolgan. .env faylida uzun, tasodifiy qiymat o'rnating!");
  process.exit(1);
}

// Yuklangan fayllar (chek, savol/belgi rasmlari)
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.get("/", (req, res) => res.json({ ok: true, name: "nazariy-backend", version: "0.1.0" }));

// ─── Ochiq / foydalanuvchi route'lari ───
app.use("/auth", authLimiter, authRoutes);
app.use("/tickets", ticketsRoutes);
app.use("/topics", topicsRoutes);
app.use("/rules", rulesRoutes);
app.use("/settings", settingsRoutes);
app.use("/notifications", notificationsRoutes);
app.use("/results", resultsRoutes);
app.use("/pro", uploadLimiter, proRoutes);
app.use("/referral", referralRoutes);
app.use("/leaderboard", leaderboardRoutes);
app.use("/duel", duelRoutes);
app.use("/content", contentRoutes);

// ─── Admin route'lari (barchasi /admin/... prefiksi ostida) ───
app.use("/admin/bundle", adminBundleRoutes);   // /admin/bundle — admin panel uchun bitta so'rov
app.use("/admin/upload", uploadLimiter);       // /admin/upload (adminContentRoutes ichida) — fayl yuklash limiti
app.use("/admin", adminContentRoutes);        // /admin/tickets, /admin/topics, /admin/rules/..., /admin/upload
app.use("/admin/changes", adminChangesRoutes); // /admin/changes, /admin/changes/:id/approve|reject|restore
app.use("/admin/admins", adminAdminsRoutes);   // /admin/admins
app.use("/admin", adminProRoutes);             // /admin/pro-requests
app.use("/admin", adminReferralRoutes);        // /admin/referral-grants
app.use("/admin", adminNotificationsRoutes);   // /admin/notifications

// ─── 404 ───
app.use((req, res) => res.status(404).json({ error: "Topilmadi" }));

// ─── Xatoliklarni umumiy ushlash ───
app.use((err, req, res, next) => {
  // Multer fayl validatsiyasi xatolari (fileFilter, fileSize) — 400
  if (err.name === "MulterError" || /Ruxsat etilmagan fayl turi/.test(err.message || "")) {
    return res.status(400).json({ error: err.message });
  }
  console.error(err);
  res.status(500).json({ error: "Server xatosi", details: err.message });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Nazariy backend ${PORT}-portda ishlamoqda`);
});

// ─── So'nggi himoya qatlami ───
// Agar biror joyda kutilmagan xato (masalan, DB ulanishida vaqtinchalik uzilish)
// ushlanmay qolsa, bu serverni butunlay to'xtatib qo'ymaydi — faqat log yoziladi.
process.on("unhandledRejection", (err) => {
  console.error("⚠️  Ushlanmagan promise xatosi:", err);
});
process.on("uncaughtException", (err) => {
  console.error("⚠️  Ushlanmagan xato:", err);
});
