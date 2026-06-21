# ✅ Deployment Checklist & Verification

Use this checklist to verify your deployment is ready and working correctly.

## Pre-Deployment Checklist

- [ ] **Domain acquired** and DNS pointing to server IP
- [ ] **Server requirements met**:
  - [ ] Docker installed (v20.10+)
  - [ ] Docker Compose installed (v1.29+)
  - [ ] Ports 80 and 443 are open
  - [ ] At least 2GB RAM available
  - [ ] At least 10GB disk space available

- [ ] **Environment configured**:
  - [ ] `.env` file created from `.env.example`
  - [ ] `DOMAIN` set to your domain name
  - [ ] `CERTBOT_EMAIL` set to valid email
  - [ ] `MYSQL_ROOT_PASSWORD` set to strong password
  - [ ] `MYSQL_PASSWORD` set to strong password
  - [ ] `JWT_SECRET` set to 32+ character random string
  - [ ] `TELEGRAM_BOT_TOKEN` configured (if using Telegram)
  - [ ] `SUPER_ADMIN_TG_ID` configured (if using Telegram)

- [ ] **Security**:
  - [ ] `.env` file permissions set: `chmod 600 .env`
  - [ ] `.env` is in `.gitignore` (don't commit secrets!)
  - [ ] Generated strong passwords (32+ chars)
  - [ ] JWT_SECRET is unique and random

## Deployment Steps

### 1. Clone Project

```bash
git clone <repo-url> nazariy
cd nazariy
```

- [ ] Project cloned successfully

### 2. Configure Environment

```bash
cp .env.example .env
nano .env
# Fill in all required values
chmod 600 .env
```

- [ ] `.env` file created
- [ ] All required variables configured
- [ ] `.env` file secured (600 permissions)

### 3. Start Services

```bash
docker compose up -d --build
```

- [ ] Command executed without errors

### 4. Wait for Initialization

```bash
# Monitor logs (Ctrl+C to stop)
docker compose logs -f
```

**What to look for:**
- [ ] MySQL initialized (look for "ready for connections")
- [ ] Backend started (look for "Nazariy backend 4000-portda ishlamoqda")
- [ ] Frontend built (look for "Built in X ms")
- [ ] Nginx started
- [ ] Certbot completed certificate generation

**Typical startup time: 30-90 seconds**

## Post-Deployment Verification

### Health Checks

```bash
# Check all services are running
docker compose ps
```

- [ ] All containers show "Up" status
- [ ] No containers showing "Exited" or "Restarting"

### Database Verification

```bash
# Check database connection
docker compose exec mysql mysql -u root -p$MYSQL_ROOT_PASSWORD -e "SHOW DATABASES;"
```

- [ ] `nazariy` database listed
- [ ] Connection successful

### Backend API Verification

```bash
# Test API endpoint
curl https://your-domain.com/api/
```

**Expected response:**
```json
{"ok":true,"name":"nazariy-backend","version":"0.1.0"}
```

- [ ] API responds with JSON
- [ ] Response is valid

### Frontend Verification

```bash
# Visit in browser
open https://your-domain.com/
```

- [ ] Page loads without errors
- [ ] No SSL warnings
- [ ] Layout displays correctly
- [ ] Can interact with UI

### SSL Certificate Verification

```bash
# Check SSL is working
curl -v https://your-domain.com/ | head -20
```

- [ ] Certificate is valid (no warnings)
- [ ] Using TLS 1.2 or higher
- [ ] Certificate from Let's Encrypt

Or check in browser:
- [ ] Click padlock icon
- [ ] Certificate is from Let's Encrypt
- [ ] Certificate is valid for your domain

## Functional Testing

### 1. Test API Endpoints

```bash
# Test health endpoint
curl https://your-domain.com/api/health

# Test tickets endpoint
curl https://your-domain.com/api/tickets

# Test with authentication (if implemented)
# curl -H "Authorization: Bearer YOUR_TOKEN" https://your-domain.com/api/auth/me
```

- [ ] Endpoints respond correctly
- [ ] No CORS errors in console
- [ ] No 5xx server errors

### 2. Test Frontend

- [ ] Load main page
- [ ] Check responsive design (mobile view)
- [ ] Test navigation
- [ ] Open browser console (F12) - no errors
- [ ] Check dark mode toggle (if present)
- [ ] Test API integration

### 3. Test Database

```bash
# Check database tables
docker compose exec mysql mysql -u root -p$MYSQL_ROOT_PASSWORD nazariy -e "SHOW TABLES;"
```

- [ ] All tables present
- [ ] Schema matches expectations

## Troubleshooting

If something doesn't work, follow these steps:

### Issue: Services not starting

```bash
# Check logs
docker compose logs

# Restart services
docker compose restart
```

### Issue: SSL certificate not generating

```bash
# Check Certbot logs
docker compose logs certbot

# Verify domain DNS
nslookup your-domain.com

# Verify ports are open
sudo lsof -i :80
sudo lsof -i :443
```

### Issue: Backend can't connect to database

```bash
# Check database is running
docker compose logs mysql

# Test connection
docker compose exec mysql mysql -u root -p$MYSQL_ROOT_PASSWORD -e "SELECT 1;"
```

### Issue: Frontend API requests failing

```bash
# Check backend logs
docker compose logs backend

# Verify API endpoint in .env
docker compose exec backend env | grep VITE_API_URL
```

## Monitoring

### Regular Checks

```bash
# Check service status daily
docker compose ps

# Check logs for errors
docker compose logs --tail 100

# Monitor resource usage
docker stats

# Check disk space
df -h
```

### Set Up Alerts

- [ ] Monitor logs for errors
- [ ] Monitor disk space
- [ ] Monitor CPU/memory usage
- [ ] Set up uptime monitoring (UptimeRobot, Pingdom, etc.)

## Maintenance

### Daily
- [ ] Check service status: `docker compose ps`
- [ ] Review logs for errors: `docker compose logs --tail 50`

### Weekly
- [ ] Check disk space: `df -h`
- [ ] Monitor resource usage: `docker stats`
- [ ] Backup database (manual or automated)

### Monthly
- [ ] Update Docker images: `docker compose pull && docker compose up -d`
- [ ] Security audit: Review access logs and errors
- [ ] Verify SSL certificate is renewing (Certbot handles this)

### As Needed
- [ ] Update application code: `git pull && docker compose up -d --build`
- [ ] Database backups: See SETUP.md
- [ ] Configuration changes: Update `.env` and restart

## Backup & Disaster Recovery

### Backup Database

```bash
# Create backup
docker compose exec mysql mysqldump -u root -p$MYSQL_ROOT_PASSWORD nazariy > backup-$(date +%Y%m%d).sql

# Store backup safely
cp backup-*.sql /backup/location/
```

- [ ] Automated backup script created
- [ ] Backups stored separately from server
- [ ] Tested restoration process

### Restore Database

```bash
# Restore from backup
docker compose exec mysql mysql -u root -p$MYSQL_ROOT_PASSWORD nazariy < backup.sql

# Verify restoration
docker compose exec mysql mysql -u root -p$MYSQL_ROOT_PASSWORD nazariy -e "SELECT COUNT(*) FROM User;"
```

- [ ] Restoration tested
- [ ] Data integrity verified

## Go-Live Checklist

**Final checks before considering deployment complete:**

- [ ] ✅ All services running and healthy
- [ ] ✅ SSL certificate valid and renewing
- [ ] ✅ Database initialized and accessible
- [ ] ✅ Frontend loads and displays correctly
- [ ] ✅ Backend API responds correctly
- [ ] ✅ CORS configured properly
- [ ] ✅ Performance acceptable
- [ ] ✅ Monitoring and logging set up
- [ ] ✅ Backup strategy implemented
- [ ] ✅ Security measures in place
- [ ] ✅ Documentation updated
- [ ] ✅ Team trained on deployment/maintenance

---

## Quick Reference Commands

```bash
# View all services
docker compose ps

# View logs
docker compose logs -f [service-name]

# Restart service
docker compose restart [service-name]

# Execute command in container
docker compose exec [service] [command]

# Stop all services
docker compose stop

# Start all services
docker compose start

# Remove all containers (keeps volumes)
docker compose down

# Full cleanup (removes containers and volumes!)
docker compose down -v

# Rebuild and restart
docker compose up -d --build

# Resource usage
docker stats

# Disk usage
docker system df
```

---

**Deployment Date**: _______________  
**Deployed By**: _______________  
**Domain**: _______________  
**Notes**: _____________________________________________

