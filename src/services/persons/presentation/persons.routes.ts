import { Router } from "express";
import { authRequired, requirePermission } from "../../auth/presentation/auth.middlewares";
import { Permissions } from "../../../shared/constants";
import {
  createPerson,
  deletePerson,
  getAllPersons,
  getPersonById,
  updatePerson,
} from "./persons.controllers";
import { validateBody } from "./persons.middlewares";
import { createPersonDtoSchema, updatePersonDtoSchema } from "../domain/dtos";

const personsRouter = Router();

personsRouter.post(
  "/",
  authRequired,
  requirePermission(Permissions.PERSONS, "write"),
  validateBody(createPersonDtoSchema),
  createPerson,
);

personsRouter.get(
  "/all",
  authRequired,
  requirePermission(Permissions.PERSONS, "read"),
  getAllPersons,
);

personsRouter.get(
  "/:id",
  authRequired,
  requirePermission(Permissions.PERSONS, "read"),
  getPersonById,
);

personsRouter.put(
  "/:id",
  authRequired,
  requirePermission(Permissions.PERSONS, "write"),
  validateBody(updatePersonDtoSchema),
  updatePerson,
);

personsRouter.delete(
  "/:id",
  authRequired,
  requirePermission(Permissions.PERSONS, "write"),
  deletePerson,
);

export { personsRouter };
