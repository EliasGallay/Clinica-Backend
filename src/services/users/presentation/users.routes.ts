import { Router } from "express";
import { createUser, deleteUser, getMe, getUserById, updateUser } from "./users.controllers";
import { validateBody } from "./users.middlewares";
import { createUserDtoSchema, updateUserDtoSchema } from "../domain/dtos";
import { authRequired, requireRoles } from "../../auth/presentation/auth.middlewares";
import { Role } from "../../../shared/constants";

const usersRouter = Router();

usersRouter.post(
  "/",
  authRequired,
  requireRoles(Role.ADMIN),
  validateBody(createUserDtoSchema),
  createUser,
);
usersRouter.get("/me", authRequired, requireRoles(Role.ADMIN, Role.RECEPTIONIST), getMe);
usersRouter.get("/:id", authRequired, requireRoles(Role.ADMIN, Role.RECEPTIONIST), getUserById);
usersRouter.put(
  "/:id",
  authRequired,
  requireRoles(Role.ADMIN, Role.RECEPTIONIST),
  validateBody(updateUserDtoSchema),
  updateUser,
);
usersRouter.delete("/:id", authRequired, requireRoles(Role.ADMIN), deleteUser);

export { usersRouter };
