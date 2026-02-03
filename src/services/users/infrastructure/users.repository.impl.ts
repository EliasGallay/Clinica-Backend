import type { Transaction } from "sequelize";
import type { UserAuthSnapshot, UserEntity } from "../domain/users.entity";
import type { UserRepository } from "../domain/user.repository";
import type { UserDatasource } from "../domain/users.datasource";

export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly datasource: UserDatasource) {}

  getById(id: number): Promise<UserEntity | null> {
    return this.datasource.getById(id);
  }

  getByEmail(email: string): Promise<UserEntity | null> {
    return this.datasource.getByEmail(email);
  }

  getByPersonId(perId: number): Promise<UserEntity | null> {
    return this.datasource.getByPersonId(perId);
  }

  getAuthSnapshot(id: number): Promise<UserAuthSnapshot | null> {
    return this.datasource.getAuthSnapshot(id);
  }

  create(user: UserEntity): Promise<UserEntity> {
    return this.datasource.create(user);
  }

  update(id: number, data: Partial<UserEntity>): Promise<UserEntity | null> {
    return this.datasource.update(id, data);
  }

  incrementTokenVersion(id: number, transaction?: Transaction): Promise<void> {
    return this.datasource.incrementTokenVersion(id, transaction);
  }

  delete(id: number): Promise<void> {
    return this.datasource.delete(id);
  }
}
