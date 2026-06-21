#!/bin/bash

###############################################################################
# HTTPS Setup & SSL Certificate Script
# Automatically obtains SSL certificate and enables HTTPS
###############################################################################

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  HTTPS Setup & SSL Certificate Configuration               ║"
echo "║  Automatically obtains and enables HTTPS                   ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Load .env file
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Please run: cp .env.example .env"
    exit 1
fi

# Source .env
export $(cat .env | grep -v '#' | xargs)

DOMAIN=${DOMAIN:-example.com}
CERTBOT_EMAIL=${CERTBOT_EMAIL:-admin@example.com}

echo "📋 Configuration:"
echo "   Domain: $DOMAIN"
echo "   Email:  $CERTBOT_EMAIL"
echo ""

# Check if Docker containers are running
echo "🔍 Checking Docker containers..."
if ! docker compose ps 2>/dev/null | grep -q "nazariy_nginx"; then
    echo "❌ Nginx container not running!"
    echo "Please start containers first: docker compose up -d --build"
    exit 1
fi

echo "✓ Containers are running"
echo ""

# Check if certificate already exists
CERT_PATH="./certbot/conf/live/$DOMAIN"
if [ -d "$CERT_PATH" ] && [ -f "$CERT_PATH/fullchain.pem" ]; then
    echo "✓ Certificate already exists at: $CERT_PATH"
    CERT_EXISTS=1
else
    echo "⚠ Certificate not found. Attempting to request from Let's Encrypt..."
    CERT_EXISTS=0
fi

echo ""
echo "════════════════════════════════════════════════════════════"
echo "  Step 1: Request SSL Certificate from Let's Encrypt"
echo "════════════════════════════════════════════════════════════"
echo ""

if [ $CERT_EXISTS -eq 0 ]; then
    echo "⏳ Requesting SSL certificate..."
    echo "   This may take a few moments..."
    echo ""

    # Request certificate using webroot validation
    docker compose exec -T certbot certbot certonly \
        --webroot -w /var/www/certbot \
        -d "$DOMAIN" -d "www.$DOMAIN" \
        --non-interactive --agree-tos \
        --email "$CERTBOT_EMAIL" \
        --renew-before-expiry || {
        echo ""
        echo "⚠ Certificate request failed or rate limited"
        echo "This could be due to:"
        echo "  1. Domain DNS not pointing to this server"
        echo "  2. Rate limiting (max 50 requests per domain per week)"
        echo "  3. Port 80 not accessible"
        echo ""
        echo "Troubleshooting:"
        echo "  - Verify DNS: nslookup $DOMAIN"
        echo "  - Check port 80: sudo lsof -i :80"
        echo "  - View Certbot logs: docker compose logs certbot"
        echo ""
        echo "Continue anyway? (y/n)"
        read -r -n 1 response
        echo ""
        if [[ ! $response =~ ^[Yy]$ ]]; then
            exit 1
        fi
    }

    # Wait a moment for certificate to be written
    sleep 2

    # Verify certificate was created
    if [ ! -f "$CERT_PATH/fullchain.pem" ]; then
        echo "❌ Certificate file not found at: $CERT_PATH/fullchain.pem"
        echo ""
        echo "Certificate request may have failed. Check:"
        echo "  docker compose logs certbot"
        exit 1
    fi

    echo "✓ Certificate obtained successfully!"
else
    echo "✓ Using existing certificate"
fi

echo ""
echo "════════════════════════════════════════════════════════════"
echo "  Step 2: Update Nginx Configuration for HTTPS"
echo "════════════════════════════════════════════════════════════"
echo ""

# Backup current nginx.conf
if [ -f nginx.conf ]; then
    cp nginx.conf "nginx.conf.http.backup.$(date +%s)"
    echo "✓ Backup created: nginx.conf.http.backup.*"
fi

# Copy HTTPS config
if [ -f nginx.conf.https ]; then
    echo "📝 Applying HTTPS configuration..."
    cp nginx.conf.https nginx.conf
    echo "✓ HTTPS config applied"
else
    echo "❌ nginx.conf.https not found!"
    echo "Cannot enable HTTPS without config file"
    exit 1
fi

echo ""
echo "════════════════════════════════════════════════════════════"
echo "  Step 3: Restart Nginx with HTTPS"
echo "════════════════════════════════════════════════════════════"
echo ""

echo "🔄 Restarting Nginx container..."
docker compose restart nginx

# Wait for Nginx to restart
echo "⏳ Waiting for Nginx to restart (10 seconds)..."
sleep 10

# Check Nginx status
if docker compose ps | grep nazariy_nginx | grep -q "Up"; then
    echo "✓ Nginx is running"
else
    echo "❌ Nginx failed to start!"
    echo "Check logs: docker compose logs nginx"
    exit 1
fi

echo ""
echo "════════════════════════════════════════════════════════════"
echo "  Step 4: Verify HTTPS Configuration"
echo "════════════════════════════════════════════════════════════"
echo ""

# Test HTTPS endpoint
echo "🔍 Testing HTTPS connection..."
if curl -s -I --insecure "https://127.0.0.1/health" >/dev/null 2>&1; then
    echo "✓ HTTPS endpoint responding"
else
    echo "⚠ HTTPS endpoint not responding yet"
    echo "This may take a moment to initialize"
fi

echo ""
echo "════════════════════════════════════════════════════════════"
echo "  ✅ HTTPS SETUP COMPLETE!"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "🌐 Your application is now available at:"
echo "   https://$DOMAIN"
echo "   https://www.$DOMAIN"
echo "   API: https://$DOMAIN/api"
echo ""
echo "🔒 SSL Certificate Information:"
docker compose exec -T certbot certbot certificates 2>/dev/null | grep -A 5 "$DOMAIN" || echo "   Use: docker compose exec certbot certbot certificates"
echo ""

echo "📝 Next Steps:"
echo "   1. Test in browser: https://$DOMAIN"
echo "   2. Set up automatic renewal (see below)"
echo "   3. Monitor certificate expiration"
echo ""

echo "🔄 Automatic Certificate Renewal Setup:"
echo ""
echo "   Option A: Using Cron Job"
echo "   ═════════════════════════"
echo "   crontab -e"
echo ""
echo "   Add this line:"
echo "   0 2 * * * cd $SCRIPT_DIR && docker compose exec -T certbot certbot renew && docker compose exec -T nginx nginx -s reload"
echo ""
echo "   This will:"
echo "   - Check for certificate renewal daily at 2:00 AM"
echo "   - Automatically renew if certificate expires in <30 days"
echo "   - Reload Nginx to apply new certificate"
echo ""

echo "   Option B: Using Systemd Timer"
echo "   ══════════════════════════════"
echo "   See HTTPS-RENEWAL.md for detailed instructions"
echo ""

echo "✅ HTTPS is now ENABLED!"
echo ""
echo "To disable HTTPS (revert to HTTP):"
echo "   cp nginx.conf.http.backup.* nginx.conf"
echo "   docker compose restart nginx"
echo ""
