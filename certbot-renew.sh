#!/bin/bash

###############################################################################
# SSL Certificate Auto-Renewal Script
# Runs daily to renew Let's Encrypt certificates
# Add to crontab: 0 2 * * * /path/to/certbot-renew.sh
###############################################################################

LOGFILE="/var/log/certbot-renew.log"

echo "$(date '+%Y-%m-%d %H:%M:%S') - Starting certificate renewal check..." >> $LOGFILE

# Navigate to docker-compose directory
cd /path/to/your/project || exit 1

# Renew certificates
docker compose exec -T certbot certbot renew --webroot -w /var/www/certbot --quiet >> $LOGFILE 2>&1

# Reload Nginx if renewal was successful
if [ $? -eq 0 ]; then
    echo "$(date '+%Y-%m-%d %H:%M:%S') - Certificate renewal successful, reloading Nginx..." >> $LOGFILE
    docker compose exec -T nginx nginx -s reload >> $LOGFILE 2>&1
else
    echo "$(date '+%Y-%m-%d %H:%M:%S') - Certificate renewal check completed or no renewal needed" >> $LOGFILE
fi

echo "$(date '+%Y-%m-%d %H:%M:%S') - Renewal check finished" >> $LOGFILE
