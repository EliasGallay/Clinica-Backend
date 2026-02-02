import type { Model } from "sequelize";

export type UsersAttributes = {
  usr_idt_id: number;
  usr_txt_email: string;
  usr_txt_password: string;
  usr_bol_email_verified: boolean;
  usr_int_rol: number;
  usr_sta_state: number;
  usr_sta_employee_state: number;
  usr_txt_email_verification_code: string | null;
  usr_dat_email_verification_expires_at: Date | null;
  usr_int_email_verification_attempts: number;
  usr_dat_email_verification_last_sent_at: Date | null;
  usr_txt_password_reset_token: string | null;
  usr_dat_password_reset_expires_at: Date | null;
  usr_int_password_reset_attempts: number;
  usr_dat_password_reset_last_sent_at: Date | null;
  usr_dat_created_at: Date;
  usr_dat_updated_at: Date;
  date_deleted_at: Date | null;
};

export type UsersCreationAttributes = Omit<
  UsersAttributes,
  "usr_idt_id" | "usr_dat_created_at" | "usr_dat_updated_at"
>;

export type UsersModelInstance = Model<UsersAttributes, UsersCreationAttributes> & UsersAttributes;
