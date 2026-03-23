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

// PUT /api/users/:id
router.put(
  "/:id",
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
  validateParams(userIdSchema),
  UserController.deactivateUser
);

// PATCH /api/users/:id/activate
router.patch(
  "/:id/activate",
  validateParams(userIdSchema),
  UserController.activateUser
);

// DELETE /api/users/:id
router.delete("/:id", validateParams(userIdSchema), UserController.deleteUser);

export default router;
