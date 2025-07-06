# --- Builder Stage ---
  FROM php:8.3-fpm AS builder
  RUN apt-get update \
    && apt-get install -y zip unzip libzip-dev libpng-dev libonig-dev libxml2-dev \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl gd zip opcache bcmath \
    && rm -rf /var/lib/apt/lists/*
  WORKDIR /var/www/html
  COPY composer.json composer.lock ./
  COPY database/ database/
  RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
    && php composer-setup.php --install-dir=/usr/bin --filename=composer \
    && composer install --no-dev --no-scripts --optimize-autoloader \
    && composer clear-cache
  COPY . .
  RUN composer dump-autoload --optimize
  
 # --- Final Stage ---
  FROM php:8.3-fpm

  RUN apt-get update \
    && apt-get install -y \
      nginx \
      default-mysql-client \
      libzip-dev \
      libpng-dev \
      libonig-dev \
      libxml2-dev \
    && docker-php-ext-install pdo_mysql \
    && rm -rf /var/lib/apt/lists/*
  
   WORKDIR /var/www/html
   COPY --from=builder /var/www/html .
  
   # Nginxの設定ファイルをコピー
   COPY docker/nginx/production/nginx.conf /etc/nginx/conf.d/default.conf
  
   # PHP-FPM のソケット設定
   RUN sed -i 's/listen = 9000/listen = \/var\/run\/php\/php-fpm.sock/' \
       /usr/local/etc/php-fpm.d/zz-docker.conf
  
   # 起動スクリプトをコピーして実行権限を付与
   COPY start.sh /usr/local/bin/start.sh
   RUN chmod +x /usr/local/bin/start.sh
  
   # パーミッション設定
   RUN mkdir -p /var/run/php \
     && chown -R www-data:www-data /var/www/html /var/run/php /var/log/nginx \
     && find /var/www/html -type d -exec chmod 775 {} \; \
     && find /var/www/html -type f -exec chmod 664 {} \;
  
   EXPOSE 8080
   CMD ["start.sh"]
  
  