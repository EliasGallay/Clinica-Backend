import type { DoctorEntity } from "./doctor.entity";

export abstract class DoctorDatasource {
  abstract getByPersonId(perId: number): Promise<DoctorEntity | null>;
  abstract create(data: Omit<DoctorEntity, "doc_id">): Promise<DoctorEntity>;
}
