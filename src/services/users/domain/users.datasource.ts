import type { UserEntity } from "./users.entity";

export abstract class UserDatasource {
  abstract getById(id: number): Promise<UserEntity | null>;
  abstract getByEmail(email: string): Promise<UserEntity | null>;
  abstract create(user: UserEntity): Promise<UserEntity>;
  abstract update(id: number, data: Partial<UserEntity>): Promise<UserEntity | null>;
  abstract delete(id: number): Promise<void>;
}
