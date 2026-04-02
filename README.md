# CESIZEN-API

Backend REST API de l'application CESIZen.

## Stack technique

| Technologie     | Version | Role                        |
| --------------- | ------- | --------------------------- |
| Node.js         | >= 20.x | Runtime                     |
| TypeScript      | 5.9.3   | Langage                     |
| Express         | 5.2.1   | Framework HTTP              |
| Prisma          | 7.2.0   | ORM                         |
| PostgreSQL      | 16.1    | Base de donnees             |
| JWT             | 9.0.3   | Authentification            |
| Zod             | 4.3.6   | Validation des donnees      |
| Swagger/OpenAPI | 3.0.3   | Documentation API           |
| Docker          | —       | Conteneurisation PostgreSQL |

## Prerequis

- Node.js >= 20.x
- npm >= 10.x
- Docker Desktop (pour PostgreSQL)

## Installation

### 1. Cloner le depot et se placer dans le dossier

```bash
cd CESIZEN-API
```

### 2. Installer les dependances

```bash
npm install
```

### 3. Configurer les variables d'environnement

Copier le fichier d'exemple et le completer :

```bash
cp .env.example .env
```

Editer `.env` avec les valeurs suivantes :

```env
# Serveur
PORT=3000
NODE_ENV=development

# Base de donnees Docker
DOCKER_DATABASE_PORT=5432
DOCKER_DATABASE_NAME=cesizen
DOCKER_DATABASE_USERNAME=cesizen
DOCKER_DATABASE_PASSWORD=cesizen

# URL de connexion Prisma
DATABASE_URL=postgresql://cesizen:cesizen@localhost:5432/cesizen?schema=public

# JWT — generer des secrets forts (ex: openssl rand -hex 64)
JWT_ACCESS_SECRET=votre_secret_access
JWT_REFRESH_SECRET=votre_secret_refresh

# Duree de vie des tokens (ex: "15m", "7d")
JWT_ACCESS_TOKEN_TTL=15m
JWT_REFRESH_TOKEN_TTL=7d
```

> **Astuce** : pour generer des secrets JWT securises :
>
> ```bash
> openssl rand -hex 64
> ```

### 4. Demarrer la base de donnees PostgreSQL

```bash
npm run dk:start
```

Cette commande lance un conteneur Docker PostgreSQL 16.1 avec les parametres definis dans `.env`.

Verifier que le conteneur tourne :

```bash
docker ps
```

Vous devez voir un conteneur `cesizen` ou similaire sur le port `5432`.

### 5. Initialiser la base de donnees

```bash
npm run db:init
```

Cette commande execute en sequence :

1. `db:push` — applique le schema Prisma a la base de donnees
2. `db:seed` — insere les donnees initiales (emotions de base, emotions detaillees, etc.)

### 6. Demarrer le serveur en developpement

```bash
npm run dev
```

Le serveur demarre sur `http://localhost:3000`.

La documentation Swagger est accessible sur `http://localhost:3000/api/docs`.

---

## Scripts disponibles

| Commande            | Description                                                      |
| ------------------- | ---------------------------------------------------------------- |
| `npm run dev`       | Demarre le serveur avec rechargement automatique (nodemon + tsx) |
| `npm start`         | Demarre le serveur en production                                 |
| `npm run dk:start`  | Lance le conteneur Docker PostgreSQL                             |
| `npm run db:init`   | Initialise la BDD (push schema + seed)                           |
| `npm run db:push`   | Applique le schema Prisma sans migration                         |
| `npm run db:seed`   | Insere les donnees initiales                                     |
| `npm run db:studio` | Ouvre Prisma Studio (interface visuelle BDD)                     |

---

## Structure du projet

```
CESIZEN-API/
├── prisma/
│   ├── schema.prisma          # Schema de la base de donnees
│   └── seed/
│       └── index.ts           # Script de donnees initiales
├── src/
│   ├── server.ts              # Point d'entree, configuration Express
│   ├── config/
│   │   ├── auth.ts            # Configuration JWT (secrets, TTL)
│   │   ├── database.ts        # Configuration Prisma
│   │   └── swagger.ts         # Configuration OpenAPI/Swagger
│   ├── constants/             # Constantes (selects Prisma, etc.)
│   ├── controllers/           # Handlers des routes
│   │   ├── authController.ts
│   │   ├── articleController.ts
│   │   ├── categoryController.ts
│   │   ├── baseEmotionController.ts
│   │   ├── detailedEmotionController.ts
│   │   ├── trackerEntryController.ts
│   │   └── userController.ts
│   ├── middlewares/           # Authentification, validation, roles
│   │   ├── authMiddleware.ts
│   │   ├── roleMiddleware.ts
│   │   └── validationMiddleware.ts
│   ├── routes/                # Definition des routes Express
│   │   ├── authRoutes.ts
│   │   ├── articleRoutes.ts
│   │   ├── categoryRoutes.ts
│   │   ├── baseEmotionRoutes.ts
│   │   ├── detailedEmotionRoutes.ts
│   │   ├── trackerEntryRoutes.ts
│   │   └── userRoutes.ts
│   ├── schemas/               # Schemas de validation Zod
│   ├── services/              # Logique metier
│   │   ├── authService.ts
│   │   ├── articleService.ts
│   │   ├── categoryService.ts
│   │   ├── baseEmotionService.ts
│   │   ├── detailedEmotionService.ts
│   │   ├── trackerEntryService.ts
│   │   ├── trackerStatsService.ts
│   │   └── userService.ts
│   └── utils/                 # Fonctions utilitaires
├── docker-compose.yaml        # Configuration Docker PostgreSQL
├── prisma.config.ts           # Configuration Prisma
├── .env.example               # Modele de variables d'environnement
├── package.json
└── tsconfig.json
```
