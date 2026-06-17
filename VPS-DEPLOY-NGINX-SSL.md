# 🚀 VPS'da Frontend Deploy + Auto SSL Setup (Ubuntu)

**Status**: Implement qiladigan yo'riqnoma  
**Platform**: Ubuntu 20.04/22.04  
**Domen**: example.com  
**SSL**: Let's Encrypt (FREE, avtomatik renewal)  

---

## 📋 VPS'da Setup (Step-by-Step)

### 1️⃣ VPS'ga kirish va update qilish

```bash
# SSH orqali VPS'ga kirish
ssh root@YOUR_VPS_IP

# Operatsion sistemani update qilish
sudo apt update
sudo apt upgrade -y

# Kerakli tools o'rnatish
sudo apt install -y curl wget git nodejs npm nginx certbot python3-certbot-nginx
```

### 2️⃣ Node.js versiyasini tekshirish

```bash
node --version   # v18+ bo'lishi kerak
npm --version
```

Agar v18'dan past bo'lsa:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

---

## 3️⃣ Loyihani VPS'ga yuklash

```bash
# Web foydalanuvchisi yaratish (optional but recommended)
sudo useradd -m -s /bin/bash webapp

# Loyihani /var/www ga yuklash
sudo mkdir -p /var/www/nazariy-web
cd /var/www/nazariy-web

# GitHub'dan clone qilish (yoki scp orqali yuklash)
sudo git clone YOUR_GITHUB_REPO .

# Egalik o'zgartirish
sudo chown -R webapp:webapp /var/www/nazariy-web
```

### 4️⃣ Frontend build qilish

```bash
# Dependencies o'rnatish
cd /var/www/nazariy-web/nazariy-web
npm install

# .env fayl yaratish
echo "VITE_API_URL=https://api.example.com" | sudo tee .env

# Production build
npm run build

# dist folder hosil bo'lishini tekshirish
ls -la dist/
```

---

## 5️⃣ Nginx konfiguratsiyasi yaratish

```bash
# Nginx config fayl yaratish
sudo nano /etc/nginx/sites-available/nazariy-web
```

Quyidagi konfiguratsiyani copy-paste qiling:

```nginx
# HTTP to HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name example.com www.example.com;

    # Let's Encrypt verification
    location /.well-known/acme-challenge/ {
        root /var/www/letsencrypt;
    }

    # Barcha boshqa so'rovlarni HTTPS'ga yo'naltirish
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name example.com www.example.com;

    # SSL sertifikatlari (Certbot tomonidan yangilaniladii)
    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    ssl_trusted_certificate /etc/letsencrypt/live/example.com/chain.pem;

    # SSL security settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # HSTS header (1 yil)
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # React app logs
    access_log /var/log/nginx/nazariy-web.access.log;
    error_log /var/log/nginx/nazariy-web.error.log;

    # Frontend build files (static)
    root /var/www/nazariy-web/nazariy-web/dist;
    index index.html;

    # React Router uchun (barcha request'lar index.html ga yo'naltirish)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Static files (css, js, images) - caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # gzip compression
    gzip on;
    gzip_types text/html text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml+rss 
               application/javascript application/json;
    gzip_min_length 1000;
    gzip_vary on;
}
```

**Ctrl+X** → **Y** → **Enter** (save qilish)

### 6️⃣ Nginx config'ni enable qilish

```bash
# Config'ni test qilish
sudo nginx -t

# Agar "successful" ko'rsatsa:
sudo ln -s /etc/nginx/sites-available/nazariy-web /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

---

## 6️⃣ Let's Encrypt SSL sertifikati o'rnatish

```bash
# Let's Encrypt directory yaratish
sudo mkdir -p /var/www/letsencrypt

# Certbot orqali sertifikat oling
sudo certbot certonly --webroot \
  -w /var/www/letsencrypt \
  -d example.com \
  -d www.example.com \
  --agree-tos \
  --no-eff-email \
  -m your-email@example.com

# Certbot avtomatik Nginx config'ni update qiladi
```

**Output**: 
```
Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/example.com/fullchain.pem
```

### 7️⃣ SSL Avtomatik Renewal (Let's Encrypt sertifikat 3 oyda expire bo'ladi)

```bash
# Certbot timer'ni enable qilish (Ubuntu)
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Renewal test qilish
sudo certbot renew --dry-run

