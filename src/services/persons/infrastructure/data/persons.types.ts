import type { Model } from "sequelize";

export type PersonsAttributes = {
  per_id: number;
  per_txt_first_name: string;
  per_txt_last_name: string;
  per_txt_dni: string | null;
  per_dat_birthdate: Date | null;
  per_int_gender: number | null;
  per_txt_email: string | null;
  per_txt_phone: string | null;
  per_txt_address: string | null;
  per_sta_state: number;
  per_dat_created_at: Date;
  per_dat_updated_at: Date;
  per_dat_deleted_at: Date | null;
};

export type PersonsCreationAttributes = Omit<
  PersonsAttributes,
  "per_id" | "per_dat_created_at" | "per_dat_updated_at"
>;

export type PersonsModelInstance = Model<PersonsAttributes, PersonsCreationAttributes> &
  PersonsAttributes;
