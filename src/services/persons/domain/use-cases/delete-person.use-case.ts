import type { PersonRepository } from "../person.repository";

export class DeletePersonUseCase {
  constructor(private readonly repository: PersonRepository) {}

  async execute(id: number): Promise<void> {
    const existing = await this.repository.getById(id);
    if (!existing) {
      throw new Error("PERSON_NOT_FOUND");
    }
    return this.repository.delete(id);
  }
}
