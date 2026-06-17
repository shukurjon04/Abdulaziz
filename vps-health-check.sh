#!/bin/bash

#################################################################################
# VPS Health Check Script - Monitor all services
#################################################################################

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
DOMAIN_NAME="${1:-example.com}"
API_DOMAIN="api.$DOMAIN_NAME"

print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

# ============================================================================
# SYSTEM CHECKS
# ============================================================================

print_header "System Health"

# Uptime
UPTIME=$(uptime -p)
echo "Uptime: $UPTIME"

# CPU Usage
CPU=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)
echo "CPU Usage: ${CPU}%"

# Memory Usage
MEM=$(free | grep Mem | awk '{printf("%.1f%%", ($3/$2)*100)}')
echo "Memory Usage: $MEM"

# Disk Usage
DISK=$(df -h / | awk 'NR==2 {print $5}')
echo "Disk Usage: $DISK"

# ============================================================================
# SERVICE CHECKS
# ============================================================================

print_header "Service Status"

# Nginx
systemctl is-active --quiet nginx
print_status $? "Nginx Web Server"

# MySQL
systemctl is-active --quiet mysql
print_status $? "MySQL Database"

# PM2
pm2 pid nazariy-api > /dev/null 2>&1
print_status $? "PM2 Backend Process"

# ============================================================================
# PROCESS CHECKS
# ============================================================================

print_header "Process Details"

# PM2 Status
echo "PM2 Processes:"
pm2 list | tail -3

# MySQL Connections
MYSQL_CONN=$(mysql -u nazariy_user -p$(grep "DB_PASSWORD=" /var/www/nazariy-backend/.env | cut -d'=' -f2) -e "SHOW PROCESSLIST;" 2>/dev/null | wc -l)
echo -e "MySQL Connections: ${GREEN}${MYSQL_CONN}${NC}"

# ============================================================================
# NETWORK CHECKS
# ============================================================================

print_header "Network Status"

# Frontend HTTPS
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN_NAME/ 2>/dev/null)
if [ "$HTTP_STATUS" = "200" ]; then
    print_status 0 "Frontend HTTPS (https://$DOMAIN_NAME): $HTTP_STATUS"
else
    print_status 1 "Frontend HTTPS (https://$DOMAIN_NAME): $HTTP_STATUS"
fi

# Backend HTTPS
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://$API_DOMAIN/ 2>/dev/null)
if [ "$HTTP_STATUS" = "200" ]; then
    print_status 0 "Backend HTTPS (https://$API_DOMAIN): $HTTP_STATUS"
else
    print_status 1 "Backend HTTPS (https://$API_DOMAIN): $HTTP_STATUS"
fi

# Backend Health Endpoint
HEALTH=$(curl -s https://$API_DOMAIN/ 2>/dev/null | jq -r '.ok' 2>/dev/null)
if [ "$HEALTH" = "true" ]; then
    print_status 0 "Backend Health Endpoint"
else
    print_status 1 "Backend Health Endpoint"
fi

# SSL Certificate Status
echo ""
echo "SSL Certificates:"

# Frontend SSL
CERT_EXPIRY=$(openssl x509 -in /etc/letsencrypt/live/$DOMAIN_NAME/cert.pem -noout -dates 2>/dev/null | grep notAfter | cut -d'=' -f2)
DAYS_LEFT=$(( ($(date -d "$CERT_EXPIRY" +%s) - $(date +%s)) / 86400 ))
echo "  $DOMAIN_NAME: Expires in $DAYS_LEFT days"

# Backend SSL
CERT_EXPIRY=$(openssl x509 -in /etc/letsencrypt/live/$API_DOMAIN/cert.pem -noout -dates 2>/dev/null | grep notAfter | cut -d'=' -f2)
DAYS_LEFT=$(( ($(date -d "$CERT_EXPIRY" +%s) - $(date +%s)) / 86400 ))
echo "  $API_DOMAIN: Expires in $DAYS_LEFT days"

# ============================================================================
# DATABASE CHECKS
# ============================================================================

print_header "Database Status"

DB_USER=$(grep "DB_USER=" /var/www/nazariy-backend/.env | cut -d'=' -f2)
DB_PASS=$(grep "DB_PASSWORD=" /var/www/nazariy-backend/.env | cut -d'=' -f2)
DB_NAME=$(grep "DB_NAME=" /var/www/nazariy-backend/.env | cut -d'=' -f2)

# Database Connection
mysql -u "$DB_USER" -p"$DB_PASS" -e "SELECT 1;" > /dev/null 2>&1
print_status $? "Database Connection"

# Table Count
TABLE_COUNT=$(mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "SHOW TABLES;" 2>/dev/null | wc -l)
echo "Tables: $TABLE_COUNT"

# User Count
USER_COUNT=$(mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "SELECT COUNT(*) FROM users;" 2>/dev/null | tail -1)
echo "Users: $USER_COUNT"

# ============================================================================
# FILE SYSTEM CHECKS
# ============================================================================

print_header "File System"

# Frontend Build
if [ -f "/var/www/nazariy-web/nazariy-web/dist/index.html" ]; then
    print_status 0 "Frontend Build (dist/index.html exists)"
else
    print_status 1 "Frontend Build (dist/index.html missing)"
fi

# Backend Source
if [ -f "/var/www/nazariy-backend/src/server.js" ]; then
    print_status 0 "Backend Source (server.js exists)"
else
    print_status 1 "Backend Source (server.js missing)"
fi

# Backup Directory
BACKUP_COUNT=$(ls /var/backups/database/*.gz 2>/dev/null | wc -l)
echo "Database Backups: $BACKUP_COUNT files"

# Recent Backup
RECENT_BACKUP=$(ls -t /var/backups/database/*.gz 2>/dev/null | head -1)
if [ ! -z "$RECENT_BACKUP" ]; then
    BACKUP_AGE=$(stat "$RECENT_BACKUP" -c "%y" 2>/dev/null | cut -d' ' -f1,2)
    echo "  Latest: $BACKUP_AGE"
fi

# ============================================================================
# LOG CHECKS
# ============================================================================

print_header "Recent Errors"

echo "Recent Nginx Errors:"
sudo tail -3 /var/log/nginx/nazariy-api.error.log 2>/dev/null || echo "  No errors"

echo ""
echo "Recent Backend Errors:"
pm2 logs nazariy-api --lines=3 2>/dev/null | grep -i error || echo "  No errors"

# ============================================================================
# SUMMARY
# ============================================================================

print_header "Health Summary"

ALL_OK=true

# Check critical services
systemctl is-active --quiet nginx || ALL_OK=false
systemctl is-active --quiet mysql || ALL_OK=false
pm2 pid nazariy-api > /dev/null 2>&1 || ALL_OK=false

# Check connectivity
curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN_NAME/ 2>/dev/null | grep -q 200 || ALL_OK=false
curl -s -o /dev/null -w "%{http_code}" https://$API_DOMAIN/ 2>/dev/null | grep -q 200 || ALL_OK=false

if [ "$ALL_OK" = true ]; then
    echo -e "${GREEN}🎉 All systems operational!${NC}"
else
    echo -e "${RED}⚠️  Some issues detected. Check above.${NC}"
fi

echo ""
