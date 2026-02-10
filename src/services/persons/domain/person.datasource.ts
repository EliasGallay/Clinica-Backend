import type { CreatePersonInput, PersonEntity } from "./person.entity";

export abstract class PersonDatasource {
  abstract getAll(): Promise<PersonEntity[]>;
  abstract getById(id: number): Promise<PersonEntity | null>;
  abstract getByDni(dni: string): Promise<PersonEntity | null>;
  abstract getByEmail(email: string): Promise<PersonEntity | null>;
  abstract create(data: CreatePersonInput): Promise<PersonEntity>;
  abstract update(id: number, data: Partial<PersonEntity>): Promise<PersonEntity | null>;
  abstract delete(id: number): Promise<void>;
}
