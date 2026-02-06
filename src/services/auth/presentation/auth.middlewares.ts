import type { NextFunction, Request, Response } from "express";
import type { JwtPayload } from "../../../config/adapters/jwt.adapter";
import { verifyToken } from "../../../config/adapters/jwt.adapter";
import { Op } from "sequelize";
import { UserPostgresDatasourceImpl } from "../../users/infrastructure/users.datasource.impl";
import { UserRepositoryImpl } from "../../users/infrastructure/users.repository.impl";
import { RolesModel, RolPermissionsModel } from "../../../infrastructure/db";
import type { Model } from "sequelize";

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

type RoleRecord = {
  id: string;
  rol_name: string;
};

type RoleModelInstance = Model<RoleRecord> & RoleRecord;

type PermissionRecord = {
  rpe_permission_txt_name: string;
  rpe_bol_can_read: boolean;
  rpe_bol_can_write: boolean;
};

type PermissionModelInstance = Model<PermissionRecord> & PermissionRecord;

type PermissionEntry = {
  canRead: boolean;
  canWrite: boolean;
};

type PermissionCacheEntry = {
  expiresAt: number;
  permissions: Map<string, PermissionEntry>;
};

const PERMISSIONS_CACHE_TTL_MS = 2 * 60 * 1000;
const permissionsCache = new Map<string, PermissionCacheEntry>();

export const clearPermissionsCache = () => {
  permissionsCache.clear();
};

const buildCacheKey = (roles: string[]) => `roles:${[...roles].sort().join("|")}`;

const fetchPermissionsForRoles = async (roleNames: string[]) => {
  const roles = (await RolesModel.findAll({
    where: { rol_name: { [Op.in]: roleNames } },
    attributes: ["id", "rol_name"],
  })) as RoleModelInstance[];

  const roleIds = roles.map((role) => role.id);
  if (!roleIds.length) return new Map<string, PermissionEntry>();

  const permissions = (await RolPermissionsModel.findAll({
    where: { rol_id: { [Op.in]: roleIds } },
    attributes: ["rpe_permission_txt_name", "rpe_bol_can_read", "rpe_bol_can_write"],
  })) as PermissionModelInstance[];

  const map = new Map<string, PermissionEntry>();
  for (const permission of permissions) {
    const existing = map.get(permission.rpe_permission_txt_name) ?? {
      canRead: false,
      canWrite: false,
    };
    map.set(permission.rpe_permission_txt_name, {
      canRead: existing.canRead || permission.rpe_bol_can_read,
      canWrite: existing.canWrite || permission.rpe_bol_can_write,
    });
  }
  return map;
};

const resolvePermissions = async (roleNames: string[]) => {
  const key = buildCacheKey(roleNames);
  const now = Date.now();
  const cached = permissionsCache.get(key);
  if (cached && cached.expiresAt > now) {
    return cached.permissions;
  }
  const permissions = await fetchPermissionsForRoles(roleNames);
  permissionsCache.set(key, { permissions, expiresAt: now + PERMISSIONS_CACHE_TTL_MS });
  return permissions;
};

export const requirePermission =
  (permission: string, access?: "read" | "write") =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as Request & { body?: { user?: JwtPayload } }).body?.user;
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const roleNames = user.roles ?? [];
      if (!roleNames.length) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const permissions = await resolvePermissions(roleNames);
      const entry = permissions.get(permission);
      const allowed = access
        ? access === "read"
          ? entry?.canRead
          : entry?.canWrite
        : entry?.canRead || entry?.canWrite;
      if (!allowed) {
        return res.status(403).json({ message: `Permission denied: ${permission}` });
      }

      return next();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

export const requireAnyPermission =
  (permissions: string[], access?: "read" | "write") =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as Request & { body?: { user?: JwtPayload } }).body?.user;
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const roleNames = user.roles ?? [];
      if (!roleNames.length) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const normalized = permissions;
      const map = await resolvePermissions(roleNames);
      const allowed = normalized.some((perm) => {
        const entry = map.get(perm);
        if (!entry) return false;
        if (!access) return entry.canRead || entry.canWrite;
        return access === "read" ? entry.canRead : entry.canWrite;
      });

      if (!allowed) {
        return res.status(403).json({ message: `Permission denied: ${normalized.join(", ")}` });
      }

      return next();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
