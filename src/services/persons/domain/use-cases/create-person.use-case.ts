import type { CreatePersonDto } from "../dtos";
import type { PersonRepository } from "../person.repository";
import { PersonEntity } from "../person.entity";

export class CreatePersonUseCase {
  constructor(private readonly repository: PersonRepository) {}

  async execute(data: CreatePersonDto): Promise<PersonEntity> {
    if (data.per_txt_dni) {
      const existingByDni = await this.repository.getByDni(data.per_txt_dni);
      if (existingByDni) {
        throw new Error("DNI_ALREADY_EXISTS");
      }
    }

    if (data.per_txt_email) {
      const existingByEmail = await this.repository.getByEmail(data.per_txt_email);
      if (existingByEmail) {
        throw new Error("PERSON_EMAIL_ALREADY_EXISTS");
      }
    }

    const entity = new PersonEntity(
      0,
      data.per_txt_first_name,
      data.per_txt_last_name,
      data.per_txt_dni ?? null,
      data.per_dat_birthdate ?? null,
      data.per_int_gender ?? null,
      data.per_txt_email ?? null,
      data.per_txt_phone ?? null,
      data.per_txt_address ?? null,
      data.per_sta_state,
      new Date(),
      new Date(),
      null,
    );

    return this.repository.create({
      per_txt_first_name: entity.per_txt_first_name,
      per_txt_last_name: entity.per_txt_last_name,
      per_txt_dni: entity.per_txt_dni,
      per_dat_birthdate: entity.per_dat_birthdate,
      per_int_gender: entity.per_int_gender,
      per_txt_email: entity.per_txt_email,
      per_txt_phone: entity.per_txt_phone,
      per_txt_address: entity.per_txt_address,
      per_sta_state: entity.per_sta_state,
    });
  }
}
