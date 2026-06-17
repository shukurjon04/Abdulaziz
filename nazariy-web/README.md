# Nazariy Avtotest — Web Frontend

Telegram Mini App'ining o'rniga ishlaidigan professional web-sayt frontend.

## O'rnatish

```bash
npm install
```

## Development

```bash
npm run dev
```

Server `http://localhost:5173` da ishga tushadi.

## Build

```bash
npm run build
```

Production uchun optimized versiya `dist/` papkada yaratiladi.

## Sozlash

`.env` faylini yarating yoki `.env.example` dan nusxalang:

```bash
cp .env.example .env
```

`.env` faylida API URL'ni backend manzili bilan to'ldiring:

```env
VITE_API_URL=http://localhost:4000
```

Production'da:

```env
VITE_API_URL=https://your-api.com
```

## Xususiyatlari

- 🎨 **Modern Dizayn** — Professional va responsive
- 🌙 **Dark Mode** — Qo'ng'iroqli va oq rejim
- 🌍 **Multi-language** — O'zbekcha, Ruscha, Inglizcha
- 📱 **Responsive** — Desktop, tablet, mobile
- 🔐 **Xavfsiz** — JWT token bilan autentifikatsiya
- ⚡ **Tez** — Vite bilan optimized

## Screens

- **Home** — Bosh sahifa va statistika
- **Tickets** — 100 ta bilet
- **Tests** — Cheksiz testlar
- **Exam** — Rasmiy imtihon
- **Stats** — Natijalar statistikasi
- **Admin** — Admin panel (agar admin bo'lsa)
- **Profile** — Foydalanuvchi profili

## Login

Hozircha demo login:
- Email: any@email.com
- Parol: any password
- Yoki "Mehmon sifatida kirish" tugmasi

## Backend bilan bog'lash

Backend API'ning quyidagi endpoints'larini ishlatadi:

- `POST /auth/telegram` — Telegram orqali login
- `GET /auth/me` — Joriy foydalanuvchi
- `GET /tickets` — Biletlar ro'yxati
- `GET /tickets/:id` — Bilet savolari
- `POST /results` — Natija yuborish
- Va boshqalar...

## Struktura

```
src/
  App.jsx                 — Main component
  api.js                  — Axios client
  main.jsx                — Entry point
  components/
    Navbar.jsx            — Navigation
    Toast.jsx             — Notifications
  screens/
    HomeScreen.jsx
    TicketsScreen.jsx
    LoginScreen.jsx
    ... va boshqalar
  styles/
    global.css            — Global styles
    app.css               — App styles
```

## Deploy

### Render.com

```bash
npm run build
```

Qo'shimcha fayllar:

`render.yaml`:
```yaml
services:
  - type: web
    name: nazariy-web
    plan: free
    buildCommand: npm install && npm run build
    startCommand: npm run preview
    staticPublishPath: dist
```

### Vercel

```bash
vercel
```

## License

MIT
