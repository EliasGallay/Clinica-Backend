import type { RoleEntity } from "../domain/role.entity";
import { RoleDatasource } from "../domain/role.datasource";
import { RolesModel } from "../../../infrastructure/db";
import { toRoleEntity } from "./data/roles.mapper";
import type { RolesModelInstance } from "./data/roles.types";

export class RolesPostgresDatasourceImpl implements RoleDatasource {
  async getAll(): Promise<RoleEntity[]> {
    const models = (await RolesModel.findAll({
      order: [["rol_name", "ASC"]],
    })) as RolesModelInstance[];
    return models.map((model) => toRoleEntity(model));
  }
}
