import type { RolPermissionsModelInstance } from "./rol-permissions.types";
import { RolPermissionEntity } from "../../domain/rol-permission.entity";

export const toRolPermissionEntity = (model: RolPermissionsModelInstance): RolPermissionEntity =>
  new RolPermissionEntity(
    model.rpe_id,
    model.rol_id,
    model.rpe_permission_txt_name,
    model.rpe_permission_txt_description,
    model.rpe_bol_can_read,
    model.rpe_bol_can_write,
    model.rpe_dat_created_at,
    model.rpe_dat_updated_at,
  );