# Output: "Congratulations! Your certificate has been renewed."
```

---

## 8️⃣ DNS Records sozlash

Domeningiz registrar'da (Namecheap, GoDaddy, etc.) quyidagilarni sozlang:

```
Type: A
Name: example.com (yoki root @)
Value: YOUR_VPS_IP_ADDRESS
TTL: 3600

Type: A  
Name: www.example.com
Value: YOUR_VPS_IP_ADDRESS
TTL: 3600
```

**Kutish**: 5-30 daqiqa (DNS propagation)

---

## 9️⃣ Backend API uchun proxy (opsional)

Agar backend shu VPS'da turgan bo'lsa, Nginx'da proxy sozlash:

```nginx
# Nginx config'iga qo'shish (https block'ining ichida)
location /api/ {
    proxy_pass http://localhost:4000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

Backend `.env`'da:
```
FRONTEND_ORIGIN=https://example.com
```

---

## 🔟 SSL Status'ni tekshirish

```bash
# SSL sertifikatni tekshirish
curl -I https://example.com

# Expected output:
# HTTP/2 200
# Strict-Transport-Security: max-age=31536000...

# SSL rating (A+ olish uchun)
# https://www.ssllabs.com/ssltest/analyze.html?d=example.com
```

---

## 🔄 Frontend update qilish (Har yangi deploy uchun)

```bash
cd /var/www/nazariy-web/nazariy-web

# Eng so'ngi kodni git'dan olish
sudo git pull origin main

# Build qilish
npm install
npm run build

# Nginx reload (zero-downtime)
sudo systemctl reload nginx
```

---

## 📊 Monitoring va Logs

### Logs ko'rish
```bash
# Nginx access logs
sudo tail -f /var/log/nginx/nazariy-web.access.log

# Nginx errors
sudo tail -f /var/log/nginx/nazariy-web.error.log

# System logs
sudo journalctl -u nginx -f
```

### Performance test
```bash
# Yuklanish vaqtini tekshirish
curl -w '\nTotal time: %{time_total}s\n' https://example.com

# SSL speed test
https://www.ssllabs.com/ssltest/
```

---

## ✅ SSL Auto-Renewal Tekshirish

```bash
# Renewal logs
sudo tail -f /var/log/letsencrypt/letsencrypt.log

# Certificate expiration sanasi
sudo openssl x509 -in /etc/letsencrypt/live/example.com/cert.pem -noout -dates
```

**Output**: 
```
notBefore=Jun 16 10:00:00 2026 GMT
notAfter=Sep 14 10:00:00 2026 GMT  (3 oydan keyin)
```

---

## 🚨 Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 80/443 already in use | `sudo lsof -i :80` → kill process |
| DNS not resolving | Check DNS records, wait 30 min |
| SSL certificate error | `sudo certbot renew --force-renewal` |
| Nginx won't start | `sudo nginx -t` → check syntax |
| 404 errors | React Router for SPA - `try_files $uri $uri/ /index.html;` |
| Slow loading | Check gzip config, enable caching |

---

## 📋 Final Checklist

- [ ] VPS SSH access
- [ ] Node.js + npm installed
- [ ] Loyiha yuklandi
- [ ] `npm run build` successful (dist folder)
- [ ] Nginx config created ✅
- [ ] Certbot SSL installed ✅
- [ ] DNS records sozlandi
- [ ] `curl https://example.com` ishlaydi
- [ ] SSL Labs A+ rating
- [ ] Auto-renewal enabled
- [ ] Nginx reload working

---

## 🎯 Completion

```bash
# Final test
sudo nginx -t
sudo systemctl reload nginx

# Check SSL
echo | openssl s_client -servername example.com -connect example.com:443 2>/dev/null | openssl x509 -noout -dates

# Access site
curl -I https://example.com
```

**Expected**: 
```
HTTP/2 200
SSL certificate valid
```

---

✅ **Frontend deploy complete with auto SSL!**

**Next**: Backend deploy or monitor with:
```bash
sudo tail -f /var/log/nginx/nazariy-web.access.log
```
