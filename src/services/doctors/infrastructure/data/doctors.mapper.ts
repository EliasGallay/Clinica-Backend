import type { DoctorsModelInstance } from "./doctors.types";
import { DoctorEntity } from "../../domain/doctor.entity";

export const toDoctorEntity = (model: DoctorsModelInstance): DoctorEntity =>
  new DoctorEntity(
    model.doc_id,
    model.per_id,
    model.doc_txt_license,
    model.doc_txt_specialty,
    model.doc_sta_state,
    model.doc_dat_created_at,
    model.doc_dat_updated_at,
    model.doc_dat_deleted_at,
  );
