import { Request, Response } from "express";
import { Prisma } from "@/generated/prisma";
import * as UserService from "@/services/userService";
import { CreateUserInput, UpdateUserInput } from "@/schemas/user";

type IdParams = { id: string };

/**
 * POST /api/users
 */
export const createUser = async (req: Request, res: Response) => {
  try {
    const userData = req.body as CreateUserInput;
    const user = await UserService.createUser(userData);

    res.status(201).json({
      success: true,
      data: user,
      message: "User created successfully",
    });
  } catch (error: any) {
    if (error.message === "EMAIL_ALREADY_EXISTS") {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    if (error instanceof Prisma.PrismaClientInitializationError) {
      console.error("Database initialization error while creating user:", error);
      return res.status(500).json({
        success: false,
        message: "Database connection error",
      });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2021" || error.code === "P2022") {
        console.error("Database schema mismatch while creating user:", error);
        return res.status(500).json({
          success: false,
          message:
            "Database schema is not up to date. Run `npm run db:push` and retry.",
        });
      }
    }

    console.error("Error creating user:", error);
    res.status(500).json({
      success: false,
      message: "Error creating user",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/**
 * GET /api/users
 */
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserService.getAllUsers();

    res.status(200).json({
      success: true,
      data: users,
      count: users.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving users",
    });
  }
};

/**
 * GET /api/users/:id
 */
export const getUserById = async (req: Request<IdParams>, res: Response) => {
  try {
    const { id } = req.params;
    const user = await UserService.getUserById(id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    if (error.message === "USER_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error retrieving user",
    });
  }
};

/**
 * PUT /api/users/:id
 */
export const updateUser = async (req: Request<IdParams>, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body as UpdateUserInput;

    const user = await UserService.updateUser(id, updateData);

    res.status(200).json({
      success: true,
      data: user,
      message: "User updated successfully",
    });
  } catch (error: any) {
    if (error.message === "USER_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (error.message === "EMAIL_ALREADY_EXISTS") {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error updating user",
    });
  }
};

/**
 * PATCH /api/users/:id/deactivate
 */
export const deactivateUser = async (
  req: Request<IdParams>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const user = await UserService.deactivateUser(id);

    res.status(200).json({
      success: true,
      data: user,
      message: "User deactivated successfully",
    });
  } catch (error: any) {
    if (error.message === "USER_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (error.message === "CANNOT_DEACTIVATE_LAST_ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Cannot deactivate the last administrator",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error deactivating user",
    });
  }
};

/**
 * PATCH /api/users/:id/activate
 */
export const activateUser = async (req: Request<IdParams>, res: Response) => {
  try {
    const { id } = req.params;
    const user = await UserService.activateUser(id);

    res.status(200).json({
      success: true,
      data: user,
      message: "User activated successfully",
    });
  } catch (error: any) {
    if (error.message === "USER_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error activating user",
    });
  }
};

/**
 * DELETE /api/users/:id
 */
export const deleteUser = async (req: Request<IdParams>, res: Response) => {
  try {
    const { id } = req.params;
    await UserService.deleteUser(id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error: any) {
    if (error.message === "USER_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (error.message === "CANNOT_DELETE_LAST_ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Cannot delete the last administrator",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error deleting user",
    });
  }
};

/**
 * GET /api/users/search?q=query
 */
export const searchUsers = async (req: Request, res: Response) => {
  try {
    const filters = (req as any).validatedQuery || {};
    const users = await UserService.searchUsers(filters);

    res.status(200).json({
      success: true,
      data: users,
      count: users.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error searching users",
    });
  }
};

/**
 * GET /api/users/active
 */
export const getActiveUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserService.getActiveUsers();

    res.status(200).json({
      success: true,
      data: users,
      count: users.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving active users",
    });
  }
};
