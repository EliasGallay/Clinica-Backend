import type { PatientEntity } from "./patient.entity";

export interface PatientRepository {
  getByPersonId(perId: number): Promise<PatientEntity | null>;
  create(data: Omit<PatientEntity, "pat_id">): Promise<PatientEntity>;
}
