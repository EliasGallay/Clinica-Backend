import { Router } from "express";
import { authRequired, requirePermission } from "../../auth/presentation/auth.middlewares";
import { Permissions } from "../../../shared/constants";
import {
  createSubmodule,
  deleteSubmodule,
  getSubmoduleById,
  getSubmodules,
  updateSubmodule,
} from "./submodules.controllers";
import { validateBody } from "./modules.middlewares";
import { createSubmoduleDtoSchema, updateSubmoduleDtoSchema } from "../domain/dtos";

const submodulesRouter = Router();

submodulesRouter.get(
  "/",
  authRequired,
  requirePermission(Permissions.SUBMODULES, "read"),
  getSubmodules,
);

submodulesRouter.get(
  "/:subId",
  authRequired,
  requirePermission(Permissions.SUBMODULES, "read"),
  getSubmoduleById,
);

submodulesRouter.post(
  "/",
  authRequired,
  requirePermission(Permissions.SUBMODULES, "write"),
  validateBody(createSubmoduleDtoSchema),
  createSubmodule,
);

submodulesRouter.put(
  "/:subId",
  authRequired,
  requirePermission(Permissions.SUBMODULES, "write"),
  validateBody(updateSubmoduleDtoSchema),
  updateSubmodule,
);

submodulesRouter.delete(
  "/:subId",
  authRequired,
  requirePermission(Permissions.SUBMODULES, "write"),
  deleteSubmodule,
);

export { submodulesRouter };
