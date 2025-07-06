#!/bin/sh
set -e

# プロジェクトのルートディレクトリに移動
cd /var/www/html

#【重要】実行前に設定キャッシュをクリア
php artisan config:clear

# マイグレーションを実行
php artisan migrate --force

#【追加】データベースのシーディングを実行
php artisan db:seed --force

echo "Migration and Seeding commands executed successfully."