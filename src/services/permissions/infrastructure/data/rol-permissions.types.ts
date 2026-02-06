import type { Model } from "sequelize";

export type RolPermissionsAttributes = {
  rpe_id: number;
  rol_id: string;
  rpe_permission_txt_name: string;
  rpe_bol_can_read: boolean;
  rpe_bol_can_write: boolean;
  rpe_dat_created_at: Date;
  rpe_dat_updated_at: Date;
  rpe_permission_txt_description : string;
};

export type RolPermissionsCreationAttributes = Omit<
  RolPermissionsAttributes,
  "rpe_id" | "rpe_dat_created_at" | "rpe_dat_updated_at"
>;

export type RolPermissionsModelInstance = Model<
  RolPermissionsAttributes,
  RolPermissionsCreationAttributes
> &
  RolPermissionsAttributes;
