import { Request, Response } from "express";
import * as AuthService from "@/services/authService";
import { LoginInput, RefreshTokenInput } from "@/schemas/auth";

/**
 * POST /api/auth/login
 */
export const login = async (req: Request, res: Response) => {
  try {
    const data = req.body as LoginInput;
    const result = await AuthService.login(data);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "INVALID_CREDENTIALS") {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      if (error.message === "USER_INACTIVE") {
        return res.status(403).json({
          success: false,
          message: "User account is inactive",
        });
      }

      if (error.message === "REFRESH_TOKEN_STORAGE_NOT_READY") {
        return res.status(500).json({
          success: false,
          message:
            "Authentication storage is not ready. Run `npm run db:push` and retry.",
        });
      }
    }

    res.status(500).json({
      success: false,
      message: "Error logging in",
    });
  }
};

/**
 * POST /api/auth/refresh
 */
export const refresh = async (req: Request, res: Response) => {
  try {
    const data = req.body as RefreshTokenInput;
    const result = await AuthService.refresh(data);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "INVALID_REFRESH_TOKEN") {
        return res.status(401).json({
          success: false,
          message: "Invalid or expired refresh token",
        });
      }

      if (error.message === "USER_NOT_FOUND") {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      if (error.message === "USER_INACTIVE") {
        return res.status(403).json({
          success: false,
          message: "User account is inactive",
        });
      }
    }

    res.status(500).json({
      success: false,
      message: "Error refreshing token",
    });
  }
};

/**
 * POST /api/auth/logout
 */
export const logout = async (req: Request, res: Response) => {
  try {
    const data = req.body as RefreshTokenInput;
    await AuthService.logout(data);

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error logging out",
    });
  }
};

/**
 * GET /api/auth/me
 */
export const me = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).authUser;
    const user = await AuthService.getAuthenticatedUser(authUser.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "USER_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error retrieving authenticated user",
    });
  }
};
