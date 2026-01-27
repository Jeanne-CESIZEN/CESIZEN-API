import { Router } from "express";
import * as UserController from "@/controllers/userController";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "@/middlewares/validation";
import {
  createUserSchema,
  updateUserSchema,
  userIdSchema,
  searchUserSchema,
} from "@/validators/userValidator";

const router = Router();

router.get("/", UserController.getAllUsers);
router.get("/active", UserController.getActiveUsers);
router.get(
  "/search",
  validateQuery(searchUserSchema),
  UserController.searchUsers
);
router.get("/:id", validateParams(userIdSchema), UserController.getUserById);
router.post("/", validateBody(createUserSchema), UserController.createUser);
router.put(
  "/:id",
  validateParams(userIdSchema),
  validateBody(updateUserSchema),
  UserController.updateUser
);
router.patch(
  "/:id/deactivate",
  validateParams(userIdSchema),
  UserController.deactivateUser
);
router.patch(
  "/:id/activate",
  validateParams(userIdSchema),
  UserController.activateUser
);
router.delete("/:id", validateParams(userIdSchema), UserController.deleteUser);

export default router;
