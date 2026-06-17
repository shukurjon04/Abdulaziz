# 🚀 Production Deployment Checklist

Before deploying to production, ensure all items are completed.

## 📋 Pre-Deployment (Before Going Live)

### Backend Setup
- [ ] Database created and accessible
- [ ] `schema.sql` executed successfully
- [ ] Sample data seeded (`npm run seed`)
- [ ] `.env` file created with production values
- [ ] `NODE_ENV=production` set
- [ ] `JWT_SECRET` is strong (32+ chars, random)
  ```bash
  openssl rand -hex 32
  ```
- [ ] `TELEGRAM_BOT_TOKEN` obtained from @BotFather
- [ ] `SUPER_ADMIN_TG_ID` set to your Telegram ID
- [ ] `FRONTEND_ORIGIN` points to your web domain
- [ ] Database credentials are secure
- [ ] Database backups configured
- [ ] All dependencies installed: `npm install`

### Web Frontend Setup
- [ ] `.env` file created with `VITE_API_URL` pointing to backend
- [ ] `npm run build` produces `dist/` folder
- [ ] Build size reasonable (< 500KB gzipped)
- [ ] No console errors in browser
- [ ] All 3 language options work (Uz, Ru, En)
- [ ] Dark mode works correctly
- [ ] Responsive design tested on mobile/tablet/desktop
- [ ] All screens load without 404 errors

### Telegram Mini App Setup
- [ ] Mini App URL deployed and accessible
- [ ] Registered with @BotFather
- [ ] Mini App opens without errors
- [ ] All features work in Telegram

## 🔐 Security Checklist

- [ ] `.env` file in `.gitignore` (not in git!)
- [ ] No secrets in source code
- [ ] `JWT_SECRET` not default/weak
- [ ] CORS `FRONTEND_ORIGIN` not `*` in production
- [ ] Database password is strong
- [ ] Rate limiting enabled on sensitive endpoints
- [ ] File upload validation working
- [ ] SQL injection prevented (parameterized queries)
- [ ] HTTPS enabled on all domains
- [ ] Helmet security headers configured
- [ ] CORS headers set correctly
- [ ] Admin routes require authentication
- [ ] No debugging code in production

## 🗄️ Database Checklist

- [ ] MySQL/PostgreSQL connection working
- [ ] Connection pool size set appropriately
- [ ] Database character encoding is UTF-8MB4
- [ ] Indexes created on frequently queried columns
- [ ] Backups automated daily
- [ ] Backup restoration tested
- [ ] Database user has minimal required permissions
- [ ] Root/admin database account disabled
- [ ] Connection timeout configured

## 🌐 Domain & DNS

- [ ] Domain registered
- [ ] DNS records configured
- [ ] SSL/TLS certificate installed (HTTPS)
- [ ] Redirect HTTP → HTTPS
- [ ] Email records (MX) configured (if needed)

## 🚀 Deployment Platforms

### If using Render.com
- [ ] GitHub repo connected
- [ ] Environment variables added in Render dashboard
- [ ] Build command correct: `npm install`
- [ ] Start command correct: `node src/server.js`
- [ ] Region selected (closest to users)
- [ ] Auto-deploy on git push enabled
- [ ] Health check configured
- [ ] Logs accessible

### If using Docker
- [ ] Dockerfile builds successfully
- [ ] Docker image runs without errors
- [ ] Ports mapped correctly
- [ ] Volume mounts configured
- [ ] Environment variables passed correctly
- [ ] Health checks configured

### If using Vercel (Web Frontend)
- [ ] GitHub repo connected
- [ ] Build settings correct
- [ ] Environment variables set
- [ ] Auto-deploy enabled
- [ ] Preview deployments work
- [ ] Production domain configured

## ✅ Testing Checklist

### Backend API
```bash
# Health check
curl https://your-backend.com/
# Should return: {"ok":true,"name":"nazariy-backend","version":"0.1.0"}

# Database connectivity
# Check logs for DB connection message

# Authentication
curl -X POST https://your-backend.com/auth/telegram \
  -H "Content-Type: application/json" \
  -d '{"initData":"test"}'
# Should return error (initData validation)
```

- [ ] Backend responds to health check
- [ ] Database tables exist and have data
- [ ] API endpoints accessible
- [ ] Authentication working
- [ ] CORS headers present in responses
- [ ] Rate limiting active
- [ ] Error handling returns proper status codes
- [ ] No sensitive data in error messages

