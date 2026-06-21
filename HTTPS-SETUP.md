# 🔒 HTTPS & SSL Certificate Complete Setup Guide

Ushbu guide sertifikat avtomatik olib, HTTPS'ni yoqish va yangilashni qamrab oladi.

## 🚀 Tez Boshlash (2 qadami)

### 1️⃣ HTTPS Sozlash & Sertifikat Olish

```bash
bash setup-https.sh
```

**Bu script:**
- ✅ Let's Encrypt'dan SSL sertifikat so'raydi
- ✅ nginx.conf'ni HTTPS'ga o'zgartiraradi
- ✅ Nginx qayta ishga tushiraradi
- ✅ HTTPS'ni faollashtiradi

### 2️⃣ Avtomatik Yangilash O'rnating

```bash
crontab -e
```

Qo'shimcha qator:
```bash
0 2 * * * cd /path/to/project && ./renew-ssl.sh
```

**Jumboq:** `/path/to/project` o'rniga haqiqiy yo'lni o'rnating.

Masalan:
```bash
0 2 * * * cd /root/Abdulaziz && ./renew-ssl.sh
```

---

## 📋 Detallar

### setup-https.sh - HTTPS Sozlash Scripti

**Nima qiladi:**

```
1. Docker containers'ni tekshiradi
2. .env faylidan DOMAIN va EMAIL o'qiydi
3. Sertifikat bo'lsa, use qiladi; bo'lmasa, olib oladi
4. nginx.conf HTTP'dan HTTPS'ga o'zgartiraradi
5. Nginx qayta ishga tushiraradi
6. Barcha narsani tekshiraradi
```

**Ishlatish:**
```bash
bash setup-https.sh
```

**Output Example:**
```
HTTPS Setup & SSL Certificate Configuration
═════════════════════════════════════════════

📋 Configuration:
   Domain: nazariy.uz
   Email:  admin@nazariy.uz

✓ Containers are running

Step 1: Request SSL Certificate from Let's Encrypt
⏳ Requesting SSL certificate...
✓ Certificate obtained successfully!

Step 2: Update Nginx Configuration for HTTPS
✓ HTTPS config applied

Step 3: Restart Nginx with HTTPS
🔄 Restarting Nginx container...
✓ Nginx is running

✅ HTTPS SETUP COMPLETE!

🌐 Your application is now available at:
   https://nazariy.uz
   https://www.nazariy.uz
   API: https://nazariy.uz/api
```

---

### renew-ssl.sh - Avtomatik Yangilash Scripti

**Nima qiladi:**

```
1. Sertifikat amal qilish sanasini tekshiradi
2. 30 kundan kam qolgan bo'lsa, yangilashni boshlaydi
3. Certbot orqali yangilashni amalga oshiradi
4. Nginx'ni qayta yuklaydi
5. Hammani log faylida yozadi
```

**Ishlatish:**
```bash
# Manual tekshirish
bash renew-ssl.sh

# Cron orqali avtomatik (kuniga 1 marta 2:00 AM'da)
0 2 * * * /path/to/renew-ssl.sh
```

**Log fayli:**
```bash
tail -f /var/log/ssl-renewal.log
```

---

## 🔧 Cron Job O'rnating

### Yaxshi yo'li - Cron

```bash
# Crontab'ni ochish
crontab -e

# Qo'shimcha qator (har kuni 2:00 AM'da):
0 2 * * * cd /root/Abdulaziz && ./renew-ssl.sh

# Yoki log'ni file'ga yozish
0 2 * * * cd /root/Abdulaziz && ./renew-ssl.sh >> /tmp/ssl-renewal.log 2>&1
```

### Cron sanasini tekshirish

```bash
# Barcha cron job'larni ko'rish
crontab -l

# Log'larni ko'rish
grep CRON /var/log/syslog
```

### Advanced - Systemd Timer

```bash
# /etc/systemd/system/ssl-renewal.service
[Unit]
Description=SSL Certificate Renewal
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
WorkingDirectory=/root/Abdulaziz
ExecStart=/root/Abdulaziz/renew-ssl.sh
User=root
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

```bash
# /etc/systemd/system/ssl-renewal.timer
[Unit]
Description=Run SSL Renewal daily

[Timer]
OnCalendar=daily
OnCalendar=*-*-* 02:00:00
Persistent=true

[Install]
WantedBy=timers.target
```

```bash
# Faollashtirish
sudo systemctl daemon-reload
sudo systemctl enable ssl-renewal.timer
sudo systemctl start ssl-renewal.timer
sudo systemctl status ssl-renewal.timer
```

---

## 🔐 SSL Sertifikat Tekshirish

### Sertifikat Ma'lumotlari

```bash
# Sertifikat ma'lumotlarini ko'rish
docker compose exec certbot certbot certificates

# Specific sertifikat haqida
openssl x509 -in ./certbot/conf/live/nazariy.uz/fullchain.pem -text -noout

# Amal qilish sanasi
openssl x509 -enddate -noout -in ./certbot/conf/live/nazariy.uz/fullchain.pem
```

### Sertifikat Tekshirish

```bash
# HTTPS'ni test qilish
curl -v https://your-domain.com

# Browser'da oching
https://your-domain.com

