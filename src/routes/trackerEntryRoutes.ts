import { Router } from "express";
import * as TrackerEntryController from "@/controllers/trackerEntryController";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "@/middlewares/validationMiddleware";
import {
  createTrackerEntrySchema,
  updateTrackerEntrySchema,
  trackerEntryIdSchema,
  trackerEntryUserIdSchema,
  searchTrackerEntrySchema,
} from "@/schemas/trackerEntry";
import { trackerStatsQuerySchema } from "@/schemas/trackerStats";

const router = Router();

// GET /api/tracker-entries
router.get("/", TrackerEntryController.getAllTrackerEntries);

// GET /api/tracker-entries/search?q=query&userId=<cuid>&detailedEmotionId=<cuid>
router.get(
  "/search",
  validateQuery(searchTrackerEntrySchema),
  TrackerEntryController.searchTrackerEntries
);

// GET /api/tracker-entries/stats?period=7&userId=<cuid>
router.get(
  "/stats",
  validateQuery(trackerStatsQuerySchema),
  TrackerEntryController.getTrackerStats
);

// GET /api/tracker-entries/user/:userId
router.get(
  "/user/:userId",
  validateParams(trackerEntryUserIdSchema),
  TrackerEntryController.getTrackerEntriesByUser
);

// GET /api/tracker-entries/:id
router.get(
  "/:id",
  validateParams(trackerEntryIdSchema),
  TrackerEntryController.getTrackerEntryById
);

// POST /api/tracker-entries
router.post(
  "/",
  validateBody(createTrackerEntrySchema),
  TrackerEntryController.createTrackerEntry
);

// PUT /api/tracker-entries/:id
router.put(
  "/:id",
  validateParams(trackerEntryIdSchema),
  validateBody(updateTrackerEntrySchema),
  TrackerEntryController.updateTrackerEntry
);

// DELETE /api/tracker-entries/:id
router.delete(
  "/:id",
  validateParams(trackerEntryIdSchema),
  TrackerEntryController.deleteTrackerEntry
);

export default router;
