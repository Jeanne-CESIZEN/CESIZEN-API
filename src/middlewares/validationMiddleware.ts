import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodRawShape, ZodError } from "zod";

/**
 * Validate the body of the request
 */
export const validateBody = <T extends ZodRawShape>(schema: ZodObject<T>) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.issues.map((issue) => ({
            field: issue.path.join(".") || "root",
            message: issue.message,
          })),
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: "Internal server error during validation",
      });
    }
  };
};

/**
 * Validate the URL parameters
 */
export const validateParams = <T extends ZodRawShape>(schema: ZodObject<T>) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      req.params = (await schema.parseAsync(req.params)) as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: "Invalid parameters",
          errors: error.issues.map((issue) => ({
            field: issue.path.join(".") || "root",
            message: issue.message,
          })),
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: "Internal server error during validation",
      });
    }
  };
};

/**
 * Validate the query params (?key=value)
 */
export const validateQuery = <T extends ZodRawShape>(schema: ZodObject<T>) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const validated = await schema.parseAsync(req.query);
      (req as any).validatedQuery = validated;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: "Invalid query parameters",
          errors: error.issues.map((issue) => ({
            field: issue.path.join(".") || "root",
            message: issue.message,
          })),
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: "Internal server error during validation",
      });
    }
  };
};
