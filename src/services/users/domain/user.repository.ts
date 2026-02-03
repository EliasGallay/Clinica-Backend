import type { Transaction } from "sequelize";
import type { UserAuthSnapshot, UserEntity } from "./users.entity";

export interface UserRepository {
  getById(id: number): Promise<UserEntity | null>;
  getByEmail(email: string): Promise<UserEntity | null>;
  getByPersonId(perId: number): Promise<UserEntity | null>;
  getAuthSnapshot(id: number): Promise<UserAuthSnapshot | null>;
  create(user: UserEntity): Promise<UserEntity>;
  update(id: number, data: Partial<UserEntity>): Promise<UserEntity | null>;
  incrementTokenVersion(id: number, transaction?: Transaction): Promise<void>;
  delete(id: number): Promise<void>;
}
