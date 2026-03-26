import { Router } from "express";
import * as UserController from "@/controllers/userController";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "@/middlewares/validationMiddleware";
import {
  createUserSchema,
  updateUserSchema,
  userIdSchema,
  searchUserSchema,
} from "@/schemas/user";
import { requireAuth } from "@/middlewares/authMiddleware";
import { requireRole, requireAdminOrSelf } from "@/middlewares/roleMiddleware";
import { Role } from "@/generated/prisma";

const router = Router();

// GET /api/users
router.get("/", UserController.getAllUsers);

// GET /api/users/active
router.get("/active", UserController.getActiveUsers);

// GET /api/users/search?q=query
router.get(
  "/search",
  validateQuery(searchUserSchema),
  UserController.searchUsers
);

// GET /api/users/:id
router.get("/:id", validateParams(userIdSchema), UserController.getUserById);

// POST /api/users
router.post("/", validateBody(createUserSchema), UserController.createUser);

// PUT /api/users/:id - admin or self
router.put(
  "/:id",
  requireAuth,
  requireAdminOrSelf,
  validateParams(userIdSchema),
  validateBody(updateUserSchema),
  UserController.updateUser
);

// PATCH /api/users/:id/gdpr
router.patch(
  "/:id/gdpr",
  requireAuth,
  validateParams(userIdSchema),
  UserController.acceptGdpr
);

// PATCH /api/users/:id/deactivate
router.patch(
  "/:id/deactivate",
  requireAuth,
  requireRole(Role.ADMIN),
  validateParams(userIdSchema),
  UserController.deactivateUser
);

// PATCH /api/users/:id/activate
router.patch(
  "/:id/activate",
  requireAuth,
  requireRole(Role.ADMIN),
  validateParams(userIdSchema),
  UserController.activateUser
);

// DELETE /api/users/:id
router.delete(
  "/:id",
  requireAuth,
  requireRole(Role.ADMIN),
  validateParams(userIdSchema),
  UserController.deleteUser
);

export default router;
