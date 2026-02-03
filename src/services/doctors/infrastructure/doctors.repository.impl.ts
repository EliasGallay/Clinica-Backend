import type { DoctorEntity } from "../domain/doctor.entity";
import type { DoctorRepository } from "../domain/doctor.repository";
import type { DoctorDatasource } from "../domain/doctor.datasource";

export class DoctorRepositoryImpl implements DoctorRepository {
  constructor(private readonly datasource: DoctorDatasource) {}

  getByPersonId(perId: number): Promise<DoctorEntity | null> {
    return this.datasource.getByPersonId(perId);
  }

  create(data: Omit<DoctorEntity, "doc_id">): Promise<DoctorEntity> {
    return this.datasource.create(data);
  }
}
