import type { UserEntity } from "./users.entity";

export interface UserRepository {
  getById(id: number): Promise<UserEntity | null>;
  getByEmail(email: string): Promise<UserEntity | null>;
  getByDni(dni: string): Promise<UserEntity | null>;
  create(user: UserEntity): Promise<UserEntity>;
  update(id: number, data: Partial<UserEntity>): Promise<UserEntity | null>;
  delete(id: number): Promise<void>;
}
