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
