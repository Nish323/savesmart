#!/bin/sh
set -e

# Laravelの準備
cd /var/www/html
php artisan config:clear

# PHP-FPMを起動
php-fpm -D

# ソケットファイルが作成されるまで待機
while [ ! -e /var/run/php/php-fpm.sock ]; do
    echo "Waiting for PHP-FPM socket file..."
    sleep 0.5
done
# ソケットファイルの権限を確保
chmod 777 /var/run/php/php-fpm.sock

echo "PHP-FPM socket ready."

# Nginxを起動
nginx -g "daemon off;"