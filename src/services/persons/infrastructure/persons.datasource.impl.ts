import type { CreatePersonInput, PersonEntity } from "../domain/person.entity";
import { PersonDatasource } from "../domain/person.datasource";
import { PersonsModel } from "../../../infrastructure/db";
import { toPersonEntity } from "./data/persons.mapper";
import type { PersonsCreationAttributes, PersonsModelInstance } from "./data/persons.types";

export class PersonsPostgresDatasourceImpl implements PersonDatasource {
  async getById(id: number): Promise<PersonEntity | null> {
    const model = (await PersonsModel.findByPk(id)) as PersonsModelInstance | null;
    return model ? toPersonEntity(model) : null;
  }

  async getByDni(dni: string): Promise<PersonEntity | null> {
    const model = (await PersonsModel.findOne({
      where: { per_txt_dni: dni },
    })) as PersonsModelInstance | null;
    return model ? toPersonEntity(model) : null;
  }

  async getByEmail(email: string): Promise<PersonEntity | null> {
    const model = (await PersonsModel.findOne({
      where: { per_txt_email: email.toLowerCase() },
    })) as PersonsModelInstance | null;
    return model ? toPersonEntity(model) : null;
  }

  async create(data: CreatePersonInput): Promise<PersonEntity> {
    const created = (await PersonsModel.create(
      data as PersonsCreationAttributes,
    )) as PersonsModelInstance;
    return toPersonEntity(created);
  }
}
