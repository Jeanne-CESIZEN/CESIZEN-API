import { Router } from "express";
import * as DetailedEmotionController from "@/controllers/detailedEmotionController";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "@/middlewares/validationMiddleware";
import { requireRole } from "@/middlewares/roleMiddleware";
import {
  createDetailedEmotionSchema,
  updateDetailedEmotionSchema,
  detailedEmotionIdSchema,
  searchDetailedEmotionSchema,
} from "@/schemas/detailedEmotion";
import { Role } from "@/generated/prisma";

const router = Router();

// GET /api/detailed-emotions
router.get("/", DetailedEmotionController.getAllDetailedEmotions);

// GET /api/detailed-emotions/search?q=query&baseEmotionId=<cuid>
router.get(
  "/search",
  validateQuery(searchDetailedEmotionSchema),
  DetailedEmotionController.searchDetailedEmotions
);

// GET /api/detailed-emotions/:id
router.get(
  "/:id",
  validateParams(detailedEmotionIdSchema),
  DetailedEmotionController.getDetailedEmotionById
);

// POST /api/detailed-emotions
router.post(
  "/",
  requireRole(Role.ADMIN),
  validateBody(createDetailedEmotionSchema),
  DetailedEmotionController.createDetailedEmotion
);

// PUT /api/detailed-emotions/:id
router.put(
  "/:id",
  validateParams(detailedEmotionIdSchema),
  validateBody(updateDetailedEmotionSchema),
  DetailedEmotionController.updateDetailedEmotion
);

// DELETE /api/detailed-emotions/:id
router.delete(
  "/:id",
  validateParams(detailedEmotionIdSchema),
  DetailedEmotionController.deleteDetailedEmotion
);

export default router;
