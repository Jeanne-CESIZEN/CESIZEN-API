import { Request, Response, NextFunction } from "express";
import { Role } from "@/generated/prisma";

export const requireRole = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authUser = (req as any).authUser as { role?: Role } | undefined;

    if (!authUser?.role) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!roles.includes(authUser.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    next();
  };
};

export const requireAdminOrSelf = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authUser = (req as any).authUser as { id?: string; role?: Role } | undefined;

  if (!authUser?.id) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  if (authUser.role === Role.ADMIN || authUser.id === req.params.id) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Forbidden",
  });
};
