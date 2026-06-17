#!/bin/bash

#################################################################################
# VPS Deploy Script - Automated Frontend + Backend Deploy with SSL
# Author: Nazariy Team
# Usage: bash vps-deploy-auto.sh
#################################################################################

set -e  # Exit on error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variables (CHANGE THESE!)
DOMAIN_NAME="${DOMAIN_NAME:-example.com}"
API_DOMAIN="${API_DOMAIN:-api.example.com}"
GITHUB_REPO="${GITHUB_REPO:-YOUR_GITHUB_REPO_URL}"
DB_PASSWORD="${DB_PASSWORD:-GenerateRandomPassword}"
JWT_SECRET="${JWT_SECRET:-$(openssl rand -hex 32)}"
TELEGRAM_BOT_TOKEN="${TELEGRAM_BOT_TOKEN:-your_bot_token}"
SUPER_ADMIN_TG_ID="${SUPER_ADMIN_TG_ID:-your_tg_id}"
EMAIL_FOR_SSL="${EMAIL_FOR_SSL:-your-email@example.com}"

#################################################################################
# Functions
#################################################################################

print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

check_root() {
    if [[ $EUID -ne 0 ]]; then
        print_error "This script must be run as root!"
        exit 1
    fi
}

check_requirements() {
    print_header "Checking Requirements"

    if ! command -v curl &> /dev/null; then
        print_error "curl not found"
        exit 1
    fi

    if ! command -v git &> /dev/null; then
        print_error "git not found"
        exit 1
    fi

    print_success "All requirements found"
}

update_system() {
    print_header "Updating System"

    apt update
    apt upgrade -y

    print_success "System updated"
}

install_dependencies() {
    print_header "Installing Dependencies"

    apt install -y \
        curl wget git nodejs npm nginx mysql-server \
        certbot python3-certbot-nginx openssl build-essential

    print_success "Dependencies installed"
}

setup_node_lts() {
    print_header "Setting up Node.js LTS"

    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)

    if [ "$NODE_VERSION" -lt 18 ]; then
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        apt install -y nodejs
    fi

    print_success "Node.js $(node -v) installed"
}

create_webapp_user() {
    print_header "Creating webapp user"

    if ! id -u webapp &>/dev/null; then
        useradd -m -s /bin/bash webapp
        print_success "webapp user created"
    else
        print_info "webapp user already exists"
    fi
}

setup_frontend() {
    print_header "Setting up Frontend"

    FRONTEND_DIR="/var/www/nazariy-web"

    mkdir -p $FRONTEND_DIR
    cd $FRONTEND_DIR

    git clone "$GITHUB_REPO" . || print_info "Repo already cloned"

    chown -R webapp:webapp $FRONTEND_DIR

    cd nazariy-web
    npm install

    # Create .env
    cat > .env << EOF
VITE_API_URL=https://${API_DOMAIN}
VITE_TELEGRAM_BOT_ID=$(echo $TELEGRAM_BOT_TOKEN | cut -d':' -f1)
EOF

    npm run build

    print_success "Frontend built successfully"
}

setup_backend() {
    print_header "Setting up Backend"

    BACKEND_DIR="/var/www/nazariy-backend"

    mkdir -p $BACKEND_DIR
    cd $BACKEND_DIR

    git clone "$GITHUB_REPO" . || print_info "Repo already cloned"

    chown -R webapp:webapp $BACKEND_DIR

    cd $BACKEND_DIR
    npm install
    npm install --production

    # Create .env
    cat > .env << EOF
NODE_ENV=production
PORT=4000
HOST=127.0.0.1

DB_HOST=localhost
DB_PORT=3306
DB_USER=nazariy_user
DB_PASSWORD=$DB_PASSWORD
DB_NAME=nazariy

JWT_SECRET=$JWT_SECRET
JWT_EXPIRES_IN=7d

TELEGRAM_BOT_TOKEN=$TELEGRAM_BOT_TOKEN
SUPER_ADMIN_TG_ID=$SUPER_ADMIN_TG_ID

FRONTEND_ORIGIN=https://${DOMAIN_NAME}

MAX_FILE_SIZE=10485760
UPLOAD_DIR=${BACKEND_DIR}/uploads

LOG_LEVEL=info
LOG_FILE=/var/log/nazariy-backend.log
EOF

    # Create uploads directory
    mkdir -p uploads
    chown -R www-data:www-data uploads
    chmod 755 uploads

    print_success "Backend setup complete"
}

