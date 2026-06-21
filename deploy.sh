#!/bin/bash

###############################################################################
#  Nazariy Project - One-Step Deployment Script
#  This script sets up and deploys the entire application
###############################################################################

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Nazariy Project - Deployment Script                       ║"
echo "║  Full Stack: Backend + Frontend + Database + Nginx + SSL   ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first:"
    echo "   https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install it first:"
    echo "   https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📋 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env with your configuration:"
    echo "   nano .env"
    echo ""
    echo "Required settings:"
    echo "   - DOMAIN=your-domain.com"
    echo "   - CERTBOT_EMAIL=admin@your-domain.com"
    echo "   - MYSQL_ROOT_PASSWORD=strong_password"
    echo "   - MYSQL_PASSWORD=strong_password"
    echo "   - JWT_SECRET=random_string_32_chars_or_more"
    echo ""
    echo "Then run this script again."
    exit 0
fi

echo "✅ Configuration file exists"

# Verify required variables
REQUIRED_VARS=("DOMAIN" "CERTBOT_EMAIL" "MYSQL_ROOT_PASSWORD" "MYSQL_PASSWORD" "JWT_SECRET")
MISSING_VARS=()

for var in "${REQUIRED_VARS[@]}"; do
    if ! grep -q "^${var}=" .env || grep -q "^${var}=example\|^${var}=your_\|^${var}=change_me\|^${var}=YOUR_\|^${var}=generate_"; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
    echo ""
    echo "❌ Missing or incomplete configuration in .env:"
    for var in "${MISSING_VARS[@]}"; do
        echo "   - $var"
    done
    echo ""
    echo "Please edit .env and fill in all required values:"
    echo "   nano .env"
    echo ""
    echo "Then run this script again."
    exit 1
fi

echo ""
echo "════════════════════════════════════════════════════════════"
echo "  Starting Deployment..."
echo "════════════════════════════════════════════════════════════"
echo ""

# Get domain from .env
DOMAIN=$(grep "^DOMAIN=" .env | cut -d'=' -f2)
echo "📌 Domain: $DOMAIN"
echo ""

# Check if ports are available
echo "🔍 Checking if ports 80 and 443 are available..."
if lsof -i :80 &>/dev/null || lsof -i :443 &>/dev/null; then
    echo "⚠️  Warning: Ports 80 and/or 443 may already be in use"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Deployment cancelled"
        exit 1
    fi
fi

echo "✅ Port check complete"
echo ""

# Start Docker services
echo "🐳 Starting Docker containers..."
echo ""

docker compose up -d --build

if [ $? -ne 0 ]; then
    echo "❌ Failed to start Docker containers"
    exit 1
fi

echo ""
echo "✅ Docker containers started"
echo ""

# Wait for services to initialize
echo "⏳ Waiting for services to initialize (30-60 seconds)..."
sleep 5

# Check service status
echo ""
echo "🔍 Checking service status..."
docker compose ps

echo ""
echo "⏳ Waiting a bit more for database and services to be ready..."
sleep 10

# Health checks
echo ""
echo "🏥 Running health checks..."
echo ""

# Check if nginx is responding
if curl -s -k https://localhost/health &>/dev/null; then
    echo "✅ Nginx is responding"
else
    echo "⚠️  Nginx not responding yet (this is normal if services are still starting)"
fi

# Check Docker logs for errors
echo ""
echo "📝 Recent logs (check for errors):"
docker compose logs --tail 20

echo ""
echo "════════════════════════════════════════════════════════════"
echo "  ✅ Deployment Complete!"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "🌐 Your application is starting up..."
echo ""
echo "📍 Access your application at:"
echo "   Frontend: https://$DOMAIN"
echo "   API:      https://$DOMAIN/api"
echo "   Health:   https://$DOMAIN/health"
echo ""
echo "⏳ Note: SSL certificate generation may take a few minutes"
echo "   Check status with: docker compose logs certbot"
echo ""
echo "📚 Full documentation:"
echo "   - Setup guide:     SETUP.md"
echo "   - Verification:    DEPLOYMENT-CHECKLIST.md"
echo "   - Troubleshooting: See SETUP.md 'Troubleshooting' section"
echo ""
echo "🔍 Monitor the deployment:"
echo "   docker compose logs -f"
echo ""
echo "🛑 To stop the application:"
echo "   docker compose stop"
echo ""
echo "🔄 To restart the application:"
echo "   docker compose start"
echo ""
echo "════════════════════════════════════════════════════════════"
echo ""
echo "✓ Deployment script finished successfully!"
echo ""
