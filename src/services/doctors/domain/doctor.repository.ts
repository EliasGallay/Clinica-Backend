import type { DoctorEntity } from "./doctor.entity";

export interface DoctorRepository {
  getByPersonId(perId: number): Promise<DoctorEntity | null>;
  create(data: Omit<DoctorEntity, "doc_id">): Promise<DoctorEntity>;
}
