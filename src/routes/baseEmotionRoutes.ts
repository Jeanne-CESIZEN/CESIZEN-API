import { Router } from "express";
import * as BaseEmotionController from "@/controllers/baseEmotionController";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "@/middlewares/validationMiddleware";
import {
  createBaseEmotionSchema,
  updateBaseEmotionSchema,
  baseEmotionIdSchema,
  searchBaseEmotionSchema,
} from "@/schemas/baseEmotion";

const router = Router();

// GET /api/base-emotions
router.get("/", BaseEmotionController.getAllBaseEmotions);

// GET /api/base-emotions/search?q=query
router.get(
  "/search",
  validateQuery(searchBaseEmotionSchema),
  BaseEmotionController.searchBaseEmotions
);

// GET /api/base-emotions/:id
router.get(
  "/:id",
  validateParams(baseEmotionIdSchema),
  BaseEmotionController.getBaseEmotionById
);

// POST /api/base-emotions
router.post(
  "/",
  validateBody(createBaseEmotionSchema),
  BaseEmotionController.createBaseEmotion
);

// PUT /api/base-emotions/:id
router.put(
  "/:id",
  validateParams(baseEmotionIdSchema),
  validateBody(updateBaseEmotionSchema),
  BaseEmotionController.updateBaseEmotion
);

// DELETE /api/base-emotions/:id
router.delete(
  "/:id",
  validateParams(baseEmotionIdSchema),
  BaseEmotionController.deleteBaseEmotion
);

export default router;
