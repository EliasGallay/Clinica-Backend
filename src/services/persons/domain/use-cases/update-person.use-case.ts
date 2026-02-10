import type { UpdatePersonDto } from "../dtos";
import type { PersonRepository } from "../person.repository";
import type { PersonEntity } from "../person.entity";

export class UpdatePersonUseCase {
  constructor(private readonly repository: PersonRepository) {}

  async execute(id: number, data: UpdatePersonDto): Promise<PersonEntity | null> {
    if (data.per_txt_dni !== undefined && data.per_txt_dni !== null) {
      const existingByDni = await this.repository.getByDni(data.per_txt_dni);
      if (existingByDni && existingByDni.per_id !== id) {
        throw new Error("DNI_ALREADY_EXISTS");
      }
    }

    if (data.per_txt_email !== undefined && data.per_txt_email !== null) {
      const existingByEmail = await this.repository.getByEmail(data.per_txt_email);
      if (existingByEmail && existingByEmail.per_id !== id) {
        throw new Error("PERSON_EMAIL_ALREADY_EXISTS");
      }
    }

    const updateData: Partial<PersonEntity> = {
      ...data,
      per_dat_updated_at: new Date(),
    } as Partial<PersonEntity>;

    return this.repository.update(id, updateData);
  }
}
