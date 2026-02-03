import bcrypt from "bcryptjs";
import type { CreateUserDto } from "../dtos";
import type { UserRepository } from "../user.repository";
import { UserEntity } from "../users.entity";
import type { PersonRepository } from "../../../persons/domain/person.repository";

export class CreateUserUseCase {
  constructor(
    private readonly repository: UserRepository,
    private readonly personRepository: PersonRepository,
  ) {}

  async execute(data: CreateUserDto): Promise<UserEntity> {
    const byEmail = await this.repository.getByEmail(data.usr_txt_email);
    if (byEmail) {
      throw new Error("EMAIL_ALREADY_EXISTS");
    }

    const person = await this.personRepository.getById(data.per_id);
    if (!person) {
      throw new Error("PERSON_NOT_FOUND");
    }

    const byPersonId = await this.repository.getByPersonId(data.per_id);
    if (byPersonId) {
      throw new Error("PERSON_ALREADY_LINKED");
    }

    const hashedPassword = data.usr_txt_password
      ? await bcrypt.hash(data.usr_txt_password, 10)
      : null;

    const entity = new UserEntity(
      0,
      data.per_id,
      data.usr_txt_email,
      hashedPassword,
      data.usr_bol_email_verified ?? false,
      data.roles,
      data.usr_sta_state,
      data.usr_sta_employee_state,
      0,
      null,
      null,
      0,
      null,
      null,
      null,
      0,
      null,
      new Date(),
      new Date(),
      null,
    );

    return this.repository.create(entity);
  }
}
