import type { CreateDoctorDto } from "../dtos";
import type { DoctorRepository } from "../doctor.repository";
import type { PersonRepository } from "../../../persons/domain/person.repository";
import { DoctorEntity } from "../doctor.entity";

export class CreateDoctorUseCase {
  constructor(
    private readonly repository: DoctorRepository,
    private readonly personRepository: PersonRepository,
  ) {}

  async execute(data: CreateDoctorDto): Promise<DoctorEntity> {
    const person = await this.personRepository.getById(data.per_id);
    if (!person) {
      throw new Error("PERSON_NOT_FOUND");
    }

    const existing = await this.repository.getByPersonId(data.per_id);
    if (existing) {
      throw new Error("DOCTOR_ALREADY_EXISTS");
    }

    const entity = new DoctorEntity(
      0,
      data.per_id,
      data.doc_txt_license ?? null,
      data.doc_txt_specialty ?? null,
      data.doc_sta_state,
      new Date(),
      new Date(),
      null,
    );

    return this.repository.create({
      per_id: entity.per_id,
      doc_txt_license: entity.doc_txt_license,
      doc_txt_specialty: entity.doc_txt_specialty,
      doc_sta_state: entity.doc_sta_state,
      doc_dat_created_at: entity.doc_dat_created_at,
      doc_dat_updated_at: entity.doc_dat_updated_at,
      doc_dat_deleted_at: entity.doc_dat_deleted_at,
    });
  }
}
