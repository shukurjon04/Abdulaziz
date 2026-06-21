# 🔒 SSL Sertifikat Avtomatik Olinish

## Qo'llanish

SSL sertifikat **avtomatik** olinadi va yangilanadi. Hech nima qo'lda sozlash kerak yo'q!

### Qanday ishlaydi?

```
docker compose up -d --build
         ↓
Nginx ishga tushadi (Port 80)
         ↓
Certbot Let's Encrypt'dan sertifikat so'raydi
         ↓
Let's Encrypt domain'ni tekshiradi (HTTP challenge)
         ↓
Sertifikat `/certbot/conf` papkasida saqlanadi
         ↓
Nginx HTTPS (Port 443) ishga tushadi
         ↓
Barcha HTTP trafikasi HTTPS'ga yo'naltiriqladi
```

## ✅ Avtomatik Olinish

### 1️⃣ Birinchi qatorda (Deploy vaqtida)

```bash
docker compose up -d --build
```

**Certbot:**
- `.env` faylidan DOMAIN va CERTBOT_EMAIL o'qiydi
- Let's Encrypt'dan sertifikat so'raydi
- Domain tekshiradi (HTTP challenge)
- Sertifikat `/certbot/conf/live/${DOMAIN}/` papkasiga saqlanadi

**Logni ko'ring:**
```bash
docker compose logs -f certbot
```

### 2️⃣ Birinchi qatorda nima bo'ladi?

```
✅ Step 1: Certbot container ishga tushadi
✅ Step 2: Sertifikat so'rovi yuboriladi
✅ Step 3: Domain tekshiriladi (HTTP)
✅ Step 4: Sertifikat olinadi yoki xatosi chiqadi
✅ Step 5: Sertifikat papkasida saqlanadi
```

## ⚠️ Agar sertifikat olmasa?

### Muammo 1: Domain ishlamaydi

```bash
# DNS tekshirish
nslookup your-domain.com
# Sizning server IP'si ko'rinishi kerak

# Proxy/DNS o'zgarishining bo'lishi mumkin
# 5-10 daqiqa kutib ko'ring, keyin qayta urinib ko'ring
```

### Muammo 2: Port 80 yopilgan

```bash
# Port 80 ochiq ekanligini tekshirish
sudo lsof -i :80

# Agar boshqa process ishlatayotgan bo'lsa, to'xtatib qo'ying
```

### Muammo 3: Certbot xatosi

```bash
# Loglarni ko'rish
docker compose logs certbot

# Manually qayta urinish
docker compose down
rm -rf certbot/conf/  # Eski fayllarni o'chirish (EHTIYOT!)
docker compose up -d --build
```

## 🔄 Avtomatik Yangilash (Har 60 kundan keyin)

Let's Encrypt sertifikatlar **90 kundan** so'ng muddati o'tadi.  
Certbot har **60 kunda** avtomatik yangilash uchun talab qo'yadi.

### Setup 1: Cron Job (Tavsiya etilgan)

```bash
# SSH bilan serverga kirib, crontab'ni ochish
crontab -e

# Qo'shimcha qatorlar:
# Har kuni 2:00 AM'da tekshirish
0 2 * * * /path/to/project/certbot-renew.sh

# Yoki har 12 soatda bir
0 */12 * * * /path/to/project/certbot-renew.sh
```

**Skript:**
```bash
#!/bin/bash
cd /path/to/project
docker compose exec -T certbot certbot renew --webroot -w /var/www/certbot --quiet
docker compose exec -T nginx nginx -s reload
```

### Setup 2: Renewal Service (Advanced)

```bash
# /etc/systemd/system/certbot-renew.service
[Unit]
Description=Certbot Renewal
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
ExecStart=/path/to/project/certbot-renew.sh
User=root

[Install]
WantedBy=multi-user.target
```

```bash
# /etc/systemd/system/certbot-renew.timer
[Unit]
Description=Run Certbot Renewal daily

[Timer]
OnCalendar=daily
OnCalendar=*-*-* 02:00:00
Persistent=true

[Install]
WantedBy=timers.target
```

