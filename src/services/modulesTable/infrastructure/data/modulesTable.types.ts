import type { Model } from "sequelize";

export type ModulesTableAttributes = {
  mod_id: number;
  mod_txt_key: string;
  mod_txt_name: string;
  mod_int_order: number;
  mod_sta_state: number;
  mod_dat_created_at: Date;
  mod_dat_updated_at: Date;
  mod_dat_deleted_at: Date | null;
  mod_path_to: string;
};

export type ModulesTableCreationAttributes = Omit<
  ModulesTableAttributes,
  "mod_id" | "mod_dat_created_at" | "mod_dat_updated_at" | "mod_dat_deleted_at"
>;

export type ModulesTableModelInstance = Model<
  ModulesTableAttributes,
  ModulesTableCreationAttributes
> &
  ModulesTableAttributes;
