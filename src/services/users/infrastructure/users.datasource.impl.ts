import type { UserEntity } from "../domain/users.entity";
import { UserDatasource } from "../domain/users.datasource";
import { UsersModel } from "../../../infrastructure/db";
import { toUserEntity } from "./data/users.mapper";
import type { UsersCreationAttributes, UsersModelInstance } from "./data/users.types";

export class UserPostgresDatasourceImpl implements UserDatasource {
  async getById(id: number): Promise<UserEntity | null> {
    const model = (await UsersModel.findByPk(id)) as UsersModelInstance | null;
    return model ? toUserEntity(model) : null;
  }

  async getByEmail(email: string): Promise<UserEntity | null> {
    const model = (await UsersModel.findOne({
      where: { usr_txt_email: email },
    })) as UsersModelInstance | null;
    return model ? toUserEntity(model) : null;
  }

  async create(user: UserEntity): Promise<UserEntity> {
    const { usr_idt_id, ...data } = user as UsersCreationAttributes & { usr_idt_id?: number };
    void usr_idt_id;
    const created = (await UsersModel.create(
      data as UsersCreationAttributes,
    )) as UsersModelInstance;
    return toUserEntity(created);
  }

  async update(id: number, data: Partial<UserEntity>): Promise<UserEntity | null> {
    const [updated] = await UsersModel.update(data as Partial<UsersCreationAttributes>, {
      where: { usr_idt_id: id },
    });
    if (!updated) return null;
    const model = (await UsersModel.findByPk(id)) as UsersModelInstance | null;
    return model ? toUserEntity(model) : null;
  }

  async delete(id: number): Promise<void> {
    await UsersModel.update({ date_deleted_at: new Date() }, { where: { usr_idt_id: id } });
  }
}