setup_mysql() {
    print_header "Setting up MySQL Database"

    systemctl start mysql
    systemctl enable mysql

    # Create database
    mysql -u root -e "CREATE DATABASE IF NOT EXISTS nazariy CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null || true

    # Create user
    mysql -u root -e "CREATE USER IF NOT EXISTS 'nazariy_user'@'localhost' IDENTIFIED BY '$DB_PASSWORD';" 2>/dev/null || true
    mysql -u root -e "GRANT ALL PRIVILEGES ON nazariy.* TO 'nazariy_user'@'localhost';" 2>/dev/null || true
    mysql -u root -e "FLUSH PRIVILEGES;" 2>/dev/null || true

    # Migrate schema
    BACKEND_DIR="/var/www/nazariy-backend"
    if [ -f "$BACKEND_DIR/src/schema.sql" ]; then
        mysql -u nazariy_user -p"$DB_PASSWORD" nazariy < "$BACKEND_DIR/src/schema.sql" 2>/dev/null || true
        print_success "Database schema created"
    fi

    print_success "MySQL configured"
}

setup_pm2() {
    print_header "Setting up PM2 Process Manager"

    npm install -g pm2
    pm2 completion install

    cd /var/www/nazariy-backend
    pm2 start src/server.js --name "nazariy-api" --instances max
    pm2 startup systemd -u www-data --hp /var/www
    pm2 save

    print_success "PM2 configured with auto-restart"
}

setup_nginx_frontend() {
    print_header "Setting up Nginx for Frontend"

    cat > /etc/nginx/sites-available/nazariy-web << 'EOF'
# HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name DOMAIN_NAME www.DOMAIN_NAME;

    location /.well-known/acme-challenge/ {
        root /var/www/letsencrypt;
    }

    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name DOMAIN_NAME www.DOMAIN_NAME;

    ssl_certificate /etc/letsencrypt/live/DOMAIN_NAME/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/DOMAIN_NAME/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

    access_log /var/log/nginx/nazariy-web.access.log;
    error_log /var/log/nginx/nazariy-web.error.log;

    root /var/www/nazariy-web/nazariy-web/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    gzip on;
    gzip_types text/html text/plain text/css text/xml text/javascript application/javascript;
    gzip_min_length 1000;
}
EOF

    sed -i "s/DOMAIN_NAME/$DOMAIN_NAME/g" /etc/nginx/sites-available/nazariy-web

    ln -sf /etc/nginx/sites-available/nazariy-web /etc/nginx/sites-enabled/ 2>/dev/null || true

    print_success "Nginx frontend config created"
}

setup_nginx_backend() {
    print_header "Setting up Nginx for Backend API"

    cat > /etc/nginx/sites-available/nazariy-api << 'EOF'
# HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name API_DOMAIN;

    location /.well-known/acme-challenge/ {
        root /var/www/letsencrypt;
    }

    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS API
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name API_DOMAIN;

    ssl_certificate /etc/letsencrypt/live/API_DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/API_DOMAIN/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    add_header Strict-Transport-Security "max-age=31536000" always;

    access_log /var/log/nginx/nazariy-api.access.log;
    error_log /var/log/nginx/nazariy-api.error.log;

    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=30r/m;
    limit_req zone=api_limit burst=100 nodelay;

    client_max_body_size 10M;

    location / {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_connect_timeout 60s;
        proxy_read_timeout 60s;
    }

    gzip on;
    gzip_types application/json text/plain;
}
EOF

    sed -i "s/API_DOMAIN/$API_DOMAIN/g" /etc/nginx/sites-available/nazariy-api

    ln -sf /etc/nginx/sites-available/nazariy-api /etc/nginx/sites-enabled/ 2>/dev/null || true

    print_success "Nginx backend config created"
}

test_nginx_config() {
    print_header "Testing Nginx Configuration"

    if nginx -t 2>&1; then
        print_success "Nginx config is valid"
    else
        print_error "Nginx config has errors!"
        exit 1
    fi
}

setup_ssl_directories() {
    print_header "Creating SSL verification directories"

    mkdir -p /var/www/letsencrypt
    chmod -R 755 /var/www/letsencrypt

    print_success "SSL directories created"
}

