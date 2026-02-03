import type { PatientEntity } from "../domain/patient.entity";
import type { PatientRepository } from "../domain/patient.repository";
import type { PatientDatasource } from "../domain/patient.datasource";

export class PatientRepositoryImpl implements PatientRepository {
  constructor(private readonly datasource: PatientDatasource) {}

  getByPersonId(perId: number): Promise<PatientEntity | null> {
    return this.datasource.getByPersonId(perId);
  }

  create(data: Omit<PatientEntity, "pat_id">): Promise<PatientEntity> {
    return this.datasource.create(data);
  }
}
