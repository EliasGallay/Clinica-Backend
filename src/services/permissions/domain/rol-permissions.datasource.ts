import type { RolPermissionEntity } from "./rol-permission.entity";
import type { GetRolPermissionsQueryDto } from "./dtos";

export type RolPermissionPage = {
  items: RolPermissionEntity[];
  total: number;
  page: number;
  limit: number;
};

export type RolPermissionAccess = {
  rpe_permission_txt_name: string;
  rpe_permission_txt_description: string;
  rpe_bol_can_read: boolean;
  rpe_bol_can_write: boolean;
};

export abstract class RolPermissionsDatasource {
  abstract getById(id: number): Promise<RolPermissionEntity | null>;
  abstract getAll(query: GetRolPermissionsQueryDto): Promise<RolPermissionPage>;
  abstract getByRoleNames(roleNames: string[]): Promise<RolPermissionAccess[]>;
  abstract create(permission: RolPermissionEntity): Promise<RolPermissionEntity>;
  abstract update(
    id: number,
    data: Partial<RolPermissionEntity>,
  ): Promise<RolPermissionEntity | null>;
  abstract delete(id: number): Promise<void>;
}
