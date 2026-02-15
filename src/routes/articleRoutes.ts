import { Router } from "express";
import * as ArticleController from "@/controllers/articleController";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "@/middlewares/validationMiddleware";
import {
  createArticleSchema,
  updateArticleSchema,
  articleIdSchema,
  searchArticleSchema,
} from "@/schemas/article";

const router = Router();

// GET /api/articles
router.get("/", ArticleController.getAllArticles);

// GET /api/articles/search?q=query&categoryId=1
router.get(
  "/search",
  validateQuery(searchArticleSchema),
  ArticleController.searchArticles
);

// GET /api/articles/:id
router.get(
  "/:id",
  validateParams(articleIdSchema),
  ArticleController.getArticleById
);

// POST /api/articles
router.post(
  "/",
  validateBody(createArticleSchema),
  ArticleController.createArticle
);

// PUT /api/articles/:id
router.put(
  "/:id",
  validateParams(articleIdSchema),
  validateBody(updateArticleSchema),
  ArticleController.updateArticle
);

// DELETE /api/articles/:id
router.delete(
  "/:id",
  validateParams(articleIdSchema),
  ArticleController.deleteArticle
);

export default router;
