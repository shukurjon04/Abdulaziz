# Nazariy Avtotest — Backend rejasi

Bu hujjat frontend (`nazariy-avtotest.jsx`) bilan ishlaydigan backend uchun umumiy
arxitektura va yo'l xaritasini tasvirlaydi.

## 1. Texnologiyalar

- **Node.js + Express** — REST API server
- **Prisma ORM + PostgreSQL** (dev uchun SQLite ham bo'ladi, `DATABASE_URL` orqali almashtiriladi)
- **JWT** — sessiya tokenlari (`/auth/telegram` orqali olinadi)
- **Telegram initData tekshiruvi** — HMAC-SHA256 (bot tokeni bilan)
- **Multer** — fayl yuklash (chek, savol rasmlari, belgi rasmlari) — keyinroq S3/Cloudinary'ga ko'chiriladi

## 2. Ma'lumotlar bazasi modeli (qisqacha)

| Model | Tavsif |
|---|---|
| `User` | Telegram foydalanuvchisi: tgId, ism, username, Pro holati, referal kodi, `adminRole`/`adminPerms` |
| `Ticket` | Bilet raqami, `isPro` |
| `Question` | Savol matni (uz/ru/kril), variantlar, to'g'ri javob, rasm, `ticketId`, `topicId` |
| `Topic` | Mavzu nomi (uz/ru/kril), rang, ikonka |
| `RuleCategory` / `RuleItem` | Yo'l qoidalari toifalari va belgilari |
| `PendingChange` | Tasdiqlash kutayotgan admin o'zgarishlari (type, payload JSON, status) |
| `ProRequest` | Pro to'lov so'rovlari (chek fayli, status) |
| `ReferralGrant` | Referal orqali Pro so'rovlari |
| `Notification` / `UserNotification` | Bildirishnomalar va o'qilganlik holati |
| `TestResult` | Har bir test/imtihon natijasi (statistika uchun) |
| `Setting` | DISCOUNT, LIMITS, REFERRAL_CONFIG kabi key-value sozlamalar |

To'liq sxema: `prisma/schema.prisma`

## 3. Autentifikatsiya oqimi

1. Frontend Telegram Mini App ochilganda `tg.initData` ni `POST /auth/telegram` ga yuboradi
2. Backend `initData` HMAC imzosini bot tokeni bilan tekshiradi (`utils/telegramAuth.js`)
3. Foydalanuvchi DB'da topiladi yoki yaratiladi (referal kodi bilan)
4. JWT token qaytariladi — frontend buni keyingi so'rovlarda `Authorization: Bearer <token>` sifatida yuboradi
5. Admin huquqlari `User.adminRole` / `User.adminPerms` orqali tekshiriladi (`middleware/adminAuth.js`)

## 4. API endpointlari (frontend bilan moslashtirilgan)

### Ochiq / Foydalanuvchi
- `POST /auth/telegram` — login, token olish ✅ (ishlaydi)
- `GET /tickets` — biletlar ro'yxati (isPro holati, savol soni)
- `GET /tickets/:id` — bilet savollari (Pro bo'lmasa, Pro biletlar 403)
- `GET /topics` — mavzular + har biriga tegishli savollar soni
- `GET /rules` — yo'l qoidalari toifalari va belgilari
- `GET /settings` — `LIMITS`, `DISCOUNT`, `REFERRAL_CONFIG.milestones`
- `GET /notifications` — foydalanuvchi bildirishnomalari
- `POST /notifications/:id/read` — o'qilgan deb belgilash
- `POST /results` — test/imtihon natijasini yuborish
- `GET /stats` — umumiy statistika + mavzular bo'yicha xatolar
- `POST /pro/requests` (multipart, chek fayli bilan) — Pro so'rov yuborish
- `POST /referral/claim` — referal mukofotini so'rash

### Admin (JWT + adminRole/perm tekshiruvi)
- `POST /admin/tickets` — bilet qo'shish (yoki PendingChange)
- `PATCH /admin/tickets/:id` — isPro o'zgartirish
- `PATCH /admin/tickets/:id/questions` — savollarni tahrirlash
- `DELETE /admin/tickets/:id`
- `POST /admin/topics`, `DELETE /admin/topics/:id`
- `POST /admin/rules/categories`, `POST /admin/rules/categories/:id/items`, `DELETE /admin/rules/items/:id`
- `GET /admin/changes` — kutilayotgan/tarix o'zgarishlar
- `POST /admin/changes/:id/approve` / `/reject` / `/restore`
- `GET/PATCH /admin/changes/:id` — tahrirlash
- `GET /admin/admins`, `POST /admin/admins`, `PATCH /admin/admins/:id`, `DELETE /admin/admins/:id`
- `GET /admin/pro-requests`, `POST /admin/pro-requests/:id/approve` / `/reject`
- `GET /admin/referral-grants`, `POST /admin/referral-grants/:id/approve`
- `PATCH /admin/settings` — DISCOUNT/LIMITS/REFERRAL_CONFIG
- `POST /admin/notifications` — bildirishnoma yuborish (barchaga yoki bittaga)

> **Eslatma:** `PendingChange` mexanizmi — super admin bo'lmagan adminning
> `POST/PATCH/DELETE` so'rovlari to'g'ridan-to'g'ri bajarilmaydi, balki
> `PendingChange` yozuvi yaratiladi. Super admin tasdiqlaganda controller
> shu amalni haqiqatda bajaradi (frontenddagi `applyChange` mantiqi backendga ko'chadi).

## 5. Fayllarni saqlash

Boshlang'ich bosqichda `multer` bilan `/uploads` papkasiga (statik serve qilinadi).
Keyinroq: AWS S3 / Cloudinary — ayniqsa chek va savol rasmlari ko'payganda.

## 6. Bosqichlar (roadmap)

1. ✅ **Skeleton** — server, Prisma sxema, auth, asosiy route fayllari (shu commit)
2. **Auth + User** — to'liq `/auth/telegram`, foydalanuvchi profilini frontendga ulash
3. **Content API** — tickets/topics/rules ni real DB'dan o'qish (frontenddagi statik massivlar o'rniga)
4. **Admin CRUD + PendingChange** — admin panelni backendga ulash
5. **Pro + Referral** — chek yuklash, tasdiqlash, Pro faollashtirish
6. **Statistika** — `TestResult` asosida real raqamlar
7. **Bildirishnomalar** — broadcast + Telegram bot push (ixtiyoriy)
8. **Deploy** — Render/Railway + PostgreSQL, frontenddagi `API_URL` ni yangilash

## 7. Frontendni ulash

Hozircha frontend hamma narsani modul darajasidagi massivlar (`tickets`, `TOPICS_DATA`,
`SIGNS_CATEGORIES`, ...) va `localStorage` orqali boshqaradi. Backend tayyor bo'lgach:

- App ochilishida `GET /tickets`, `/topics`, `/rules`, `/settings` chaqiriladi va
  natijalar shu massivlarga yuklanadi (hozirgi `loadPersistedAdminData()` o'rnini bosadi)
- Admin paneldagi har bir mutatsiya (`requestOrApply`) endi mos API chaqiruviga
  almashtiriladi
- `savePersistedAdminData()` kerak bo'lmay qoladi — DB manba bo'ladi
