import type { PersonRepository } from "../../../persons/domain/person.repository";
import type { UserRepository } from "../user.repository";
import type { UserEntity } from "../users.entity";

export type UserWithPerson = {
  user: UserEntity;
  person_data: Awaited<ReturnType<PersonRepository["getById"]>>;
};

export class GetUsersUseCase {
  constructor(
    private readonly repository: UserRepository,
    private readonly personRepository: PersonRepository,
  ) {}

  async execute(): Promise<UserWithPerson[]> {
    const users = await this.repository.getAll();
    const items = await Promise.all(
      users.map(async (user) => ({
        user,
        person_data: user.per_id ? await this.personRepository.getById(user.per_id) : null,
      })),
    );
    return items;
  }
}
