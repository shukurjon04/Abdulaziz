# 🚀 VPS Deploy - QUICK START GUIDE

**Vaqt**: 15 daqiqa | **Avtomatik**: Ha | **SSL**: Avtomatik (Free Let's Encrypt)

---

## 📋 Boshlashdan Oldin (VPS bilangina)

### 1. VPS xususiyatlari
```
✅ Ubuntu 20.04 / 22.04
✅ 2GB+ RAM (recommended 4GB)
✅ 20GB+ disk space
✅ Internet access
✅ Root access
✅ Domain name (example.com)
```

### 2. Domeningizni DNS'da sozlang
```
Type: A
Name: example.com
Value: YOUR_VPS_IP
TTL: 3600

Type: A
Name: www.example.com
Value: YOUR_VPS_IP
TTL: 3600

Type: A
Name: api.example.com
Value: YOUR_VPS_IP
TTL: 3600
```

**Kutish**: 5-30 daqiqa DNS propagation uchun

---

## ⚡ 1-STEP DEPLOY

### VPS'ga SSH'da kirish:
```bash
ssh root@YOUR_VPS_IP
```

### Script download qilish:
```bash
cd /tmp
wget https://your-github-url/raw/main/vps-deploy-auto.sh
# YOKI git clone qilgan joydan copy qiling
cp /home/boqiyev/Abdulaziz/vps-deploy-auto.sh .
```

### Script'ni run qilish:
```bash
bash vps-deploy-auto.sh
```

### Prompts'ga javob berish:

```
✅ "Continue with these settings?" → y
✅ "Do you want to generate SSL?" → y (auto)
✅ "Accept Let's Encrypt terms?" → y (auto)
```

### Deployment progress ko'rish:
```
✅ System updated
✅ Dependencies installed
✅ Node.js v18 setup
✅ Frontend built
✅ Backend setup
✅ MySQL configured
✅ PM2 started
✅ Nginx configured
✅ SSL certificates obtained
✅ Firewall setup
✅ Backups configured

🎉 Deployment Complete!
```

**Vaqt**: ~10-15 daqiqa

---

## ✅ Deployment keyin Test Qilish

### 1. DNS'ni tekshirish (5-30 daqiqa kutish)
```bash
nslookup example.com
nslookup api.example.com

# Expected: YOUR_VPS_IP
```

### 2. Frontend test
```bash
curl -I https://example.com

# Expected:
# HTTP/2 200
# Strict-Transport-Security: max-age=31536000
```

### 3. Backend API test
```bash
curl -I https://api.example.com

# Expected:
# HTTP/2 200
# X-Powered-By: Express
```

### 4. Backend health endpoint
```bash
curl https://api.example.com/ | jq .

# Expected:
# {
#   "ok": true,
#   "name": "nazariy-backend",
#   "version": "0.1.0"
# }
```

### 5. Browser'da test
- Go to: https://example.com
- Green lock icon = ✅ SSL working
- Check: All pages load without errors
- Check: Dark mode works
- Check: 3 languages work

---

## 🔄 Logs va Monitoring

### Backend logs (real-time)
```bash
ssh root@YOUR_VPS_IP
pm2 logs nazariy-api

# Ctrl+C to exit
```

### Frontend logs
```bash
sudo tail -f /var/log/nginx/nazariy-web.access.log
sudo tail -f /var/log/nginx/nazariy-web.error.log
```

### API logs
```bash
sudo tail -f /var/log/nginx/nazariy-api.access.log
```

### MySQL connection test
```bash
ssh root@YOUR_VPS_IP
mysql -u nazariy_user -p nazariy -e "SELECT COUNT(*) FROM users;"

# Prompt'da password enter qiling (vps-deploy-auto.sh'da generierte password)
```

---

## 🔑 Important Credentials

These are in `/root/.vps-deploy-env.sh` on VPS:

```bash
# Get credentials
ssh root@YOUR_VPS_IP
cat ~/.vps-deploy-env.sh
```

**Save somewhere safe** (password manager):
- DB User: `nazariy_user`
- DB Password: `<generated>`
- JWT Secret: `<32-char random>`
- Telegram Bot Token: `<your token>`

---

## 🚀 Update Frontend (New Deploy)

After code changes:

```bash
ssh root@YOUR_VPS_IP

cd /var/www/nazariy-web/nazariy-web

git pull origin main
npm install
npm run build

sudo systemctl reload nginx
```

**Zero-downtime** reload ✅

---

## 🔄 Update Backend (New Deploy)

After code changes:

```bash
ssh root@YOUR_VPS_IP

cd /var/www/nazariy-backend

git pull origin main
npm install

pm2 restart nazariy-api
```

**Auto-restart** by PM2 ✅

---

## 🆘 Troubleshooting

### Issue: "Connection refused" (Frontend can't reach Backend)
```bash
# Check backend status
pm2 status

# Check if running
curl http://localhost:4000/

# If down, restart
pm2 restart nazariy-api
```

### Issue: 502 Bad Gateway
```bash
# Check Nginx reverse proxy logs
sudo tail /var/log/nginx/nazariy-api.error.log

# Check backend logs
pm2 logs nazariy-api

# Restart both
pm2 restart nazariy-api
sudo systemctl reload nginx
```

### Issue: "Cannot GET /" (Frontend not found)
```bash
# Check if dist folder exists
ls /var/www/nazariy-web/nazariy-web/dist/

# If not, rebuild
cd /var/www/nazariy-web/nazariy-web
npm run build
sudo systemctl reload nginx
```

### Issue: SSL certificate not working
```bash
# Check certificate status
sudo openssl x509 -in /etc/letsencrypt/live/example.com/cert.pem -noout -dates

# Force renewal
sudo certbot renew --force-renewal

# Restart Nginx
sudo systemctl restart nginx
```

### Issue: Database connection error
```bash
# Check MySQL
sudo systemctl status mysql

# Check credentials in .env
cat /var/www/nazariy-backend/.env | grep DB_

# Test connection
mysql -h localhost -u nazariy_user -p nazariy -e "SELECT 1;"
```

---

## 📊 Performance Checks

### SSL Rating (Should be A+)
```
Go to: https://www.ssllabs.com/ssltest/analyze.html?d=example.com
```

### Response time check
```bash
# Frontend
curl -w "Total time: %{time_total}s\n" https://example.com/

# Backend
curl -w "Total time: %{time_total}s\n" https://api.example.com/
```

**Target**: < 500ms

---

## 🔐 Security Checklist

- ✅ HTTPS (SSL) enabled on both domains
- ✅ Auto-renewal every 90 days (Let's Encrypt)
- ✅ HSTS header set (enforces HTTPS)
- ✅ Database user has limited permissions
- ✅ JWT Secret is 32+ characters (random)
- ✅ Telegram Bot Token secured in .env
- ✅ `.env` files in `.gitignore` (not in git)
- ✅ Firewall enabled (UFW)
- ✅ Daily automatic database backups

---

## 📋 Useful Commands

### Check all processes
```bash
pm2 list
pm2 status
pm2 monit
```

### View logs
```bash
pm2 logs nazariy-api          # Backend logs
pm2 logs --tail=100           # Last 100 lines
pm2 logs --err                # Error logs only
```

### Restart services
```bash
pm2 restart nazariy-api                  # Backend
sudo systemctl reload nginx              # Frontend
sudo systemctl restart nginx             # Full restart
sudo systemctl restart mysql             # Database
```

### Check disk space
```bash
df -h
du -sh /var/www/*
du -sh /var/backups/database/*
```

### Database backup
```bash
mysqldump -u nazariy_user -p nazariy > backup.sql
# (password prompt)

# Restore
mysql -u nazariy_user -p nazariy < backup.sql
```

### View Nginx config
```bash
sudo cat /etc/nginx/sites-enabled/nazariy-web
sudo cat /etc/nginx/sites-enabled/nazariy-api
```

### Test SSL renewal
```bash
sudo certbot renew --dry-run
```

---

## 📞 Emergency Procedures

### If Backend is Down

```bash
# 1. Check status
pm2 status

# 2. Check logs
pm2 logs nazariy-api

# 3. Restart
pm2 restart nazariy-api

# 4. If still down, check database
mysql -u nazariy_user -p nazariy -e "SELECT 1;"

# 5. If database ok, check error logs
cat /var/log/nazariy-backend.log
```

### If Frontend is Down

```bash
# 1. Check Nginx
sudo systemctl status nginx

# 2. Check config
sudo nginx -t

# 3. Restart
sudo systemctl restart nginx

# 4. Check files
ls /var/www/nazariy-web/nazariy-web/dist/index.html
```

### If Database is Down

```bash
# 1. Check status
sudo systemctl status mysql

# 2. Start
sudo systemctl start mysql

# 3. Check logs
sudo tail /var/log/mysql/error.log

# 4. Restart
sudo systemctl restart mysql
```

---

## 🎯 What's Running

After deployment, your VPS runs:

| Service | Port | Access | Purpose |
|---------|------|--------|---------|
| Nginx | 80/443 | Public | Web server (Frontend + Reverse Proxy) |
| Node.js | 4000 | Internal (Nginx) | Backend API |
| MySQL | 3306 | Internal only | Database |
| PM2 | - | Local | Process manager (keeps backend alive) |
| Certbot | - | Auto | SSL renewal (runs daily) |

---

## 📈 Monitoring

For ongoing monitoring, you can install:

```bash
# Option 1: New Relic (has free tier)
curl -Ls https://download.newrelic.com/install/newrelic-cli/scripts/install.sh | bash

# Option 2: Datadog (has free tier)
DD_AGENT_MAJOR_VERSION=7 bash -c "$(curl -L https://s3.amazonaws.com/..."

# Option 3: Sentry (error tracking, free for JavaScript)
npm install --save @sentry/node
```

---

## ✨ Next Steps

1. ✅ DNS configured
2. ✅ Script run
3. ✅ Tests passing
4. ✅ SSL working

**Then**:
- [ ] Monitor logs for 24 hours
- [ ] Test all features (login, upload, etc.)
- [ ] Announce to users
- [ ] Plan next features

---

## 🎓 Learning Resources

- [Let's Encrypt Auto-renewal](https://certbot.eff.org/instructions)
- [PM2 Documentation](https://pm2.keymetrics.io/)
- [Nginx Reverse Proxy](https://nginx.org/en/docs/http/ngx_http_proxy_module.html)
- [MySQL Backup](https://dev.mysql.com/doc/mysqldump.html)

---

## 💪 You've Got This!

If stuck:
1. Check logs (`pm2 logs`, `sudo tail /var/log/...`)
2. Run manual test commands
3. Check firewall & DNS
4. Restart services

**Good luck!** 🚀

```bash
# Final victory check
curl -s https://example.com | head -10
curl -s https://api.example.com/ | jq .
pm2 list
```
