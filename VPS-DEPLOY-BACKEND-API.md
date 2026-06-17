# 🚀 VPS'da Backend API Deploy (Ubuntu)

**Status**: Backend production deploy  
**Platform**: Ubuntu 20.04/22.04  
**Framework**: Node.js + Express  
**Port**: 4000 (internal), SSL via Nginx reverse proxy  
**Process Manager**: PM2  

---

## 📋 VPS'da Backend Setup (Step-by-Step)

### 1️⃣ Backend uchun directory yaratish

```bash
# SSH orqali kirish
ssh root@YOUR_VPS_IP

# Backend directory
sudo mkdir -p /var/www/nazariy-backend
cd /var/www/nazariy-backend

# GitHub'dan clone qilish
sudo git clone YOUR_GITHUB_REPO .

# Ownership o'zgartirish
sudo chown -R webapp:webapp /var/www/nazariy-backend
sudo chmod -R 755 /var/www/nazariy-backend
```

### 2️⃣ Backend dependencies o'rnatish

```bash
cd /var/www/nazariy-backend

# NPM packages
npm install

# Production dependencies only
npm install --production

# Node versiyasini tekshirish
node --version  # v18+ bo'lishi kerak
```

### 3️⃣ MySQL database o'rnatish

```bash
# MySQL server o'rnatish
sudo apt install -y mysql-server

# MySQL service start qilish
sudo systemctl start mysql
sudo systemctl enable mysql

# MySQL root password o'rnatish (opsional)
sudo mysql_secure_installation

# Database yaratish
sudo mysql -u root -p -e "CREATE DATABASE nazariy CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Database user yaratish (production uchun)
sudo mysql -u root -p << EOF
CREATE USER 'nazariy_user'@'localhost' IDENTIFIED BY 'strong_password_here';
GRANT ALL PRIVILEGES ON nazariy.* TO 'nazariy_user'@'localhost';
FLUSH PRIVILEGES;
EOF
```

### 4️⃣ Backend .env fayl yaratish

```bash
cd /var/www/nazariy-backend

# .env fayl yaratish
sudo nano .env
```

Quyidagilarni yozing:

```env
# Server
NODE_ENV=production
PORT=4000
HOST=127.0.0.1

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=nazariy_user
DB_PASSWORD=strong_password_here
DB_NAME=nazariy

# Security
JWT_SECRET=$(openssl rand -hex 32)
JWT_EXPIRES_IN=7d

# Telegram
TELEGRAM_BOT_TOKEN=your_bot_token_from_botfather
SUPER_ADMIN_TG_ID=your_telegram_user_id

# Frontend origin (CORS)
FRONTEND_ORIGIN=https://example.com

# File upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=/var/www/nazariy-backend/uploads

# Logging
LOG_LEVEL=info
LOG_FILE=/var/log/nazariy-backend.log

# Optional: Sentry/error tracking
# SENTRY_DSN=https://key@sentry.io/project
```

**Save**: Ctrl+X → Y → Enter

### 5️⃣ Database schema migrate qilish

```bash
cd /var/www/nazariy-backend

# Schema yaratish
mysql -u nazariy_user -p nazariy < src/schema.sql

# Password enter qilish (yuqorida yaratgan password)

# Sample data seed qilish (opsional)
node src/seed.js
```

**Tekshirish**:
```bash
mysql -u nazariy_user -p nazariy -e "SHOW TABLES;"
# Expected: 10+ tables (users, tickets, topics, etc.)
```

### 6️⃣ PM2 o'rnatish (process manager)

PM2 - Node.js process'ni restart qiladi, logs boshqaradi, crash bo'lsa auto-restart qiladi.

```bash
# PM2 global o'rnatish
sudo npm install -g pm2

# PM2 CLI completion (opsional)
pm2 completion install

# Backend start qilish
cd /var/www/nazariy-backend
pm2 start src/server.js --name "nazariy-api" --instances max

# Logs ko'rish
pm2 logs nazariy-api

# Status tekshirish
pm2 status
```

### 7️⃣ PM2 auto-start on reboot

```bash
# PM2'ni systemd'ga integrate qilish
sudo pm2 startup systemd -u www-data --hp /var/www

# PM2 apps'ni save qilish
pm2 save

# Tekshirish (reboot'da auto-start bo'ladi)
sudo systemctl status pm2-www-data
```

---

## 8️⃣ Nginx Reverse Proxy (API)

```bash
# Nginx config yaratish
sudo nano /etc/nginx/sites-available/nazariy-api
```

Quyidagini copy-paste qiling:

