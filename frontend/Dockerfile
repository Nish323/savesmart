# Frontend Production Dockerfile for Cloud Run

# === 1) Build stage ===
FROM node:20-alpine AS builder
WORKDIR /app

# Build-time environment variables for client URL configuration
ARG NEXT_PUBLIC_API_URL_CLIENT
ARG NEXT_PUBLIC_API_URL_SERVER
ARG NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_API_URL_CLIENT=${NEXT_PUBLIC_API_URL_CLIENT}
ENV NEXT_PUBLIC_API_URL_SERVER=${NEXT_PUBLIC_API_URL_SERVER}
ENV NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copy source and build
COPY . .
RUN npm run build

# === 2) Runtime stage ===
FROM node:20-alpine AS runner
WORKDIR /app

# Copy build output and package files
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Only install production dependencies
RUN npm install --only=production --legacy-peer-deps

# Expose Cloud Run default port
ENV PORT=8080
EXPOSE 8080

# Start Next.js in production
CMD ["npx", "next", "start", "-p", "8080"]