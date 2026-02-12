import type { RoleEntity } from "../domain/role.entity";
import type { RoleRepository } from "../domain/role.repository";
import type { RoleDatasource } from "../domain/role.datasource";

export class RoleRepositoryImpl implements RoleRepository {
  constructor(private readonly datasource: RoleDatasource) {}

  getAll(): Promise<RoleEntity[]> {
    return this.datasource.getAll();
  }
}
