import { Router } from "express";
import { createUser, deleteUser, getMe, getUserById, updateUser } from "./users.controllers";
import { validateBody } from "./users.middlewares";
import { createUserDtoSchema, updateUserDtoSchema } from "../domain/dtos";
import {
  authRequired,
  requirePermission,
  requireRoles,
} from "../../auth/presentation/auth.middlewares";
import { Permissions, Role } from "../../../shared/constants";

const usersRouter = Router();

usersRouter.post(
  "/",
  authRequired,
  requireRoles(Role.ADMIN),
  requirePermission(Permissions.USERS, "write"),
  validateBody(createUserDtoSchema),
  createUser,
);
usersRouter.get("/me", authRequired, requirePermission(Permissions.USERS, "read"), getMe);
usersRouter.get("/:id", authRequired, requirePermission(Permissions.USERS, "read"), getUserById);
usersRouter.put(
  "/:id",
  authRequired,
  requirePermission(Permissions.USERS, "write"),
  validateBody(updateUserDtoSchema),
  updateUser,
);
usersRouter.delete(
  "/:id",
  authRequired,
  requireRoles(Role.ADMIN),
  requirePermission(Permissions.USERS, "write"),
  deleteUser,
);

export { usersRouter };
