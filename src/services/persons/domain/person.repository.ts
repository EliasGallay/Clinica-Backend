import type { CreatePersonInput, PersonEntity } from "./person.entity";

export interface PersonRepository {
  getAll(): Promise<PersonEntity[]>;
  getById(id: number): Promise<PersonEntity | null>;
  getByDni(dni: string): Promise<PersonEntity | null>;
  getByEmail(email: string): Promise<PersonEntity | null>;
  create(data: CreatePersonInput): Promise<PersonEntity>;
  update(id: number, data: Partial<PersonEntity>): Promise<PersonEntity | null>;
  delete(id: number): Promise<void>;
}
