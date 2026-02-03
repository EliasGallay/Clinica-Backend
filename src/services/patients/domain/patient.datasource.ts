import type { PatientEntity } from "./patient.entity";

export abstract class PatientDatasource {
  abstract getByPersonId(perId: number): Promise<PatientEntity | null>;
  abstract create(data: Omit<PatientEntity, "pat_id">): Promise<PatientEntity>;
}
