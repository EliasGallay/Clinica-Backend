import type { RolesModelInstance } from "./roles.types";
import { RoleEntity } from "../../domain/role.entity";

export const toRoleEntity = (model: RolesModelInstance): RoleEntity =>
  new RoleEntity(model.id, model.rol_name, model.rol_description ?? null, model.rol_weight ?? null);
