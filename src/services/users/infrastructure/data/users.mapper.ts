import type { UsersModelInstance } from "./users.types";
import { UserEntity } from "../../domain/users.entity";

export const toUserEntity = (model: UsersModelInstance): UserEntity =>
  new UserEntity(
    model.usr_idt_id,
    model.loc_idt_id,
    model.usr_txt_name,
    model.usr_txt_lastname,
    model.usr_txt_dni,
    model.usr_dat_dateofbirth,
    model.usr_int_gender,
    model.usr_txt_celphone,
    model.usr_txt_cuit_cuil,
    model.usr_txt_email,
    model.usr_txt_streetname,
    model.usr_txt_streetnumber,
    model.usr_txt_floor,
    model.usr_txt_department,
    model.usr_txt_postalcode,
    model.usr_int_rol,
    model.usr_dat_registrationdate,
    model.usr_int_registerorigin,
    model.usr_txt_registeroriginhash,
    model.usr_dat_terminationdate,
    model.usr_int_image,
    model.usr_txt_image_ext,
    model.usr_txt_password,
    model.usr_txt_token,
    model.usr_sta_state,
    model.usr_sta_employee_state,
    model.usr_txt_verification_code,
    model.date_deleted_at,
  );
