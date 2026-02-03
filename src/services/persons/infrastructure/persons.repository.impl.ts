import type { CreatePersonInput, PersonEntity } from "../domain/person.entity";
import type { PersonRepository } from "../domain/person.repository";
import type { PersonDatasource } from "../domain/person.datasource";

export class PersonRepositoryImpl implements PersonRepository {
  constructor(private readonly datasource: PersonDatasource) {}

  getById(id: number): Promise<PersonEntity | null> {
    return this.datasource.getById(id);
  }

  getByDni(dni: string): Promise<PersonEntity | null> {
    return this.datasource.getByDni(dni);
  }

  getByEmail(email: string): Promise<PersonEntity | null> {
    return this.datasource.getByEmail(email);
  }

  create(data: CreatePersonInput): Promise<PersonEntity> {
    return this.datasource.create(data);
  }
}
