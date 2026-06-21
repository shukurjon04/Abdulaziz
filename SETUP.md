# 🚀 Nazariy Project Setup & Deployment Guide

This guide will help you set up and deploy the Nazariy application on any server using Docker Compose.

## Prerequisites

- **Docker** (version 20.10+)
- **Docker Compose** (version 1.29+)
- **A domain name** with DNS pointing to your server
- **Ports 80 and 443** open on your server

## Quick Start (5 minutes)

### 1. Clone/Download the Project

```bash
git clone <repository-url> nazariy
cd nazariy
```

### 2. Configure Environment Variables

Copy the example file and configure your settings:

```bash
cp .env.example .env
nano .env
```

**Required configuration:**

```env
# Your domain name
DOMAIN=your-domain.com

# Email for SSL certificate notifications
CERTBOT_EMAIL=admin@your-domain.com

# Strong passwords for database
MYSQL_ROOT_PASSWORD=your_strong_root_password_here
MYSQL_PASSWORD=your_strong_user_password_here

# JWT secret (generate a random 32+ character string)
JWT_SECRET=your_random_secret_key_here_minimum_32_characters

# Telegram bot (if using Telegram integration)
TELEGRAM_BOT_TOKEN=your_bot_token_here
SUPER_ADMIN_TG_ID=your_telegram_id_here
```

**How to generate strong passwords and secrets:**

```bash
# Generate JWT secret
openssl rand -base64 32

# Generate strong passwords (use multiple times)
openssl rand -base64 16
```

### 3. Deploy with Docker Compose

```bash
# Build and start all services
docker compose up -d --build

# Check logs
docker compose logs -f

# Verify everything is running
docker compose ps
```

### 4. Verify Installation

Wait 30-60 seconds for all services to start, then check:

```bash
# Check if services are healthy
docker compose ps

# View backend API
curl https://your-domain.com/api/
# Should return: {"ok":true,"name":"nazariy-backend","version":"0.1.0"}

# View frontend
open https://your-domain.com/
```

## Services Overview

| Service | Port | Purpose |
|---------|------|---------|
| **Nginx** | 80, 443 | Reverse proxy with SSL/TLS |
| **Certbot** | - | Automatic SSL certificate management |
| **Backend** | 4000 | Node.js Express API |
| **Frontend** | 80 | React web application |
| **MySQL** | 3306 | Database |

## File Structure

```
nazariy/
├── docker-compose.yml      # Docker Compose configuration
├── nginx.conf              # Nginx configuration (auto-templated with domain)
├── nginx-entrypoint.sh     # Nginx startup script for env substitution
├── .env                    # Environment variables (KEEP SECRET!)
├── .env.example            # Example configuration template
├── nazariy-backend/        # Backend API (Node.js/Express)
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── server.js       # Main server file
│       ├── schema.sql      # Database schema (auto-initialized)
│       ├── routes/         # API endpoints
│       ├── middleware/     # Express middleware
│       └── utils/          # Utility functions
├── nazariy-web/            # Frontend (React/Vite)
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.js
│   └── src/                # React components
├── certbot/                # SSL certificates (auto-generated)
│   ├── conf/               # Certificate data
│   └── www/                # Validation files
└── SETUP.md                # This file
```

## Troubleshooting

### SSL Certificate Not Generating

If you see "Certificate already exists or failed" in logs:

```bash
# Check Certbot logs
docker compose logs certbot

# Manually request certificate (if domain is pointing correctly)
docker compose exec certbot certbot certonly \
  --webroot -w /var/www/certbot \
  -d your-domain.com -d www.your-domain.com \
  --non-interactive --agree-tos \
  --email admin@your-domain.com

# Restart Nginx
docker compose restart nginx
```

### Backend Can't Connect to Database

```bash
# Check MySQL health
docker compose logs mysql

# Verify database credentials in .env
docker compose exec mysql mysql -u nazariy_user -p -e "SELECT 1;"
```

### Frontend API Requests Failing

