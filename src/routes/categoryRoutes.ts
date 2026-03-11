import { Router } from "express";
import * as CategoryController from "@/controllers/categoryController";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "@/middlewares/validationMiddleware";
import { requireRole } from "@/middlewares/roleMiddleware";
import {
  createCategorySchema,
  updateCategorySchema,
  categoryIdSchema,
  searchCategorySchema,
} from "@/schemas/category";
import { Role } from "@/generated/prisma";
import { requireAuth } from "@/middlewares/authMiddleware";

const router = Router();

// GET /api/categories
router.get("/", CategoryController.getAllCategories);

// GET /api/categories/search?q=query
router.get(
  "/search",
  validateQuery(searchCategorySchema),
  CategoryController.searchCategories
);

// GET /api/categories/:id
router.get(
  "/:id",
  validateParams(categoryIdSchema),
  CategoryController.getCategoryById
);

router.use(requireAuth);

// POST /api/categories
router.post(
  "/",
  requireRole(Role.ADMIN),
  validateBody(createCategorySchema),
  CategoryController.createCategory
);

// PUT /api/categories/:id
router.put(
  "/:id",
  validateParams(categoryIdSchema),
  validateBody(updateCategorySchema),
  CategoryController.updateCategory
);

// DELETE /api/categories/:id
router.delete(
  "/:id",
  validateParams(categoryIdSchema),
  CategoryController.deleteCategory
);

export default router;
