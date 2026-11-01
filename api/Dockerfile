# Étape 1 : Builder
FROM node:22-alpine AS builder
WORKDIR /app
RUN apk add --no-cache openssl
COPY package.json package-lock.json ./
COPY prisma ./prisma/
RUN npm ci
RUN npx prisma generate

# Étape 2 : Runner (Image finale ultra-légère)
FROM node:22-alpine AS runner
WORKDIR /app
RUN apk add --no-cache openssl
ENV NODE_ENV=production \
    PORT=3001

# On ne copie que le nécessaire pour l'exécution
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY . .

# Suppression des fichiers inutiles pour la prod (tests, etc.)
RUN rm -rf tests

USER node
EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=3s --start-period=20s \
  CMD wget -qO- http://127.0.0.1:${PORT}/api/health || exit 1

CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
