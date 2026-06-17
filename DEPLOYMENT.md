# Nazariy Avtotest — Deploy Qo'llanmasi

Ushbu qo'llanma barcha 3 ta component (Backend, Web Frontend, Telegram Mini App) ni production'da deploy qilish uchun.

## 📋 Komponenlar

1. **Backend** — Node.js + Express + MySQL
2. **Web Frontend** — React + Vite
3. **Telegram Mini App** — React (Telegram Mini App SDK)

---

## 🚀 Deploy Variantlari

### **Variant 1: Render.com (Tavsiya — FREE)**

#### Backend Deploy

1. GitHub'ga push qiling:
```bash
cd nazariy-backend
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/nazariy-backend.git
git push -u origin main
```

2. [render.com](https://render.com) ga kiring, **New Web Service**
3. GitHub repo'ni ulang
4. **Build Command**: `npm install`
5. **Start Command**: `node src/server.js`
6. **Environment Variables** qo'shing:
   ```
   DATABASE_URL=mysql://user:password@host/dbname
   JWT_SECRET=your_long_random_secret_key
   TELEGRAM_BOT_TOKEN=your_bot_token
   SUPER_ADMIN_TG_ID=your_telegram_id
   NODE_ENV=production
   ```
7. Deploy qiling — URL olasiz: `https://your-backend.onrender.com`

#### Web Frontend Deploy

1. GitHub'ga push:
```bash
cd nazariy-web
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/nazariy-web.git
git push -u origin main
```

2. Render.com, **Static Site**
3. **Build Command**: `npm install && npm run build`
4. **Publish Directory**: `dist`
5. **Environment Variables**:
   ```
   VITE_API_URL=https://your-backend.onrender.com
   ```
6. Deploy — URL olasiz: `https://your-web.onrender.com`

---

### **Variant 2: Docker + AWS/Azure (Kuchli)**

#### Docker Setup

Backend uchun `Dockerfile` yarating:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY src/ ./src/
EXPOSE 4000
CMD ["node", "src/server.js"]
```

Web Frontend uchun:

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Docker Compose (Local testing)

`docker-compose.yml`:

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root123
      MYSQL_DATABASE: nazariy
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  backend:
    build: ./nazariy-backend
    ports:
      - "4000:4000"
    environment:
      DB_HOST: mysql
      DB_USER: root
      DB_PASSWORD: root123
      DB_NAME: nazariy
      JWT_SECRET: your_secret_key
      TELEGRAM_BOT_TOKEN: your_token
    depends_on:
      - mysql

  web:
    build: ./nazariy-web
    ports:
      - "3000:80"
    environment:
      VITE_API_URL: http://localhost:4000

volumes:
  mysql_data:
```

```bash
docker-compose up -d
```

---

### **Variant 3: Vercel (Web Frontend — fastest)**

```bash
cd nazariy-web
npm i -g vercel
vercel login
vercel
```

**Environment Variables**:
```
VITE_API_URL=https://your-backend.onrender.com
```

---

## 🗄️ Database Setup

### **Option 1: Managed MySQL (Tavsiya)**

- **Beget.uz** — 50 MB FREE MySQL
- **PlanetScale** — MySQL serverless, FREE tier
- **AWS RDS** — Paid, powerful

#### PlanetScale uchun:

1. [planetscale.com](https://planetscale.com) ga kiring
2. Create database
3. Connection string olasiz
4. `.env` ga qo'shing:
   ```
   DATABASE_URL=mysql://user:password@host/dbname
   ```

### **Option 2: Self-hosted MySQL**

Render PostgreSQL ishlatsa bo'ladi, lekin MySQL'ga o'zgartirish kerak:

Backend uchun `.env`:
```
DB_HOST=database.rendered.com
DB_PORT=3306
DB_USER=username
DB_PASSWORD=password
DB_NAME=nazariy
```

---

## 📱 Telegram Mini App Deploy

### Setup

1. `nazariy-tg-app` proyektini yarating:
```bash
mkdir nazariy-tg-app && cd nazariy-tg-app
npm init -y
npm install react react-dom vite @vitejs/plugin-react
```

2. Loyihani struktur qiling:
```
nazariy-tg-app/
├── index.html
├── vite.config.js
├── .env.example
├── src/
│   ├── main.jsx
│   ├── App.jsx (nazariy-avtotest.jsx dan nusxalang)
│   └── styles/
└── package.json
```

3. Build:
```bash
npm run build
```

### Deploy Mini App

1. Web hosting'ga upload qiling (Vercel, Netlify):
```bash
vercel
```

2. URL olasiz: `https://your-tg-app.vercel.app`

3. @BotFather'da:
```
/newapp
Qandaydir nom
https://your-tg-app.vercel.app
```

4. Frontend'da URL'ni yangilang:
```javascript
const MINI_APP_URL = "https://your-tg-app.vercel.app"
```

---

## 🔐 Security Checklist

- [ ] `.env` faylli `.gitignore` da
- [ ] `JWT_SECRET` — 32+ belgili tasodifiy satr
- [ ] `TELEGRAM_BOT_TOKEN` — token faqat .env da
- [ ] CORS — production domeni ko'rsatilgan
- [ ] Database password kuchli
- [ ] HTTPS yoqilgan
- [ ] Rate limiting aktiv
- [ ] Helmet middleware ishlamoqda

---

## 🧪 Production Test Checklist

### Backend

```bash
# Test
curl https://your-backend.onrender.com/
# Javob: {"ok":true,"name":"nazariy-backend","version":"0.1.0"}

# Test auth
curl -X POST https://your-backend.onrender.com/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Web Frontend

```bash
# Ochish
https://your-web.onrender.com
# Login qiling
# Home screen ko'rinish
# Tickets, Tests, Stats tekshiring
```

### Telegram Mini App

```bash
# BotFather'da /mybots
# Mini app URL tekshiring
# Telegram'da /start — mini app ochilsin
```

---

## 📊 Environment Variables Summary

### Backend (.env)

```env
# Server
PORT=4000
NODE_ENV=production

# Database
DB_HOST=your-host.com
DB_PORT=3306
DB_USER=username
DB_PASSWORD=password
DB_NAME=nazariy
DB_POOL_SIZE=5

# JWT
JWT_SECRET=your_very_long_random_secret_key_32plus_chars

# Telegram
TELEGRAM_BOT_TOKEN=YOUR_BOT_TOKEN_FROM_BOTFATHER
SUPER_ADMIN_TG_ID=YOUR_TELEGRAM_ID

# CORS
FRONTEND_ORIGIN=https://your-web.onrender.com
```

### Web Frontend (.env)

```env
VITE_API_URL=https://your-backend.onrender.com
```

### Telegram Mini App (.env)

```env
VITE_API_URL=https://your-backend.onrender.com
```

---

## 🔄 CI/CD Pipeline (GitHub Actions)

`.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy Backend
        run: |
          curl https://api.render.com/deploy/srv-your-service-id?key=${{ secrets.RENDER_API_KEY }}
      
      - name: Deploy Web
        run: |
          curl https://api.render.com/deploy/srv-your-web-id?key=${{ secrets.RENDER_API_KEY }}
```

---

## 📈 Monitoring

- **Sentry** — Error tracking (FREE)
- **Datadog** — Performance monitoring
- **New Relic** — APM

```javascript
// Backend uchun
import * as Sentry from "@sentry/node";
Sentry.init({ dsn: "your-dsn" });
```

---

## 🆘 Troubleshooting

| Muammo | Yechim |
|--------|--------|
| **Backend timeout** | DB connection pool size o'zgartiring |
| **CORS xatosi** | FRONTEND_ORIGIN'ni tekshiring |
| **Mini app ochilmaydi** | URL ni BotFather'da to'g'ri kiritganini tekshiring |
| **Database ulanmadi** | Connection string'ni test qiling |

---

## 📞 Support

Qanday savol bo'lsa:
- Backend: `/nazariy-backend/README.md`
- Web: `/nazariy-web/README.md`
- Telegram Mini App: Telegram Bot API docs

---

**Tayyor! Hammasini deploy qila olasiz.** 🚀
