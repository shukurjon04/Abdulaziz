# 🚀 Deployment Guide - Nazariy

Bu loyihani **Development** va **Production** muhitida ishga tushirish uchun komplete guide.

---

## 📊 Setup Turlari

| Rejim | Faylu | SSL | Foydalanish |
|------|------|-----|-----------|
| **Development** | `docker-compose.yml` | ❌ HTTP | Local testing |
| **Production** | `docker-compose.prod.yml` | ✅ HTTPS | Public server |

---

## 🔧 Development Setup (Local)

### 1. Containers ishga tushirish
```bash
docker compose up -d --build
```

### 2. Tekshirish
```bash
docker compose ps
```

### 3. Aplikatsiyaga kirish
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- MySQL: localhost:3306

### 4. Logs ko'rish
```bash
docker compose logs -f
```

### 5. Shutdown
```bash
docker compose down
```

---

## 🌐 Production Setup (SSL bilan)

### Prerequisites
1. **Domain:** nazariy.uz
2. **DNS sozlanishi:** A record → Server IP
3. **Ports:** 80, 443 ochiq

### 1. Sertifikat olish va ishga tushirish
```bash
docker compose -f docker-compose.prod.yml up -d --build
```

### 2. Sertifikat tekshirish
```bash
docker compose -f docker-compose.prod.yml logs certbot
```

### 3. Aplikatsiyaga kirish
- Frontend: https://nazariy.uz
- Backend API: https://nazariy.uz/api

---

## 🔄 Sertifikat Avtomatik Yangilash

```bash
sudo crontab -e

# Qo'shing:
0 */12 * * * /home/boqiyev/Abdulaziz/renew-cert.sh
```

---

## 🐛 Muammolarni Hal Qilish

### Logs ko'rish
```bash
docker compose -f docker-compose.prod.yml logs nginx
docker compose -f docker-compose.prod.yml logs certbot
```

### Config tekshirish
```bash
docker compose -f docker-compose.prod.yml exec nginx nginx -t
```

---

**Sukses deploymentlar! 🚀**