setup_ssl_certificates() {
    print_header "Setting up Let's Encrypt SSL Certificates"

    systemctl restart nginx

    # Frontend certificate
    print_info "Getting certificate for $DOMAIN_NAME..."
    certbot certonly --webroot \
        -w /var/www/letsencrypt \
        -d "$DOMAIN_NAME" \
        -d "www.$DOMAIN_NAME" \
        --agree-tos \
        --no-eff-email \
        -m "$EMAIL_FOR_SSL" \
        --non-interactive \
        --force-renewal 2>/dev/null || print_info "Certificate already exists or error"

    # Backend certificate
    print_info "Getting certificate for $API_DOMAIN..."
    certbot certonly --webroot \
        -w /var/www/letsencrypt \
        -d "$API_DOMAIN" \
        --agree-tos \
        --no-eff-email \
        -m "$EMAIL_FOR_SSL" \
        --non-interactive \
        --force-renewal 2>/dev/null || print_info "Certificate already exists or error"

    # Enable certbot auto-renewal
    systemctl enable certbot.timer
    systemctl start certbot.timer

    print_success "SSL certificates configured"
}

setup_firewall() {
    print_header "Setting up Firewall (UFW)"

    if command -v ufw &> /dev/null; then
        ufw --force enable
        ufw allow 22/tcp
        ufw allow 80/tcp
        ufw allow 443/tcp
        print_success "Firewall configured"
    else
        print_info "UFW not available, skipping"
    fi
}

setup_cron_backup() {
    print_header "Setting up Automatic Database Backups"

    mkdir -p /var/backups/database

    # Add cron job for daily backup
    (crontab -l 2>/dev/null | grep -v nazariy; echo "0 2 * * * mysqldump -u nazariy_user -p'$DB_PASSWORD' nazariy > /var/backups/database/nazariy-\$(date +\%Y\%m\%d).sql") | crontab -

    print_success "Database backup cron job added (daily at 2 AM)"
}

final_setup() {
    print_header "Final Setup"

    # Restart Nginx with SSL
    systemctl restart nginx

    # Verify PM2 is running
    pm2 list

    print_success "Final setup complete"
}

print_summary() {
    print_header "DEPLOYMENT SUMMARY"

    echo -e "Frontend: ${GREEN}https://${DOMAIN_NAME}${NC}"
    echo -e "API: ${GREEN}https://${API_DOMAIN}${NC}"
    echo -e "Database: ${GREEN}MySQL (nazariy_user)${NC}"
    echo -e "Process Manager: ${GREEN}PM2${NC}"
    echo -e "Web Server: ${GREEN}Nginx${NC}"
    echo -e "SSL: ${GREEN}Let's Encrypt (auto-renewal)${NC}"

    echo -e "\n${YELLOW}Next steps:${NC}"
    echo "1. Update DNS records:"
    echo "   A record: $DOMAIN_NAME → YOUR_VPS_IP"
    echo "   A record: www.$DOMAIN_NAME → YOUR_VPS_IP"
    echo "   A record: $API_DOMAIN → YOUR_VPS_IP"
    echo ""
    echo "2. Wait 5-30 minutes for DNS propagation"
    echo ""
    echo "3. Test:"
    echo "   curl -I https://${DOMAIN_NAME}"
    echo "   curl -I https://${API_DOMAIN}"
    echo ""
    echo "4. Check logs:"
    echo "   pm2 logs nazariy-api"
    echo "   sudo tail -f /var/log/nginx/nazariy-web.access.log"
    echo ""
    echo "5. Useful commands:"
    echo "   pm2 list              # Check backend status"
    echo "   pm2 logs              # View backend logs"
    echo "   pm2 restart all       # Restart all apps"
    echo "   sudo systemctl reload nginx  # Reload frontend"
    echo "   certbot renew --dry-run      # Test SSL renewal"

    echo ""
    print_success "Deployment Complete! 🎉"
}

#################################################################################
# Main Execution
#################################################################################

main() {
    print_header "VPS DEPLOYMENT SCRIPT"

    echo "Configuration:"
    echo "  Domain: $DOMAIN_NAME"
    echo "  API Domain: $API_DOMAIN"
    echo "  Email: $EMAIL_FOR_SSL"
    echo "  GitHub: $GITHUB_REPO"
    echo ""
    read -p "Continue with these settings? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_error "Aborted"
        exit 1
    fi

    check_root
    check_requirements
    update_system
    install_dependencies
    setup_node_lts
    create_webapp_user
    setup_frontend
    setup_backend
    setup_mysql
    setup_pm2
    setup_nginx_frontend
    setup_nginx_backend
    test_nginx_config
    setup_ssl_directories
    setup_ssl_certificates
    setup_firewall
    setup_cron_backup
    final_setup
    print_summary
}

# Run main function
main "$@"