```bash
# Faollashtirish
sudo systemctl enable certbot-renew.timer
sudo systemctl start certbot-renew.timer
sudo systemctl status certbot-renew.timer
```

## 📋 Sertifikat Status

### Sertifikat ma'lumotini ko'rish

```bash
# Sertifikatlarni ko'rish
docker compose exec certbot certbot certificates

# Bitta sertifikat haqida:
docker compose exec certbot certbot info your-domain.com
```

### Yangilash kunim?

```bash
# Yangilash sanasini ko'rish
docker compose exec certbot certbot certificates | grep "Expiry Date"
```

### Log fayllarni ko'rish

```bash
# Certbot log'lari
docker compose exec certbot cat /var/log/letsencrypt/letsencrypt.log | tail -20

# Yangilash historiyasi
docker compose exec certbot ls -la /var/log/letsencrypt/archive/
```

## 🔒 Xavfsizlik

### Sertifikat fayllari qayerda?

```
/certbot/conf/live/${DOMAIN}/
├── cert.pem          (Sertifikat)
├── chain.pem         (Zanjir)
├── fullchain.pem     (To'liq - Nginx uchun)
└── privkey.pem       (Shaxsiy kalit)
```

### Permissions tekshirish

```bash
# Sertifikat fayllari read-only bo'lishi kerak
docker compose exec nginx ls -la /etc/letsencrypt/live/${DOMAIN}/
# rwx------ (600) bo'lishi kerak privkey.pem uchun
```

## 🆘 Muammolar

### "Rate limit exceeded" xatosi

```
Let's Encrypt 7 kunlik limit:
- 50 sertifikat / domain / 7 kun
- 5 duplikat sertifikat / sof-oq / 7 kun

Agar qo'sh bilan qayta urinishgan bo'lsangiz, kutib turing:
- Staging environment'da test qiling
- 7 kundan keyin qayta urinib ko'ring
```

### "Challenge failed" xatosi

```
Sabablari:
1. Domain DNS ishlamaydi
2. Port 80 yopilgan
3. Firewall muammolari
4. Nginx ishlamaydi

Tekshirish:
- DNS: nslookup your-domain.com
- Port: sudo lsof -i :80
- Firewall: sudo ufw status
- Nginx: docker compose logs nginx
```

### Sertifikat yangilanmaydi

```bash
# Manual yangilash
docker compose exec certbot certbot renew --force-renewal

# Yoki debug rezhimida
docker compose exec certbot certbot renew --dry-run
```

## 📚 Qo'shimcha Ma'lumotlar

### Let's Encrypt haqida
- Bepul SSL sertifikatlar
- 90 kunik amal qiladi
- Avtomatik yangilash zarur
- www va non-www versiyalari uchun

### Nginx SSL configuration
- `nginx.conf'da` sozlanadi:
  ```nginx
  ssl_certificate /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;
  ```

### Certbot haqida
- Let's Encrypt official client
- Avtomatik renewal qiladi
- Multiple domain qo'llaydi
- Webroot validation ishlatkanda

## ✅ Checklist

- [ ] Birinchi qatorda sertifikat olingan
- [ ] HTTPS (Port 443) ishga tushgan
- [ ] SSL lock icon ko'ringan
- [ ] Sertifikat valid va to'g'ri domain uchun
- [ ] Avtomatik yangilash sozlangan (cron/timer)
- [ ] Renewal log'lari tekshirilgan
- [ ] Vanquish 60 kundan keyin qayta tekshirish

## 🚀 Qisqacha

```bash
# Avtomatik olinadi:
docker compose up -d --build

# Status tekshirish:
docker compose logs certbot
docker compose exec certbot certbot certificates

# Yangilashni tekshirish:
docker compose exec certbot certbot renew --dry-run

# Manual yangilash:
docker compose exec certbot certbot renew
docker compose exec nginx nginx -s reload
```

---

**Xulosa**: SSL sertifikat birinchi qatorda avtomatik olinadi, ammo **yangilash uchun cron job yoki timer** o'rnating! 🔒
