import type { Model } from "sequelize";

export type UsersAttributes = {
  usr_idt_id: number;
  loc_idt_id: number;
  usr_txt_name: string;
  usr_txt_lastname: string;
  usr_txt_dni: string;
  usr_dat_dateofbirth: Date;
  usr_int_gender: number;
  usr_txt_celphone: string | null;
  usr_txt_cuit_cuil: string;
  usr_txt_email: string;
  usr_txt_streetname: string;
  usr_txt_streetnumber: string;
  usr_txt_floor: string | null;
  usr_txt_department: string | null;
  usr_txt_postalcode: string;
  usr_int_rol: number;
  usr_dat_registrationdate: Date;
  usr_int_registerorigin: number;
  usr_txt_registeroriginhash: string | null;
  usr_dat_terminationdate: Date | null;
  usr_int_image: number | null;
  usr_txt_password: string | null;
  usr_txt_token: string | null;
  usr_sta_state: number;
  usr_sta_employee_state: number;
  usr_txt_verification_code: string | null;
  date_deleted_at: Date | null;
  usr_txt_image_ext: string | null;
};

export type UsersCreationAttributes = Omit<UsersAttributes, "usr_idt_id">;

export type UsersModelInstance = Model<UsersAttributes, UsersCreationAttributes> & UsersAttributes;
