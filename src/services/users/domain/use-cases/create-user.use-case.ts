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

    const byDni = await this.repository.getByDni(data.usr_txt_dni);
    if (byDni) {
      throw new Error("DNI_ALREADY_EXISTS");
    }

    const hashedPassword = data.usr_txt_password
      ? await bcrypt.hash(data.usr_txt_password, 10)
      : null;

    const entity = new UserEntity(
      0,
      data.loc_idt_id,
      data.usr_txt_name,
      data.usr_txt_lastname,
      data.usr_txt_dni,
      data.usr_dat_dateofbirth,
      data.usr_int_gender,
      data.usr_txt_celphone ?? null,
      data.usr_txt_cuit_cuil,
      data.usr_txt_email,
      data.usr_txt_streetname,
      data.usr_txt_streetnumber,
      data.usr_txt_floor ?? null,
      data.usr_txt_department ?? null,
      data.usr_txt_postalcode,
      data.usr_int_rol,
      data.usr_dat_registrationdate,
      data.usr_int_registerorigin,
      data.usr_txt_registeroriginhash ?? null,
      data.usr_dat_terminationdate ?? null,
      data.usr_int_image ?? null,
      data.usr_txt_image_ext ?? null,
      hashedPassword,
      data.usr_txt_token ?? null,
      data.usr_sta_state,
      data.usr_sta_employee_state,
      data.usr_txt_verification_code ?? null,
      data.date_deleted_at ?? null,
    );

    return this.repository.create(entity);
  }
}
