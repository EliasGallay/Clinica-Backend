import type { DoctorEntity } from "../domain/doctor.entity";
import { DoctorDatasource } from "../domain/doctor.datasource";
import { DoctorsModel } from "../../../infrastructure/db";
import { toDoctorEntity } from "./data/doctors.mapper";
import type { DoctorsCreationAttributes, DoctorsModelInstance } from "./data/doctors.types";

export class DoctorsPostgresDatasourceImpl implements DoctorDatasource {
  async getByPersonId(perId: number): Promise<DoctorEntity | null> {
    const model = (await DoctorsModel.findOne({
      where: { per_id: perId },
    })) as DoctorsModelInstance | null;
    return model ? toDoctorEntity(model) : null;
  }

  async create(data: Omit<DoctorEntity, "doc_id">): Promise<DoctorEntity> {
    const created = (await DoctorsModel.create(
      data as DoctorsCreationAttributes,
    )) as DoctorsModelInstance;
    return toDoctorEntity(created);
  }
}
