#!/bin/sh
# Set -e to exit on any error, but we'll handle some gracefully
set -e

# Load environment variables from .env if available
if [ -f /etc/nginx/.env ]; then
    set -a
    . /etc/nginx/.env
    set +a
fi

# Set defaults if not set
DOMAIN=${DOMAIN:-example.com}

echo "Configuring Nginx for domain: $DOMAIN"

# Ensure envsubst is available
if ! command -v envsubst &> /dev/null; then
    echo "Installing gettext for envsubst..."
    apk add --no-cache gettext 2>&1 | grep -v "^WARNING:"
fi

# Create self-signed certificate if certificates directory is empty
CERT_DIR="/etc/letsencrypt/live/${DOMAIN}"
CERT_FILE="$CERT_DIR/fullchain.pem"

if [ ! -f "$CERT_FILE" ]; then
    echo "No valid certificate found at $CERT_FILE"
    echo "Creating temporary self-signed certificate for domain: $DOMAIN"

    mkdir -p "$CERT_DIR" || echo "Note: Directory may already exist"

    # Create certificates if they don't exist
    if [ ! -f "$CERT_DIR/fullchain.pem" ]; then
        echo "Generating self-signed certificate..."
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout "$CERT_DIR/privkey.pem" \
            -out "$CERT_DIR/fullchain.pem" \
            -subj "/CN=${DOMAIN}" 2>&1 | grep -v "^WARNING:" || true

        # Verify certificate was created
        if [ -f "$CERT_DIR/fullchain.pem" ]; then
            echo "✓ Self-signed certificate created"
        else
            echo "⚠ Warning: Could not create certificate file"
        fi
    fi
fi

# Substitute environment variables in nginx config
echo "Applying domain configuration: ${DOMAIN}"
envsubst '${DOMAIN}' < /etc/nginx/nginx.conf.tpl > /tmp/nginx.conf
chmod 644 /tmp/nginx.conf
mv /tmp/nginx.conf /etc/nginx/nginx.conf

# Test nginx config
echo "Testing Nginx configuration..."
if ! nginx -t 2>&1; then
    echo "⚠ Nginx config test produced warnings or errors"
    echo "Attempting to start Nginx anyway..."
fi

echo "✓ Starting Nginx..."
exec nginx -g "daemon off;"