### Web Frontend
- [ ] Homepage loads in < 3 seconds
- [ ] Login screen functional
- [ ] Guest login works
- [ ] Can navigate all screens
- [ ] API calls successful
- [ ] No 404 errors
- [ ] Images load correctly
- [ ] Responsive on mobile
- [ ] Dark mode works
- [ ] Language switching works
- [ ] No console errors
- [ ] LocalStorage cleared on logout

### Telegram Mini App
- [ ] Opens in Telegram
- [ ] All buttons clickable
- [ ] API calls work
- [ ] Data persists correctly
- [ ] Closes properly
- [ ] No Telegram API errors

## 📊 Performance & Monitoring

- [ ] Sentry/error tracking configured
- [ ] Performance monitoring active
- [ ] Logs stored and accessible
- [ ] Uptime monitoring enabled
- [ ] Alert notifications configured
- [ ] Dashboard created for monitoring
- [ ] Database query optimization done
- [ ] CDN configured (if using)
- [ ] Caching headers set correctly
- [ ] Gzip compression enabled

### Performance Targets
- [ ] Backend response time < 500ms
- [ ] Web frontend load time < 3s
- [ ] 99.9% uptime
- [ ] < 100ms database query time
- [ ] < 5MB API response size

## 📱 Mobile Testing

- [ ] Test on iOS (iPhone)
- [ ] Test on Android
- [ ] Test on tablet
- [ ] Test landscape orientation
- [ ] Test with slow 3G connection
- [ ] Test offline behavior
- [ ] Test with dark mode
- [ ] Test notification permissions

## 🔄 CI/CD Pipeline

- [ ] GitHub Actions workflow active
- [ ] Tests run on every push
- [ ] Build fails on errors
- [ ] Auto-deploy only after successful tests
- [ ] Rollback procedure documented
- [ ] Git branch protection enabled
- [ ] Pull request reviews required

## 📞 Support & Documentation

- [ ] README.md updated
- [ ] API documentation complete
- [ ] Deployment guide updated
- [ ] Support contact information added
- [ ] Error messages helpful
- [ ] Logs include useful debug info
- [ ] Known issues documented

## 🎯 Final Checks

- [ ] All team members aware of launch
- [ ] Announcement/PR plan ready
- [ ] Marketing materials ready
- [ ] User communication drafted
- [ ] Support team briefed
- [ ] Rollback plan documented
- [ ] Emergency contact numbers shared

## 🚨 Launch Day

### Before Going Live (T-1 hour)
- [ ] Final code review completed
- [ ] All tests passing
- [ ] Database backup created
- [ ] Team on standby
- [ ] Monitoring dashboards open
- [ ] Logs streaming live

### Launch (T=0)
- [ ] Deploy backend
- [ ] Deploy web frontend
- [ ] Deploy Telegram Mini App
- [ ] Verify all services running
- [ ] Run smoke tests
- [ ] Monitor error rates
- [ ] Monitor response times
- [ ] Check user logins

### Post-Launch (T+1 hour)
- [ ] Error rate normal
- [ ] No unexpected traffic spikes
- [ ] Database performing well
- [ ] User feedback positive
- [ ] Monitor for 24 hours

## 🔄 Post-Deployment

- [ ] Update status page
- [ ] Send announcement to users
- [ ] Monitor metrics continuously
- [ ] Respond to user feedback
- [ ] Plan next features
- [ ] Schedule retrospective
- [ ] Document lessons learned

---

## 📋 Emergency Contacts

| Role | Name | Phone | Email |
|------|------|-------|-------|
| DevOps | - | - | - |
| Backend Lead | - | - | - |
| Frontend Lead | - | - | - |
| Database Admin | - | - | - |

## 🆘 Troubleshooting

### If Backend is Down
1. Check service status on Render/Docker
2. Check database connection
3. Check environment variables
4. Check logs for errors
5. Restart service
6. If still down, rollback to previous version

### If Web is Down
1. Check if static site is running
2. Check build logs
3. Check if API is responding
4. Clear browser cache
5. Check CDN status (if using)

### If Database is Down
1. Check MySQL service status
2. Check connections limit reached
3. Check disk space
4. Check slow queries
5. Restart database
6. Restore from backup if corrupted

---

**Last Updated**: 2026-06-16  
**Status**: Ready for Production ✅
