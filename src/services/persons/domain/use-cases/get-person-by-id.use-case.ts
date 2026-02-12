import type { DoctorRepository } from "../../../doctors/domain/doctor.repository";
import type { PatientRepository } from "../../../patients/domain/patient.repository";
import type { RolPermissionsRepository } from "../../../permissions/domain/rol-permissions.repository";
import type { UserRepository } from "../../../users/domain/user.repository";
import type { PersonProfile } from "../dtos";
import type { PersonRepository } from "../person.repository";

export class GetPersonByIdUseCase {
  constructor(
    private readonly repository: PersonRepository,
    private readonly userRepository: UserRepository,
    private readonly patientRepository: PatientRepository,
    private readonly doctorRepository: DoctorRepository,
    private readonly permissionsRepository: RolPermissionsRepository,
  ) {}

  async execute(id: number): Promise<PersonProfile | null> {
    const person = await this.repository.getById(id);
    if (!person) return null;

    const [user, patient, doctor] = await Promise.all([
      this.userRepository.getByPersonId(person.per_id),
      this.patientRepository.getByPersonId(person.per_id),
      this.doctorRepository.getByPersonId(person.per_id),
    ]);

    const roles = user?.roles ?? [];
    const permissions = roles.length ? await this.permissionsRepository.getByRoleNames(roles) : [];

    return {
      person_data: person,
      patient_data: patient,
      doctor_data: doctor,
      permissions,
    };
  }
}
