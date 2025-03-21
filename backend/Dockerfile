FROM php:8.3-fpm

# カスタム php.ini を追加する（ファイル名は任意ですが、わかりやすくするため custom.ini とする）
COPY docker/php/php.ini /usr/local/etc/php/conf.d/custom.ini

# 必要なパッケージをインストール
RUN apt-get update && apt-get install -y \
    libzip-dev zip unzip \
    && docker-php-ext-install zip pdo_mysql mysqli \
    && docker-php-ext-enable opcache

# Composer をインストール
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 作業ディレクトリ
WORKDIR /var/www/html

# Laravel のコードをコンテナにコピー
COPY . /var/www/html

# Laravel の依存関係をインストール
RUN composer install --no-dev --optimize-autoloader

# キャッシュ最適化
RUN php artisan config:cache && php artisan route:cache

# ポートを設定
EXPOSE 9000

CMD ["php-fpm"]