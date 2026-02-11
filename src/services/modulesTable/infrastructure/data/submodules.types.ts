import type { Model } from "sequelize";

export type SubmodulesAttributes = {
  sub_id: number;
  mod_id: number;
  sub_txt_key: string;
  sub_txt_name: string;
  sub_int_order: number;
  sub_sta_state: number;
  sub_dat_created_at: Date;
  sub_dat_updated_at: Date;
  sub_dat_deleted_at: Date | null;
  sub_path_to: string;
  sub_icon: string | null;
};

export type SubmodulesCreationAttributes = Omit<
  SubmodulesAttributes,
  "sub_id" | "sub_dat_created_at" | "sub_dat_updated_at" | "sub_dat_deleted_at"
>;

export type SubmodulesModelInstance = Model<SubmodulesAttributes, SubmodulesCreationAttributes> &
  SubmodulesAttributes;
