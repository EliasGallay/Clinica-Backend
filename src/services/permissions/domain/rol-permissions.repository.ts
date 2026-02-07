import type { RolPermissionEntity } from "./rol-permission.entity";
import type { GetRolPermissionsQueryDto } from "./dtos";
import type { RolPermissionAccess, RolPermissionPage } from "./rol-permissions.datasource";

export abstract class RolPermissionsRepository {
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
