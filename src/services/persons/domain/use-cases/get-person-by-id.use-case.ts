import type { PersonRepository } from "../person.repository";
import type { PersonEntity } from "../person.entity";

export class GetPersonByIdUseCase {
  constructor(private readonly repository: PersonRepository) {}

  async execute(id: number): Promise<PersonEntity | null> {
    return this.repository.getById(id);
  }
}
