import type { DoctorRepository } from "../../../doctors/domain/doctor.repository";
import type { PatientRepository } from "../../../patients/domain/patient.repository";
import type { RolPermissionsRepository } from "../../../permissions/domain/rol-permissions.repository";
import type { UserRepository } from "../../../users/domain/user.repository";
import type { PersonProfile } from "../dtos";
import type { PersonRepository } from "../person.repository";

export class GetPersonsUseCase {
  constructor(
    private readonly repository: PersonRepository,
    private readonly userRepository: UserRepository,
    private readonly patientRepository: PatientRepository,
    private readonly doctorRepository: DoctorRepository,
    private readonly permissionsRepository: RolPermissionsRepository,
  ) {}

  private async buildProfile(personId: number, person: PersonProfile["person_data"]) {
    const [user, patient, doctor] = await Promise.all([
      this.userRepository.getByPersonId(personId),
      this.patientRepository.getByPersonId(personId),
      this.doctorRepository.getByPersonId(personId),
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

  async execute(): Promise<PersonProfile[]> {
    const persons = await this.repository.getAll();
    const profiles = await Promise.all(
      persons.map((person) => this.buildProfile(person.per_id, person)),
    );
    return profiles;
  }
}
