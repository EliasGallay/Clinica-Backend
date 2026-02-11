import type { UpdateSubmoduleDto } from "../dtos";
import type { ModulesRepository } from "../modules.repository";
import type { SubmodulesRepository } from "../submodules.repository";
import type { SubmoduleEntity } from "../submodules.entity";

export class UpdateSubmoduleUseCase {
  constructor(
    private readonly submodulesRepository: SubmodulesRepository,
    private readonly modulesRepository: ModulesRepository,
  ) {}

  async execute(id: number, data: UpdateSubmoduleDto): Promise<SubmoduleEntity | null> {
    const existing = await this.submodulesRepository.getById(id);
    if (!existing) {
      return null;
    }

    const targetModId = data.mod_id ?? existing.mod_id;
    const targetKey = data.sub_txt_key ?? existing.sub_txt_key;

    if (data.mod_id) {
      const module = await this.modulesRepository.getById(data.mod_id);
      if (!module) {
        throw new Error("MODULE_NOT_FOUND");
      }
    }

    if (data.mod_id || data.sub_txt_key) {
      const keyOwner = await this.submodulesRepository.getByKey(targetModId, targetKey);
      if (keyOwner && keyOwner.sub_id !== id) {
        throw new Error("SUBMODULE_KEY_EXISTS");
      }
    }

    return this.submodulesRepository.update(id, { ...data, sub_dat_updated_at: new Date() });
  }
}
