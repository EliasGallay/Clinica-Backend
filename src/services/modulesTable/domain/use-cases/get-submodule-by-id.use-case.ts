import type { SubmodulesRepository } from "../submodules.repository";
import type { SubmoduleEntity } from "../submodules.entity";

export class GetSubmoduleByIdUseCase {
  constructor(private readonly repository: SubmodulesRepository) {}

  execute(id: number): Promise<SubmoduleEntity | null> {
    return this.repository.getById(id);
  }
}
