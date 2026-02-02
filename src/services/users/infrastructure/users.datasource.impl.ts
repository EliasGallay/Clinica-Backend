import type { UserEntity } from "../domain/users.entity";
import { UserDatasource } from "../domain/users.datasource";
import type { Model, ModelStatic } from "sequelize";
import { RolesModel, UsersModel, sequelize } from "../../../infrastructure/db";
import { toUserEntity } from "./data/users.mapper";
import type { UsersCreationAttributes, UsersModelInstance } from "./data/users.types";

type RoleAttributes = {
  id: string;
  rol_name: string;
};

type RoleModelInstance = Model<RoleAttributes> & RoleAttributes;
type ModelStaticRoleModel = ModelStatic<RoleModelInstance>;

export class UserPostgresDatasourceImpl implements UserDatasource {
  private readonly rolesModel = RolesModel as ModelStaticRoleModel;

  private async resolveRoleIds(roleNames: string[]): Promise<string[]> {
    const uniqueRoleNames = [...new Set(roleNames)];
    if (!uniqueRoleNames.length) return [];
    const roles = await this.rolesModel.findAll({
      where: { rol_name: uniqueRoleNames },
      attributes: ["id", "rol_name"],
    });
    if (roles.length !== uniqueRoleNames.length) {
      throw new Error("ROLE_NOT_FOUND");
    }
    return roles.map((role) => role.id);
  }

  private getRoleNames(model: UsersModelInstance): string[] {
    const typed = model as UsersModelInstance & {
      roles?: Array<{ rol_name: string }>;
    };
    return typed.roles?.map((role) => role.rol_name) ?? [];
  }

  async getById(id: number): Promise<UserEntity | null> {
    const model = (await UsersModel.findByPk(id, {
      include: [
        {
          model: this.rolesModel,
          as: "roles",
          attributes: ["rol_name"],
          through: { attributes: [] },
        },
      ],
    })) as UsersModelInstance | null;
    return model ? toUserEntity(model, this.getRoleNames(model)) : null;
  }

  async getByEmail(email: string): Promise<UserEntity | null> {
    const model = (await UsersModel.findOne({
      where: { usr_txt_email: email },
      include: [
        {
          model: this.rolesModel,
          as: "roles",
          attributes: ["rol_name"],
          through: { attributes: [] },
        },
      ],
    })) as UsersModelInstance | null;
    return model ? toUserEntity(model, this.getRoleNames(model)) : null;
  }

  async create(user: UserEntity): Promise<UserEntity> {
    const { usr_idt_id, roles, ...data } = user as UsersCreationAttributes & {
      usr_idt_id?: number;
      roles: string[];
    };
    void usr_idt_id;
    return sequelize.transaction(async (transaction) => {
      const created = (await UsersModel.create(data as UsersCreationAttributes, {
        transaction,
      })) as UsersModelInstance & {
        setRoles?: (roleIds: string[], options: { transaction: unknown }) => Promise<void>;
      };

      const roleIds = await this.resolveRoleIds(roles);
      if (created.setRoles) {
        await created.setRoles(roleIds, { transaction });
      }

      const reloaded = (await UsersModel.findByPk(created.usr_idt_id, {
        include: [
          {
            model: this.rolesModel,
            as: "roles",
            attributes: ["rol_name"],
            through: { attributes: [] },
          },
        ],
        transaction,
      })) as UsersModelInstance | null;

      if (!reloaded) {
        throw new Error("USER_NOT_FOUND");
      }
      return toUserEntity(reloaded, this.getRoleNames(reloaded));
    });
  }

  async update(id: number, data: Partial<UserEntity>): Promise<UserEntity | null> {
    const { roles, ...userData } = data as Partial<UserEntity> & { roles?: string[] };
    return sequelize.transaction(async (transaction) => {
      const hasUserData = Object.keys(userData).length > 0;
      if (hasUserData) {
        const [updated] = await UsersModel.update(userData as Partial<UsersCreationAttributes>, {
          where: { usr_idt_id: id },
          transaction,
        });
        if (!updated) return null;
      } else {
        const exists = await UsersModel.findByPk(id, { transaction });
        if (!exists) return null;
      }

      if (roles) {
        const roleIds = await this.resolveRoleIds(roles);
        const model = (await UsersModel.findByPk(id, {
          transaction,
        })) as
          | (UsersModelInstance & {
              setRoles?: (roleIds: string[], options: { transaction: unknown }) => Promise<void>;
            })
          | null;
        if (!model) return null;
        if (model.setRoles) {
          await model.setRoles(roleIds, { transaction });
        }
      }

      const reloaded = (await UsersModel.findByPk(id, {
        include: [
          {
            model: this.rolesModel,
            as: "roles",
            attributes: ["rol_name"],
            through: { attributes: [] },
          },
        ],
        transaction,
      })) as UsersModelInstance | null;
      return reloaded ? toUserEntity(reloaded, this.getRoleNames(reloaded)) : null;
    });
  }

  async delete(id: number): Promise<void> {
    await UsersModel.update({ date_deleted_at: new Date() }, { where: { usr_idt_id: id } });
  }
}

