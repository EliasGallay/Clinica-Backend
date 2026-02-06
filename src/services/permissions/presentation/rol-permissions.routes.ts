import { Router } from "express";
import {
  getPermissionsCatalog,
  getRolPermissions,
  updateRolPermission,
} from "./rol-permissions.controllers";
import { validateBody } from "./rol-permissions.middlewares";
import { updateRolPermissionDtoSchema } from "../domain";
import { authRequired, requirePermission } from "../../auth/presentation/auth.middlewares";
import { Permissions } from "../../../shared/constants";

const rolesPermissionsRouter = Router();

rolesPermissionsRouter.get(
  "/permissions",
  authRequired,
  requirePermission(Permissions.ROLES_PERMISSIONS, "read"),
  getPermissionsCatalog,
);
rolesPermissionsRouter.get(
  "/:rolId/permissions",
  authRequired,
  requirePermission(Permissions.ROLES_PERMISSIONS, "read"),
  getRolPermissions,
);
rolesPermissionsRouter.put(
  "/:rolId/permissions/:permissionId",
  authRequired,
  requirePermission(Permissions.ROLES_PERMISSIONS, "write"),
  validateBody(updateRolPermissionDtoSchema),
  updateRolPermission,
);

export { rolesPermissionsRouter };
