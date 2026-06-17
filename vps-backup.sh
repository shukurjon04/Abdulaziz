#!/bin/bash

#################################################################################
# Database Backup Script for Nazariy VPS
# Automatic daily backups with retention
#################################################################################

# Configuration
BACKUP_DIR="/var/backups/database"
DB_USER="nazariy_user"
DB_NAME="nazariy"
RETENTION_DAYS=30  # Keep backups for 30 days
LOG_FILE="/var/log/nazariy-backup.log"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Function to log
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
    echo "$1"
}

log_message "=== Starting Database Backup ==="

# Read password from .env file
DB_PASSWORD=$(grep "DB_PASSWORD=" /var/www/nazariy-backend/.env | cut -d'=' -f2)

# Backup filename
BACKUP_FILE="${BACKUP_DIR}/nazariy-$(date +%Y%m%d-%H%M%S).sql"

# Create backup
if mysqldump -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" > "$BACKUP_FILE" 2>/dev/null; then
    BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    log_message "✅ Backup successful: $BACKUP_FILE ($BACKUP_SIZE)"

    # Compress backup
    gzip "$BACKUP_FILE"
    BACKUP_FILE="${BACKUP_FILE}.gz"
    BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    log_message "✅ Compressed: $BACKUP_FILE ($BACKUP_SIZE)"
else
    log_message "❌ Backup failed!"
    exit 1
fi

# Delete old backups (older than RETENTION_DAYS)
log_message "Cleaning up old backups (keeping last $RETENTION_DAYS days)..."
find "$BACKUP_DIR" -name "nazariy-*.sql.gz" -mtime +$RETENTION_DAYS -delete
log_message "✅ Cleanup complete"

# List recent backups
log_message "Recent backups:"
ls -lh "$BACKUP_DIR" | tail -5 | awk '{print "  " $9 " (" $5 ")"}'

log_message "=== Backup Finished Successfully ==="
log_message ""

exit 0
