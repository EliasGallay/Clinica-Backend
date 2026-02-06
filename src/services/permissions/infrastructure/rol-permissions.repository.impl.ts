import type { RolPermissionEntity } from "../domain/rol-permission.entity";
import type { RolPermissionsRepository } from "../domain/rol-permissions.repository";
import type { RolPermissionsDatasource } from "../domain/rol-permissions.datasource";
import type { GetRolPermissionsQueryDto } from "../domain/dtos";
import type { RolPermissionPage } from "../domain/rol-permissions.datasource";

export class RolPermissionsRepositoryImpl implements RolPermissionsRepository {
  constructor(private readonly datasource: RolPermissionsDatasource) {}

  getById(id: number): Promise<RolPermissionEntity | null> {
    return this.datasource.getById(id);
  }

  getAll(query: GetRolPermissionsQueryDto): Promise<RolPermissionPage> {
    return this.datasource.getAll(query);
  }

  create(permission: RolPermissionEntity): Promise<RolPermissionEntity> {
    return this.datasource.create(permission);
  }

  update(id: number, data: Partial<RolPermissionEntity>): Promise<RolPermissionEntity | null> {
    return this.datasource.update(id, data);
  }

  delete(id: number): Promise<void> {
    return this.datasource.delete(id);
  }
}
