# Nazariy Avtotest — To'liq Loyiha

Professional yo'l qoidalari va savol-javoblar sinov tizimi.

- 🎯 **Backend** — Node.js + Express + MySQL
- 🌐 **Web Frontend** — React + Vite (Modern Design)
- 📱 **Telegram Mini App** — React (Telegram Mini App SDK)

## 📁 Loyiha Struktura

```
nazariy-avtotest/
├── nazariy-backend/          # REST API server
│   ├── src/
│   │   ├── server.js         # Express app
│   │   ├── db.js             # MySQL pool
│   │   ├── schema.sql        # Database schema
│   │   ├── migrate.js        # Migration script
│   │   ├── seed.js           # Sample data
│   │   ├── middleware/       # Auth, security
│   │   ├── routes/           # API endpoints
│   │   └── utils/            # Helpers
│   ├── package.json
│   ├── .env.example
│   ├── Dockerfile
│   └── render.yaml
│
├── nazariy-web/              # Web Frontend (React + Vite)
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── api.js            # Axios client
│   │   ├── screens/          # Pages
│   │   ├── components/       # UI components
│   │   └── styles/           # CSS
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── Dockerfile
│   └── .env.example
│
├── nazariy-avtotest.jsx      # Telegram Mini App (Single file)
│
├── docker-compose.yml        # Local development
├── DEPLOYMENT.md             # Deploy guide
├── PRODUCTION-CHECKLIST.md   # Before launch
└── README.md                 # This file
```

## 🚀 Quick Start

### Development

**Backend**:
```bash
cd nazariy-backend
cp .env.example .env
npm install
npm run migrate  # Setup database
npm run seed     # Add sample data
npm run dev      # http://localhost:4000
```

**Web Frontend**:
```bash
cd nazariy-web
npm install
npm run dev      # http://localhost:5173
```

**With Docker**:
```bash
docker-compose up
# Backend: http://localhost:4000
# Web: http://localhost:3000
# MySQL: localhost:3306
```

### Testing

Login credentials (development):
- **Email**: any@email.com
- **Password**: any
- **Or**: "Mehmon sifatida kirish" (Guest)

## 📋 Features

| Feature | Status |
|---------|--------|
| 📝 100 ta bilet + 20 savol | ✅ Ready |
| ✍️ Cheksiz testlar | ✅ Ready |
| 📋 Rasmiy imtihon | ✅ Ready |
| 📊 Statistika | ✅ Ready |
| 👥 Admin panel | ✅ Ready |
| 💳 Pro obuna | ✅ Ready |
| 🎁 Referal tizim | ✅ Ready |
| 🔔 Bildirishnomalar | ✅ Ready |
| 🌐 Multi-language (Uz/Ru/En) | ✅ Ready |
| 🌙 Dark mode | ✅ Ready |
| 📱 Responsive design | ✅ Ready |
| 🤖 Telegram Mini App | ✅ Ready |

## 🔐 Security

- ✅ JWT authentication
- ✅ Telegram Mini App verification (HMAC-SHA256)
- ✅ Rate limiting (auth, upload, general)
- ✅ SQL injection protection (parameterized queries)
- ✅ CORS configured
- ✅ Helmet security headers
- ✅ File upload validation

## 📦 Deploy

### Option 1: Render.com (Recommended — FREE)

**Backend**:
1. Push to GitHub
2. Create new Web Service on Render
3. Connect GitHub repo
4. Set environment variables
5. Deploy!

**Web Frontend**:
1. Create Static Site on Render
2. Build: `npm install && npm run build`
3. Publish: `dist`
4. Deploy!

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

### Option 2: Docker

```bash
docker-compose up -d
```

### Option 3: Vercel (Web only)

```bash
cd nazariy-web
vercel
```

## 🔑 Environment Variables

### Backend

```env
NODE_ENV=production
PORT=4000
JWT_SECRET=your_long_random_secret_32_plus_chars
TELEGRAM_BOT_TOKEN=your_bot_token
SUPER_ADMIN_TG_ID=your_telegram_id
DB_HOST=your-database.com
DB_PORT=3306
DB_USER=user
DB_PASSWORD=password
DB_NAME=nazariy
FRONTEND_ORIGIN=https://your-domain.com
```

### Web Frontend

```env
VITE_API_URL=https://your-backend.com
```

## 📚 API Documentation

Base URL: `https://your-backend.com`

