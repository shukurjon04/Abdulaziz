# Nazariy Avtotest — Backend

`nazariy-avtotest.jsx` (Telegram Mini App) uchun REST API.

To'liq arxitektura va yo'l xaritasi: **[PLAN.md](./PLAN.md)**

## O'rnatish

```bash
npm install
cp .env.example .env
```

`.env` faylini to'ldiring:
- `TELEGRAM_BOT_TOKEN` — @BotFather'dan olingan bot tokeni (initData tekshirish uchun **majburiy**)
- `JWT_SECRET` — uzun tasodifiy satr
- `SUPER_ADMIN_TG_ID` — sizning Telegram ID'ingiz (raqam, masalan `123456789`). Buni
  https://t.me/userinfobot orqali bilib olishingiz mumkin

## Ma'lumotlar bazasi (MySQL)

`.env` faylida MySQL ulanish ma'lumotlarini to'ldiring (`DB_HOST`, `DB_USER`,
`DB_PASSWORD`, `DB_NAME`). Bazani avval hosting panelida (masalan, Beget
"MySQL Databases" bo'limida) yaratib qo'ying.

```bash
npm run migrate   # jadvallarni yaratish (src/schema.sql asosida)
npm run seed      # boshlang'ich ma'lumotlar (mavzular, biletlar, super admin, sozlamalar)
```

## Ishga tushirish

```bash
npm run dev      # avtomatik qayta yuklanish bilan (node --watch)
npm start        # oddiy
```

Server `http://localhost:4000` da ishga tushadi. Tekshirish:
```bash
curl http://localhost:4000/
# {"ok":true,"name":"nazariy-backend","version":"0.1.0"}
```

## Frontend bilan ulash

`nazariy-avtotest.jsx` faylida:

```js
const API_URL = "https://nazariy-backend.onrender.com"; // <- shu yerga deploy qilingan manzilingizni yozing
```

`useTelegram().loginToBackend()` ilova ochilganda avtomatik `/auth/telegram`ga
so'rov yuboradi va tokenni saqlaydi.

## Muhim eslatmalar

- **Fayllar** (chek, savol/belgi rasmlari) hozircha `/uploads` papkasida saqlanadi
  va `/uploads/...` orqali ochiq serve qilinadi. Production'da S3/Cloudinary'ga
  ko'chirish tavsiya etiladi (`src/utils/upload.js`)
- **PendingChange** (tasdiqlash oqimi) — `requireAdmin` middleware orqali
  super bo'lmagan adminlarning yozish amallari avtomatik `PendingChange`
  yozuviga aylanadi (`src/utils/requestOrApply.js`)
- Backend **mysql2** kutubxonasi orqali to'g'ridan-to'g'ri SQL so'rovlar
  bilan ishlaydi (ORM yo'q) — Nano/Micro kabi cheklangan resursli
  hostinglarda ham muammosiz ishlaydi

## Loyiha tuzilishi

```
src/
  server.js              — Express app, barcha route'larni ulaydi
  db.js                  — MySQL ulanish hovuzi (mysql2)
  schema.sql             — DB sxemasi (jadval yaratish buyruqlari)
  migrate.js             — schema.sql'ni bazada ishga tushiradi
  seed.js                — boshlang'ich ma'lumotlar
  middleware/auth.js     — requireAuth, requireAdmin
  utils/
    id.js                 — genId() — ID generator
    proStatus.js          — isProActive() — Pro obuna holatini tekshirish
    telegramAuth.js       — initData HMAC tekshiruvi
    jwt.js                — token yaratish/tekshirish
    referral.js           — referal kod generatori
    upload.js             — multer (fayl yuklash)
    applyChange.js        — admin o'zgarishlarini DB'ga qo'llash
    requestOrApply.js     — super/oddiy admin farqi (PendingChange)
  routes/
    auth.js               — POST /auth/telegram, GET /auth/me
    tickets.js, topics.js, rules.js, settings.js
    notifications.js, results.js, pro.js, referral.js
    admin.content.js      — /admin/tickets, /admin/topics, /admin/rules/*
    admin.changes.js       — /admin/changes/* (tasdiqlash oqimi)
    admin.admins.js         — /admin/admins (adminlar boshqaruvi)
    admin.pro.js, admin.referral.js, admin.notifications.js
```
