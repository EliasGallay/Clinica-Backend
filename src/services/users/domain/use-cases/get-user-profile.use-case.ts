import type { UserRepository } from "../user.repository";
import type { PersonRepository } from "../../../persons/domain/person.repository";
import type { PatientRepository } from "../../../patients/domain/patient.repository";
import type { DoctorRepository } from "../../../doctors/domain/doctor.repository";
import type { RolPermissionsRepository } from "../../../permissions/domain/rol-permissions.repository";
import type { UserEntity } from "../users.entity";
import type { PersonEntity } from "../../../persons/domain/person.entity";
import type { PatientEntity } from "../../../patients/domain/patient.entity";
import type { DoctorEntity } from "../../../doctors/domain/doctor.entity";
import type { RolPermissionAccess } from "../../../permissions/domain/rol-permissions.datasource";

export type UserProfile = {
  user: UserEntity;
  person: PersonEntity | null;
  patient: PatientEntity | null;
  doctor: DoctorEntity | null;
  permissions: RolPermissionAccess[];
};

export class GetUserProfileUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly personRepository: PersonRepository,
    private readonly patientRepository: PatientRepository,
    private readonly doctorRepository: DoctorRepository,
    private readonly permissionsRepository: RolPermissionsRepository,
  ) {}

  async execute(id: number): Promise<UserProfile | null> {
    const user = await this.userRepository.getById(id);
    if (!user) return null;

    const perId = user.per_id;
    const [person, patient, doctor] = perId
      ? await Promise.all([
          this.personRepository.getById(perId),
          this.patientRepository.getByPersonId(perId),
          this.doctorRepository.getByPersonId(perId),
        ])
      : [null, null, null];

    const roles = user.roles ?? [];
    const permissions = roles.length
      ? await this.permissionsRepository.getByRoleNames(roles)
      : [];

    return { user, person, patient, doctor, permissions };
  }
}
