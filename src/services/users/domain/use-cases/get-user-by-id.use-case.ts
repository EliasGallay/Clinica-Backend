import type { UserRepository } from "../user.repository";
import type { UserEntity } from "../users.entity";

export class GetUserByIdUseCase {
  constructor(private readonly repository: UserRepository) {}

  async execute(id: number): Promise<UserEntity | null> {
    return this.repository.getById(id);
  }
}
