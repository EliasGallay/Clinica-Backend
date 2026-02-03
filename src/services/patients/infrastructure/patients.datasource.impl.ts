import type { PatientEntity } from "../domain/patient.entity";
import { PatientDatasource } from "../domain/patient.datasource";
import { PatientsModel } from "../../../infrastructure/db";
import { toPatientEntity } from "./data/patients.mapper";
import type { PatientsCreationAttributes, PatientsModelInstance } from "./data/patients.types";

export class PatientsPostgresDatasourceImpl implements PatientDatasource {
  async getByPersonId(perId: number): Promise<PatientEntity | null> {
    const model = (await PatientsModel.findOne({
      where: { per_id: perId },
    })) as PatientsModelInstance | null;
    return model ? toPatientEntity(model) : null;
  }

  async create(data: Omit<PatientEntity, "pat_id">): Promise<PatientEntity> {
    const created = (await PatientsModel.create(
      data as PatientsCreationAttributes,
    )) as PatientsModelInstance;
    return toPatientEntity(created);
  }
}
