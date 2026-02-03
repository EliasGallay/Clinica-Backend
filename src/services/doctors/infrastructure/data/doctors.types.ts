import type { Model } from "sequelize";

export type DoctorsAttributes = {
  doc_id: number;
  per_id: number;
  doc_txt_license: string | null;
  doc_txt_specialty: string | null;
  doc_sta_state: number;
  doc_dat_created_at: Date;
  doc_dat_updated_at: Date;
  doc_dat_deleted_at: Date | null;
};

export type DoctorsCreationAttributes = Omit<
  DoctorsAttributes,
  "doc_id" | "doc_dat_created_at" | "doc_dat_updated_at"
>;

export type DoctorsModelInstance = Model<DoctorsAttributes, DoctorsCreationAttributes> &
  DoctorsAttributes;
