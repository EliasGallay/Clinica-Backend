import type { DoctorEntity } from "../../../doctors/domain/doctor.entity";
import type { PatientEntity } from "../../../patients/domain/patient.entity";
import type { RolPermissionAccess } from "../../../permissions/domain/rol-permissions.datasource";
import type { PersonEntity } from "../person.entity";

export type PersonProfile = {
  person_data: PersonEntity;
  patient_data: PatientEntity | null;
  doctor_data: DoctorEntity | null;
  permissions: RolPermissionAccess[];
};
