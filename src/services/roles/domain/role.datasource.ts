import type { RoleEntity } from "./role.entity";

export abstract class RoleDatasource {
  abstract getAll(): Promise<RoleEntity[]>;
}
