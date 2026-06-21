#!/bin/sh
set -e

# Ensure envsubst is available
if ! command -v envsubst &> /dev/null; then
    echo "Installing gettext for envsubst..."
    apk add --no-cache gettext
fi

# Substitute environment variables in nginx config
envsubst '${DOMAIN}' < /etc/nginx/nginx.conf.tpl > /tmp/nginx.conf.tmp
mv /tmp/nginx.conf.tmp /etc/nginx/nginx.conf

# Test nginx config
nginx -t

# Start nginx
exec nginx -g "daemon off;"
