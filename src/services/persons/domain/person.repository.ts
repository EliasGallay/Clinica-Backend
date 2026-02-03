import type { CreatePersonInput, PersonEntity } from "./person.entity";

export interface PersonRepository {
  getById(id: number): Promise<PersonEntity | null>;
  getByDni(dni: string): Promise<PersonEntity | null>;
  getByEmail(email: string): Promise<PersonEntity | null>;
  create(data: CreatePersonInput): Promise<PersonEntity>;
}
