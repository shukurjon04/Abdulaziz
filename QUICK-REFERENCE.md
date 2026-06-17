# ⚡ Quick Reference — Tezkor Qo'llanma

## 🚀 Tezkor Boshlash

```bash
# 1. Hammani setup qiling
./setup.sh

# 2. Environment variables'ni to'ldiring
nano nazariy-backend/.env
nano nazariy-web/.env

# 3. Backend boshlang
cd nazariy-backend
npm run dev

# 4. Web Frontend boshlang (yangi terminal)
cd nazariy-web
npm run dev

# 5. Brauzerda oching
http://localhost:5173
```

## 📁 Fayl Lokatsiyalari

| Fayl | Maqsad |
|------|--------|
| `nazariy-backend/.env` | Backend config |
| `nazariy-web/.env` | Web config |
| `nazariy-backend/src/server.js` | Express server |
| `nazariy-backend/src/schema.sql` | Database schema |
| `nazariy-web/src/App.jsx` | Web app |
| `nazariy-avtotest.jsx` | Telegram Mini App |

## 🎯 Common Commands

### Backend

```bash
cd nazariy-backend

npm run dev         # Development server
npm run build       # Build (if needed)
npm run migrate     # Database migration
npm run seed        # Add sample data
npm install         # Install dependencies
npm audit fix       # Fix vulnerabilities
```

### Web Frontend

```bash
cd nazariy-web

npm run dev         # Development server
npm run build       # Production build
npm install         # Install dependencies
npm audit fix       # Fix vulnerabilities
```

### Docker

```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f backend

# Rebuild images
docker-compose build --no-cache
```

## 🔑 Default Credentials (Development)

**Web Frontend**:
- Email: `any@email.com`
- Password: `any`
- Or: Click "Mehmon sifatida kirish"

**Database** (Docker):
- Host: `localhost:3306`
- User: `nazariy_user`
- Password: `user_password_change_me`
- Database: `nazariy`

## 🌐 URLs

| Service | URL |
|---------|-----|
| Backend | http://localhost:4000 |
| Web | http://localhost:5173 |
| Database | localhost:3306 |

## 🐛 Debugging

### Backend Logs

```bash
cd nazariy-backend
npm run dev
# Look for: ✅ Nazariy backend 4000-portda ishlamoqda
```

### Web Console

```
Browser → F12 → Console
```

### Database Connection

```bash
# Test connection
mysql -h localhost -u nazariy_user -p nazariy
# Password: user_password_change_me

# If using Docker:
docker exec -it nazariy_mysql mysql -u nazariy_user -p nazariy
```

## 📊 Health Checks

```bash
# Backend health
curl http://localhost:4000/
# Expected: {"ok":true,"name":"nazariy-backend","version":"0.1.0"}

# Web Frontend
curl http://localhost:5173/
# Expected: HTML content
```

## 🚀 Deployment

### Render.com

```bash
# 1. Push to GitHub
git push origin main

# 2. On Render.com, connect GitHub repo
# 3. Set environment variables
# 4. Deploy automatically
```

### Docker

```bash
# Build image
docker build -t nazariy-backend nazariy-backend/

# Run container
docker run -p 4000:4000 --env-file .env nazariy-backend
```

### Vercel (Web Frontend)

```bash
cd nazariy-web
vercel
```

## 🔧 Troubleshooting

### Port Already in Use

```bash
# Find process using port 4000
lsof -i :4000

# Kill process
kill -9 <PID>

# Or use different port
PORT=5000 npm run dev
```

### Database Connection Failed

```bash
# Check MySQL is running
docker exec -it nazariy_mysql mysql -u root -proot_password_change_me -e "SELECT 1;"

# Check .env variables
cat nazariy-backend/.env | grep DB_
```

### Build Fails

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

### CORS Errors

```javascript
// Check FRONTEND_ORIGIN in backend .env
FRONTEND_ORIGIN=http://localhost:5173  // Development
FRONTEND_ORIGIN=https://your-domain.com // Production
```

## 📚 Important Files

```
README.md                    # Main documentation
DEPLOYMENT.md               # Deploy guide
PRODUCTION-CHECKLIST.md     # Before launch
QUICK-REFERENCE.md          # This file (быстрый старт)
setup.sh                    # Setup script
docker-compose.yml          # Docker setup
.env.example                # Environment template
```

## 🔐 Security

- ✅ Never commit `.env` files
- ✅ Keep JWT_SECRET secret
- ✅ Verify TELEGRAM_BOT_TOKEN
- ✅ Set strong database passwords
- ✅ Use HTTPS in production

## 📞 Emergency

### Backend Down
```bash
# Restart
cd nazariy-backend
npm run dev

# Or with Docker
docker-compose restart backend
```

### Database Down
```bash
# Check status
docker ps | grep mysql

# Restart
docker-compose restart mysql
```

### Web Not Loading
```bash
# Clear cache
npm run build

# Check API connection
curl http://localhost:4000/
```

## 🎯 Development Workflow

```bash
# 1. Create feature branch
git checkout -b feature/my-feature

# 2. Make changes
# Edit files...

# 3. Test locally
npm run dev

# 4. Commit changes
git add .
git commit -m "Add: my feature"

# 5. Push to GitHub
git push origin feature/my-feature

# 6. Create Pull Request
# On GitHub.com, create PR

# 7. Deploy
git push origin main
# Automatic deployment via CI/CD
```

## 📊 Database Backup

```bash
# Backup
docker exec nazariy_mysql mysqldump -u root -proot_password_change_me nazariy > backup.sql

# Restore
docker exec -i nazariy_mysql mysql -u root -proot_password_change_me nazariy < backup.sql
```

## 🎓 Learning Resources

- Node.js: https://nodejs.org/docs
- React: https://react.dev
- Express: https://expressjs.com
- MySQL: https://dev.mysql.com
- Docker: https://docs.docker.com
- Vite: https://vitejs.dev

---

**💡 Pro Tips:**
- Use `npm run dev` for active development with hot reload
- Use Docker Compose for full stack testing
- Always test API endpoints with curl before integration
- Keep .env examples up to date
- Document any breaking changes

**Updated:** 2026-06-16
