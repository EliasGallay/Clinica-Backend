import type { ModulesRepository } from "../modules.repository";
import type { SubmodulesRepository } from "../submodules.repository";
import type { SubmoduleEntity } from "../submodules.entity";

export class GetSubmodulesUseCase {
  constructor(
    private readonly submodulesRepository: SubmodulesRepository,
    private readonly modulesRepository: ModulesRepository,
  ) {}

  async execute(modId: number): Promise<SubmoduleEntity[]> {
    const module = await this.modulesRepository.getById(modId);
    if (!module) {
      throw new Error("MODULE_NOT_FOUND");
    }
    return this.submodulesRepository.getAllByModuleId(modId);
  }
}
