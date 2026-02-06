import type { GetRolPermissionsQueryDto } from "../dtos";
import type { RolPermissionsRepository } from "../rol-permissions.repository";
import type { RolPermissionPage } from "../rol-permissions.datasource";

export class GetRolPermissionsUseCase {
  constructor(private readonly repository: RolPermissionsRepository) {}

  execute(query: GetRolPermissionsQueryDto): Promise<RolPermissionPage> {
    return this.repository.getAll(query);
  }
}
