import type { UserRepository } from "../user.repository";
import type { UserEntity } from "../users.entity";

export class GetUsersUseCase {
  constructor(private readonly repository: UserRepository) {}

  execute(): Promise<UserEntity[]> {
    return this.repository.getAll();
  }
}
