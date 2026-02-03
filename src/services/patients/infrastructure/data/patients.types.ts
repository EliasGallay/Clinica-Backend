import type { Model } from "sequelize";

export type PatientsAttributes = {
  pat_id: number;
  per_id: number;
  pat_sta_state: number;
  pat_dat_created_at: Date;
  pat_dat_updated_at: Date;
  pat_dat_deleted_at: Date | null;
};

export type PatientsCreationAttributes = Omit<
  PatientsAttributes,
  "pat_id" | "pat_dat_created_at" | "pat_dat_updated_at"
>;

export type PatientsModelInstance = Model<PatientsAttributes, PatientsCreationAttributes> &
  PatientsAttributes;
