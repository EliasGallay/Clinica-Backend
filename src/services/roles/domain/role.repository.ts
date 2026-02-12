import type { RoleEntity } from "./role.entity";

export interface RoleRepository {
  getAll(): Promise<RoleEntity[]>;
}
