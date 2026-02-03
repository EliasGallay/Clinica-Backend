import { Router } from "express";
import { authRequired, requireRoles } from "../../auth/presentation/auth.middlewares";
import { Role } from "../../../shared/constants";
import { createDoctor } from "./doctors.controllers";
import { validateBody } from "./doctors.middlewares";
import { createDoctorDtoSchema } from "../domain/dtos";

const doctorsRouter = Router();

doctorsRouter.post(
  "/",
  authRequired,
  requireRoles(Role.ADMIN, Role.RECEPTIONIST),
  validateBody(createDoctorDtoSchema),
  createDoctor,
);

export { doctorsRouter };
