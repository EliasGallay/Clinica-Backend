import { Router } from "express";
import { authRequired, requirePermission } from "../../auth/presentation/auth.middlewares";
import { Permissions } from "../../../shared/constants";
import { createPerson, getPersonById } from "./persons.controllers";
import { validateBody } from "./persons.middlewares";
import { createPersonDtoSchema } from "../domain/dtos";

const personsRouter = Router();

personsRouter.post(
  "/",
  authRequired,
  requirePermission(Permissions.PERSONS, "write"),
  validateBody(createPersonDtoSchema),
  createPerson,
);

personsRouter.get(
  "/:id",
  authRequired,
  requirePermission(Permissions.PERSONS, "read"),
  getPersonById,
);

export { personsRouter };
