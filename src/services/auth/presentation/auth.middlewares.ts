import type { NextFunction, Request, Response } from "express";
import type { JwtPayload } from "../../../config/adapters/jwt.adapter";
import { verifyToken } from "../../../config/adapters/jwt.adapter";
import { UserPostgresDatasourceImpl } from "../../users/infrastructure/users.datasource.impl";
import { UserRepositoryImpl } from "../../users/infrastructure/users.repository.impl";

const userDatasource = new UserPostgresDatasourceImpl();
const userRepository = new UserRepositoryImpl(userDatasource);

export const authRequired = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const payload = verifyToken(token);
    if (typeof payload.ver !== "number") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await userRepository.getAuthSnapshot(payload.usr_idt_id);
    if (!user || user.date_deleted_at) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (user.usr_int_token_version !== payload.ver) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    (req as Request & { user?: JwtPayload }).user = payload;
    const typed = req as Request & { body?: { user?: JwtPayload } };
    if (!typed.body) {
      typed.body = {};
    }
    typed.body.user = payload;
    return next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export const requireRoles =
  (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const user = (req as Request & { user?: JwtPayload }).user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userRoles = user.roles ?? [];
    if (!userRoles.some((role) => roles.includes(role))) {
      return res.status(403).json({ message: "Forbidden" });
    }
    return next();
  };

export const requireSelfOrRoles =
  (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const user = (req as Request & { user?: JwtPayload }).user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userRoles = user.roles ?? [];
    if (userRoles.some((role) => roles.includes(role))) {
      return next();
    }
    const id = Number(req.params.id);
    if (!Number.isNaN(id) && user.usr_idt_id === id) {
      return next();
    }
    return res.status(403).json({ message: "Forbidden" });
  };
