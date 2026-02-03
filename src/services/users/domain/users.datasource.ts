import type { Transaction } from "sequelize";
import type { UserAuthSnapshot, UserEntity } from "./users.entity";

export abstract class UserDatasource {
  abstract getById(id: number): Promise<UserEntity | null>;
  abstract getByEmail(email: string): Promise<UserEntity | null>;
  abstract getByPersonId(perId: number): Promise<UserEntity | null>;
  abstract getAuthSnapshot(id: number): Promise<UserAuthSnapshot | null>;
  abstract create(user: UserEntity): Promise<UserEntity>;
  abstract update(id: number, data: Partial<UserEntity>): Promise<UserEntity | null>;
  abstract incrementTokenVersion(id: number, transaction?: Transaction): Promise<void>;
  abstract delete(id: number): Promise<void>;
}