Check that:
1. Backend is running: `docker compose logs backend`
2. API URL is correct in .env: `VITE_API_URL=https://your-domain.com/api`
3. CORS is configured correctly (check backend logs for errors)

## Common Commands

```bash
# View logs for specific service
docker compose logs -f backend
docker compose logs -f nginx
docker compose logs -f mysql

# Restart services
docker compose restart
docker compose restart backend

# Stop and remove everything (WARNING: will delete database!)
docker compose down

# Stop without removing volumes (keeps database)
docker compose stop

# Start again
docker compose up -d

# Rebuild images
docker compose up -d --build

# Execute commands in containers
docker compose exec backend npm run migrate
docker compose exec backend npm run seed
docker compose exec mysql mysql -u root -p

# View resource usage
docker stats
```

## Environment Variables Reference

### Domain & SSL
- `DOMAIN` - Your domain name (e.g., example.com)
- `CERTBOT_EMAIL` - Email for Let's Encrypt notifications

### Database
- `MYSQL_ROOT_PASSWORD` - MySQL root password
- `MYSQL_DATABASE` - Database name (default: nazariy)
- `MYSQL_USER` - Database user (default: nazariy_user)
- `MYSQL_PASSWORD` - Database user password

### Backend
- `NODE_ENV` - Environment (production/development)
- `PORT` - Backend port (default: 4000)
- `DB_HOST` - Database host (default: mysql)
- `DB_PORT` - Database port (default: 3306)
- `DB_POOL_SIZE` - Database connection pool size (default: 10)
- `JWT_SECRET` - Secret for JWT tokens (MUST be unique and long!)
- `TELEGRAM_BOT_TOKEN` - Telegram bot token
- `SUPER_ADMIN_TG_ID` - Telegram ID of admin
- `FRONTEND_ORIGIN` - Frontend URL (auto-set: https://${DOMAIN})

### Frontend
- `VITE_API_URL` - Backend API URL (auto-set: https://${DOMAIN}/api)

## Maintenance

### Regular Backups

```bash
# Backup database
docker compose exec mysql mysqldump -u root -p${MYSQL_ROOT_PASSWORD} nazariy > backup.sql

# Restore database
docker compose exec mysql mysql -u root -p${MYSQL_ROOT_PASSWORD} nazariy < backup.sql
```

### Update Application

```bash
# Pull latest code
git pull

# Rebuild and restart
docker compose up -d --build

# View logs to confirm
docker compose logs -f
```

### SSL Certificate Renewal

Let's Encrypt certificates are automatically renewed (handled by Certbot). Check status:

```bash
docker compose exec certbot certbot certificates
```

## Security Best Practices

✅ **Do:**
- Use strong, randomly generated passwords
- Keep `.env` file secret (add to `.gitignore`)
- Use HTTPS only (automatic with Let's Encrypt)
- Regularly update Docker images: `docker compose pull`
- Monitor logs for suspicious activity: `docker compose logs nginx`
- Set proper file permissions on `.env`: `chmod 600 .env`

❌ **Don't:**
- Commit `.env` to version control
- Use default or weak passwords
- Expose ports other than 80/443
- Run as root in containers
- Keep old backup files with sensitive data

## Support & Debugging

### Enable Debug Logging

Edit `.env`:
```env
NODE_ENV=development
DEBUG=*
```

Restart and check logs:
```bash
docker compose restart backend
docker compose logs -f backend
```

### Health Check Endpoint

```bash
# Frontend health
curl https://your-domain.com/health

# Backend health
curl https://your-domain.com/api/

# Database health
docker compose exec mysql mysqladmin ping -u root -p
```

## Advanced Configuration

### Use External Database

Edit `docker-compose.yml`:
1. Remove or comment out the `mysql` service
2. Change `DB_HOST` in .env to your external database IP
3. Restart: `docker compose up -d`

### Custom Nginx Configuration

Edit `nginx.conf` and restart:
```bash
docker compose restart nginx
```

### Database Seeding

```bash
docker compose exec backend npm run seed
```

---

**Need help?** Check the logs: `docker compose logs -f`

**Ready to deploy?** Follow "Quick Start" section above!
