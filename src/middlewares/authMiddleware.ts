import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { authConfig } from "@/config/auth";
import { prisma } from "@/config/database";
import { USER_SELECT } from "@/constants/prismaSelects";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Missing or invalid authorization header",
      });
    }

    const token = authorization.slice("Bearer ".length).trim();
    const decoded = jwt.verify(token, authConfig.accessTokenSecret);

    if (typeof decoded === "string") {
      return res.status(401).json({
        success: false,
        message: "Invalid access token",
      });
    }

    if (decoded.type !== "access" || !decoded.sub || typeof decoded.sub !== "string") {
      return res.status(401).json({
        success: false,
        message: "Invalid access token",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.sub },
      select: USER_SELECT,
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    (req as any).authUser = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired access token",
    });
  }
};
