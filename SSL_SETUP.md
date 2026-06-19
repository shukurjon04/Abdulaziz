# SSL Sertifikatlari - O'rnatish va Boshqarish

## Tavsifi

Bu setup **Let's Encrypt** dan **nazariy.uz** domeniga avtomatik SSL sertifikatlarini oladi va boshqaradi.

## O'rnatish Qadamlari

### 1. DNS o'rnatish
`nazariy.uz` domenini server IP manzilingiga yo'naltirish kerak:
```
A records:
nazariy.uz -> YOUR_SERVER_IP
www.nazariy.uz -> YOUR_SERVER_IP
```

### 2. Docker containers ishga tushirish

```bash
# SSL sertifikatlarini olish va barcha xizmatlarni ishga tushirish
docker compose up -d --build
```

**Bu qiladi:**
- Certbot sertifikatlarni Let's Encrypt dan oladi
- Nginx SSL bilan ishga tushadi
- Backend va Frontend proxy orqali ishlaydi

### 3. Sertifikatlarni tekshirish

```bash
docker compose logs certbot
```

Agar "Account registered" yoki "Certificate already exists" ko'rinsa - OK!

## Avtomatik Yangilash

Let's Encrypt sertifikatlar 90 kun davom etadi. Ular avtomatik yangilash uchun:

### Cron job o'rnatish (Linux/Mac)

```bash
chmod +x /home/boqiyev/Abdulaziz/renew-cert.sh

# Root sifatida crontab o'chiring
sudo crontab -e

# Quyidagi qatorni qo'shing (har 12 soatda ishga tushadi):
0 */12 * * * /home/boqiyev/Abdulaziz/renew-cert.sh >> /var/log/nazariy-ssl-renewal.log 2>&1
```

### Yoki Docker orqali avtomatik yangilash

```bash
docker compose exec certbot certbot renew --dry-run
```

## Foydalanish

Sizning aplikatsiya endi:
- **Frontend**: https://nazariy.uz
- **Backend API**: https://nazariy.uz/api
- **Redirect**: http://nazariy.uz → https://nazariy.uz (avtomatik)

## Sertifikatlar joylashuvi

```
certbot/
├── conf/         # Let's Encrypt config va sertifikatlar
├── www/          # Let's Encrypt validation fayllar
└── renewal-hooks/ # Yangilash skriptlar
```

## Muammolarni Hal Qilish

### Sertifikatlar olinmadi
```bash
docker compose logs certbot
```

**Sabablari:**
- DNS hali sozlanmagan
- Firewall 80/443 portlarini blokiradi
- Email xato

### Nginx xatoliklar
```bash
docker compose logs nginx
```

### Sertifikat manual yangilash
```bash
docker compose exec certbot certbot renew --force-renewal
docker compose exec nginx nginx -s reload
```

## Muhim Xavfsizlik Qadamlari

1. ✅ HTTPS: Barcha trafiklar shifrlanadi
2. ✅ Avtomatik Yangilash: Sertifikatlar hech qachon tugamasligi
3. ✅ TLS 1.2+: Zamonaviy standartlar
4. ✅ HSTS: Brauzerlar HTTPS dan chiqaolmaydi

## Qo'shimcha Komandalar

```bash
# Sertifikat ma'lumotlarini ko'rish
docker compose exec certbot certbot certificates

# Sertifikat tafsili
docker compose exec certbot certbot show nazariy.uz

# Nginx konfiguratsiya tekshirish
docker compose exec nginx nginx -t

# Nginx qayta yuklash
docker compose exec nginx nginx -s reload
```

## Let's Encrypt Limitlar

- **50 sertifikat** 7 kunlik davr uchun (bir domen uchun)
- **5 ismli sertifikat** 7 kunlik davr uchun (wildcard tuzilishi)

Limitdan chiqib ketmang!

---

**Savollar? Dokumettsiyani o'qing:** https://letsencrypt.org/docs/
