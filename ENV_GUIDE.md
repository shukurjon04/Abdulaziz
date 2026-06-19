# 🔐 Environment Variables Guide

Barcha sensitive data `.env` fayldan o'qiladi. Hech qachon `.env` ni Git ga commit qilmang!

---

## 📋 .env Faylinin Strukturasi

### 1. Faylni Yaratish

```bash
# .env.example dan copy qiling
cp .env.example .env

# Keyin .env ni o'z qiymatlaringiz bilan edit qiling
nano .env
```

### 2. Development uchun (.env)

```env
# Database
MYSQL_ROOT_PASSWORD=root_password_change_me
MYSQL_DATABASE=nazariy
MYSQL_USER=nazariy_user
MYSQL_PASSWORD=user_password_change_me

# Backend
NODE_ENV=development
PORT=4000
DB_HOST=mysql
DB_PORT=3306
DB_POOL_SIZE=5
JWT_SECRET=dev_secret_key_do_not_use_in_production
TELEGRAM_BOT_TOKEN=YOUR_BOT_TOKEN_HERE
SUPER_ADMIN_TG_ID=123456789

# Frontend
VITE_API_URL=http://localhost:4000

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# Let's Encrypt
CERTBOT_EMAIL=admin@nazariy.uz
DOMAIN=nazariy.uz
```

### 3. Production uchun (.env)

```env
# Database - STRONG PASSWORD!
MYSQL_ROOT_PASSWORD=SuperStrongPassword123!
MYSQL_DATABASE=nazariy
MYSQL_USER=nazariy_user
MYSQL_PASSWORD=AnotherStrongPassword456!

# Backend
NODE_ENV=production
PORT=4000
DB_HOST=mysql
DB_PORT=3306
DB_POOL_SIZE=10
JWT_SECRET=VeryLongSecretKey1234567890ABCDEFGH
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklmNOPqrstuVWXYZ
SUPER_ADMIN_TG_ID=987654321

# Frontend
VITE_API_URL=https://nazariy.uz/api

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# Let's Encrypt
CERTBOT_EMAIL=admin@nazariy.uz
DOMAIN=nazariy.uz
```

---

## 🔄 Docker Compose da .env Ishlatish

### Automatic (Recommended)
```yaml
env_file: .env
environment:
  MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
  MYSQL_DATABASE: ${MYSQL_DATABASE}
```

### Manual
```bash
# .env ni load qilish
set -a
source .env
set +a

docker compose up
```

---

## 🔒 Security Best Practices

### ✅ DO

```bash
✅ .env faylini Git ga ignore qiling (.gitignore)
✅ .env.example dan faqat example qiymatlarni qo'ying
✅ Strong passwords ishlatni (12+ characters, special chars)
✅ Production uchun unique secrets yarating
✅ .env faylga 600 permission bering
  chmod 600 .env
✅ .env faylni backup qiling (SECURE LOCATION)
```

### ❌ DON'T

```bash
❌ .env ni Git repo ga commit qilmang
❌ Sensitive data hardcode qilmang
❌ .env faylni public share qilmang
❌ Default passwords ishlatmang
❌ Token va secrets ni code da qoldirmang
❌ .env faylni version control ga qo'ymang
```

---

## 📝 Common Environment Variables

### Database
```env
MYSQL_ROOT_PASSWORD=        # Root password
MYSQL_DATABASE=nazariy      # Database name
MYSQL_USER=nazariy_user     # Non-root user
MYSQL_PASSWORD=             # User password
```

### Backend
```env
NODE_ENV=development        # development|production
PORT=4000                   # Server port
DB_HOST=mysql               # Database hostname
DB_PORT=3306                # Database port
DB_POOL_SIZE=5              # Connection pool
JWT_SECRET=                 # JWT signing key (min 32 chars)
TELEGRAM_BOT_TOKEN=         # Telegram bot API token
SUPER_ADMIN_TG_ID=          # Admin Telegram ID
FRONTEND_ORIGIN=            # CORS origin
```

### Frontend
```env
VITE_API_URL=               # Backend API URL
```

### Email (Optional)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=              # App password (not regular password)
```

### Let's Encrypt
```env
CERTBOT_EMAIL=admin@nazariy.uz
DOMAIN=nazariy.uz           # Your domain name
```

---

## 🚀 Telegram Bot Token Qanday Olish

1. **BotFather ga yozing** (@BotFather in Telegram)
2. `/newbot` command bilan new bot yarating
3. Bot nomi va username bering
4. **Token** ni copy qiling
5. `.env` fayliga qo'ying:
   ```env
   TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklmNOPqrstuVWXYZ
   ```

---

## 🔐 JWT Secret Yaratish

```bash
# Linux/Mac
openssl rand -base64 32

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Python
python3 -c "import secrets; print(secrets.token_hex(32))"
```

**Output misoliy:**
```
abc123def456ghi789jkl012mno345pqr678stu901vwx
```

---

## 📊 Environment Variable Priority

```
1. Docker environment (-e flag)
2. docker-compose env_file
3. .env file
4. System environment
5. Default values
```

---

## ✅ Check List

- [ ] `.env.example` create qilindi
- [ ] `.env` faylini `.gitignore` ga qo'shing
- [ ] `.env` faylni local machine ga create qildi
- [ ] Barcha required variables filled in
- [ ] Strong passwords set qilindi
- [ ] Telegram bot token configured
- [ ] JWT secret generated
- [ ] SMTP credentials added (agar kerak)
- [ ] Development uchun test qilindi
- [ ] Production uchun values updated

---

## 🐛 Troubleshooting

### Variables not loading?
```bash
# Check .env file
cat .env

# Check docker-compose syntax
docker compose config

# Rebuild containers
docker compose down
docker compose up -d --build
```

### Permission denied .env?
```bash
chmod 600 .env
```

### Variable not recognized?
```bash
# Make sure env_file: .env is in docker-compose.yml
# Make sure variable format is: ${VARIABLE_NAME}
```

---

**Xavfsizlikni ahamiyat bering! 🔐**
