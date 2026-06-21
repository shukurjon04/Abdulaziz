#!/bin/bash

###############################################################################
# SSL Certificate Auto-Renewal Script
# Run daily via cron to automatically renew expiring certificates
# Add to crontab: 0 2 * * * /path/to/renew-ssl.sh
###############################################################################

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOGFILE="/var/log/ssl-renewal.log"

# Create log directory if it doesn't exist
mkdir -p "$(dirname "$LOGFILE")"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOGFILE"
}

log "════════════════════════════════════════════════════════════"
log "SSL Certificate Renewal Check Started"
log "════════════════════════════════════════════════════════════"

# Navigate to project directory
cd "$SCRIPT_DIR" || {
    log "ERROR: Could not change to project directory: $SCRIPT_DIR"
    exit 1
}

# Check if .env exists
if [ ! -f .env ]; then
    log "ERROR: .env file not found at $SCRIPT_DIR/.env"
    exit 1
fi

# Load environment variables
export $(grep -v '^#' .env | xargs)

DOMAIN=${DOMAIN:-example.com}

log "Domain: $DOMAIN"
log "Checking certificate status..."

# Check if Docker is running
if ! command -v docker &> /dev/null; then
    log "ERROR: Docker is not installed or not in PATH"
    exit 1
fi

# Check if containers are running
if ! docker compose ps 2>/dev/null | grep -q "nazariy_nginx"; then
    log "WARNING: Nginx container not running. Skipping renewal check."
    exit 0
fi

log "Containers are running. Proceeding with renewal check..."

# Check certificate expiration
CERT_PATH="./certbot/conf/live/$DOMAIN"
if [ -f "$CERT_PATH/fullchain.pem" ]; then
    # Get expiration date
    EXPIRY=$(openssl x509 -enddate -noout -in "$CERT_PATH/fullchain.pem" 2>/dev/null | cut -d= -f2)
    log "Certificate expiry date: $EXPIRY"

    # Check if certificate expires in less than 30 days
    EXPIRY_EPOCH=$(date -d "$EXPIRY" +%s 2>/dev/null || echo 0)
    NOW_EPOCH=$(date +%s)
    DAYS_LEFT=$(( ($EXPIRY_EPOCH - $NOW_EPOCH) / 86400 ))

    log "Days until expiration: $DAYS_LEFT"

    if [ $DAYS_LEFT -lt 30 ]; then
        log "Certificate expires in less than 30 days. Attempting renewal..."
    else
        log "Certificate is still valid. No renewal needed."
        log "Renewal check completed successfully."
        exit 0
    fi
else
    log "WARNING: Certificate file not found at $CERT_PATH/fullchain.pem"
fi

# Attempt certificate renewal
log "Running Certbot renewal..."
if docker compose exec -T certbot certbot renew \
    --webroot -w /var/www/certbot \
    --quiet 2>&1 | tee -a "$LOGFILE"; then
    log "✓ Certificate renewal check completed"
else
    log "⚠ Certificate renewal returned a status"
fi

# Reload Nginx to apply new certificate
log "Reloading Nginx configuration..."
if docker compose exec -T nginx nginx -s reload 2>&1 | tee -a "$LOGFILE"; then
    log "✓ Nginx reloaded successfully"
else
    log "⚠ Nginx reload completed"
fi

# Final verification
log "Final certificate status:"
if [ -f "$CERT_PATH/fullchain.pem" ]; then
    FINAL_EXPIRY=$(openssl x509 -enddate -noout -in "$CERT_PATH/fullchain.pem" 2>/dev/null | cut -d= -f2)
    log "Certificate valid until: $FINAL_EXPIRY"
fi

log "✓ SSL Renewal Script Completed Successfully"
log "════════════════════════════════════════════════════════════"
