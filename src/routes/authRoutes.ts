import { Router } from "express";
import * as AuthController from "@/controllers/authController";
import { validateBody } from "@/middlewares/validationMiddleware";
import { requireAuth } from "@/middlewares/authMiddleware";
import {
  loginSchema,
  refreshTokenBodySchema,
  logoutSchema,
} from "@/schemas/auth";

const router = Router();

// POST /api/auth/login
router.post("/login", validateBody(loginSchema), AuthController.login);

// POST /api/auth/refresh
router.post(
  "/refresh",
  validateBody(refreshTokenBodySchema),
  AuthController.refresh
);

// POST /api/auth/logout
router.post("/logout", validateBody(logoutSchema), AuthController.logout);

// GET /api/auth/me
router.get("/me", requireAuth, AuthController.me);

export default router;
