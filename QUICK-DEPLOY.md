# 🚀 Quick Deployment Guide (5 Minutes)

Everything is configured and ready to deploy. Here's all you need to do.

## Step 1: Prepare Your Server (1 minute)

Make sure you have:
- ✅ Docker installed
- ✅ Docker Compose installed  
- ✅ A domain name (pointing to your server IP)
- ✅ Ports 80 and 443 open

```bash
# Verify Docker installation
docker --version
docker-compose --version
```

## Step 2: Configure (1 minute)

```bash
# Copy example configuration
cp .env.example .env

# Edit with your settings
nano .env
```

**Minimum required configuration:**

```env
DOMAIN=your-domain.com
CERTBOT_EMAIL=admin@your-domain.com
MYSQL_ROOT_PASSWORD=choose_a_strong_password
MYSQL_PASSWORD=choose_another_strong_password
JWT_SECRET=generate_random_string_32_chars_minimum
```

**Generate strong passwords/secrets:**

```bash
# Generate a random 32-character string
openssl rand -base64 32
```

## Step 3: Deploy (3 minutes)

### Option A: Automatic (Recommended)

```bash
bash deploy.sh
```

The script will:
- ✅ Validate configuration
- ✅ Check port availability
- ✅ Build Docker images
- ✅ Start all services
- ✅ Run health checks
- ✅ Show status

### Option B: Manual

```bash
# Build and start all services
docker compose up -d --build

# Monitor startup (Ctrl+C to stop)
docker compose logs -f

# Check status after 30-60 seconds
docker compose ps
```

## Verify It Works

Once containers are running, verify:

```bash
# Check all services are healthy
docker compose ps

# Test frontend
curl https://your-domain.com/

# Test API
curl https://your-domain.com/api/

# Both should respond without SSL errors
```

Open in browser:
- Frontend: `https://your-domain.com`
- API: `https://your-domain.com/api`

**Expected to see:**
- ✅ Frontend loads (may be blank/loading initially)
- ✅ API returns: `{"ok":true,"name":"nazariy-backend","version":"0.1.0"}`
- ✅ SSL certificate is valid (no warnings)

## What Was Deployed?

A complete production-ready stack:

| Component | Port | Purpose |
|-----------|------|---------|
| Nginx | 80, 443 | Reverse proxy + SSL/TLS |
| Backend API | 4000 | Node.js Express API |
| Frontend | 3000 | React web application |
| MySQL | 3306 | Database |
| Certbot | - | Automatic SSL certificates |

All running in isolated Docker containers with networking configured.

## Useful Commands

```bash
# View logs
docker compose logs -f backend    # Backend logs
docker compose logs -f nginx      # Nginx logs
docker compose logs -f mysql      # Database logs
docker compose logs -f certbot    # SSL certificate logs

# Restart a service
docker compose restart backend
docker compose restart nginx

# Stop everything
docker compose stop

# Start everything
docker compose start

# Restart everything
docker compose restart

# Full cleanup (stops everything, keeps data)
docker compose down

# Emergency cleanup (removes everything including data!)
docker compose down -v
```

## Troubleshooting

### SSL Certificate Not Generating

- Wait 2-3 minutes (certificate generation takes time)
- Verify domain DNS is pointing to server: `nslookup your-domain.com`
- Check Certbot logs: `docker compose logs certbot`

### Services Not Starting

```bash
# View full logs
docker compose logs

# Restart services
docker compose down
docker compose up -d --build
```

### API Returning Errors

- Check backend logs: `docker compose logs backend`
- Verify database: `docker compose exec mysql mysql -u root -p$MYSQL_ROOT_PASSWORD -e "SHOW TABLES;"`
- Check .env variables are correct

### High Memory/CPU Usage

- Check resource usage: `docker stats`
- Restart to free resources: `docker compose restart`

## Next Steps

### After Deployment

1. **Read the full documentation:**
   - `SETUP.md` - Comprehensive guide
   - `DEPLOYMENT-CHECKLIST.md` - Verification steps

2. **Configure your application:**
   - Set up Telegram bot (if using)
   - Configure admin credentials
   - Customize content

3. **Set up monitoring:**
   - Monitor logs: `docker compose logs -f`
   - Monitor resources: `docker stats`
   - Set up external uptime monitoring (UptimeRobot, etc.)

4. **Create backups:**
   - Back up database regularly
   - Store backups separately from server

### Common Tasks

**View all logs:**
```bash
docker compose logs -f
```

**Update application:**
```bash
git pull
docker compose up -d --build
docker compose logs -f
```

**Backup database:**
```bash
docker compose exec mysql mysqldump -u root -p$MYSQL_ROOT_PASSWORD nazariy > backup-$(date +%Y%m%d).sql
```

**Access database directly:**
```bash
docker compose exec mysql mysql -u root -p$MYSQL_ROOT_PASSWORD
```

**Execute backend commands:**
```bash
docker compose exec backend npm run migrate
docker compose exec backend npm run seed
```

## Support

**If something isn't working:**

1. Check logs: `docker compose logs`
2. Check SETUP.md troubleshooting section
3. Verify .env configuration
4. Check that DNS is properly configured
5. Verify ports 80 and 443 are accessible

## Summary

✅ **You now have:**
- Production-ready Docker setup
- Automatic SSL/TLS certificates
- Full-stack application running
- Database initialized
- Complete monitoring and logging

✅ **All services running with:**
- Health checks
- Auto-restart on failure
- Security headers
- CORS configuration
- Rate limiting

✅ **Ready for:**
- Production traffic
- Team access
- Long-term operation
- Regular backups

---

**That's it!** Your application is now deployed and ready to use.

For detailed information, see:
- 📖 **SETUP.md** - Complete setup & troubleshooting
- ✅ **DEPLOYMENT-CHECKLIST.md** - Verification procedures
- 📖 **README.md** - Project overview

---

**Questions?** All answers are in SETUP.md!
