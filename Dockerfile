# syntax=docker/dockerfile:1

# ─── Étape 1 : dépendances + génération du client Prisma ────────────────────
FROM node:24-alpine AS deps
WORKDIR /app

# Installe toutes les dépendances (tsx et prisma sont nécessaires au runtime/build)
COPY package.json package-lock.json ./
RUN npm ci

# Génère le client Prisma à partir du schéma
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN npx prisma generate

# ─── Étape 2 : image d'exécution ────────────────────────────────────────────
FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Récupère les dépendances et le client Prisma généré
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/src/generated ./src/generated

# Code applicatif
COPY package.json tsconfig.json prisma.config.ts ./
COPY prisma ./prisma
COPY src ./src

# Exécution en utilisateur non privilégié
USER node

EXPOSE 3000

# L'application est lancée via tsx (les alias @/* sont résolus via tsconfig)
CMD ["npm", "run", "start:prod"]
