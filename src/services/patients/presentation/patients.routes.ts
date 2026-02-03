import { Router } from "express";
import { authRequired, requireRoles } from "../../auth/presentation/auth.middlewares";
import { Role } from "../../../shared/constants";
import { createPatient } from "./patients.controllers";
import { validateBody } from "./patients.middlewares";
import { createPatientDtoSchema } from "../domain/dtos";

const patientsRouter = Router();

patientsRouter.post(
  "/",
  authRequired,
  requireRoles(Role.ADMIN, Role.RECEPTIONIST),
  validateBody(createPatientDtoSchema),
  createPatient,
);

export { patientsRouter };