### Authentication

```bash
POST /auth/telegram
Body: { initData: string, referredBy?: string }
Response: { token: string, user: object, settings: object }

GET /auth/me
Headers: Authorization: Bearer <token>
Response: { user object }
```

### Tickets

```bash
GET /tickets
Response: [{ id, number, isPro, questionCount }, ...]

GET /tickets/:id
Response: { id, number, isPro, questions: [...] }
```

### Tests

```bash
POST /results
Body: { ticketId, answers: { questionId: optionIndex }, time: ms }
Response: { correct, total, accuracy, passed }

GET /stats
Response: { totalQuestions, correctAnswers, accuracy, ... }
```

### Admin

```bash
GET /admin/bundle
Response: { tickets, topics, rules, settings, ... }

POST /admin/tickets
Body: { isPro, questionCount }
Response: { result }

PATCH /admin/tickets/:id/questions
Body: { questions: [...] }
Response: { result }
```

Full API docs in `nazariy-backend/README.md`

## 🗄️ Database

Schema: `nazariy-backend/src/schema.sql`

**Tables**:
- User (Telegram users, admin roles)
- Ticket (100 biletlar)
- Question (Savollar)
- Topic (Mavzular)
- RuleCategory, RuleItem (Yo'l qoidalari)
- TestResult (Natijalar)
- PendingChange (Admin tasdiqlash)
- ProRequest, ReferralGrant (Obuna)
- Notification, Setting

## 📱 Telegram Mini App

To use as Telegram Mini App:

1. Build with Vite
2. Deploy to web hosting (Vercel, Netlify)
3. Register with @BotFather using `/newapp`
4. Set Mini App URL to your hosted URL

Users open via `/start` command or button in Telegram.

## 🧪 Testing

### Backend

```bash
# Health check
curl https://your-backend.com/

# Auth test
curl -X POST https://your-backend.com/auth/telegram \
  -H "Content-Type: application/json" \
  -d '{"initData":"..."}'

# Get data
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://your-backend.com/tickets
```

### Web Frontend

- Open https://your-domain.com
- Login (email/password or guest)
- Test all screens
- Try dark mode
- Test mobile responsive

### Telegram Mini App

- Open Telegram
- Search @YourBotName
- Press /start
- Mini app opens

## 🚨 Production Checklist

Before launching to production:

- [ ] Database configured and migrated
- [ ] `.env` variables set (don't commit!)
- [ ] JWT_SECRET is strong (32+ chars)
- [ ] TELEGRAM_BOT_TOKEN set
- [ ] SUPER_ADMIN_TG_ID set
- [ ] CORS FRONTEND_ORIGIN configured
- [ ] HTTPS enabled
- [ ] Rate limiting active
- [ ] Backups configured
- [ ] Monitoring set up (Sentry, etc.)
- [ ] All 3 components deployed
- [ ] Test login works
- [ ] Test API endpoints
- [ ] Test Telegram Mini App

See [PRODUCTION-CHECKLIST.md](PRODUCTION-CHECKLIST.md) for detailed checklist.

## 📞 Support

### Backend Issues
- Check logs: `npm run dev`
- Check database: MySQL connection
- See `nazariy-backend/README.md`

### Web Frontend Issues
- Check browser console
- Check network tab (API calls)
- See `nazariy-web/README.md`

### Telegram Mini App
- Check Telegram app settings
- Verify Mini App URL is correct
- Check browser console (F12)

## 📈 Monitoring & Analytics

Recommended services:
- **Errors**: Sentry
- **Performance**: Datadog, New Relic
- **Uptime**: Uptimerobot, Pingdom
- **Logs**: LogRocket, CloudWatch

## 🔄 Updates & Maintenance

### Code Updates

```bash
# Backend
cd nazariy-backend
git pull
npm install
npm run migrate
npm run seed
# Restart service

# Web
cd nazariy-web
git pull
npm install
npm run build
# Redeploy
```

### Database Backups

Set up automated backups via your hosting provider (Render, AWS, etc.)

### Security Updates

```bash
npm audit fix
npm audit fix --force  # Only if needed
```

## 📄 License

MIT — Free for personal and commercial use.

## 🙋 Questions?

- Read component READMEs
- Check DEPLOYMENT.md for deploy help
- Check PRODUCTION-CHECKLIST.md before launch

---

**Built with ❤️ for Uzbekistan**

Created: 2026-06-16
