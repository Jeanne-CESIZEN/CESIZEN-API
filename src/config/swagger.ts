import type { OpenAPIV3 } from "openapi-types";

const swaggerDocument: OpenAPIV3.Document = {
  openapi: "3.0.3",
  info: {
    title: "CESIZEN API",
    version: "1.0.0",
    description: "API REST de l'application CESIZEN — suivi émotionnel et bien-être.",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Serveur local",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      // ─── Auth ────────────────────────────────────────────────────────────
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", example: "alice@example.com" },
          password: { type: "string", minLength: 1, example: "s3cr3t" },
        },
      },
      LoginResponse: {
        type: "object",
        properties: {
          accessToken: { type: "string" },
          refreshToken: { type: "string" },
        },
      },
      RefreshTokenRequest: {
        type: "object",
        required: ["refreshToken"],
        properties: {
          refreshToken: { type: "string" },
        },
      },
      // ─── User ─────────────────────────────────────────────────────────────
      User: {
        type: "object",
        properties: {
          id: { type: "string", example: "clxyz123" },
          firstname: { type: "string", example: "Alice" },
          lastname: { type: "string", example: "Dupont" },
          email: { type: "string", format: "email", example: "alice@example.com" },
          role: { type: "string", enum: ["USER", "ADMIN"], example: "USER" },
          isActive: { type: "boolean", example: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      CreateUserRequest: {
        type: "object",
        required: ["firstname", "lastname", "email", "password"],
        properties: {
          firstname: { type: "string", minLength: 2, example: "Alice" },
          lastname: { type: "string", minLength: 2, example: "Dupont" },
          email: { type: "string", format: "email", example: "alice@example.com" },
          password: { type: "string", minLength: 8, example: "P@ssw0rd!" },
          role: { type: "string", enum: ["USER", "ADMIN"], default: "USER" },
        },
      },
      UpdateUserRequest: {
        type: "object",
        properties: {
          firstname: { type: "string", minLength: 2 },
          lastname: { type: "string", minLength: 2 },
          email: { type: "string", format: "email" },
          password: { type: "string", minLength: 8 },
          role: { type: "string", enum: ["USER", "ADMIN"] },
          isActive: { type: "boolean" },
        },
      },
      // ─── Category ─────────────────────────────────────────────────────────
      Category: {
        type: "object",
        properties: {
          id: { type: "string", example: "clxyz123" },
          name: { type: "string", example: "Bien-être" },
          color: { type: "string", example: "#4caf50" },
          iconName: { type: "string", example: "leaf" },
          description: { type: "string", nullable: true, example: "Articles sur le bien-être" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      CreateCategoryRequest: {
        type: "object",
        required: ["name", "color", "iconName"],
        properties: {
          name: { type: "string", minLength: 2, example: "Bien-être" },
          color: { type: "string", example: "#4caf50" },
          iconName: { type: "string", example: "leaf" },
          description: { type: "string", maxLength: 500 },
        },
      },
      UpdateCategoryRequest: {
        type: "object",
        properties: {
          name: { type: "string", minLength: 2 },
          color: { type: "string" },
          iconName: { type: "string" },
          description: { type: "string", maxLength: 500 },
        },
      },
      // ─── Article ──────────────────────────────────────────────────────────
      Article: {
        type: "object",
        properties: {
          id: { type: "string", example: "clxyz123" },
          categoryId: { type: "string", example: "clxyz123" },
          title: { type: "string", example: "Gérer le stress au quotidien" },
          description: { type: "string", nullable: true },
          content: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      CreateArticleRequest: {
        type: "object",
        required: ["categoryId", "title", "content"],
        properties: {
          categoryId: { type: "string", example: "clxyz123" },
          title: { type: "string", minLength: 2, example: "Gérer le stress" },
          description: { type: "string", maxLength: 500 },
          content: { type: "string", minLength: 1 },
        },
      },
      UpdateArticleRequest: {
        type: "object",
        properties: {
          categoryId: { type: "string" },
          title: { type: "string", minLength: 2 },
          description: { type: "string", maxLength: 500 },
          content: { type: "string" },
        },
      },
      // ─── BaseEmotion ──────────────────────────────────────────────────────
      BaseEmotion: {
        type: "object",
        properties: {
          id: { type: "string", example: "clxyz123" },
          name: { type: "string", example: "Joie" },
          emoji: { type: "string", nullable: true, example: "😀" },
          color: { type: "string", nullable: true, example: "#FFD700" },
          score: { type: "integer", minimum: 1, maximum: 5, example: 5 },
          order: { type: "integer", minimum: 0, example: 0 },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      CreateBaseEmotionRequest: {
        type: "object",
        required: ["name", "score", "order"],
        properties: {
          name: { type: "string", minLength: 2, maxLength: 100, example: "Joie" },
          emoji: { type: "string", nullable: true, example: "😀" },
          color: { type: "string", nullable: true, example: "#FFD700" },
          score: { type: "integer", minimum: 1, maximum: 5, example: 5 },
          order: { type: "integer", minimum: 0, example: 0 },
        },
      },
      UpdateBaseEmotionRequest: {
        type: "object",
        properties: {
          name: { type: "string", minLength: 2, maxLength: 100 },
          emoji: { type: "string", nullable: true },
          color: { type: "string", nullable: true },
          score: { type: "integer", minimum: 1, maximum: 5 },
          order: { type: "integer", minimum: 0 },
        },
      },
      // ─── DetailedEmotion ──────────────────────────────────────────────────
      DetailedEmotion: {
        type: "object",
        properties: {
          id: { type: "string", example: "clxyz123" },
          baseEmotionId: { type: "string", example: "clxyz123" },
          name: { type: "string", example: "Enthousiaste" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      CreateDetailedEmotionRequest: {
        type: "object",
        required: ["baseEmotionId", "name"],
        properties: {
          baseEmotionId: { type: "string", example: "clxyz123" },
          name: { type: "string", minLength: 2, maxLength: 100, example: "Enthousiaste" },
        },
      },
      UpdateDetailedEmotionRequest: {
        type: "object",
        properties: {
          baseEmotionId: { type: "string" },
          name: { type: "string", minLength: 2, maxLength: 100 },
        },
      },
      // ─── TrackerEntry ─────────────────────────────────────────────────────
      TrackerEntry: {
        type: "object",
        properties: {
          id: { type: "string", example: "clxyz123" },
          userId: { type: "string", example: "clxyz123" },
          detailedEmotionId: { type: "string", example: "clxyz123" },
          comment: { type: "string", nullable: true, maxLength: 1000 },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      CreateTrackerEntryRequest: {
        type: "object",
        required: ["detailedEmotionId"],
        properties: {
          userId: { type: "string", example: "clxyz123", description: "ADMIN only — auto-assigned from JWT for regular users" },
          detailedEmotionId: { type: "string", example: "clxyz123" },
          comment: { type: "string", maxLength: 1000 },
        },
      },
      UpdateTrackerEntryRequest: {
        type: "object",
        properties: {
          userId: { type: "string", description: "ADMIN only — ignoré pour les utilisateurs normaux" },
          detailedEmotionId: { type: "string" },
          comment: { type: "string", maxLength: 1000 },
        },
      },
      // ─── TrackerStats ─────────────────────────────────────────────────────
      TrackerStats: {
        type: "object",
        properties: {
          period: { type: "integer", example: 7 },
          summary: {
            type: "object",
            properties: {
              dominantEmotion: {
                nullable: true,
                type: "object",
                properties: {
                  key: { type: "string" },
                  name: { type: "string" },
                  emoji: { type: "string" },
                  color: { type: "string" },
                  count: { type: "integer" },
                },
              },
              averageMood: {
                type: "object",
                properties: {
                  score: { type: "number" },
                  count: { type: "integer" },
                },
              },
              trend: {
                type: "object",
                properties: {
                  direction: { type: "string", enum: ["up", "down", "stable"] },
                  percent: { type: "number" },
                },
              },
            },
          },
          emotions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                key: { type: "string" },
                name: { type: "string" },
                emoji: { type: "string" },
                color: { type: "string" },
              },
            },
          },
          distribution: {
            type: "array",
            items: {
              type: "object",
              properties: {
                key: { type: "string" },
                count: { type: "integer" },
                percent: { type: "integer" },
              },
            },
          },
          timeline: {
            type: "array",
            items: {
              type: "object",
              properties: {
                date: { type: "string" },
                label: { type: "string" },
                total: { type: "integer" },
                averageMood: { type: "number" },
                counts: {
                  type: "object",
                  additionalProperties: { type: "integer" },
                },
              },
            },
          },
        },
      },
      // ─── Réponses génériques ──────────────────────────────────────────────
      SuccessResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Opération réussie" },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          error: { type: "string", example: "Message d'erreur" },
        },
      },
    },
  },

  // ── Paths ──────────────────────────────────────────────────────────────────
  paths: {
    // ─── Auth ───────────────────────────────────────────────────────────────
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Connexion",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/LoginRequest" } } },
        },
        responses: {
          "200": {
            description: "Tokens JWT",
            content: { "application/json": { schema: { $ref: "#/components/schemas/LoginResponse" } } },
          },
          "401": { description: "Identifiants invalides", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "403": { description: "Compte utilisateur inactif", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/api/auth/refresh": {
      post: {
        tags: ["Auth"],
        summary: "Renouveler l'access token",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/RefreshTokenRequest" } } },
        },
        responses: {
          "200": {
            description: "Nouveau access token",
            content: { "application/json": { schema: { $ref: "#/components/schemas/LoginResponse" } } },
          },
          "401": { description: "Refresh token invalide ou expiré", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "403": { description: "Compte utilisateur inactif", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/api/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Déconnexion",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/RefreshTokenRequest" } } },
        },
        responses: {
          "200": { description: "Déconnecté avec succès" },
          "400": { description: "Token manquant", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/api/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Utilisateur authentifié courant",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Profil de l'utilisateur connecté",
            content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } },
          },
          "401": { description: "Non authentifié", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },

    // ─── Users ──────────────────────────────────────────────────────────────
    "/api/users": {
      get: {
        tags: ["Users"],
        summary: "Lister tous les utilisateurs",
        responses: {
          "200": {
            description: "Liste des utilisateurs",
            content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/User" } } } },
          },
        },
      },
      post: {
        tags: ["Users"],
        summary: "Créer un utilisateur",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/CreateUserRequest" } } },
        },
        responses: {
          "201": { description: "Utilisateur créé", content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } } },
          "400": { description: "Données invalides", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "409": { description: "Email déjà utilisé", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/api/users/active": {
      get: {
        tags: ["Users"],
        summary: "Lister les utilisateurs actifs",
        responses: {
          "200": {
            description: "Utilisateurs actifs",
            content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/User" } } } },
          },
        },
      },
    },
    "/api/users/search": {
      get: {
        tags: ["Users"],
        summary: "Rechercher des utilisateurs",
        parameters: [
          { name: "q", in: "query", schema: { type: "string" }, description: "Texte de recherche" },
          { name: "role", in: "query", schema: { type: "string", enum: ["USER", "ADMIN"] } },
          { name: "isActive", in: "query", schema: { type: "boolean" } },
        ],
        responses: {
          "200": { description: "Résultats", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/User" } } } } },
        },
      },
    },
    "/api/users/{id}": {
      get: {
        tags: ["Users"],
        summary: "Obtenir un utilisateur par ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Utilisateur", content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } } },
          "404": { description: "Non trouvé", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
      put: {
        tags: ["Users"],
        summary: "Mettre à jour un utilisateur",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateUserRequest" } } },
        },
        responses: {
          "200": { description: "Utilisateur mis à jour", content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } } },
          "404": { description: "Non trouvé", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "409": { description: "Email déjà utilisé", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
      delete: {
        tags: ["Users"],
        summary: "Supprimer un utilisateur",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Supprimé", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessResponse" } } } },
          "403": { description: "Impossible de supprimer le dernier administrateur", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "404": { description: "Non trouvé", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/api/users/{id}/deactivate": {
      patch: {
        tags: ["Users"],
        summary: "Désactiver un utilisateur",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Utilisateur désactivé", content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } } },
          "403": { description: "Impossible de désactiver le dernier administrateur", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "404": { description: "Non trouvé", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/api/users/{id}/activate": {
      patch: {
        tags: ["Users"],
        summary: "Activer un utilisateur",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Utilisateur activé", content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } } },
          "404": { description: "Non trouvé", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },

    // ─── Categories ─────────────────────────────────────────────────────────
    "/api/categories": {
      get: {
        tags: ["Categories"],
        summary: "Lister toutes les catégories",
        responses: {
          "200": { description: "Liste", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Category" } } } } },
        },
      },
      post: {
        tags: ["Categories"],
        summary: "Créer une catégorie (ADMIN)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/CreateCategoryRequest" } } },
        },
        responses: {
          "201": { description: "Catégorie créée", content: { "application/json": { schema: { $ref: "#/components/schemas/Category" } } } },
          "401": { description: "Non authentifié", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "403": { description: "Accès refusé", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "409": { description: "Nom de catégorie déjà utilisé", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/api/categories/search": {
      get: {
        tags: ["Categories"],
        summary: "Rechercher des catégories",
        parameters: [
          { name: "q", in: "query", schema: { type: "string" }, description: "Texte de recherche" },
        ],
        responses: {
          "200": { description: "Résultats", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Category" } } } } },
        },
      },
    },
    "/api/categories/{id}": {
      get: {
        tags: ["Categories"],
        summary: "Obtenir une catégorie par ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Catégorie", content: { "application/json": { schema: { $ref: "#/components/schemas/Category" } } } },
          "404": { description: "Non trouvée", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
      put: {
        tags: ["Categories"],
        summary: "Mettre à jour une catégorie",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateCategoryRequest" } } },
        },
        responses: {
          "200": { description: "Catégorie mise à jour", content: { "application/json": { schema: { $ref: "#/components/schemas/Category" } } } },
          "401": { description: "Non authentifié", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "404": { description: "Non trouvée", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "409": { description: "Nom de catégorie déjà utilisé", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
      delete: {
        tags: ["Categories"],
        summary: "Supprimer une catégorie",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Supprimée", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessResponse" } } } },
          "401": { description: "Non authentifié", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "404": { description: "Non trouvée", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },

    // ─── Articles ───────────────────────────────────────────────────────────
    "/api/articles": {
      get: {
        tags: ["Articles"],
        summary: "Lister tous les articles",
        responses: {
          "200": { description: "Liste", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Article" } } } } },
        },
      },
      post: {
        tags: ["Articles"],
        summary: "Créer un article (ADMIN)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/CreateArticleRequest" } } },
        },
        responses: {
          "201": { description: "Article créé", content: { "application/json": { schema: { $ref: "#/components/schemas/Article" } } } },
          "401": { description: "Non authentifié", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "403": { description: "Accès refusé", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/api/articles/search": {
      get: {
        tags: ["Articles"],
        summary: "Rechercher des articles",
        parameters: [
          { name: "q", in: "query", schema: { type: "string" }, description: "Texte de recherche" },
          { name: "categoryId", in: "query", schema: { type: "string" }, description: "Filtrer par catégorie (CUID)" },
        ],
        responses: {
          "200": { description: "Résultats", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Article" } } } } },
        },
      },
    },
    "/api/articles/{id}": {
      get: {
        tags: ["Articles"],
        summary: "Obtenir un article par ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Article", content: { "application/json": { schema: { $ref: "#/components/schemas/Article" } } } },
          "404": { description: "Non trouvé", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
      put: {
        tags: ["Articles"],
        summary: "Mettre à jour un article",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateArticleRequest" } } },
        },
        responses: {
          "200": { description: "Article mis à jour", content: { "application/json": { schema: { $ref: "#/components/schemas/Article" } } } },
          "401": { description: "Non authentifié", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "404": { description: "Non trouvé", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
      delete: {
        tags: ["Articles"],
        summary: "Supprimer un article",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Supprimé", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessResponse" } } } },
          "401": { description: "Non authentifié", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "404": { description: "Non trouvé", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },

    // ─── Base Emotions ───────────────────────────────────────────────────────
    "/api/base-emotions": {
      get: {
        tags: ["Base Emotions"],
        summary: "Lister toutes les émotions de base",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Liste", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/BaseEmotion" } } } } },
          "401": { description: "Non authentifié", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
      post: {
        tags: ["Base Emotions"],
        summary: "Créer une émotion de base (ADMIN)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/CreateBaseEmotionRequest" } } },
        },
        responses: {
          "201": { description: "Créée", content: { "application/json": { schema: { $ref: "#/components/schemas/BaseEmotion" } } } },
          "401": { description: "Non authentifié", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "403": { description: "Accès refusé", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "409": { description: "Nom d'émotion de base déjà utilisé", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/api/base-emotions/search": {
      get: {
        tags: ["Base Emotions"],
        summary: "Rechercher des émotions de base",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "q", in: "query", schema: { type: "string" }, description: "Texte de recherche" },
        ],
        responses: {
          "200": { description: "Résultats", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/BaseEmotion" } } } } },
          "401": { description: "Non authentifié", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/api/base-emotions/{id}": {
      get: {
        tags: ["Base Emotions"],
        summary: "Obtenir une émotion de base par ID",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Émotion de base", content: { "application/json": { schema: { $ref: "#/components/schemas/BaseEmotion" } } } },
          "401": { description: "Non authentifié", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "404": { description: "Non trouvée", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
      put: {
        tags: ["Base Emotions"],
        summary: "Mettre à jour une émotion de base",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateBaseEmotionRequest" } } },
        },
        responses: {
          "200": { description: "Mise à jour", content: { "application/json": { schema: { $ref: "#/components/schemas/BaseEmotion" } } } },
          "401": { description: "Non authentifié", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "404": { description: "Non trouvée", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "409": { description: "Nom d'émotion de base déjà utilisé", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
      delete: {
        tags: ["Base Emotions"],
        summary: "Supprimer une émotion de base",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Supprimée", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessResponse" } } } },
          "401": { description: "Non authentifié", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "404": { description: "Non trouvée", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },

    // ─── Detailed Emotions ──────────────────────────────────────────────────
    "/api/detailed-emotions": {
      get: {
        tags: ["Detailed Emotions"],
        summary: "Lister toutes les émotions détaillées",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Liste", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/DetailedEmotion" } } } } },
          "401": { description: "Non authentifié", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
      post: {
        tags: ["Detailed Emotions"],
        summary: "Créer une émotion détaillée (ADMIN)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/CreateDetailedEmotionRequest" } } },
        },
        responses: {
          "201": { description: "Créée", content: { "application/json": { schema: { $ref: "#/components/schemas/DetailedEmotion" } } } },
          "401": { description: "Non authentifié", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "403": { description: "Accès refusé", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "409": { description: "Nom d'émotion détaillée déjà utilisé dans cette émotion de base", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/api/detailed-emotions/search": {
      get: {
        tags: ["Detailed Emotions"],
        summary: "Rechercher des émotions détaillées",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "q", in: "query", schema: { type: "string" }, description: "Texte de recherche" },
          { name: "baseEmotionId", in: "query", schema: { type: "string" }, description: "Filtrer par émotion de base (CUID)" },
        ],
        responses: {
          "200": { description: "Résultats", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/DetailedEmotion" } } } } },
          "401": { description: "Non authentifié", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/api/detailed-emotions/{id}": {
      get: {
        tags: ["Detailed Emotions"],
        summary: "Obtenir une émotion détaillée par ID",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Émotion détaillée", content: { "application/json": { schema: { $ref: "#/components/schemas/DetailedEmotion" } } } },
          "401": { description: "Non authentifié", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "404": { description: "Non trouvée", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
      put: {
        tags: ["Detailed Emotions"],
        summary: "Mettre à jour une émotion détaillée",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateDetailedEmotionRequest" } } },
        },
        responses: {
          "200": { description: "Mise à jour", content: { "application/json": { schema: { $ref: "#/components/schemas/DetailedEmotion" } } } },
          "401": { description: "Non authentifié", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "404": { description: "Non trouvée", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "409": { description: "Nom d'émotion détaillée déjà utilisé dans cette émotion de base", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
      delete: {
        tags: ["Detailed Emotions"],
        summary: "Supprimer une émotion détaillée",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Supprimée", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessResponse" } } } },
          "401": { description: "Non authentifié", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "404": { description: "Non trouvée", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },

    // ─── Tracker Entries ────────────────────────────────────────────────────
    "/api/tracker-entries": {
      get: {
        tags: ["Tracker Entries"],
        summary: "Lister toutes les entrées du tracker",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Liste", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/TrackerEntry" } } } } },
          "401": { description: "Non authentifié", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
      post: {
        tags: ["Tracker Entries"],
        summary: "Créer une entrée du tracker",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/CreateTrackerEntryRequest" } } },
        },
        responses: {
          "201": { description: "Créée", content: { "application/json": { schema: { $ref: "#/components/schemas/TrackerEntry" } } } },
          "401": { description: "Non authentifié", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/api/tracker-entries/search": {
      get: {
        tags: ["Tracker Entries"],
        summary: "Rechercher des entrées du tracker",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "q", in: "query", schema: { type: "string" }, description: "Texte de recherche" },
          { name: "userId", in: "query", schema: { type: "string" }, description: "ID utilisateur (CUID) — ADMIN only, auto-assigné depuis le JWT pour les utilisateurs normaux" },
          { name: "detailedEmotionId", in: "query", schema: { type: "string" }, description: "Filtrer par émotion détaillée (CUID)" },
        ],
        responses: {
          "200": { description: "Résultats", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/TrackerEntry" } } } } },
          "401": { description: "Non authentifié", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/api/tracker-entries/stats": {
      get: {
        tags: ["Tracker Entries"],
        summary: "Statistiques d'émotions",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "period", in: "query", schema: { type: "integer", enum: [7, 30, 90] }, description: "Période en jours (défaut: 7)" },
          { name: "userId", in: "query", schema: { type: "string" }, description: "Filtrer par utilisateur (CUID)" },
        ],
        responses: {
          "200": { description: "Statistiques", content: { "application/json": { schema: { $ref: "#/components/schemas/TrackerStats" } } } },
          "401": { description: "Non authentifié", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/api/tracker-entries/user/{userId}": {
      get: {
        tags: ["Tracker Entries"],
        summary: "Entrées du tracker d'un utilisateur",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "userId", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Entrées", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/TrackerEntry" } } } } },
          "401": { description: "Non authentifié", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "403": { description: "Accès interdit — entrées d'un autre utilisateur", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "404": { description: "Utilisateur non trouvé", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/api/tracker-entries/{id}": {
      get: {
        tags: ["Tracker Entries"],
        summary: "Obtenir une entrée du tracker par ID",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Entrée", content: { "application/json": { schema: { $ref: "#/components/schemas/TrackerEntry" } } } },
          "401": { description: "Non authentifié", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "403": { description: "Accès interdit — entrée d'un autre utilisateur", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "404": { description: "Non trouvée", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
      put: {
        tags: ["Tracker Entries"],
        summary: "Mettre à jour une entrée du tracker",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateTrackerEntryRequest" } } },
        },
        responses: {
          "200": { description: "Mise à jour", content: { "application/json": { schema: { $ref: "#/components/schemas/TrackerEntry" } } } },
          "401": { description: "Non authentifié", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "403": { description: "Accès interdit — entrée d'un autre utilisateur", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "404": { description: "Non trouvée", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
      delete: {
        tags: ["Tracker Entries"],
        summary: "Supprimer une entrée du tracker",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Supprimée", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessResponse" } } } },
          "401": { description: "Non authentifié", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "403": { description: "Accès interdit — entrée d'un autre utilisateur", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "404": { description: "Non trouvée", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
  },
};

export default swaggerDocument;
