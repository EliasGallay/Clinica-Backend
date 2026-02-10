import type { PersonRepository } from "../person.repository";

export class DeletePersonUseCase {
  constructor(private readonly repository: PersonRepository) {}

  async execute(id: number): Promise<void> {
    return this.repository.delete(id);
  }
}
