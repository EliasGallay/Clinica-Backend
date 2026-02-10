import type {
  RolPermissionAccess,
  RolPermissionsDatasource,
} from "../domain/rol-permissions.datasource";
import type { GetRolPermissionsQueryDto } from "../domain/dtos";
import type { RolPermissionEntity } from "../domain/rol-permission.entity";
import { RolesModel, RolPermissionsModel } from "../../../infrastructure/db";
import { toRolPermissionEntity } from "./data/rol-permissions.mapper";
import type {
  RolPermissionsCreationAttributes,
  RolPermissionsModelInstance,
} from "./data/rol-permissions.types";

export class RolPermissionsPostgresDatasourceImpl implements RolPermissionsDatasource {
  async getById(id: number): Promise<RolPermissionEntity | null> {
    const model = (await RolPermissionsModel.findByPk(id)) as RolPermissionsModelInstance | null;
    return model ? toRolPermissionEntity(model) : null;
  }

  async getAll(query: GetRolPermissionsQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const offset = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (query.rol_id) {
      where.rol_id = query.rol_id;
    }

    const result = await RolPermissionsModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [
        ["rpe_permission_txt_name", "ASC"],
        ["rpe_id", "ASC"],
      ],
      distinct: true,
    });

    return {
      items: (result.rows as RolPermissionsModelInstance[]).map(toRolPermissionEntity),
      total: result.count,
      page,
      limit,
    };
  }

  async getByRoleNames(roleNames: string[]): Promise<RolPermissionAccess[]> {
    const uniqueRoleNames = [...new Set(roleNames)].filter((name) => name);
    if (!uniqueRoleNames.length) return [];

    const roles = (await RolesModel.findAll({
      where: { rol_name: uniqueRoleNames },
      attributes: ["id", "rol_name"],
    })) as unknown as Array<{ id: string; rol_name: string }>;
    const roleIds = roles.map((role) => role.id);
    if (!roleIds.length) return [];

    const permissions = (await RolPermissionsModel.findAll({
      where: { rol_id: roleIds },
      attributes: [
        "rpe_permission_txt_name",
        "rpe_permission_txt_description",
        "rpe_bol_can_read",
        "rpe_bol_can_write",
      ],
    })) as RolPermissionsModelInstance[];

    const map = new Map<string, RolPermissionAccess>();
    for (const permission of permissions) {
      const key = permission.rpe_permission_txt_name;
      const existing = map.get(key);
      if (!existing) {
        map.set(key, {
          rpe_permission_txt_name: permission.rpe_permission_txt_name,
          rpe_permission_txt_description: permission.rpe_permission_txt_description,
          rpe_bol_can_read: permission.rpe_bol_can_read,
          rpe_bol_can_write: permission.rpe_bol_can_write,
        });
        continue;
      }
      map.set(key, {
        ...existing,
        rpe_bol_can_read: existing.rpe_bol_can_read || permission.rpe_bol_can_read,
        rpe_bol_can_write: existing.rpe_bol_can_write || permission.rpe_bol_can_write,
      });
    }

    return Array.from(map.values()).sort((a, b) =>
      a.rpe_permission_txt_name.localeCompare(b.rpe_permission_txt_name),
    );
  }

  async create(permission: RolPermissionEntity): Promise<RolPermissionEntity> {
    const role = await RolesModel.findByPk(permission.rol_id);
    if (!role) {
      throw new Error("ROLE_NOT_FOUND");
    }
    const { rpe_id, ...data } = permission as RolPermissionsCreationAttributes & {
      rpe_id?: number;
    };
    void rpe_id;
    const created = (await RolPermissionsModel.create(
      data as RolPermissionsCreationAttributes,
    )) as RolPermissionsModelInstance;
    return toRolPermissionEntity(created);
  }

  async update(
    id: number,
    data: Partial<RolPermissionEntity>,
  ): Promise<RolPermissionEntity | null> {
    const [updated] = await RolPermissionsModel.update(
      data as Partial<RolPermissionsCreationAttributes>,
      { where: { rpe_id: id } },
    );
    if (!updated) return null;
    const model = (await RolPermissionsModel.findByPk(id)) as RolPermissionsModelInstance | null;
    return model ? toRolPermissionEntity(model) : null;
  }

  async delete(id: number): Promise<void> {
    await RolPermissionsModel.destroy({ where: { rpe_id: id } });
  }
}
