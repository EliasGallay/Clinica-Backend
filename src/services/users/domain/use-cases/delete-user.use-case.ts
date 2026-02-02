import type { UserRepository } from "../user.repository";

export class DeleteUserUseCase {
  constructor(private readonly repository: UserRepository) {}

  async execute(id: number): Promise<void> {
    return this.repository.delete(id);
  }
}
