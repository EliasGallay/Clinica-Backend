import { Router } from "express";
import { authRequired, requirePermission } from "../../auth/presentation/auth.middlewares";
import { Permissions } from "../../../shared/constants";
import { createPatient } from "./patients.controllers";
import { validateBody } from "./patients.middlewares";
import { createPatientDtoSchema } from "../domain/dtos";

const patientsRouter = Router();

patientsRouter.post(
  "/",
  authRequired,
  requirePermission(Permissions.PATIENTS, "write"),
  validateBody(createPatientDtoSchema),
  createPatient,
);

export { patientsRouter };
