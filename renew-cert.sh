#!/bin/bash

# SSL sertifikatlarni yangilash skripti
# Bu skript har 12 soatda ishga tushadi

docker compose exec -T certbot certbot renew --quiet

if [ $? -eq 0 ]; then
    echo "Sertifikatlar yangilandi: $(date)" >> /var/log/nazariy-ssl-renewal.log
    # Nginx ni qayta yuklash
    docker compose exec -T nginx nginx -s reload
else
    echo "Sertifikat yangilashda xatolik: $(date)" >> /var/log/nazariy-ssl-renewal.log
fi
