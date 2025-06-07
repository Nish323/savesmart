# 開発用 Dockerfile（ホットリロード前提）
FROM node:20.12.2

WORKDIR /app

# JSTに設定
RUN ln -sf /usr/share/zoneinfo/Asia/Tokyo /etc/localtime \
    && echo "Asia/Tokyo" > /etc/timezone
		
# パッケージファイルだけ先にコピー（キャッシュ効かせるため）
COPY package.json package-lock.json ./

# 依存関係インストール（ホスト側のnode_modulesと分離）
RUN npm install --legacy-peer-deps

EXPOSE 3000

# 開発モードで起動
CMD ["npm", "run", "dev"]