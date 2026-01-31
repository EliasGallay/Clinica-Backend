import { Router } from "express";
import { createUser, deleteUser, getUserById, updateUser } from "./users.controllers";
import { validateBody } from "./users.middlewares";
import { createUserDtoSchema, updateUserDtoSchema } from "../domain/dtos";
import {
  authRequired,
  requireRoles,
  requireSelfOrRoles,
} from "../../auth/presentation/auth.middlewares";
import { Role } from "../../../shared/constants";

const usersRouter = Router();

usersRouter.post(
  "/",
  authRequired,
  requireRoles(Role.ADMIN, Role.RECEPTIONIST),
  validateBody(createUserDtoSchema),
  createUser,
);
usersRouter.get(
  "/:id",
  authRequired,
  requireSelfOrRoles(Role.ADMIN, Role.RECEPTIONIST, Role.DOCTOR),
  getUserById,
);
usersRouter.put(
  "/:id",
  authRequired,
  requireRoles(Role.ADMIN, Role.RECEPTIONIST),
  validateBody(updateUserDtoSchema),
  updateUser,
);
usersRouter.delete("/:id", authRequired, requireRoles(Role.ADMIN), deleteUser);

export { usersRouter };
