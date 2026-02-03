import type { PatientsModelInstance } from "./patients.types";
import { PatientEntity } from "../../domain/patient.entity";

export const toPatientEntity = (model: PatientsModelInstance): PatientEntity =>
  new PatientEntity(
    model.pat_id,
    model.per_id,
    model.pat_sta_state,
    model.pat_dat_created_at,
    model.pat_dat_updated_at,
    model.pat_dat_deleted_at,
  );
