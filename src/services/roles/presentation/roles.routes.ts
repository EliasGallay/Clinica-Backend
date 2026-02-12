import { Router } from "express";
import { authRequired, requirePermission } from "../../auth/presentation/auth.middlewares";
import { Permissions } from "../../../shared/constants";
import { getAllRoles } from "./roles.controllers";

const rolesRouter = Router();

rolesRouter.get(
  "/all",
  authRequired,
  requirePermission(Permissions.ROLES_PERMISSIONS, "read"),
  getAllRoles,
);

export { rolesRouter };
