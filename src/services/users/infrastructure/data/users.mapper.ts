import type { UsersModelInstance } from "./users.types";
import { UserEntity } from "../../domain/users.entity";

export const toUserEntity = (model: UsersModelInstance): UserEntity =>
  new UserEntity(
    model.usr_idt_id,
    model.usr_txt_email,
    model.usr_txt_password,
    model.usr_bol_email_verified,
    model.usr_int_rol,
    model.usr_sta_state,
    model.usr_sta_employee_state,
    model.usr_txt_email_verification_code,
    model.usr_dat_email_verification_expires_at,
    model.usr_int_email_verification_attempts,
    model.usr_dat_email_verification_last_sent_at,
    model.usr_txt_password_reset_token,
    model.usr_dat_password_reset_expires_at,
    model.usr_int_password_reset_attempts,
    model.usr_dat_password_reset_last_sent_at,
    model.usr_dat_created_at,
    model.usr_dat_updated_at,
    model.date_deleted_at,
  );
