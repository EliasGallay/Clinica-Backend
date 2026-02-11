import { Router } from "express";
import { authRequired, requirePermission } from "../../auth/presentation/auth.middlewares";
import { Permissions } from "../../../shared/constants";
import {
  createModule,
  deleteModule,
  getModuleById,
  getModules,
  updateModule,
} from "./modules.controllers";
import { validateBody } from "./modules.middlewares";
import { createModuleDtoSchema, updateModuleDtoSchema } from "../domain/dtos";

const modulesRouter = Router();

modulesRouter.get(
  "/",
  authRequired,
  requirePermission(Permissions.MODULES, "read"),
  getModules,
);

modulesRouter.get(
  "/:modId",
  authRequired,
  requirePermission(Permissions.MODULES, "read"),
  getModuleById,
);

modulesRouter.post(
  "/",
  authRequired,
  requirePermission(Permissions.MODULES, "write"),
  validateBody(createModuleDtoSchema),
  createModule,
);

modulesRouter.put(
  "/:modId",
  authRequired,
  requirePermission(Permissions.MODULES, "write"),
  validateBody(updateModuleDtoSchema),
  updateModule,
);

modulesRouter.delete(
  "/:modId",
  authRequired,
  requirePermission(Permissions.MODULES, "write"),
  deleteModule,
);

export { modulesRouter };
