import bcrypt from "bcryptjs";
import type { CreateUserDto } from "../dtos";
import type { UserRepository } from "../user.repository";
import { UserEntity } from "../users.entity";

export class CreateUserUseCase {
  constructor(private readonly repository: UserRepository) {}

  async execute(data: CreateUserDto): Promise<UserEntity> {
    const byEmail = await this.repository.getByEmail(data.usr_txt_email);
    if (byEmail) {
      throw new Error("EMAIL_ALREADY_EXISTS");
    }

    const hashedPassword = data.usr_txt_password
      ? await bcrypt.hash(data.usr_txt_password, 10)
      : null;

    const entity = new UserEntity(
      0,
      data.usr_txt_email,
      hashedPassword,
      data.usr_bol_email_verified ?? false,
      data.usr_int_rol,
      data.usr_sta_state,
      data.usr_sta_employee_state,
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
