import { Router } from "express";
import { authRequired, requirePermission } from "../../auth/presentation/auth.middlewares";
import { Permissions } from "../../../shared/constants";
import { createDoctor } from "./doctors.controllers";
import { validateBody } from "./doctors.middlewares";
import { createDoctorDtoSchema } from "../domain/dtos";

const doctorsRouter = Router();

doctorsRouter.post(
  "/",
  authRequired,
  requirePermission(Permissions.DOCTORS, "write"),
  validateBody(createDoctorDtoSchema),
  createDoctor,
);

export { doctorsRouter };
