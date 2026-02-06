import type { UpdateRolPermissionDto } from "../dtos";
import type { RolPermissionsRepository } from "../rol-permissions.repository";

export class UpdateRolPermissionUseCase {
  constructor(private readonly repository: RolPermissionsRepository) {}

  async execute(rolId: string, id: number, data: UpdateRolPermissionDto) {
    const existing = await this.repository.getById(id);
    if (!existing || existing.rol_id !== rolId) return null;

    return this.repository.update(id, { ...data, rpe_dat_updated_at: new Date() });
  }
}