# SSL Labs test (external)
https://www.ssllabs.com/ssltest/analyze.html?d=your-domain.com
```

---

## ⚠️ Muammolar va Hal Qilish

### Muammo 1: "Certificate already exists or failed"

**Sabab:** Sertifikat olinmagani yoki rate limit

**Hal:**
```bash
# 1 soat kutish kerak (rate limit)
sleep 3600

# Keyin qayta urinish
docker compose exec -T certbot certbot renew

# Yoki manual
bash setup-https.sh
```

### Muammo 2: "Domain validation failed"

**Sabab:** DNS not pointing to server yoki port 80 yopilgan

**Hal:**
```bash
# DNS tekshirish
nslookup your-domain.com
# Your server IP ko'rinishi kerak

# Port 80 tekshirish
sudo lsof -i :80
# Nginx listen qilib turishi kerak

# Firewall tekshirish
sudo ufw status
# Port 80 va 443 open bo'lishi kerak
```

### Muammo 3: "Too many failed authorizations"

**Sabab:** 5 dan ortiq xatosiz urinish (1 soatlik limit)

**Hal:**
```bash
# 1 soat kutish kerak
# Staging server'dan test qilish
docker compose exec -T certbot certbot certonly \
  --webroot -w /var/www/certbot \
  -d your-domain.com \
  --staging \
  --email admin@your-domain.com
```

### Muammo 4: Nginx HTTPS'da ishlamaydi

**Hal:**
```bash
# Nginx logs ko'rish
docker compose logs nginx

# Config test qilish
docker compose exec nginx nginx -t

# Sertifikat fayllari tekshirish
ls -la ./certbot/conf/live/your-domain.com/
# fullchain.pem va privkey.pem bo'lishi kerak

# Permissions tekshirish
chmod 644 ./certbot/conf/live/your-domain.com/fullchain.pem
chmod 600 ./certbot/conf/live/your-domain.com/privkey.pem
```

---

## 🔄 Yangilash Tezligi

Let's Encrypt sertifikatlar:
- **Amal qilish muddati:** 90 kun
- **Yangilash shunga keyin:** 60 kundan keyin
- **Avtomatik tekshirish:** Har kuni (cron job orqali)
- **Real yangilash:** Faqat 30 kundan kam qolganida

```
Yangilash Timeline:
─────────────────
Day 1:  Sertifikat olingan (90 gun amal qiladi)
Day 60: Avtomatik renewal boshlanadi
Day 85: Oxirgi urinish
Day 90: Sertifikat muddati tugadi
```

---

## ✅ Tekshirish Ro'yxati

- [ ] `setup-https.sh` script ishga tushdi
- [ ] Sertifikat olingan va `/certbot/conf/live/` papkasida bor
- [ ] nginx.conf HTTPS konfiguratsiyasiga o'zgartirilgan
- [ ] Nginx HTTPS (port 443) ishlamoqda
- [ ] `https://your-domain.com` ko'rsa muvaffaqiyatli
- [ ] SSL sertifikat valid (browser'da lock icon ko'rinadi)
- [ ] Cron job o'rnatilgan (crontab -l)
- [ ] Renewal logs tekshirilgan (/var/log/ssl-renewal.log)

---

## 🎯 Manual Yangilash

```bash
# Bitta marta manual yangilash
bash renew-ssl.sh

# Yoki docker orqali
docker compose exec -T certbot certbot renew

# Keyin Nginx reload
docker compose exec -T nginx nginx -s reload
```

---

## 🔙 HTTPS'ni Disabled Qilish (agar zarur bo'lsa)

```bash
# HTTP backup'ni restore qilish
cp nginx.conf.http.backup.* nginx.conf

# Nginx restart
docker compose restart nginx

# Endi HTTP (port 80) ishlamoqda
```

---

## 📊 Monitoring

### Sertifikat Status

```bash
# Har kuni tekshirish
docker compose exec certbot certbot certificates

# Script orqali
./renew-ssl.sh

# Log ko'rish
tail -f /var/log/ssl-renewal.log
```

### Nginx Status

```bash
docker compose ps | grep nginx
docker compose logs nginx
```

### Cron Job Logs

```bash
# Cron execution logs
grep CRON /var/log/syslog

# SSL renewal logs
cat /var/log/ssl-renewal.log
```

---

## 🆘 Support

### Logs Ko'rish

```bash
# Certbot logs
docker compose logs certbot
tail -f /var/log/letsencrypt/letsencrypt.log

# Nginx logs
docker compose logs nginx

# Renewal logs
tail -f /var/log/ssl-renewal.log

# Cron logs
grep ssl-renewal /var/log/syslog
```

### Debug Qilish

```bash
# Script manual ishga tushirish (verbose)
bash -x setup-https.sh

# Docker exec debugging
docker compose exec certbot bash
certbot certificates

# Port tekshirish
sudo netstat -tlnp | grep -E ":80|:443"
```

---

## Xulosa

**1️⃣ Setup:**
```bash
bash setup-https.sh
```

**2️⃣ Avtomatik yangilash:**
```bash
crontab -e
# Add: 0 2 * * * cd /path/to/project && ./renew-ssl.sh
```

**3️⃣ Tekshirish:**
```bash
https://your-domain.com
docker compose logs certbot
```

Barcho tayyor! 🎉
