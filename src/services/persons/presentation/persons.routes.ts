import { Router } from "express";
import { authRequired, requireRoles } from "../../auth/presentation/auth.middlewares";
import { Role } from "../../../shared/constants";
import { createPerson, getPersonById } from "./persons.controllers";
import { validateBody } from "./persons.middlewares";
import { createPersonDtoSchema } from "../domain/dtos";

const personsRouter = Router();

personsRouter.post(
  "/",
  authRequired,
  requireRoles(Role.ADMIN, Role.RECEPTIONIST),
  validateBody(createPersonDtoSchema),
  createPerson,
);

personsRouter.get("/:id", authRequired, requireRoles(Role.ADMIN, Role.RECEPTIONIST), getPersonById);

export { personsRouter };
