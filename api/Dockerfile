# Dockerfile de l'API Node.js / Express
FROM node:22-alpine
WORKDIR /app

# Prisma a besoin d'OpenSSL sur Alpine
RUN apk add --no-cache openssl

ENV NODE_ENV=production \
    PORT=3001

# Dépendances d'abord : cette couche est réutilisée tant que package*.json ne change pas
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Code de l'API
COPY --chown=node:node . .

# Génère le client Prisma à partir du schéma
RUN npx prisma generate

# L'utilisateur "node" est fourni par l'image : pas de droits root
USER node
EXPOSE 3001

# Vérifie régulièrement que l'API répond
HEALTHCHECK --interval=30s --timeout=3s --start-period=20s \
  CMD wget -qO- http://127.0.0.1:${PORT}/api/health || exit 1

# Applique les migrations, puis démarre l'API
CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
