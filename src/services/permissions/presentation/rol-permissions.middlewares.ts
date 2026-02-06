import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";

export const validateBody =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const preservedUser = (req as Request & { body?: { user?: unknown } }).body?.user;
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.flatten() });
    }
    req.body = parsed.data;
    if (preservedUser !== undefined) {
      (req as Request & { body: { user?: unknown } }).body.user = preservedUser;
    }
    return next();
  };
