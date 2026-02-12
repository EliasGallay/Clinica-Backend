import type { RoleEntity } from "../role.entity";
import type { RoleRepository } from "../role.repository";

export class GetRolesUseCase {
  constructor(private readonly repository: RoleRepository) {}

  execute(): Promise<RoleEntity[]> {
    return this.repository.getAll();
  }
}
