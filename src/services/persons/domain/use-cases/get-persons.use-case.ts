import type { PersonRepository } from "../person.repository";
import type { PersonEntity } from "../person.entity";

export class GetPersonsUseCase {
  constructor(private readonly repository: PersonRepository) {}

  execute(): Promise<PersonEntity[]> {
    return this.repository.getAll();
  }
}