```nginx
# HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name api.example.com;

    # Let's Encrypt verification
    location /.well-known/acme-challenge/ {
        root /var/www/letsencrypt;
    }

    # Barcha so'rovlarni HTTPS'ga
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS API server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name api.example.com;

    # SSL sertifikatlari
    ssl_certificate /etc/letsencrypt/live/api.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.example.com/privkey.pem;

    # SSL settings (yuqorida kabi)
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    add_header Strict-Transport-Security "max-age=31536000" always;

    # API logs
    access_log /var/log/nginx/nazariy-api.access.log;
    error_log /var/log/nginx/nazariy-api.error.log;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=30r/m;
    limit_req zone=api_limit burst=100 nodelay;

    # Backend proxy
    location / {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;

        # Headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;

        # Upgrades (WebSocket uchun, agar kerak bo'lsa)
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # File upload limit (10MB)
    client_max_body_size 10M;

    # gzip compression
    gzip on;
    gzip_types application/json text/plain;
}
```

**Save**: Ctrl+X → Y → Enter

### 9️⃣ Nginx config enable qilish

```bash
# Test
sudo nginx -t

# Enable
sudo ln -s /etc/nginx/sites-available/nazariy-api /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

---

## 🔟 API uchun Let's Encrypt SSL

```bash
# API subdomain uchun sertifikat
sudo certbot certonly --webroot \
  -w /var/www/letsencrypt \
  -d api.example.com \
  --agree-tos \
  -m your-email@example.com

# Certbot auto-update Nginx config
```

---

## 1️⃣1️⃣ Upload folder permissions

```bash
# Uploads directory yaratish
mkdir -p /var/www/nazariy-backend/uploads

# Permissions set qilish
sudo chown -R www-data:www-data /var/www/nazariy-backend/uploads
sudo chmod 755 /var/www/nazariy-backend/uploads
```

---

## 1️⃣2️⃣ Firewall sozlash (UFW)

```bash
# UFW enable qilish (opsional)
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable

# Status tekshirish
sudo ufw status
```

---

## 1️⃣3️⃣ Health check va monitoring

```bash
# Backend API health
curl -I https://api.example.com/

# Expected:
# HTTP/2 200
# {"ok":true,"name":"nazariy-backend",...}

# Database connectivity test
pm2 logs nazariy-api | grep -i "database"
# Expected: "Connected to MySQL"
```

---

## 1️⃣4️⃣ Logs va Troubleshooting

```bash
# PM2 logs
pm2 logs nazariy-api

# Nginx access logs
sudo tail -f /var/log/nginx/nazariy-api.access.log

# Nginx errors
sudo tail -f /var/log/nginx/nazariy-api.error.log

# System errors
sudo journalctl -u nginx -f
```

### Common Issues

| Problem | Solution |
|---------|----------|
| 502 Bad Gateway | Backend down? `pm2 status` |
| Connection refused | Backend port, firewall, CORS |
| Database error | Check .env credentials, MySQL running? |
| Port 4000 in use | `lsof -i :4000` → `kill -9 <PID>` |
| 403 Forbidden | File permissions, nginx ownership |

---

## 1️⃣5️⃣ Auto-restart qilish (crash'da)

PM2 already auto-restart qiladi, lekin qo'shimcha:

```bash
# Process watch qilish
pm2 watch

# Auto-restart on error
pm2 start src/server.js --cron-restart="0 0 * * *"  # Daily 00:00
```

---

## 1️⃣6️⃣ Backup va restore

```bash
# Database backup (daily)
sudo mysqldump -u nazariy_user -p nazariy > /var/backups/nazariy-$(date +%Y%m%d).sql

# Cron job (automatic daily backup)
(crontab -l 2>/dev/null; echo "0 2 * * * mysqldump -u nazariy_user -p'strong_password' nazariy > /var/backups/nazariy-\$(date +\%Y\%m\%d).sql") | crontab -

# Restore (agar kerak bo'lsa)
mysql -u nazariy_user -p nazariy < /var/backups/nazariy-20260616.sql
```

---

## 1️⃣7️⃣ SSL Auto-renewal check

```bash
# Certificate status
sudo openssl x509 -in /etc/letsencrypt/live/api.example.com/cert.pem -noout -dates

# Renewal test
sudo certbot renew --dry-run

# Logs
sudo tail -f /var/log/letsencrypt/letsencrypt.log
```

---

## 📋 Final Checklist

- [ ] Backend kodi yuklandi
- [ ] Node.js + npm installed
- [ ] MySQL installed va database yaratilgan
- [ ] Schema migrated
- [ ] .env fayl sozlandi
- [ ] PM2 start successful
- [ ] PM2 auto-start configured
- [ ] Nginx reverse proxy setup
- [ ] SSL sertifikat olingan
- [ ] `curl https://api.example.com/` ishlaydi
- [ ] Logs ko'rinadi
- [ ] Auto-backup qo'shilgan

---

## 🎯 Deployment Complete!

```bash
# Final test
curl -s https://api.example.com/ | jq .

# Expected:
# {
#   "ok": true,
#   "name": "nazariy-backend",
#   "version": "0.1.0",
#   "timestamp": "2026-06-16T..."
# }
```

✅ Backend API deploy complete with SSL!

**Next**: Test end-to-end (Frontend ↔ Backend)
```bash
curl -H "Authorization: Bearer token" https://api.example.com/tickets
```
