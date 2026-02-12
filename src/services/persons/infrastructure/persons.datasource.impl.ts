import type { CreatePersonInput, PersonEntity } from "../domain/person.entity";
import { PersonDatasource } from "../domain/person.datasource";
import { PersonsModel } from "../../../infrastructure/db";
import { toPersonEntity } from "./data/persons.mapper";
import type { PersonsCreationAttributes, PersonsModelInstance } from "./data/persons.types";

export class PersonsPostgresDatasourceImpl implements PersonDatasource {
  async getAll(): Promise<PersonEntity[]> {
    const models = (await PersonsModel.findAll({
      where: { per_dat_deleted_at: null },
      order: [["per_id", "DESC"]],
    })) as PersonsModelInstance[];
    return models.map((model) => toPersonEntity(model));
  }

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

  async update(id: number, data: Partial<PersonEntity>): Promise<PersonEntity | null> {
    const [updated] = await PersonsModel.update(
      data as Partial<PersonsCreationAttributes>,
      { where: { per_id: id, per_dat_deleted_at: null } },
    );
    if (!updated) return null;
    const reloaded = (await PersonsModel.findByPk(id)) as PersonsModelInstance | null;
    return reloaded ? toPersonEntity(reloaded) : null;
  }

  async delete(id: number): Promise<void> {
    await PersonsModel.update(
      { per_dat_deleted_at: new Date() },
      { where: { per_id: id, per_dat_deleted_at: null } },
    );
  }
}
