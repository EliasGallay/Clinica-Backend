import type { CreatePatientDto } from "../dtos";
import type { PatientRepository } from "../patient.repository";
import type { PersonRepository } from "../../../persons/domain/person.repository";
import { PatientEntity } from "../patient.entity";

export class CreatePatientUseCase {
  constructor(
    private readonly repository: PatientRepository,
    private readonly personRepository: PersonRepository,
  ) {}

  async execute(data: CreatePatientDto): Promise<PatientEntity> {
    const person = await this.personRepository.getById(data.per_id);
    if (!person) {
      throw new Error("PERSON_NOT_FOUND");
    }

    const existing = await this.repository.getByPersonId(data.per_id);
    if (existing) {
      throw new Error("PATIENT_ALREADY_EXISTS");
    }

    const entity = new PatientEntity(
      0,
      data.per_id,
      data.pat_sta_state,
      new Date(),
      new Date(),
      null,
    );

    return this.repository.create({
      per_id: entity.per_id,
      pat_sta_state: entity.pat_sta_state,
      pat_dat_created_at: entity.pat_dat_created_at,
      pat_dat_updated_at: entity.pat_dat_updated_at,
      pat_dat_deleted_at: entity.pat_dat_deleted_at,
    });
  }
}
